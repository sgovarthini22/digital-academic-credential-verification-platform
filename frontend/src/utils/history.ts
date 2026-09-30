import api from '../api/client';
import type { User } from '../contexts/AuthContext';

/**
 * Role-scoped history built only from existing backend endpoints:
 *  - GET /credentials            (already scoped by the backend: INSTITUTION -> own institution, STUDENT -> own email)
 *  - GET /verification-history   (returns the global ledger; scoped here on the client)
 *
 * INSTITUTION : verification activity on its credentials + an ISSUED event per credential it issued
 * STUDENT     : verification activity on the student's own credentials
 * VERIFIER    : verification checks performed by this verifier
 */
export async function fetchRoleHistory(user: User): Promise<any[]> {
  const historyRes = await api.get('/verification-history', { params: { limit: 1000 } });
  const all: any[] = historyRes.data.history || [];

  if (user.role === 'VERIFIER') {
    const name = (user.name || '').trim().toLowerCase();
    return all.filter(
      (h) =>
        (h.verifier_id != null && h.verifier_id === user.id) ||
        (name && String(h.verifier_name || '').trim().toLowerCase() === name)
    );
  }

  const credRes = await api.get('/credentials');
  const creds: any[] = credRes.data.credentials || [];
  const byId = new Map<string, any>(creds.map((c) => [c.credential_id, c]));

  // The backend already logs an ISSUED event for credentials issued through the app.
  const loggedIssued = new Set(all.filter((h) => h.verification_result === 'ISSUED').map((h) => h.credential_id));

  const events = all
    .filter((h) => byId.has(h.credential_id))
    // students see who checked their credentials, not internal issuance records
    .filter((h) => user.role !== 'STUDENT' || h.verification_result !== 'ISSUED')
    .map((h) => {
      const c = byId.get(h.credential_id);
      return {
        ...h,
        student_name: h.student_name || c.student_name,
        credential_type: h.credential_type || c.credential_type,
      };
    });

  if (user.role === 'INSTITUTION') {
    // Credentials with no logged ISSUED event (e.g. seeded records) get one from their real created_at.
    creds.filter((c) => !loggedIssued.has(c.credential_id)).forEach((c) => {
      events.push({
        id: `issued-${c.credential_id}`,
        credential_id: c.credential_id,
        student_name: c.student_name,
        credential_type: c.credential_type,
        verifier_name: `Issued by ${user.institution_name || user.name}`,
        verifier_ip: null,
        verification_result: 'ISSUED',
        verified_at: c.created_at,
      });
    });
  }

  return events.sort((a, b) => new Date(b.verified_at).getTime() - new Date(a.verified_at).getTime());
}
