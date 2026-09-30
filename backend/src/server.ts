import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import 'dotenv/config';
import {
  pg,
  initDatabase,
  createCanonicalCredentialString,
  generateSha256,
  generateQrCodeDataUrl,
} from './db';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_super_secret_jwt_key_2026';

app.use(cors({ origin: FRONTEND_URL.split(','), credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth Middleware
export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: 'INSTITUTION' | 'STUDENT' | 'VERIFIER';
  institution_id?: number | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded as AuthenticatedUser;
    next();
  });
}

function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires one of [${roles.join(', ')}] roles` });
    }
    next();
  };
}

// ----------------------------------------------------
// REST APIS
// ----------------------------------------------------

// 1. Auth: Register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, institution_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password and role are required' });
    }

    const validRoles = ['INSTITUTION', 'STUDENT', 'VERIFIER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existing = await pg.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userRes = await pg.query(
      `INSERT INTO users (name, email, password_hash, role, institution_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, institution_id`,
      [name.trim(), email.toLowerCase().trim(), password_hash, role, institution_id || null]
    );

    const newUser = userRes.rows[0] as AuthenticatedUser;

    // Default consent for students
    if (role === 'STUDENT') {
      await pg.query(
        `INSERT INTO student_consents (student_email, allow_detailed_verification)
         VALUES ($1, TRUE) ON CONFLICT (student_email) DO NOTHING`,
        [newUser.email]
      );
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        institution_id: newUser.institution_id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user: newUser, token });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// 2. Auth: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRes = await pg.query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.role, u.institution_id,
              i.institution_name, i.institution_code, i.status as institution_status
       FROM users u
       LEFT JOIN institutions i ON u.institution_id = i.id
       WHERE u.email = $1`,
      [email.toLowerCase().trim()]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userRes.rows[0] as any;
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.role === 'INSTITUTION' && user.institution_status && user.institution_status !== 'ACTIVE') {
      return res.status(403).json({ error: `Institution status is ${user.institution_status}. Only ACTIVE institutions can access.` });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        institution_id: user.institution_id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution_id: user.institution_id,
        institution_name: user.institution_name,
        institution_code: user.institution_code,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 3. Auth: Current User
app.get('/api/auth/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userRes = await pg.query(
      `SELECT u.id, u.name, u.email, u.role, u.institution_id,
              i.institution_name, i.institution_code, i.status as institution_status
       FROM users u
       LEFT JOIN institutions i ON u.institution_id = i.id
       WHERE u.id = $1`,
      [req.user!.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userRes.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// 4. Institutions: Register
app.post('/api/institutions', async (req: Request, res: Response) => {
  try {
    const {
      institution_name,
      institution_type,
      institution_code,
      email,
      phone,
      address,
      password,
    } = req.body;

    if (!institution_name || !institution_type || !institution_code || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required institution fields' });
    }

    // Check duplicate code or email
    const existing = await pg.query(
      'SELECT id FROM institutions WHERE institution_code = $1 OR email = $2',
      [institution_code.trim().toUpperCase(), email.toLowerCase().trim()]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An institution with this code or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const instRes = await pg.query(
      `INSERT INTO institutions (institution_name, institution_type, institution_code, email, phone, address, password_hash, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE')
       RETURNING id, institution_name, institution_type, institution_code, email, phone, address, status, created_at`,
      [
        institution_name.trim(),
        institution_type.trim(),
        institution_code.trim().toUpperCase(),
        email.toLowerCase().trim(),
        phone || '',
        address || '',
        password_hash,
      ]
    );

    const institution = instRes.rows[0] as any;

    // Create default admin user for this institution
    const userRes = await pg.query(
      `INSERT INTO users (name, email, password_hash, role, institution_id)
       VALUES ($1, $2, $3, 'INSTITUTION', $4)
       RETURNING id, name, email, role, institution_id`,
      [institution_name.trim() + ' Admin', email.toLowerCase().trim(), password_hash, institution.id]
    );

    const user = userRes.rows[0] as AuthenticatedUser;
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        institution_id: user.institution_id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ institution, user, token });
  } catch (err: any) {
    console.error('Institution register error:', err);
    res.status(500).json({ error: err.message || 'Failed to register institution' });
  }
});

// List all active institutions
app.get('/api/institutions', async (_req: Request, res: Response) => {
  try {
    const list = await pg.query(
      'SELECT id, institution_name, institution_type, institution_code, email, phone, status FROM institutions ORDER BY institution_name ASC'
    );
    res.json({ institutions: list.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch institutions' });
  }
});

// 5. Credential Issuance
app.post('/api/credentials', authenticateToken, requireRole('INSTITUTION'), async (req: Request, res: Response) => {
  try {
    const {
      student_name,
      register_number,
      student_email,
      credential_type,
      qualification,
      academic_year,
      issue_date,
      marks,
      expiry_date,
    } = req.body;

    if (
      !student_name ||
      !register_number ||
      !student_email ||
      !credential_type ||
      !qualification ||
      !academic_year ||
      !issue_date ||
      !marks
    ) {
      return res.status(400).json({ error: 'All primary academic credential fields are required' });
    }

    const institution_id = req.user!.institution_id;
    if (!institution_id) {
      return res.status(403).json({ error: 'User is not linked to an authorized institution' });
    }

    // Verify institution is ACTIVE
    const instCheck = await pg.query('SELECT status FROM institutions WHERE id = $1', [institution_id]);
    if (instCheck.rows.length === 0 || (instCheck.rows[0] as any).status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Only ACTIVE institutions can issue credentials' });
    }

    // Generate Unique Credential ID: CRED-<YEAR>-<RANDOM_HEX>
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const currentYear = new Date().getFullYear();
    const credential_id = `CRED-${currentYear}-${randomHex}`;

    // Compute canonical SHA-256 integrity hash
    const canonicalString = createCanonicalCredentialString({
      student_name,
      register_number,
      credential_type,
      qualification,
      institution_id,
      academic_year,
      issue_date,
      marks,
      expiry_date: expiry_date || null,
    });
    const canonical_hash = generateSha256(canonicalString);

    // Generate local QR Code with direct verification link
    const verificationUrl = `/verify/${credential_id}`;
    const qr_code_data = await generateQrCodeDataUrl(verificationUrl);

    // Save credential in PostgreSQL
    const credRes = await pg.query(
      `INSERT INTO credentials (
        credential_id, student_name, register_number, student_email, credential_type, qualification,
        institution_id, academic_year, issue_date, marks, expiry_date, canonical_hash, qr_code_data, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'VALID')
      RETURNING *`,
      [
        credential_id,
        student_name.trim(),
        register_number.trim(),
        student_email.toLowerCase().trim(),
        credential_type.trim(),
        qualification.trim(),
        institution_id,
        academic_year.trim(),
        issue_date.trim(),
        marks.trim(),
        expiry_date ? expiry_date.trim() : null,
        canonical_hash,
        qr_code_data,
      ]
    );

    // Record initial issuance in history
    await pg.query(
      `INSERT INTO verification_history (credential_id, verifier_id, verifier_name, verification_result)
       VALUES ($1, $2, $3, 'ISSUED')`,
      [credential_id, req.user!.id, req.user!.name]
    );

    // Ensure student consent row exists
    await pg.query(
      `INSERT INTO student_consents (student_email, allow_detailed_verification)
       VALUES ($1, TRUE) ON CONFLICT (student_email) DO NOTHING`,
      [student_email.toLowerCase().trim()]
    );

    res.status(201).json({
      message: 'Credential successfully issued and cryptographically anchored',
      credential: credRes.rows[0],
      canonical_hash,
      verification_url: verificationUrl,
    });
  } catch (err: any) {
    console.error('Credential issuance error:', err);
    res.status(500).json({ error: err.message || 'Failed to issue credential' });
  }
});

// 6. List Credentials (with filter by institution or student)
app.get('/api/credentials', authenticateToken, async (req: Request, res: Response) => {
  try {
    let query = `
      SELECT c.*, i.institution_name, i.institution_code
      FROM credentials c
      JOIN institutions i ON c.institution_id = i.id
    `;
    const params: any[] = [];

    if (req.user!.role === 'INSTITUTION') {
      query += ` WHERE c.institution_id = $1`;
      params.push(req.user!.institution_id);
    } else if (req.user!.role === 'STUDENT') {
      query += ` WHERE c.student_email = $1`;
      params.push(req.user!.email);
    }

    query += ` ORDER BY c.created_at DESC`;

    const result = await pg.query(query, params);
    res.json({ credentials: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

// 7. Get Credential Details by ID
app.get('/api/credentials/:credentialId', async (req: Request, res: Response) => {
  try {
    const { credentialId } = req.params;
    const result = await pg.query(
      `SELECT c.*, i.institution_name, i.institution_type, i.institution_code,
              r.revocation_reason, r.revoked_at, u.name as revoked_by_name
       FROM credentials c
       JOIN institutions i ON c.institution_id = i.id
       LEFT JOIN revocations r ON c.credential_id = r.credential_id
       LEFT JOIN users u ON r.revoked_by = u.id
       WHERE c.credential_id = $1`,
      [credentialId.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    res.json({ credential: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch credential' });
  }
});

// 8. Revocation
app.post(
  '/api/credentials/:credentialId/revoke',
  authenticateToken,
  requireRole('INSTITUTION'),
  async (req: Request, res: Response) => {
    try {
      const { credentialId } = req.params;
      const { revocation_reason } = req.body;

      if (!revocation_reason || !revocation_reason.trim()) {
        return res.status(400).json({ error: 'Revocation reason is required for compliance audit' });
      }

      // Check credential belongs to user's institution
      const credCheck = await pg.query(
        'SELECT id, institution_id, status FROM credentials WHERE credential_id = $1',
        [credentialId.trim()]
      );

      if (credCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Credential not found' });
      }

      const credential = credCheck.rows[0] as any;
      if (credential.institution_id !== req.user!.institution_id) {
        return res.status(403).json({ error: 'Unauthorized: you can only revoke credentials issued by your institution' });
      }

      // Update status to REVOKED
      await pg.query(
        "UPDATE credentials SET status = 'REVOKED', updated_at = CURRENT_TIMESTAMP WHERE credential_id = $1",
        [credentialId.trim()]
      );

      // Insert into revocations audit table
      await pg.query(
        `INSERT INTO revocations (credential_id, revoked_by, revocation_reason, revoked_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [credentialId.trim(), req.user!.id, revocation_reason.trim()]
      );

      // Record in verification history
      await pg.query(
        `INSERT INTO verification_history (credential_id, verifier_id, verifier_name, verification_result)
         VALUES ($1, $2, $3, 'REVOKED')`,
        [credentialId.trim(), req.user!.id, req.user!.name]
      );

      res.json({
        message: 'Credential successfully revoked and logged in audit registry',
        credential_id: credentialId,
        status: 'REVOKED',
      });
    } catch (err: any) {
      console.error('Revocation error:', err);
      res.status(500).json({ error: err.message || 'Revocation failed' });
    }
  }
);

// 9. CORE VERIFICATION ENGINE
// Logical Status Priority:
// 1. NOT_FOUND: No matching database record
// 2. REVOKED: Stored status is REVOKED
// 3. EXPIRED: Current date > expiry_date
// 4. TAMPERED: Current SHA-256 != Stored SHA-256
// 5. VALID: Hash match & active
app.get('/api/verify/:credentialId', async (req: Request, res: Response) => {
  try {
    const { credentialId } = req.params;
    const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    const verifierName = req.query.verifier_name ? String(req.query.verifier_name) : 'Authorized Verifier';

    const credRes = await pg.query(
      `SELECT c.*, i.institution_name, i.institution_type, i.institution_code,
              r.revocation_reason, r.revoked_at
       FROM credentials c
       JOIN institutions i ON c.institution_id = i.id
       LEFT JOIN revocations r ON c.credential_id = r.credential_id
       WHERE c.credential_id = $1`,
      [credentialId.trim()]
    );

    // 1. NOT FOUND check
    if (credRes.rows.length === 0) {
      await pg.query(
        `INSERT INTO verification_history (credential_id, verifier_name, verifier_ip, verification_result)
         VALUES ($1, $2, $3, 'NOT_FOUND')`,
        [credentialId.trim(), verifierName, clientIp]
      );

      return res.status(200).json({
        credential_id: credentialId.trim(),
        verification_status: 'NOT_FOUND',
        message: 'No record found with this Credential ID in the academic registry.',
      });
    }

    const cred = credRes.rows[0] as any;

    // 2. REVOKED check
    if (cred.status === 'REVOKED') {
      await pg.query(
        `INSERT INTO verification_history (credential_id, verifier_name, verifier_ip, verification_result)
         VALUES ($1, $2, $3, 'REVOKED')`,
        [credentialId.trim(), verifierName, clientIp]
      );

      return res.status(200).json({
        credential_id: cred.credential_id,
        verification_status: 'REVOKED',
        message: 'This credential was revoked by the issuing institution.',
        revoked_at: cred.revoked_at,
        revocation_reason: cred.revocation_reason,
        institution_name: cred.institution_name,
        credential_type: cred.credential_type,
        issue_date: cred.issue_date,
      });
    }

    // 3. EXPIRED check
    if (cred.expiry_date) {
      const expiry = new Date(cred.expiry_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!isNaN(expiry.getTime()) && today > expiry) {
        await pg.query(
          `INSERT INTO verification_history (credential_id, verifier_name, verifier_ip, verification_result)
           VALUES ($1, $2, $3, 'EXPIRED')`,
          [credentialId.trim(), verifierName, clientIp]
        );

        return res.status(200).json({
          credential_id: cred.credential_id,
          verification_status: 'EXPIRED',
          message: 'The validity period for this certificate has ended.',
          expiry_date: cred.expiry_date,
          institution_name: cred.institution_name,
          credential_type: cred.credential_type,
          issue_date: cred.issue_date,
        });
      }
    }

    // 4. TAMPER DETECTION: Recreate SHA-256 hash using the current fields in DB
    const currentCanonicalString = createCanonicalCredentialString({
      student_name: cred.student_name,
      register_number: cred.register_number,
      credential_type: cred.credential_type,
      qualification: cred.qualification,
      institution_id: cred.institution_id,
      academic_year: cred.academic_year,
      issue_date: cred.issue_date,
      marks: cred.marks,
      expiry_date: cred.expiry_date || null,
    });
    const currentHash = generateSha256(currentCanonicalString);

    if (currentHash !== cred.canonical_hash) {
      await pg.query(
        `INSERT INTO verification_history (credential_id, verifier_name, verifier_ip, verification_result)
         VALUES ($1, $2, $3, 'TAMPERED')`,
        [credentialId.trim(), verifierName, clientIp]
      );

      return res.status(200).json({
        credential_id: cred.credential_id,
        verification_status: 'TAMPERED',
        message: 'Security Alert: Credential data has been modified. Digital fingerprint does not match the stored cryptographic integrity anchor.',
        stored_hash: cred.canonical_hash,
        current_hash: currentHash,
        institution_name: cred.institution_name,
        credential_type: cred.credential_type,
        issue_date: cred.issue_date,
      });
    }

    // 5. VALID check
    await pg.query(
      `INSERT INTO verification_history (credential_id, verifier_name, verifier_ip, verification_result)
       VALUES ($1, $2, $3, 'VALID')`,
      [credentialId.trim(), verifierName, clientIp]
    );

    // Check student consent for detailed information disclosure
    const consentRes = await pg.query(
      'SELECT allow_detailed_verification FROM student_consents WHERE student_email = $1',
      [cred.student_email]
    );
    const allowDetailed = consentRes.rows.length === 0 || (consentRes.rows[0] as any).allow_detailed_verification;

    if (!allowDetailed) {
      return res.status(200).json({
        credential_id: cred.credential_id,
        verification_status: 'VALID',
        message: 'Credential is authentic and digitally validated.',
        stored_hash: cred.canonical_hash,
        current_hash: currentHash,
        institution_name: cred.institution_name,
        credential_type: cred.credential_type,
        issue_date: cred.issue_date,
        student_consent_restricted: true,
        notice: 'Student has set consent to privacy mode. Detailed personal marks and registration info are restricted.',
      });
    }

    // Full detailed data
    return res.status(200).json({
      credential_id: cred.credential_id,
      verification_status: 'VALID',
      message: 'Credential is authentic and digitally validated.',
      stored_hash: cred.canonical_hash,
      current_hash: currentHash,
      student_name: cred.student_name,
      register_number: cred.register_number,
      student_email: cred.student_email,
      credential_type: cred.credential_type,
      qualification: cred.qualification,
      institution_name: cred.institution_name,
      institution_code: cred.institution_code,
      academic_year: cred.academic_year,
      issue_date: cred.issue_date,
      marks: cred.marks,
      expiry_date: cred.expiry_date,
      qr_code_data: cred.qr_code_data,
      is_test_record: cred.is_test_record,
      student_consent_restricted: false,
    });
  } catch (err: any) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Verification engine encountered an internal error' });
  }
});

// 10. POST /api/verify (Alternative form submission)
app.post('/api/verify', async (req: Request, res: Response) => {
  const { credential_id } = req.body;
  if (!credential_id) {
    return res.status(400).json({ error: 'Credential ID is required' });
  }
  // Redirect internally to GET handler logic
  req.params.credentialId = credential_id.trim();
  return (app as any)._router.handle(req, res, () => {});
});

// 11. Certificate Comparison
app.post('/api/verify/compare', async (req: Request, res: Response) => {
  try {
    const {
      credential_id,
      student_name,
      register_number,
      credential_type,
      academic_year,
      marks,
      issue_date,
    } = req.body;

    if (!credential_id) {
      return res.status(400).json({ error: 'Credential ID is required' });
    }

    const credRes = await pg.query(
      `SELECT c.*, i.institution_name FROM credentials c
       JOIN institutions i ON c.institution_id = i.id
       WHERE c.credential_id = $1`,
      [credential_id.trim()]
    );

    if (credRes.rows.length === 0) {
      return res.status(404).json({ error: 'Credential not found in registry' });
    }

    const original = credRes.rows[0] as any;

    const normalize = (val: any) => String(val || '').trim().toLowerCase();

    const comparisons = {
      student_name: {
        submitted: student_name,
        original: original.student_name,
        match: normalize(student_name) === normalize(original.student_name),
      },
      register_number: {
        submitted: register_number,
        original: original.register_number,
        match: normalize(register_number) === normalize(original.register_number),
      },
      credential_type: {
        submitted: credential_type,
        original: original.credential_type,
        match: normalize(credential_type) === normalize(original.credential_type),
      },
      academic_year: {
        submitted: academic_year,
        original: original.academic_year,
        match: normalize(academic_year) === normalize(original.academic_year),
      },
      marks: {
        submitted: marks,
        original: original.marks,
        match: normalize(marks) === normalize(original.marks),
      },
      issue_date: {
        submitted: issue_date,
        original: original.issue_date,
        match: normalize(issue_date) === normalize(original.issue_date),
      },
    };

    const overallMatch = Object.values(comparisons).every((field) => field.match);

    res.json({
      credential_id,
      result: overallMatch ? 'MATCH' : 'MISMATCH',
      overall_match: overallMatch,
      field_comparisons: comparisons,
      explanation:
        'Certificate Comparison checks field-level information against original records, while SHA-256 checks cryptographic integrity of stored credential data.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Certificate comparison failed' });
  }
});

// 12. Bulk Verification
app.post('/api/verify/bulk', async (req: Request, res: Response) => {
  try {
    const { credential_ids } = req.body;
    if (!Array.isArray(credential_ids) || credential_ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of credential_ids' });
    }

    const results: Array<{
      credential_id: string;
      student_name?: string;
      credential_type?: string;
      result: 'VALID' | 'TAMPERED' | 'REVOKED' | 'NOT_FOUND' | 'EXPIRED';
      details: string;
    }> = [];

    const counts = {
      total: credential_ids.length,
      valid: 0,
      tampered: 0,
      revoked: 0,
      not_found: 0,
      expired: 0,
    };

    for (const rawId of credential_ids) {
      const id = String(rawId).trim();
      if (!id) continue;

      const credRes = await pg.query('SELECT * FROM credentials WHERE credential_id = $1', [id]);

      if (credRes.rows.length === 0) {
        counts.not_found++;
        results.push({
          credential_id: id,
          result: 'NOT_FOUND',
          details: 'No record in registry',
        });
        continue;
      }

      const cred = credRes.rows[0] as any;

      if (cred.status === 'REVOKED') {
        counts.revoked++;
        results.push({
          credential_id: id,
          student_name: cred.student_name,
          credential_type: cred.credential_type,
          result: 'REVOKED',
          details: 'Credential cancelled by institution',
        });
        continue;
      }

      if (cred.expiry_date) {
        const expiry = new Date(cred.expiry_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!isNaN(expiry.getTime()) && today > expiry) {
          counts.expired++;
          results.push({
            credential_id: id,
            student_name: cred.student_name,
            credential_type: cred.credential_type,
            result: 'EXPIRED',
            details: `Expired on ${cred.expiry_date}`,
          });
          continue;
        }
      }

      const canonical = createCanonicalCredentialString({
        student_name: cred.student_name,
        register_number: cred.register_number,
        credential_type: cred.credential_type,
        qualification: cred.qualification,
        institution_id: cred.institution_id,
        academic_year: cred.academic_year,
        issue_date: cred.issue_date,
        marks: cred.marks,
        expiry_date: cred.expiry_date,
      });
      const hash = generateSha256(canonical);

      if (hash !== cred.canonical_hash) {
        counts.tampered++;
        results.push({
          credential_id: id,
          student_name: cred.student_name,
          credential_type: cred.credential_type,
          result: 'TAMPERED',
          details: 'Data does not match stored SHA-256 hash',
        });
      } else {
        counts.valid++;
        results.push({
          credential_id: id,
          student_name: cred.student_name,
          credential_type: cred.credential_type,
          result: 'VALID',
          details: 'Cryptographically verified & intact',
        });
      }
    }

    res.json({
      summary: counts,
      results,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Bulk verification failed' });
  }
});

// 13. Verification History (Searchable audit log)
app.get('/api/verification-history', async (req: Request, res: Response) => {
  try {
    const { search, limit = 50 } = req.query;
    let query = `
      SELECT v.*, c.student_name, c.credential_type, c.register_number
      FROM verification_history v
      LEFT JOIN credentials c ON v.credential_id = c.credential_id
    `;
    const params: any[] = [];

    if (search) {
      query += ` WHERE v.credential_id ILIKE $1 OR v.verifier_name ILIKE $1 OR v.verification_result ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY v.verified_at DESC LIMIT ${parseInt(String(limit), 10) || 50}`;

    const historyRes = await pg.query(query, params);
    res.json({ history: historyRes.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch verification history' });
  }
});

// 14. Dashboard Statistics
app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
  try {
    const institutionId = req.query.institution_id ? parseInt(String(req.query.institution_id), 10) : null;

    let credFilter = '';
    const credParams: any[] = [];
    if (institutionId) {
      credFilter = ' WHERE institution_id = $1';
      credParams.push(institutionId);
    }

    const totalRes = await pg.query(`SELECT COUNT(*) as count FROM credentials${credFilter}`, credParams);
    const activeRes = await pg.query(
      `SELECT COUNT(*) as count FROM credentials WHERE status = 'VALID'${institutionId ? ' AND institution_id = $1' : ''}`,
      credParams
    );
    const revokedRes = await pg.query(
      `SELECT COUNT(*) as count FROM credentials WHERE status = 'REVOKED'${institutionId ? ' AND institution_id = $1' : ''}`,
      credParams
    );

    const historyRes = await pg.query('SELECT COUNT(*) as count FROM verification_history');
    const tamperedRes = await pg.query(
      "SELECT COUNT(*) as count FROM verification_history WHERE verification_result = 'TAMPERED'"
    );

    // Distribution by credential type
    const typesRes = await pg.query(`
      SELECT credential_type, COUNT(*) as count
      FROM credentials
      ${credFilter}
      GROUP BY credential_type
      ORDER BY count DESC
    `, credParams);

    // Recent 10 verification events
    const recentEventsRes = await pg.query(`
      SELECT * FROM verification_history ORDER BY verified_at DESC LIMIT 8
    `);

    res.json({
      stats: {
        total_credentials: parseInt((totalRes.rows[0] as any).count, 10),
        active_credentials: parseInt((activeRes.rows[0] as any).count, 10),
        revoked_credentials: parseInt((revokedRes.rows[0] as any).count, 10),
        verification_events: parseInt((historyRes.rows[0] as any).count, 10),
        tampered_attempts: parseInt((tamperedRes.rows[0] as any).count, 10),
        type_distribution: typesRes.rows,
        recent_events: recentEventsRes.rows,
      },
    });
  } catch (err: any) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// 15. Student Credential Passport & Consent
app.get('/api/students/:email/credentials', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const credsRes = await pg.query(
      `SELECT c.*, i.institution_name, i.institution_code
       FROM credentials c
       JOIN institutions i ON c.institution_id = i.id
       WHERE c.student_email = $1
       ORDER BY c.created_at ASC`,
      [email.toLowerCase().trim()]
    );

    const consentRes = await pg.query(
      'SELECT allow_detailed_verification FROM student_consents WHERE student_email = $1',
      [email.toLowerCase().trim()]
    );

    const consent = consentRes.rows.length > 0 ? (consentRes.rows[0] as any).allow_detailed_verification : true;

    res.json({
      student_email: email,
      consent: { allow_detailed_verification: consent },
      credentials: credsRes.rows,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch student passport' });
  }
});

app.put('/api/students/:email/consent', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { allow_detailed_verification } = req.body;

    if (req.user!.role === 'STUDENT' && req.user!.email !== email.toLowerCase().trim()) {
      return res.status(403).json({ error: 'Cannot modify consent for another student' });
    }

    await pg.query(
      `INSERT INTO student_consents (student_email, allow_detailed_verification, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (student_email)
       DO UPDATE SET allow_detailed_verification = $2, updated_at = CURRENT_TIMESTAMP`,
      [email.toLowerCase().trim(), Boolean(allow_detailed_verification)]
    );

    res.json({
      message: 'Student consent updated successfully',
      student_email: email,
      allow_detailed_verification: Boolean(allow_detailed_verification),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update consent' });
  }
});

// 16. HACKATHON LIVE DEMO TAMPERING ENDPOINT (Step 9 Demo Flow)
// Simulates unauthorized modification of the TEST database record (e.g. 550/600 -> 590/600)
// WITHOUT updating its canonical_hash, clearly demonstrating instant tamper detection!
app.post('/api/demo/tamper-test-record', async (req: Request, res: Response) => {
  try {
    const { credential_id = 'CRED-2026-TAMPERDEMO', action = 'tamper', marks = '590/600' } = req.body;

    const credRes = await pg.query('SELECT * FROM credentials WHERE credential_id = $1', [credential_id]);
    if (credRes.rows.length === 0) {
      return res.status(404).json({ error: 'Test credential not found' });
    }

    const currentCred = credRes.rows[0] as any;

    if (action === 'tamper') {
      // Modify marks directly in PostgreSQL without changing canonical_hash
      await pg.query(
        'UPDATE credentials SET marks = $1, updated_at = CURRENT_TIMESTAMP WHERE credential_id = $2',
        [marks, credential_id]
      );

      res.json({
        message: 'TEST RECORD TAMPERED: Database field marks modified from 550/600 to 590/600 without recalculating stored SHA-256 hash.',
        credential_id,
        current_db_marks: marks,
        original_stored_hash: currentCred.canonical_hash,
        is_tampered: true,
      });
    } else {
      // Reset back to original 550/600
      await pg.query(
        "UPDATE credentials SET marks = '550/600', status = 'VALID', updated_at = CURRENT_TIMESTAMP WHERE credential_id = $1",
        [credential_id]
      );

      res.json({
        message: 'TEST RECORD RESTORED: Reset marks back to original 550/600.',
        credential_id,
        current_db_marks: '550/600',
        is_tampered: false,
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Demo tamper modification failed' });
  }
});

// ----------------------------------------------------
// BOOTSTRAP
// ----------------------------------------------------

async function startServer() {
  try {
    await initDatabase();
    console.log('PostgreSQL (PGlite) schema and seeds initialized successfully.');

    app.get('/api/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
