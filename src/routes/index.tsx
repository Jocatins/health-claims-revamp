import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../layouts";
import { ProviderProvider } from "../context/ProviderContext";
import ProtectedRoute from "./ProtectedRoute";
import ProductsList from "../pages/Products";
import { ClaimsManagement } from "../pages/ClaimsManagement";

import Tariffs from "../pages/Tariffs";
import Settings from "../pages/Settings";
import EnrolleesManagement from "../pages/EnrolleesManagement";
import EnrolleeDetails from "../pages/EnrolleeDetails";

import Individual from "../pages/enrollee/registration/Individual";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />


        {/* <Route path="/dashboard" element={<Layout />} /> */}
        <Route path="/" element={<ProviderProvider><ProtectedRoute /></ProviderProvider>}> 
          <Route path="dashboard" element={<Layout><ProductsList /></Layout>} />
          <Route path="claims" element={<Layout><ClaimsManagement /></Layout>} />
          <Route path="enrollees" element={<Layout><EnrolleesManagement /></Layout>} />
          <Route path="enrollees/:id" element={<Layout><EnrolleeDetails /></Layout>} />
          <Route path="tariff" element={<Layout><Tariffs /></Layout>} />
          <Route path="settings" element={<Layout><Settings /></Layout>} />
          
          <Route path="enrollee/">
          
          </Route>

         
           <Route
            path="enrollee/registration"
            element={
              <Layout>
                <Individual/>
              </Layout>
            }
          />
        

        </Route>
         
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
