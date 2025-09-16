import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../layouts";
import ProtectedRoute from "./ProtectedRoute";
import ProductsList from "../pages/Products";
import Dashboard from "../pages/Dashboard";
import { ClaimsManagement } from "../pages/ClaimsManagement";
import Individual from "../pages/enrollee/registration/Individual";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={<ProtectedRoute />}
        >
          <Route
            path="dashboard"
            element={
              <Layout>
                <ProductsList />
              </Layout>
            }
          />
           <Route
            path="enrollee/registration"
            element={
              <Layout>
                <Individual/>
              </Layout>
            }
          />
          <Route
            path="claims"
            element={
              <Layout>
                <ClaimsManagement />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
