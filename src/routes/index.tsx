import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../layouts";
import { ProviderProvider } from "../context/ProviderContext";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";

import { ClaimsManagement } from "../pages/ClaimsManagement";

import Tariffs from "../pages/Tariffs";
import Settings from "../pages/Settings";
import EnrolleesManagement from "../pages/EnrolleesManagement";
import EnrolleeDetails from "../pages/EnrolleeDetails";

import Individual from "../pages/enrollee/registration/Individual";

import EnrolleesPage from "../pages/enrollee/EnrolleesPage";
import Corporate from "../pages/enrollee/registration/Corporate";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProviderProvider><ProtectedRoute /></ProviderProvider>}> 
        <Route path="dashboard" element={<Layout><Dashboard /></Layout>} />
         
          <Route path="claims" element={<Layout><ClaimsManagement /></Layout>} />
          <Route path="enrollee-management" element={<Layout><EnrolleesManagement /></Layout>} />
          <Route path="enrollees/:id" element={<Layout><EnrolleeDetails /></Layout>} />
          <Route path="tariff" element={<Layout><Tariffs /></Layout>} />
          <Route path="settings" element={<Layout><Settings /></Layout>} />
          
          <Route path="enrollee/">
       
           <Route path="dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="enrollees" element={<Layout><EnrolleesPage /></Layout>} />
          
          <Route path="registration/individual" element={<Layout><Individual /></Layout>} />
          <Route path="registration/corporate" element={<Layout><Corporate /></Layout>} />
          </Route>
        </Route>
         
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
