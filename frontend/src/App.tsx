import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, UserRole } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navbar } from './components/Navbar';

// Public Pages
import { Home } from './pages/Home';
import { Verify } from './pages/Verify';
import { Login, dashboardFor } from './pages/Login';
import { Register } from './pages/Register';
import { TestCases } from './pages/TestCases';

// Institution Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCredentials } from './pages/admin/AdminCredentials';
import { AdminIssueCredential } from './pages/admin/AdminIssueCredential';
import { AdminHistory } from './pages/admin/AdminHistory';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentPassport } from './pages/student/StudentPassport';
import { StudentConsent } from './pages/student/StudentConsent';
import { StudentHistory } from './pages/student/StudentHistory';

// Verifier Pages
import { VerifierDashboard } from './pages/verifier/VerifierDashboard';
import { BulkVerification } from './pages/verifier/BulkVerification';
import { VerifierHistory } from './pages/verifier/VerifierHistory';

// Route Guard Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Front door: logged-out visitors see the login page; signed-in users go to their dashboard
const LoginGate: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[85vh] bg-[#e7eef9] flex items-center justify-center text-[#5c769b] text-xs">
        Loading...
      </div>
    );
  }
  if (user) return <Navigate to={dashboardFor(user.role)} replace />;
  return <Login />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginGate />} />
                <Route path="/home" element={<Home />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/verify/:credentialId" element={<Verify />} />
                <Route path="/login" element={<LoginGate />} />
                <Route path="/register" element={<Register />} />
                <Route path="/test-cases" element={<TestCases />} />

                {/* Institution Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['INSTITUTION']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/credentials"
                  element={
                    <ProtectedRoute allowedRoles={['INSTITUTION']}>
                      <AdminCredentials />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/credentials/new"
                  element={
                    <ProtectedRoute allowedRoles={['INSTITUTION']}>
                      <AdminIssueCredential />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/history"
                  element={
                    <ProtectedRoute allowedRoles={['INSTITUTION']}>
                      <AdminHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/credentials"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/passport"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentPassport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/consent"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentConsent />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/student/history"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <StudentHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Verifier Routes */}
                <Route
                  path="/verifier/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['VERIFIER']}>
                      <VerifierDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/verifier/verify" element={<Verify />} />
                <Route
                  path="/verifier/bulk-verification"
                  element={<BulkVerification />}
                />
                <Route
                  path="/verifier/history"
                  element={
                    <ProtectedRoute allowedRoles={['VERIFIER']}>
                      <VerifierHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
