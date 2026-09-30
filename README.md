# Digital Academic Credential Verification Platform
> **“Secure • Verifiable • Tamper-Resistant Digital Credentials”**

An end-to-end academic credential issuance, cryptographic anchoring, and verification platform designed for educational institutions, students, and background screening verifiers.

---

## 1. Project Overview & Objective

Manual academic credential verification is fundamentally slow, costly, and susceptible to document manipulation and undetected revocations. 

This platform enables:
1. **Accredited Institutions** to digitally issue academic certificates with deterministic SHA-256 hash digests and cryptographically signed QR codes.
2. **Authorized Verifiers / Employers** to instantly authenticate credentials via QR scanning, Credential ID lookup, CSV bulk uploads, or field-by-field certificate comparison.
3. **Students** to hold a unified Multi-Tier Credential Passport and control granular privacy consent over their personal academic scores.

The platform classifies certificate integrity into 5 definitive states:
- **`VALID ✓`**: Hash matches stored anchor in PostgreSQL, credential is active.
- **`TAMPERED !`**: Field data does not match the original canonical cryptographic hash.
- **`REVOKED ✕`**: Authorized institution has formally cancelled the credential with audit reasoning.
- **`NOT FOUND ?`**: No record exists in the academic registry.
- **`EXPIRED ⏱`**: Credential validity period has concluded.

---

## 2. Core Architecture & Workflow

```
Institution Admin
      │
      ▼
1. Enter Credential Data (Student Name, Reg No, Type, Marks, Issue Date)
      │
      ▼
2. Generate Unique Credential ID (e.g. CRED-2026-8F42A91D)
      │
      ▼
3. Deterministic Canonicalization (Canonical JSON String)
      │
      ▼
4. Generate 256-bit SHA-256 Hash
      │
      ▼
5. Store Credential + Hash in PostgreSQL
      │
      ▼
6. Render Tamper-Resistant QR Code with Verification Endpoint
      │
      ▼
Student Receives Credential in Passport
      │
      ▼
Verifier Scans QR / Queries Credential ID
      │
      ▼
Verification Engine:
  ├── Check Database Record Existence (If none -> NOT FOUND)
  ├── Check Status Flag (If 'REVOKED' -> REVOKED)
  ├── Check Expiry Date (If past today -> EXPIRED)
  ├── Recompute SHA-256 Hash from Current Database Fields
  └── Compare Recomputed Hash vs Stored Canonical Hash
      ├── Match -> VALID ✓
      └── Mismatch -> TAMPERED !
      │
      ▼
Record Query Event in Immutable Audit Trail (verification_history)
```

---

## 3. Tech Stack

- **Frontend**: React 19, TypeScript, React Router 7, Axios, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express.js, TypeScript (`tsx`).
- **Database**: PostgreSQL (`@electric-sql/pglite` embedded relational engine with full Postgres SQL syntax, indexes, foreign keys, and constraints).
- **Cryptography & Signatures**: Node.js standard `crypto` module (SHA-256), `qrcode` generator, `bcryptjs` password hashing, `jsonwebtoken` (JWT) RBAC.
- **Internationalization**: Bilingual verification interface (English & தமிழ் / Tamil).

---

## 4. Key Security & Cryptographic Concepts

### A. SHA-256 Deterministic Canonical Hashing
To prevent false hash mismatches from JSON key ordering or whitespace discrepancies, the platform converts input fields into a normalized canonical JSON string before running SHA-256:

```json
{
  "academic_year": "2025-2026",
  "credential_type": "12th",
  "expiry_date": null,
  "institution_id": "1",
  "issue_date": "2026-04-30",
  "marks": "550/600",
  "qualification": "Higher Secondary Certificate (HSC) - Bio-Maths",
  "register_number": "REG2026001",
  "student_name": "Gopika Sri"
}
```

```typescript
const canonicalString = createCanonicalCredentialString(credentialData);
const canonicalHash = crypto.createHash('sha256').update(canonicalString, 'utf8').digest('hex');
```

### B. Tamper Detection vs. Revocation
- **`TAMPERED`**: The certificate data stored in the database has been unlawfully altered (e.g., marks modified from 550/600 to 590/600). The current SHA-256 recomputation does not match the original hash anchored at issuance.
- **`REVOKED`**: The credential was officially cancelled by the issuing institution (e.g., disciplinary action, administrative cancellation). The record is preserved for audit compliance.

---

## 5. PostgreSQL Database Schema

The database consists of 6 relational tables:

1. **`institutions`**: Accredited schools, colleges, and universities with unique codes and `ACTIVE` status enforcement.
2. **`users`**: Role-based accounts for `INSTITUTION`, `STUDENT`, and `VERIFIER`.
3. **`credentials`**: Academic certificates containing canonical hashes, QR payloads, and validity terms.
4. **`revocations`**: Audit log of cancelled credentials including revocation reason, date, and issuer.
5. **`verification_history`**: Immutable log recording every lookup, verifying IP, identity, and outcome.
6. **`student_consents`**: Student privacy preferences (`allow_detailed_verification`).

---

## 6. Demo Accounts (1-Click Login Available)

| Role | Email | Password | Details |
|---|---|---|---|
| **Institution Admin** | `admin@abcschool.edu` | `Password@123` | ABC Higher Secondary School & Academy |
| **Student** | `gopika.sri@student.edu` | `Password@123` | Gopika Sri (Multiple Credentials & Passport) |
| **Verifier / Employer** | `verifier@talentcorp.com` | `Password@123` | Talent Screening Agency |

---

## 7. Hackathon Live Demo Flow (Step-by-Step)

During your presentation, follow this sequence:

1. **Step 1 - Institution Login**: Click **Demo Role: Admin** in the header or sign in as `admin@abcschool.edu`.
2. **Step 2 - Issue Credential**: Open **Issue New Credential**, select `12th`, student `Gopika Sri`, marks `550/600`. Submit to generate unique Credential ID, SHA-256 hash, and QR code.
3. **Step 3 - Verify Valid Credential**: Click **Verify Live** or enter `CRED-2026-8F42A91D`. Notice the green **`VALID ✓`** badge and 100% SHA-256 hash match.
4. **Step 4 - Simulate Tampering (Test Record)**: Click the **Simulate Tamper (590/600)** button on the top banner. This modifies the test record marks in PostgreSQL without updating its anchored hash.
5. **Step 5 - Tamper Alert**: Verify `CRED-2026-TAMPERDEMO`. The engine detects the hash discrepancy and displays a flashing **`TAMPERED !`** security warning.
6. **Step 6 - Revocation Flow**: Go to **Registry**, click **Revoke** on `CRED-2025-REVOKED7`, provide a reason, and submit.
7. **Step 7 - Verify Revoked**: Verify `CRED-2025-REVOKED7`. The engine returns an amber **`REVOKED ✕`** status with cancellation date and reason.
8. **Step 8 - Student Passport & Consent**: Switch to student `gopika.sri@student.edu`. Open **Credential Passport** to view independent statuses. Toggle **Allow Detailed Verification** to test student privacy redaction.
9. **Step 9 - Bulk Verification**: Go to **Bulk Verification**, load the sample batch, and execute. View batch metrics and export the CSV audit report.
10. **Step 10 - Audit Trail**: Open **Audit Trail** to view every verification query recorded in PostgreSQL.

---

## 8. Project Structure

```
frontend/   React 19 + Vite + Tailwind v4 (blue theme)  -> http://localhost:5173
backend/    Express + PGlite (embedded PostgreSQL) API   -> http://localhost:3000
```

## 9. Running

```bash
# Terminal 1 - backend
cd backend
cp .env.example .env
npm install
npm run dev

# Terminal 2 - frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. In dev, Vite proxies `/api` to the backend.
For production, run `npm run build` in `frontend/` and set `VITE_API_URL` to your backend URL;
set `FRONTEND_URL` and `JWT_SECRET` in `backend/.env`.
