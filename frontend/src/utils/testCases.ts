// Generated from TEST_CASES.md
export interface TestCase { id: string; scenario: string; steps: string; expected: string; checked: string }
export interface TestSection { title: string; cases: TestCase[] }

export const TEST_SECTIONS: TestSection[] = [
  {
    "title": "Authentication & Access Control",
    "cases": [
      {
        "id": "TC-AUTH-01",
        "scenario": "Website link opens login first",
        "steps": "Open http://localhost:5173 while logged out",
        "expected": "Login page is shown (Email/Username, Password, Remember me, Forgot password, Sign In, demo cards, Register link)",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-02",
        "scenario": "Admin login",
        "steps": "Enter admin@abcschool.edu / Password@123 → Sign In",
        "expected": "Redirected to /admin/dashboard",
        "checked": "API"
      },
      {
        "id": "TC-AUTH-03",
        "scenario": "Student login",
        "steps": "Enter gopika.sri@student.edu / Password@123 → Sign In",
        "expected": "Redirected to /student/dashboard",
        "checked": "API"
      },
      {
        "id": "TC-AUTH-04",
        "scenario": "Verifier login",
        "steps": "Enter verifier@talentcorp.com / Password@123 → Sign In",
        "expected": "Redirected to /verifier/dashboard",
        "checked": "API"
      },
      {
        "id": "TC-AUTH-05",
        "scenario": "1-click demo login",
        "steps": "Click each of the 3 \"Hackathon Demo Access\" cards",
        "expected": "Logs in as that role and opens its dashboard",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-06",
        "scenario": "Wrong password",
        "steps": "Valid email + wrong password",
        "expected": "Red error message; stays on login page",
        "checked": "API"
      },
      {
        "id": "TC-AUTH-07",
        "scenario": "Unknown user",
        "steps": "Enter a non-existing email",
        "expected": "Error message; no login",
        "checked": "API"
      },
      {
        "id": "TC-AUTH-08",
        "scenario": "Empty fields",
        "steps": "Click Sign In with blank fields",
        "expected": "Browser \"required\" validation blocks submit",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-09",
        "scenario": "Show/hide password",
        "steps": "Type a password, click the eye icon",
        "expected": "Password toggles between hidden and visible",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-10",
        "scenario": "Remember me",
        "steps": "Login with box checked, logout, open login page",
        "expected": "Email is pre-filled. With box unchecked it is not",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-11",
        "scenario": "Forgot password",
        "steps": "Click \"Forgot password?\"",
        "expected": "Info message to contact institution administrator",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-12",
        "scenario": "Register link",
        "steps": "Click \"Register Here\"",
        "expected": "Opens /register",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-13",
        "scenario": "Logout",
        "steps": "Click the logout icon in the navbar",
        "expected": "Session cleared; protected pages redirect to login",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-14",
        "scenario": "Already logged in",
        "steps": "Login, then open /",
        "expected": "Redirected straight to own dashboard (no login page)",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-15",
        "scenario": "Protected route, logged out",
        "steps": "Logged out, open /admin/dashboard",
        "expected": "Redirected to login",
        "checked": "UI"
      },
      {
        "id": "TC-AUTH-16",
        "scenario": "Role guard",
        "steps": "Login as Student, open /admin/dashboard",
        "expected": "Redirected away; admin pages not shown",
        "checked": "UI"
      }
    ]
  },
  {
    "title": "Institution / Admin",
    "cases": [
      {
        "id": "TC-INS-01",
        "scenario": "Dashboard",
        "steps": "Login as Admin",
        "expected": "Cards for Total Issued, Active, Revoked, Verifications, Tamper Alerts; credentials-by-type; recent audit feed",
        "checked": "UI"
      },
      {
        "id": "TC-INS-02",
        "scenario": "Issue credential",
        "steps": "Issue New Credential → fill form (use student email gopika.sri@student.edu) → submit",
        "expected": "Success screen with new Credential ID (format CRED-2026-XXXXXXXX) and QR code",
        "checked": "API"
      },
      {
        "id": "TC-INS-03",
        "scenario": "QR content",
        "steps": "Download the QR and scan it with a phone/QR app",
        "expected": "Text encoded is /verify/<CREDENTIAL_ID>",
        "checked": "API"
      },
      {
        "id": "TC-INS-04",
        "scenario": "Issue with missing fields",
        "steps": "Submit form with required field empty",
        "expected": "Validation prevents submit",
        "checked": "UI"
      },
      {
        "id": "TC-INS-05",
        "scenario": "Registry list",
        "steps": "Open Registry",
        "expected": "Only this institution's credentials shown, with status badges",
        "checked": "API"
      },
      {
        "id": "TC-INS-06",
        "scenario": "Registry search & filter",
        "steps": "Search by name / reg no / ID; filter by type",
        "expected": "Table filters accordingly",
        "checked": "UI"
      },
      {
        "id": "TC-INS-07",
        "scenario": "View / download QR",
        "steps": "Click the QR icon on a row",
        "expected": "Modal shows QR, ID, Download PNG works",
        "checked": "UI"
      },
      {
        "id": "TC-INS-08",
        "scenario": "Revoke credential",
        "steps": "Click Revoke → enter reason → Confirm",
        "expected": "Status changes to REVOKED; Revoke button disappears",
        "checked": "API"
      },
      {
        "id": "TC-INS-09",
        "scenario": "Revoke without reason",
        "steps": "Open revoke dialog, leave reason blank",
        "expected": "Cannot submit",
        "checked": "UI"
      },
      {
        "id": "TC-INS-10",
        "scenario": "Revoked result on verify",
        "steps": "Verify the revoked ID",
        "expected": "Result REVOKED with reason and date",
        "checked": "API"
      },
      {
        "id": "TC-INS-11",
        "scenario": "Institution history",
        "steps": "Open Audit Trail",
        "expected": "Shows ISSUED, REVOKED and verification events only for this institution's credentials",
        "checked": "API"
      },
      {
        "id": "TC-INS-12",
        "scenario": "History filters",
        "steps": "Search by ID / verifier; filter by result type",
        "expected": "Rows filter correctly",
        "checked": "UI"
      },
      {
        "id": "TC-INS-13",
        "scenario": "Dashboard scoping",
        "steps": "Compare \"Verifications\" count with Audit Trail (excluding ISSUED)",
        "expected": "Counts match",
        "checked": "UI"
      }
    ]
  },
  {
    "title": "Student",
    "cases": [
      {
        "id": "TC-STU-01",
        "scenario": "Dashboard",
        "steps": "Login as Student",
        "expected": "Own credentials listed with status, marks, ID",
        "checked": "API"
      },
      {
        "id": "TC-STU-02",
        "scenario": "View QR",
        "steps": "Click \"View QR\" on a credential",
        "expected": "QR modal opens with ID and download",
        "checked": "UI"
      },
      {
        "id": "TC-STU-03",
        "scenario": "Credential Passport",
        "steps": "Navbar → Credential Passport",
        "expected": "Passport view of all own credentials",
        "checked": "UI"
      },
      {
        "id": "TC-STU-04",
        "scenario": "Consent OFF",
        "steps": "Manage Consent → disable detailed access",
        "expected": "Success message; status shows Privacy Mode",
        "checked": "API"
      },
      {
        "id": "TC-STU-05",
        "scenario": "Consent effect",
        "steps": "With consent OFF, verify CRED-2026-8F42A91D as Verifier",
        "expected": "Result VALID but marks/register no. are hidden with privacy notice",
        "checked": "API"
      },
      {
        "id": "TC-STU-06",
        "scenario": "Consent ON",
        "steps": "Re-enable consent, verify again",
        "expected": "Full details shown",
        "checked": "API"
      },
      {
        "id": "TC-STU-07",
        "scenario": "Student history",
        "steps": "Navbar → History",
        "expected": "Lists checks on own credentials with ID, verified by, result, date/time",
        "checked": "API"
      },
      {
        "id": "TC-STU-08",
        "scenario": "History privacy",
        "steps": "Compare with Admin/Verifier logs",
        "expected": "Student never sees checks on other students' credentials",
        "checked": "API"
      },
      {
        "id": "TC-STU-09",
        "scenario": "New verification appears",
        "steps": "Verifier checks student's credential, student refreshes History",
        "expected": "New event visible",
        "checked": "API"
      }
    ]
  },
  {
    "title": "Verifier",
    "cases": [
      {
        "id": "TC-VER-01",
        "scenario": "Dashboard",
        "steps": "Login as Verifier",
        "expected": "Quick ID box, Bulk, Comparison and Audit Log cards",
        "checked": "UI"
      },
      {
        "id": "TC-VER-02",
        "scenario": "Verify by ID",
        "steps": "Enter CRED-2026-8F42A91D → Verify",
        "expected": "VALID banner, credential details, stored hash = computed hash",
        "checked": "API"
      },
      {
        "id": "TC-VER-03",
        "scenario": "Scan QR (camera)",
        "steps": "Verify page → Scan QR → allow camera → show a credential QR",
        "expected": "ID auto-detected and verification runs once",
        "checked": "UI"
      },
      {
        "id": "TC-VER-04",
        "scenario": "Camera denied",
        "steps": "Deny camera permission",
        "expected": "Friendly error; can still type ID",
        "checked": "UI"
      },
      {
        "id": "TC-VER-05",
        "scenario": "Demo presets",
        "steps": "Click each preset button on Verify page",
        "expected": "Each shows its matching status",
        "checked": "API"
      },
      {
        "id": "TC-VER-06",
        "scenario": "Field comparison",
        "steps": "After a VALID result → Field Comparison tab → change marks → Run",
        "expected": "Mismatch highlighted per field",
        "checked": "API"
      },
      {
        "id": "TC-VER-07",
        "scenario": "Bulk verification",
        "steps": "Bulk Verify → Download sample CSV → upload/paste → Run",
        "expected": "Summary counts and per-row results",
        "checked": "API"
      },
      {
        "id": "TC-VER-08",
        "scenario": "Bulk export",
        "steps": "After bulk run → export results",
        "expected": "CSV report downloads",
        "checked": "UI"
      },
      {
        "id": "TC-VER-09",
        "scenario": "Verifier history",
        "steps": "Verify 3 different IDs, open Screening Log",
        "expected": "Shows those checks with result and time; only this verifier's",
        "checked": "API"
      },
      {
        "id": "TC-VER-10",
        "scenario": "History search/export",
        "steps": "Search by ID; click Export CSV",
        "expected": "Filters; CSV downloads",
        "checked": "UI"
      },
      {
        "id": "TC-VER-11",
        "scenario": "Single verify = single log",
        "steps": "Verify one ID once",
        "expected": "Exactly one new history row (no duplicates)",
        "checked": "API"
      }
    ]
  },
  {
    "title": "Verification statuses",
    "cases": [
      {
        "id": "TC-STAT-01",
        "scenario": "CRED-2026-8F42A91D",
        "steps": "Verify",
        "expected": "VALID ✓",
        "checked": "API"
      },
      {
        "id": "TC-STAT-02",
        "scenario": "CRED-2026-TAMPERDEMO",
        "steps": "Click \"Tamper\" in demo banner, then verify",
        "expected": "TAMPERED ! with stored ≠ computed hash (red)",
        "checked": "API"
      },
      {
        "id": "TC-STAT-03",
        "scenario": "CRED-2026-TAMPERDEMO",
        "steps": "Click \"Restore\", verify again",
        "expected": "Back to VALID",
        "checked": "API"
      },
      {
        "id": "TC-STAT-04",
        "scenario": "CRED-2025-REVOKED7",
        "steps": "Verify",
        "expected": "REVOKED ✕ with reason and date",
        "checked": "API"
      },
      {
        "id": "TC-STAT-05",
        "scenario": "CRED-2023-EXPIRED9",
        "steps": "Verify",
        "expected": "EXPIRED ⏱",
        "checked": "API"
      },
      {
        "id": "TC-STAT-06",
        "scenario": "CRED-NONEXISTENT-404",
        "steps": "Verify",
        "expected": "NOT FOUND ?",
        "checked": "API"
      }
    ]
  },
  {
    "title": "End-to-end flow",
    "cases": [
      {
        "id": "TC-E2E-01",
        "scenario": "End-to-end flow",
        "steps": "1. Login as Admin → 2. Issue credential for gopika.sri@student.edu → 3. Note ID + QR → 4. Logout → 5. Login as Student → credential and QR visible → 6. Logout → 7. Login as Verifier → verify the ID → VALID → 8. Logout → 9. Login as Admin → Revoke it → 10. Verifier verifies again → REVOKED → 11. Check History for all three roles",
        "expected": "Each role's History shows the correct events (Admin: ISSUED + REVOKED + verifications; Student: verifications; Verifier: own checks)",
        "checked": "API (backend flow) / UI (screens)"
      }
    ]
  },
  {
    "title": "General / non-functional",
    "cases": [
      {
        "id": "TC-GEN-01",
        "scenario": "Language toggle",
        "steps": "Click EN / தமிழ் in navbar",
        "expected": "Verify page text switches language",
        "checked": ""
      },
      {
        "id": "TC-GEN-02",
        "scenario": "Backend offline",
        "steps": "Stop backend, try to login",
        "expected": "Error message shown, app does not crash",
        "checked": ""
      },
      {
        "id": "TC-GEN-03",
        "scenario": "Responsive",
        "steps": "Resize to mobile width",
        "expected": "Layout adapts, tables scroll horizontally",
        "checked": ""
      },
      {
        "id": "TC-GEN-04",
        "scenario": "Refresh persistence",
        "steps": "Login, refresh page",
        "expected": "Session persists (still logged in)",
        "checked": ""
      },
      {
        "id": "TC-GEN-05",
        "scenario": "Overview page",
        "steps": "Navbar → Overview",
        "expected": "Marketing/overview page (/home) opens",
        "checked": ""
      }
    ]
  }
];
