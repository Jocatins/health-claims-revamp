import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../layouts";
import ProtectedRoute from "./ProtectedRoute";
import ProductsList from "../pages/Products";
import { ClaimsManagement } from "../pages/ClaimsManagement";
import Individual from "../pages/enrollee/registration/Individual";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

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
