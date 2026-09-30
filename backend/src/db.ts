import { PGlite } from '@electric-sql/pglite';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

// Initialize embedded PostgreSQL engine
const dbDir = path.resolve(process.cwd(), '.data/pgdata');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const pg = new PGlite(dbDir);

export function createCanonicalCredentialString(data: {
  student_name: string;
  register_number: string;
  credential_type: string;
  qualification: string;
  institution_id: number | string;
  academic_year: string;
  issue_date: string;
  marks: string;
  expiry_date?: string | null;
}): string {
  return JSON.stringify({
    academic_year: String(data.academic_year || '').trim(),
    credential_type: String(data.credential_type || '').trim(),
    expiry_date: data.expiry_date ? String(data.expiry_date).trim() : null,
    institution_id: String(data.institution_id || '').trim(),
    issue_date: String(data.issue_date || '').trim(),
    marks: String(data.marks || '').trim(),
    qualification: String(data.qualification || '').trim(),
    register_number: String(data.register_number || '').trim(),
    student_name: String(data.student_name || '').trim(),
  });
}

export function generateSha256(canonicalString: string): string {
  return crypto.createHash('sha256').update(canonicalString, 'utf8').digest('hex');
}

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 320,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });
}

// Database schema bootstrap and initial seeds
export async function initDatabase() {
  // 1. Institutions table
  await pg.query(`
    CREATE TABLE IF NOT EXISTS institutions (
      id SERIAL PRIMARY KEY,
      institution_name VARCHAR(255) NOT NULL,
      institution_type VARCHAR(100) NOT NULL,
      institution_code VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      address TEXT,
      password_hash VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Users table (for Institution Admin, Student, Verifier)
  await pg.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      institution_id INTEGER REFERENCES institutions(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Credentials table
  await pg.query(`
    CREATE TABLE IF NOT EXISTS credentials (
      id SERIAL PRIMARY KEY,
      credential_id VARCHAR(100) UNIQUE NOT NULL,
      student_name VARCHAR(255) NOT NULL,
      register_number VARCHAR(100) NOT NULL,
      student_email VARCHAR(255) NOT NULL,
      credential_type VARCHAR(100) NOT NULL,
      qualification VARCHAR(255) NOT NULL,
      institution_id INTEGER REFERENCES institutions(id) NOT NULL,
      academic_year VARCHAR(50) NOT NULL,
      issue_date VARCHAR(50) NOT NULL,
      marks VARCHAR(100) NOT NULL,
      expiry_date VARCHAR(50),
      canonical_hash VARCHAR(64) NOT NULL,
      qr_code_data TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'VALID',
      is_test_record BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Revocations table
  await pg.query(`
    CREATE TABLE IF NOT EXISTS revocations (
      id SERIAL PRIMARY KEY,
      credential_id VARCHAR(100) REFERENCES credentials(credential_id) ON DELETE CASCADE,
      revoked_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      revocation_reason TEXT NOT NULL,
      revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Verification History table
  await pg.query(`
    CREATE TABLE IF NOT EXISTS verification_history (
      id SERIAL PRIMARY KEY,
      credential_id VARCHAR(100) NOT NULL,
      verifier_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      verifier_name VARCHAR(255) DEFAULT 'Public Verifier',
      verifier_ip VARCHAR(100) DEFAULT '127.0.0.1',
      verification_result VARCHAR(50) NOT NULL,
      verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Student Consent table
  await pg.query(`
    CREATE TABLE IF NOT EXISTS student_consents (
      id SERIAL PRIMARY KEY,
      student_email VARCHAR(255) UNIQUE NOT NULL,
      allow_detailed_verification BOOLEAN DEFAULT TRUE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default demonstration records if empty
  const instCheck = await pg.query('SELECT COUNT(*) as count FROM institutions');
  const count = parseInt((instCheck.rows[0] as { count: string }).count, 10);

  if (count === 0) {
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Password@123', salt);

    // 1. Seed Institution
    const instRes = await pg.query(`
      INSERT INTO institutions (institution_name, institution_type, institution_code, email, phone, address, password_hash, status)
      VALUES (
        'ABC Higher Secondary School & Academy of Technology',
        'Higher Secondary & Vocational College',
        'INS-TN-2026-001',
        'admin@abcschool.edu',
        '+91 98765 43210',
        '42 Knowledge Corridor, Anna Salai, Chennai, Tamil Nadu - 600002',
        '${defaultPasswordHash}',
        'ACTIVE'
      ) RETURNING id;
    `);
    const instId = (instRes.rows[0] as { id: number }).id;

    // 2. Seed Users
    // Admin
    const adminRes = await pg.query(`
      INSERT INTO users (name, email, password_hash, role, institution_id)
      VALUES (
        'Dr. Rajeshwar Raman',
        'admin@abcschool.edu',
        '${defaultPasswordHash}',
        'INSTITUTION',
        ${instId}
      ) RETURNING id;
    `);
    const adminId = (adminRes.rows[0] as { id: number }).id;

    // Students
    await pg.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES 
        ('Gopika Sri', 'gopika.sri@student.edu', '${defaultPasswordHash}', 'STUDENT'),
        ('Karthik Sundaram', 'karthik.s@student.edu', '${defaultPasswordHash}', 'STUDENT'),
        ('Ananya Krishnan', 'ananya.k@student.edu', '${defaultPasswordHash}', 'STUDENT');
    `);

    // Verifier / Employer
    await pg.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (
        'Tata Consultancy Talent Verifier',
        'verifier@talentcorp.com',
        '${defaultPasswordHash}',
        'VERIFIER'
      );
    `);

    // Seed student consent
    await pg.query(`
      INSERT INTO student_consents (student_email, allow_detailed_verification)
      VALUES 
        ('gopika.sri@student.edu', TRUE),
        ('karthik.s@student.edu', FALSE),
        ('ananya.k@student.edu', TRUE);
    `);

    // 3. Seed Credentials
    // Credential 1: 12th Marksheet for Gopika Sri (VALID)
    const cred1Data = {
      student_name: 'Gopika Sri',
      register_number: 'REG2026001',
      credential_type: '12th',
      qualification: 'Higher Secondary Certificate (HSC) - Bio-Maths',
      institution_id: instId,
      academic_year: '2025-2026',
      issue_date: '2026-04-30',
      marks: '550/600',
      expiry_date: null,
    };
    const cred1Canonical = createCanonicalCredentialString(cred1Data);
    const cred1Hash = generateSha256(cred1Canonical);
    const cred1QR = await generateQrCodeDataUrl('/verify/CRED-2026-8F42A91D');

    await pg.query(`
      INSERT INTO credentials (
        credential_id, student_name, register_number, student_email, credential_type, qualification,
        institution_id, academic_year, issue_date, marks, expiry_date, canonical_hash, qr_code_data, status, is_test_record
      ) VALUES (
        'CRED-2026-8F42A91D',
        '${cred1Data.student_name}',
        '${cred1Data.register_number}',
        'gopika.sri@student.edu',
        '${cred1Data.credential_type}',
        '${cred1Data.qualification}',
        ${instId},
        '${cred1Data.academic_year}',
        '${cred1Data.issue_date}',
        '${cred1Data.marks}',
        NULL,
        '${cred1Hash}',
        '${cred1QR}',
        'VALID',
        FALSE
      );
    `);

    // Credential 2: 10th Certificate for Gopika Sri (VALID)
    const cred2Data = {
      student_name: 'Gopika Sri',
      register_number: 'REG2024098',
      credential_type: '10th',
      qualification: 'Secondary School Leaving Certificate (SSLC)',
      institution_id: instId,
      academic_year: '2023-2024',
      issue_date: '2024-05-18',
      marks: '482/500',
      expiry_date: null,
    };
    const cred2Canonical = createCanonicalCredentialString(cred2Data);
    const cred2Hash = generateSha256(cred2Canonical);
    const cred2QR = await generateQrCodeDataUrl('/verify/CRED-2024-4B11E29C');

    await pg.query(`
      INSERT INTO credentials (
        credential_id, student_name, register_number, student_email, credential_type, qualification,
        institution_id, academic_year, issue_date, marks, expiry_date, canonical_hash, qr_code_data, status, is_test_record
      ) VALUES (
        'CRED-2024-4B11E29C',
        '${cred2Data.student_name}',
        '${cred2Data.register_number}',
        'gopika.sri@student.edu',
        '${cred2Data.credential_type}',
        '${cred2Data.qualification}',
        ${instId},
        '${cred2Data.academic_year}',
        '${cred2Data.issue_date}',
        '${cred2Data.marks}',
        NULL,
        '${cred2Hash}',
        '${cred2QR}',
        'VALID',
        FALSE
      );
    `);

    // Credential 3: Degree for Karthik Sundaram (VALID)
    const cred3Data = {
      student_name: 'Karthik Sundaram',
      register_number: 'REG2022045',
      credential_type: 'Degree',
      qualification: 'Bachelor of Technology in Computer Science',
      institution_id: instId,
      academic_year: '2022-2026',
      issue_date: '2026-06-15',
      marks: '8.92 CGPA',
      expiry_date: null,
    };
    const cred3Canonical = createCanonicalCredentialString(cred3Data);
    const cred3Hash = generateSha256(cred3Canonical);
    const cred3QR = await generateQrCodeDataUrl('/verify/CRED-2026-9C33D10A');

    await pg.query(`
      INSERT INTO credentials (
        credential_id, student_name, register_number, student_email, credential_type, qualification,
        institution_id, academic_year, issue_date, marks, expiry_date, canonical_hash, qr_code_data, status, is_test_record
      ) VALUES (
        'CRED-2026-9C33D10A',
        '${cred3Data.student_name}',
        '${cred3Data.register_number}',
        'karthik.s@student.edu',
        '${cred3Data.credential_type}',
        '${cred3Data.qualification}',
        ${instId},
        '${cred3Data.academic_year}',
        '${cred3Data.issue_date}',
        '${cred3Data.marks}',
        NULL,
        '${cred3Hash}',
        '${cred3QR}',
        'VALID',
        FALSE
      );
    `);

    // Credential 4: Course Certificate for Ananya Krishnan (REVOKED)
    const cred4Data = {
      student_name: 'Ananya Krishnan',
      register_number: 'REG2025112',
      credential_type: 'Course Certificate',
      qualification: 'Advanced Full Stack Web Development',
      institution_id: instId,
      academic_year: '2025-2026',
      issue_date: '2025-11-10',
      marks: 'Grade A',
      expiry_date: null,
    };
    const cred4Canonical = createCanonicalCredentialString(cred4Data);
    const cred4Hash = generateSha256(cred4Canonical);
    const cred4QR = await generateQrCodeDataUrl('/verify/CRED-2025-REVOKED7');

    await pg.query(`
      INSERT INTO credentials (
        credential_id, student_name, register_number, student_email, credential_type, qualification,
        institution_id, academic_year, issue_date, marks, expiry_date, canonical_hash, qr_code_data, status, is_test_record
      ) VALUES (
        'CRED-2025-REVOKED7',
        '${cred4Data.student_name}',
        '${cred4Data.register_number}',
        'ananya.k@student.edu',
        '${cred4Data.credential_type}',
        '${cred4Data.qualification}',
        ${instId},
        '${cred4Data.academic_year}',
        '${cred4Data.issue_date}',
        '${cred4Data.marks}',
        NULL,
        '${cred4Hash}',
        '${cred4QR}',
        'REVOKED',
        FALSE
      );
    `);

    // Revocation record for Credential 4
    await pg.query(`
      INSERT INTO revocations (credential_id, revoked_by, revocation_reason, revoked_at)
      VALUES (
        'CRED-2025-REVOKED7',
        ${adminId},
        'Course prerequisites not fulfilled and withdrawal requested by board.',
        CURRENT_TIMESTAMP
      );
    `);

    // Credential 5: DEMO TEST RECORD FOR TAMPERING DEMONSTRATION
    // Original marks: 550/600. Hash is generated on 550/600.
    const cred5Data = {
      student_name: 'Gopika Sri (Hackathon Test Record)',
      register_number: 'REG2026TEST',
      credential_type: '12th',
      qualification: 'Higher Secondary Certificate (Tamper Demo)',
      institution_id: instId,
      academic_year: '2025-2026',
      issue_date: '2026-04-30',
      marks: '550/600',
      expiry_date: null,
    };
    const cred5Canonical = createCanonicalCredentialString(cred5Data);
    const cred5Hash = generateSha256(cred5Canonical);
    const cred5QR = await generateQrCodeDataUrl('/verify/CRED-2026-TAMPERDEMO');

    await pg.query(`
      INSERT INTO credentials (
        credential_id, student_name, register_number, student_email, credential_type, qualification,
        institution_id, academic_year, issue_date, marks, expiry_date, canonical_hash, qr_code_data, status, is_test_record
      ) VALUES (
        'CRED-2026-TAMPERDEMO',
        '${cred5Data.student_name}',
        '${cred5Data.register_number}',
        'gopika.sri@student.edu',
        '${cred5Data.credential_type}',
        '${cred5Data.qualification}',
        ${instId},
        '${cred5Data.academic_year}',
        '${cred5Data.issue_date}',
        '${cred5Data.marks}',
        NULL,
        '${cred5Hash}',
        '${cred5QR}',
        'VALID',
        TRUE
      );
    `);

    // Credential 6: Expired Certificate (for demonstrating EXPIRED state)
    const cred6Data = {
      student_name: 'Ananya Krishnan',
      register_number: 'REG2023CERT',
      credential_type: 'Course Certificate',
      qualification: 'Cybersecurity Analyst Certificate (1-Year Validity)',
      institution_id: instId,
      academic_year: '2023-2024',
      issue_date: '2023-01-15',
      marks: '95/100',
      expiry_date: '2024-01-15', // Past date!
    };
    const cred6Canonical = createCanonicalCredentialString(cred6Data);
    const cred6Hash = generateSha256(cred6Canonical);
    const cred6QR = await generateQrCodeDataUrl('/verify/CRED-2023-EXPIRED9');

    await pg.query(`
      INSERT INTO credentials (
        credential_id, student_name, register_number, student_email, credential_type, qualification,
        institution_id, academic_year, issue_date, marks, expiry_date, canonical_hash, qr_code_data, status, is_test_record
      ) VALUES (
        'CRED-2023-EXPIRED9',
        '${cred6Data.student_name}',
        '${cred6Data.register_number}',
        'ananya.k@student.edu',
        '${cred6Data.credential_type}',
        '${cred6Data.qualification}',
        ${instId},
        '${cred6Data.academic_year}',
        '${cred6Data.issue_date}',
        '${cred6Data.marks}',
        '${cred6Data.expiry_date}',
        '${cred6Hash}',
        '${cred6QR}',
        'VALID',
        FALSE
      );
    `);

    // 4. Seed initial verification history events
    await pg.query(`
      INSERT INTO verification_history (credential_id, verifier_name, verifier_ip, verification_result, verified_at)
      VALUES 
        ('CRED-2026-8F42A91D', 'Public Verifier', '103.21.244.12', 'VALID', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
        ('CRED-2025-REVOKED7', 'Tech Mahindra HR', '106.51.78.20', 'REVOKED', CURRENT_TIMESTAMP - INTERVAL '1 day'),
        ('CRED-UNKNOWN-999', 'Infosys Recruiter', '49.207.210.9', 'NOT_FOUND', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
        ('CRED-2023-EXPIRED9', 'Amazon Screening', '157.48.90.11', 'EXPIRED', CURRENT_TIMESTAMP - INTERVAL '5 hours');
    `);
  }
}
