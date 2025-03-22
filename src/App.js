import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/homepage/homepage';
import RegistrationForm from './components/User Register/register';
import RegisterSuccessful from './components/Registration Success/RegistrationSuccess';
import LoginForm from './components/Login/Login';
import LoginSuccessful from './components/Login/LoginSuccess';
import Navbar from './components/Navbar/Navbar';
import VendorRegister from './components/VendorRegister/VendorRegister';
import Alert from './components/Alerts/Alert';
import { useState } from 'react';
import VendorDashboard from './components/Vendor Dashboard/VendorDashboard';
import ServiceDetails from './components/ServiceDetails/ServiceDetails';
import ServiceForm from './components/Create Service/ServiceForm';
import ServiceSuccess from './components/Service Success/ServiceSuccess';
import ProtectedRoute from './Auth/ProtectedRouting';

function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });
  const [userRole, setUserRole] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    return storedUser?.role || null;
  });
  const [alert, setAlert] = useState({ type: "", message: "", isOpen: false, onClose: null })

  const showAlert = (type, message, onClose = null) => {
    setAlert({ type, message, isOpen: true, });

    setTimeout(() => {
      setAlert({ type: "", message: "", isOpen: false, onClose });
    }, 5000);
  };

  const closeAlert = () => {
    if (alert.onClose) alert.onClose(); // Call the provided onClose function
    setAlert({ type: "", message: "", isOpen: false, onClose: null });
  };
  return (
    <>
      <BrowserRouter>
        <Navbar token={token} userRole={userRole} setToken={setToken} setUserRole={setUserRole} />
        <Alert type={alert.type} message={alert.message} isOpen={alert.isOpen} onClose={closeAlert} />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/register-success' element={<RegisterSuccessful />} />
          <Route path='*' element={<Navigate to="/" />} />

          {/* Unauthorized Routes */}
          {!token &&
            <>
              <Route path='/vendor-login' element={<LoginForm showAlert={showAlert} />} />
              <Route path='/user-register' element={<RegistrationForm />} />
              <Route path='/vendor-register' element={<VendorRegister />} />
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
                  <Route path='/login-success' element={<LoginSuccessful />} />
                  <Route path='/vendor-dashboard' element={<VendorDashboard />} />
                  <Route path='/service-details' element={<ServiceDetails />} />
                  <Route path='/service-create-success' element={<ServiceSuccess />} />
                </>
              )
              : (
                //render this routes if Roles is User
                <>
                <Route path='/' element={<Homepage />} />
                  <Route path='/vendor-login' element={<Navigate to="/" />} />
                  <Route path='/vendor-register' element={<Navigate to="/" />} />
                  <Route path='/login-success' element={<LoginSuccessful />} />
                  <Route path='/vendor-dashboard' element={<Navigate to="/" />} />
                  <Route path='/service-details' element={<ServiceDetails />} />
                  <Route path='/service-create-success' element={<Navigate to="/" />} />
                </>
              )}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
