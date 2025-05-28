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
import AdminDashboard from './components/Admin dashboard/AdminDashboard';
import AuthorizeVendors from './components/Admin dashboard/Authorize Vendors/AuthorizeVendors';
import UserTask from './components/User Tasks/UserTask';
import Blogs from './components/Blogs/Blogs';
import UserPlans from './components/UserPlans/UserPlans';
import Profile from './components/Profile/profile';
import ReviewCarousel from './components/Reviews/Reviews';
import CreateRealWedding from './components/Real_Weddings/Create_real_wedding/CreateRealWedding';
import DisplayRealWeddings from './components/Real_Weddings/display_real_weddings/DisplayRealWeddings';
import RealWeddings from './components/Admin dashboard/Real-weddings/RealWeddings';

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
          <Route path='/home' element={<Navigate to="/" />} />
          <Route path='/register-success' element={<RegisterSuccessful />} />
          <Route path='*' element={<Navigate to="/" />} />
          <Route path='/vendor-list' element={<DisplayVendors />} />
          <Route path='/plans' element={<UserPlans />} />
          <Route path='/reviews' element={<ReviewCarousel />} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/real-weddings' element={ <DisplayRealWeddings/> }/>

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
                  <Route path='/service-details' element={<ServiceDetails />} />
                  <Route path='/service-create-success' element={<ServiceSuccess />} />
                  <Route path='/vendor/:vendor_id' element={<VendorDetails />} />
                  <Route path='/vendor-dashboard' element={<VendorDashboard />} />
                  <Route path='/tasks' element={<UserTask />} />
                  <Route path='/blogs' element={<Blogs />} />
                </>
              )
              : userRole === "USER" ? (
                //render this routes if Roles is User
                <>
                  <Route path='/' element={<Homepage />} />
                  <Route path='/vendor-login' element={<Navigate to="/" />} />
                  <Route path='/vendor-register' element={<Navigate to="/" />} />
                  <Route path='/vendor-dashboard' element={<Navigate to="/" />} />
                  <Route path='/service-details' element={<ServiceDetails />} />
                  <Route path='/service-create-success' element={<Navigate to="/" />} />
                  <Route path='/vendor/:vendor_id' element={<VendorDetails />} />
                  <Route path='/authorize-vendors' element={<AuthorizeVendors />} />
                  <Route path='/tasks' element={<UserTask />} />
                  <Route path='/blogs' element={<Blogs />} />
                </>
              )
                : userRole === "ADMIN" ? (
                  <>
                    <Route path='/admin-dashboard' element={<AdminDashboard/>} />
                    <Route path='/authorize-vendors' element={<AuthorizeVendors />} />
                    <Route path='/vendor/:vendor_id' element={<VendorDetails />} />
                    <Route path='/service-details' element={<ServiceDetails />} />
                    <Route path='/blogs' element={<Blogs />} />
                    <Route path='/create-real-wedding' element={<CreateRealWedding />} />
                    <Route path='/manage-real-weddings' element={ <RealWeddings/> }/>
                  </>
                )
                  :
                  (<Route path='/vendor-login' element={<Navigate to="/" />}/>)}

            {userRole === "ADMIN" && <></>}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
