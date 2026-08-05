import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegistrationPage from './pages/RegistrationPage';
import NhifMembershipPage from './pages/nhif/NhifMembershipPage';
import NhifCardApplicationPage from './pages/nhif/NhifCardApplicationPage';
import NhifInvoicesPage from './pages/nhif/NhifInvoicesPage';
import NhifVerificationPage from './pages/nhif/NhifVerificationPage';
import StudentServicesPage from './pages/StudentServicesPage';
import AcademicPage from './pages/AcademicPage';
import AccountPage from './pages/AccountPage';
import ChangeProfilePage from './pages/ChangeProfilePage';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import FinancePage from './pages/FinancePage';
import AccommodationPage from './pages/AccommodationPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />

        {/* Registration - 10 steps */}
        <Route path="registration" element={<Navigate to="/registration/basic" replace />} />
        <Route path="registration/basic" element={<RegistrationPage />} />
        <Route path="registration/admission" element={<RegistrationPage />} />
        <Route path="registration/schools" element={<RegistrationPage />} />
        <Route path="registration/college" element={<RegistrationPage />} />
        <Route path="registration/health" element={<RegistrationPage />} />
        <Route path="registration/experience" element={<RegistrationPage />} />
        <Route path="registration/contact" element={<RegistrationPage />} />
        <Route path="registration/sponsor" element={<RegistrationPage />} />
        <Route path="registration/courses" element={<RegistrationPage />} />
        <Route path="registration/form" element={<RegistrationPage />} />

        {/* NHIF Portal */}
        <Route path="nhif" element={<Navigate to="/nhif/membership" replace />} />
        <Route path="nhif/membership" element={<NhifMembershipPage />} />
        <Route path="nhif/card-application" element={<NhifCardApplicationPage />} />
        <Route path="nhif/invoices" element={<NhifInvoicesPage />} />
        <Route path="nhif/verification" element={<NhifVerificationPage />} />

        {/* Student Services */}
        <Route path="student-services" element={<Navigate to="/student-services/financial-services" replace />} />
        <Route path="student-services/financial-services" element={<StudentServicesPage />} />
        <Route path="student-services/id-services" element={<StudentServicesPage />} />
        <Route path="student-services/accommodation" element={<StudentServicesPage />} />
        <Route path="student-services/change-status" element={<StudentServicesPage />} />
        <Route path="student-services/clearance" element={<StudentServicesPage />} />
        <Route path="student-services/results-appeal" element={<StudentServicesPage />} />
        <Route path="student-services/academic-documents" element={<StudentServicesPage />} />

        {/* Academic */}
        <Route path="academic" element={<Navigate to="/academic/results" replace />} />
        <Route path="academic/results" element={<AcademicPage />} />

        {/* My Account */}
        <Route path="account" element={<Navigate to="/account/change-password" replace />} />
        <Route path="account/change-password" element={<AccountPage />} />
        <Route path="account/change-profile" element={<ChangeProfilePage />} />

        {/* Legacy admin modules */}
        <Route path="students" element={<StudentsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="accommodation" element={<AccommodationPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
