import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import HomePage from './components/public/HomePage';
import CandidateFormPage from './components/public/CandidateFormPage';
import CompanyFormPage from './components/public/CompanyFormPage';
import AboutPage from './components/public/AboutPage';
import ContactPage from './components/public/ContactPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import CandidatesList from './components/admin/candidates/CandidatesList';
import CandidateDetails from './components/admin/candidates/CandidateDetails';
import CandidateForm from './components/admin/candidates/CandidateForm';
import CompaniesList from './components/admin/companies/CompaniesList';
import CompanyDetails from './components/admin/companies/CompanyDetails';
import CompanyForm from './components/admin/companies/CompanyForm';
import EmployeesList from './components/admin/employees/EmployeesList';
import EmployeeForm from './components/admin/employees/EmployeeForm';
import SettingsPage from './components/admin/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="candidate" element={<CandidateFormPage />} />
          <Route path="company" element={<CompanyFormPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Candidates */}
          <Route path="candidates" element={<CandidatesList />} />
          <Route path="candidates/new" element={<CandidateForm />} />
          <Route path="candidates/:id" element={<CandidateDetails />} />
          <Route path="candidates/:id/edit" element={<CandidateForm />} />

          {/* Companies */}
          <Route path="companies" element={<CompaniesList />} />
          <Route path="companies/new" element={<CompanyForm />} />
          <Route path="companies/:id" element={<CompanyDetails />} />
          <Route path="companies/:id/edit" element={<CompanyForm />} />

          {/* Employees */}
          <Route path="employees" element={<EmployeesList />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="employees/:id/edit" element={<EmployeeForm />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}