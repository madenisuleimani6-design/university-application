import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegistrationPage from './pages/RegistrationPage';
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
        <Route path="registration" element={<RegistrationPage />} />
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
        <Route path="nhif" element={<DashboardPage />} />
        <Route path="nhif/membership" element={<DashboardPage />} />
        <Route path="nhif/card-application" element={<DashboardPage />} />
        <Route path="nhif/invoices" element={<DashboardPage />} />
        <Route path="nhif/verification" element={<DashboardPage />} />
        <Route path="student-services" element={<StudentsPage />} />
        <Route path="academic" element={<CoursesPage />} />
        <Route path="account" element={<DashboardPage />} />
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
