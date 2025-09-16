import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../layouts";
import ProtectedRoute from "./ProtectedRoute";
import ProductsList from "../pages/Products";
import Dashboard from "../pages/Dashboard";
import { ClaimsManagement } from "../pages/ClaimsManagement";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="claims" element={<ClaimsManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
