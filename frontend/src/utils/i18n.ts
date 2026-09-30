export type Language = 'en' | 'ta';

export interface Translations {
  verifyTitle: string;
  verifySubtitle: string;
  enterCredentialId: string;
  credentialIdPlaceholder: string;
  verifyButton: string;
  orScanQr: string;
  uploadQrCode: string;
  statusValid: string;
  statusTampered: string;
  statusRevoked: string;
  statusNotFound: string;
  statusExpired: string;
  institution: string;
  studentName: string;
  registerNumber: string;
  credentialType: string;
  qualification: string;
  academicYear: string;
  issueDate: string;
  marks: string;
  expiryDate: string;
  cryptographicIntegrity: string;
  storedHash: string;
  computedHash: string;
  hashMatchExplanation: string;
  consentRestrictedNotice: string;
  tamperWarning: string;
  revocationNotice: string;
  certificateComparison: string;
  compareExplanation: string;
  fieldLevelMatch: string;
  fieldLevelMismatch: string;
  languageName: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    verifyTitle: 'Verify Academic Credential',
    verifySubtitle: 'Instant, tamper-resistant validation powered by SHA-256 cryptographic hashing and QR signatures',
    enterCredentialId: 'Credential ID',
    credentialIdPlaceholder: 'e.g. CRED-2026-8F42A91D',
    verifyButton: 'Verify Credential',
    orScanQr: 'Or scan QR Code',
    uploadQrCode: 'Upload / Scan QR Image',
    statusValid: 'VALID',
    statusTampered: 'TAMPERED',
    statusRevoked: 'REVOKED',
    statusNotFound: 'NOT FOUND',
    statusExpired: 'EXPIRED',
    institution: 'Issuing Institution',
    studentName: 'Student Name',
    registerNumber: 'Register Number',
    credentialType: 'Credential Type',
    qualification: 'Qualification / Program',
    academicYear: 'Academic Year',
    issueDate: 'Issue Date',
    marks: 'Marks / Grade',
    expiryDate: 'Expiry Date',
    cryptographicIntegrity: 'SHA-256 Cryptographic Integrity Check',
    storedHash: 'Anchored Hash (in Database):',
    computedHash: 'Live Recomputed Hash:',
    hashMatchExplanation: 'Every character of the credential payload is deterministically bound. Identical inputs yield an identical 256-bit digest.',
    consentRestrictedNotice: 'Student Privacy Active: Detailed marks and student identity have been redacted by student consent settings.',
    tamperWarning: 'SECURITY BREACH DETECTED: The credential data in the registry does not match the original cryptographic anchor generated at issuance.',
    revocationNotice: 'OFFICIALLY REVOKED: This credential was formally revoked by the authorized institution.',
    certificateComparison: 'Field-Level Certificate Comparison',
    compareExplanation: 'Check physical/submitted document fields directly against the issuing authority record.',
    fieldLevelMatch: 'ALL FIELDS MATCH ORIGINAL RECORD',
    fieldLevelMismatch: 'DISCREPANCIES DETECTED IN SUBMITTED FIELDS',
    languageName: 'English',
  },
  ta: {
    verifyTitle: 'கல்விச் சான்றிதழை சரிபார்க்கவும்',
    verifySubtitle: 'SHA-256 குறியாக்கவியல் மற்றும் QR கையொப்பம் மூலம் உடனடி, மாற்ற முடியாத சரிபார்ப்பு',
    enterCredentialId: 'சான்றிதழ் அடையாள எண்',
    credentialIdPlaceholder: 'எ.கா: CRED-2026-8F42A91D',
    verifyButton: 'சான்றிதழை சரிபார்க்கவும்',
    orScanQr: 'அல்லது QR குறியீட்டை ஸ்கேன் செய்யவும்',
    uploadQrCode: 'QR குறியீட்டு படத்தை பதிவேற்றவும்',
    statusValid: 'செல்லுபடியாகும் (VALID)',
    statusTampered: 'மாற்றப்பட்டது / சிதைக்கப்பட்டது (TAMPERED)',
    statusRevoked: 'ரத்து செய்யப்பட்டது (REVOKED)',
    statusNotFound: 'கண்டறியப்படவில்லை (NOT FOUND)',
    statusExpired: 'காலாவதியானது (EXPIRED)',
    institution: 'கல்வி நிறுவனம்',
    studentName: 'மாணவர் பெயர்',
    registerNumber: 'பதிவு எண்',
    credentialType: 'சான்றிதழ் வகை',
    qualification: 'கல்வித் தகுதி / படிப்பு',
    academicYear: 'கல்வி ஆண்டு',
    issueDate: 'வழங்கப்பட்ட தேதி',
    marks: 'மதிப்பெண் / தரம்',
    expiryDate: 'காலாவதி தேதி',
    cryptographicIntegrity: 'SHA-256 குறியாக்க ஒருமைப்பாடு சரிபார்ப்பு',
    storedHash: 'சேமிக்கப்பட்ட டிஜிட்டல் கைரேகை (Stored Hash):',
    computedHash: 'தற்போதைய மறு கணக்கீட்டு கைரேகை (Recomputed Hash):',
    hashMatchExplanation: 'சான்றிதழ் தரவுகள் அனைத்தும் கணக்கீட்டு முறையில் பிணைக்கப்பட்டுள்ளன. ஏதேனும் மாற்றம் ஏற்பட்டால் கைரேகை பொருந்தாது.',
    consentRestrictedNotice: 'மாணவர் தனியுரிமை பாதுகாப்பு: மாணவரின் ஒப்புதல் அமைப்பின்படி கூடுதல் தனிப்பட்ட விவரங்கள் மறைக்கப்பட்டுள்ளன.',
    tamperWarning: 'பாதுகாப்பு எச்சரிக்கை: வழங்கப்பட்ட போது உருவான அசல் கைரேகையுடன் தரவுகள் பொருந்தவில்லை. ஆவணத்தில் மாற்றம் செய்யப்பட்டுள்ளது!',
    revocationNotice: 'அதிகாரப்பூர்வமாக ரத்து செய்யப்பட்டது: இந்த சான்றிதழ் கல்வி நிறுவனத்தால் ரத்து செய்யப்பட்டுள்ளது.',
    certificateComparison: 'சான்றிதழ் தகவல் நேரடி ஒப்பீடு',
    compareExplanation: 'சமர்ப்பிக்கப்பட்ட சான்றிதழ் விவரங்களை கல்வி நிறுவனத்தின் அசல் தரவுகளுடன் நேரடியாக ஒப்பிட்டு சரிபார்க்கவும்.',
    fieldLevelMatch: 'அனைத்து விவரங்களும் அசல் பதிவோடு சரியாகப் பொருந்துகின்றன',
    fieldLevelMismatch: 'சமர்ப்பிக்கப்பட்ட விவரங்களில் முரண்பாடுகள் கண்டறியப்பட்டுள்ளன',
    languageName: 'தமிழ்',
  },
};
