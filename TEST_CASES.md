# User Test Cases — Digital Academic Credential Verification Platform

**Scope:** Frontend user acceptance testing (UAT) against the existing backend.
**Frontend:** http://localhost:5173  |  **Backend:** http://localhost:3000

## 0. Setup

```bash
cd backend  && npm install && npm run dev     # terminal 1
cd frontend && npm install && npm run dev     # terminal 2
```

### Demo accounts (password for all: `Password@123`)

| Role | Email | Password |
|---|---|---|
| Institution / Admin | admin@abcschool.edu | Password@123 |
| Student | gopika.sri@student.edu | Password@123 |
| Employer / Verifier | verifier@talentcorp.com | Password@123 |

### Demo credential IDs (pre-loaded)

| Credential ID | Expected verification result |
|---|---|
| CRED-2026-8F42A91D | VALID |
| CRED-2026-TAMPERDEMO | VALID (becomes TAMPERED after "tamper" demo action) |
| CRED-2025-REVOKED7 | REVOKED |
| CRED-2023-EXPIRED9 | EXPIRED |
| CRED-NONEXISTENT-404 | NOT FOUND |

> **Result column:** fill in Pass / Fail while testing.
> Legend for "Pre-checked": **API** = the underlying backend behaviour was already exercised against a running backend; **UI** cases must be checked by hand in the browser.

---

## 1. Authentication & Access Control

| ID | Scenario | Steps | Expected result | Pre-checked | Result |
|---|---|---|---|---|---|
| TC-AUTH-01 | Website link opens login first | Open http://localhost:5173 while logged out | Login page is shown (Email/Username, Password, Remember me, Forgot password, Sign In, demo cards, Register link) | UI | |
| TC-AUTH-02 | Admin login | Enter admin@abcschool.edu / Password@123 → Sign In | Redirected to `/admin/dashboard` | API | |
| TC-AUTH-03 | Student login | Enter gopika.sri@student.edu / Password@123 → Sign In | Redirected to `/student/dashboard` | API | |
| TC-AUTH-04 | Verifier login | Enter verifier@talentcorp.com / Password@123 → Sign In | Redirected to `/verifier/dashboard` | API | |
| TC-AUTH-05 | 1-click demo login | Click each of the 3 "Hackathon Demo Access" cards | Logs in as that role and opens its dashboard | UI | |
| TC-AUTH-06 | Wrong password | Valid email + wrong password | Red error message; stays on login page | API | |
| TC-AUTH-07 | Unknown user | Enter a non-existing email | Error message; no login | API | |
| TC-AUTH-08 | Empty fields | Click Sign In with blank fields | Browser "required" validation blocks submit | UI | |
| TC-AUTH-09 | Show/hide password | Type a password, click the eye icon | Password toggles between hidden and visible | UI | |
| TC-AUTH-10 | Remember me | Login with box checked, logout, open login page | Email is pre-filled. With box unchecked it is not | UI | |
| TC-AUTH-11 | Forgot password | Click "Forgot password?" | Info message to contact institution administrator | UI | |
| TC-AUTH-12 | Register link | Click "Register Here" | Opens `/register` | UI | |
| TC-AUTH-13 | Logout | Click the logout icon in the navbar | Session cleared; protected pages redirect to login | UI | |
| TC-AUTH-14 | Already logged in | Login, then open `/` | Redirected straight to own dashboard (no login page) | UI | |
| TC-AUTH-15 | Protected route, logged out | Logged out, open `/admin/dashboard` | Redirected to login | UI | |
| TC-AUTH-16 | Role guard | Login as Student, open `/admin/dashboard` | Redirected away; admin pages not shown | UI | |

## 2. Institution / Admin

| ID | Scenario | Steps | Expected result | Pre-checked | Result |
|---|---|---|---|---|---|
| TC-INS-01 | Dashboard | Login as Admin | Cards for Total Issued, Active, Revoked, Verifications, Tamper Alerts; credentials-by-type; recent audit feed | UI | |
| TC-INS-02 | Issue credential | Issue New Credential → fill form (use student email `gopika.sri@student.edu`) → submit | Success screen with new Credential ID (format `CRED-2026-XXXXXXXX`) and QR code | API | |
| TC-INS-03 | QR content | Download the QR and scan it with a phone/QR app | Text encoded is `/verify/<CREDENTIAL_ID>` | API | |
| TC-INS-04 | Issue with missing fields | Submit form with required field empty | Validation prevents submit | UI | |
| TC-INS-05 | Registry list | Open Registry | Only this institution's credentials shown, with status badges | API | |
| TC-INS-06 | Registry search & filter | Search by name / reg no / ID; filter by type | Table filters accordingly | UI | |
| TC-INS-07 | View / download QR | Click the QR icon on a row | Modal shows QR, ID, Download PNG works | UI | |
| TC-INS-08 | Revoke credential | Click Revoke → enter reason → Confirm | Status changes to REVOKED; Revoke button disappears | API | |
| TC-INS-09 | Revoke without reason | Open revoke dialog, leave reason blank | Cannot submit | UI | |
| TC-INS-10 | Revoked result on verify | Verify the revoked ID | Result REVOKED with reason and date | API | |
| TC-INS-11 | Institution history | Open Audit Trail | Shows ISSUED, REVOKED and verification events **only for this institution's credentials** | API | |
| TC-INS-12 | History filters | Search by ID / verifier; filter by result type | Rows filter correctly | UI | |
| TC-INS-13 | Dashboard scoping | Compare "Verifications" count with Audit Trail (excluding ISSUED) | Counts match | UI | |

## 3. Student

| ID | Scenario | Steps | Expected result | Pre-checked | Result |
|---|---|---|---|---|---|
| TC-STU-01 | Dashboard | Login as Student | Own credentials listed with status, marks, ID | API | |
| TC-STU-02 | View QR | Click "View QR" on a credential | QR modal opens with ID and download | UI | |
| TC-STU-03 | Credential Passport | Navbar → Credential Passport | Passport view of all own credentials | UI | |
| TC-STU-04 | Consent OFF | Manage Consent → disable detailed access | Success message; status shows Privacy Mode | API | |
| TC-STU-05 | Consent effect | With consent OFF, verify `CRED-2026-8F42A91D` as Verifier | Result VALID but marks/register no. are hidden with privacy notice | API | |
| TC-STU-06 | Consent ON | Re-enable consent, verify again | Full details shown | API | |
| TC-STU-07 | Student history | Navbar → History | Lists checks on **own** credentials with ID, verified by, result, date/time | API | |
| TC-STU-08 | History privacy | Compare with Admin/Verifier logs | Student never sees checks on other students' credentials | API | |
| TC-STU-09 | New verification appears | Verifier checks student's credential, student refreshes History | New event visible | API | |

## 4. Verifier

| ID | Scenario | Steps | Expected result | Pre-checked | Result |
|---|---|---|---|---|---|
| TC-VER-01 | Dashboard | Login as Verifier | Quick ID box, Bulk, Comparison and Audit Log cards | UI | |
| TC-VER-02 | Verify by ID | Enter `CRED-2026-8F42A91D` → Verify | VALID banner, credential details, stored hash = computed hash | API | |
| TC-VER-03 | Scan QR (camera) | Verify page → Scan QR → allow camera → show a credential QR | ID auto-detected and verification runs once | UI | |
| TC-VER-04 | Camera denied | Deny camera permission | Friendly error; can still type ID | UI | |
| TC-VER-05 | Demo presets | Click each preset button on Verify page | Each shows its matching status | API | |
| TC-VER-06 | Field comparison | After a VALID result → Field Comparison tab → change marks → Run | Mismatch highlighted per field | API | |
| TC-VER-07 | Bulk verification | Bulk Verify → Download sample CSV → upload/paste → Run | Summary counts and per-row results | API | |
| TC-VER-08 | Bulk export | After bulk run → export results | CSV report downloads | UI | |
| TC-VER-09 | Verifier history | Verify 3 different IDs, open Screening Log | Shows those checks with result and time; **only this verifier's** | API | |
| TC-VER-10 | History search/export | Search by ID; click Export CSV | Filters; CSV downloads | UI | |
| TC-VER-11 | Single verify = single log | Verify one ID once | Exactly **one** new history row (no duplicates) | API | |

## 5. Verification statuses

| ID | Credential | Steps | Expected result | Pre-checked | Result |
|---|---|---|---|---|---|
| TC-STAT-01 | CRED-2026-8F42A91D | Verify | **VALID** ✓ | API | |
| TC-STAT-02 | CRED-2026-TAMPERDEMO | Click "Tamper" in demo banner, then verify | **TAMPERED** ! with stored ≠ computed hash (red) | API | |
| TC-STAT-03 | CRED-2026-TAMPERDEMO | Click "Restore", verify again | Back to **VALID** | API | |
| TC-STAT-04 | CRED-2025-REVOKED7 | Verify | **REVOKED** ✕ with reason and date | API | |
| TC-STAT-05 | CRED-2023-EXPIRED9 | Verify | **EXPIRED** ⏱ | API | |
| TC-STAT-06 | CRED-NONEXISTENT-404 | Verify | **NOT FOUND** ? | API | |

## 6. End-to-end flow

| ID | Steps | Expected result | Pre-checked | Result |
|---|---|---|---|---|
| TC-E2E-01 | 1. Login as Admin → 2. Issue credential for `gopika.sri@student.edu` → 3. Note ID + QR → 4. Logout → 5. Login as Student → credential and QR visible → 6. Logout → 7. Login as Verifier → verify the ID → **VALID** → 8. Logout → 9. Login as Admin → Revoke it → 10. Verifier verifies again → **REVOKED** → 11. Check History for all three roles | Each role's History shows the correct events (Admin: ISSUED + REVOKED + verifications; Student: verifications; Verifier: own checks) | API (backend flow) / UI (screens) | |

## 7. General / non-functional

| ID | Scenario | Steps | Expected result | Result |
|---|---|---|---|---|
| TC-GEN-01 | Language toggle | Click EN / தமிழ் in navbar | Verify page text switches language | |
| TC-GEN-02 | Backend offline | Stop backend, try to login | Error message shown, app does not crash | |
| TC-GEN-03 | Responsive | Resize to mobile width | Layout adapts, tables scroll horizontally | |
| TC-GEN-04 | Refresh persistence | Login, refresh page | Session persists (still logged in) | |
| TC-GEN-05 | Overview page | Navbar → Overview | Marketing/overview page (`/home`) opens | |

---

## 8. Known limitations (need backend changes — not covered by these tests)

- Verification **method** (QR / ID / bulk) is not stored by the backend, so History cannot show it.
- `/api/verification-history` is a public endpoint; history is filtered per role on the frontend only.
- Bulk verifications are not written to History by the backend.
- Verifier history matches by verifier name (backend does not store verifier ID for verify calls).
- No separate super-admin role exists; the Institution role is the admin.
