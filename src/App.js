import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/homepage/homepage';
import RegistrationForm from './components/User Register/register';
import RegisterSuccessful from './components/Registration Success/RegistrationSuccess';
import LoginForm from './components/Vendor Login/Login';
import Navbar from './components/Navbar/Navbar';
import VendorRegister from './components/VendorRegister/VendorRegister';
import { useState } from 'react';
import VendorDashboard from './components/Vendor Dashboard/VendorDashboard';
import ServiceDetails from './components/ServiceDetails/ServiceDetails';
import ServiceSuccess from './components/Service Success/ServiceSuccess';
import ProtectedRoute from './Auth/ProtectedRouting';
import UserLogin from './components/User Login/UserLogin';
import VendorDetails from './components/Vendor Details/VendorDetails';
import DisplayVendors from './components/Vendor Display/DisplayVendors';

function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });
  const [userRole, setUserRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole || null;
  });
  return (
    <>
      <BrowserRouter>
        <Navbar token={token} userRole={userRole} setToken={setToken} setUserRole={setUserRole} />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/home' element={<Navigate to="/" />}/>
          <Route path='/register-success' element={<RegisterSuccessful />} />
          <Route path='*' element={<Navigate to="/" />} />
          <Route path='/vendor-dashboard' element={<VendorDashboard />} />
          <Route path='/vendor-list' element={<DisplayVendors />} />


          {/* Unauthorized Routes */}
          {!token &&
            <>
              <Route path='/vendor-login' element={<LoginForm />} />
              <Route path='/user-register' element={<RegistrationForm />} />
              <Route path='/vendor-register' element={<VendorRegister />} />
              <Route path='/user-login' element={<UserLogin />} />
            </>

          }

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>

            {userRole === "VENDOR" ?
              (
                // render this routes if Role is Vendor
                <>
                <Route path='/' element={<Homepage />} />
                  <Route path='/vendor-login' element={<Navigate to="/" />} />
                  <Route path='/vendor-register' element={<Navigate to="/" />} />
                  {/* <Route path='/login-success' element={<LoginSuccessful />} /> */}
                  <Route path='/service-details' element={<ServiceDetails />} />
                  <Route path='/service-create-success' element={<ServiceSuccess />} />
                  <Route path='/vendor/:vendor_id' element={<VendorDetails />} />
                </>
              )
              : (
                //render this routes if Roles is User
                <>
                <Route path='/' element={<Homepage />} />
                  <Route path='/vendor-login' element={<Navigate to="/" />} />
                  <Route path='/vendor-register' element={<Navigate to="/" />} />
                  {/* <Route path='/login-success' element={<LoginSuccessful />} /> */}
                  <Route path='/vendor-dashboard' element={<Navigate to="/" />} />
                  <Route path='/service-details' element={<ServiceDetails />} />
                  <Route path='/service-create-success' element={<Navigate to="/" />} />
                  <Route path='/vendor/:vendor_id' element={<VendorDetails />} />
                </>
              )}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
