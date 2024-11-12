import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react"; // Thêm useState và useEffect
import "./index.css";
import path from "./constants/path";
import Home from "./pages/User/Home/Home";
import Login from "./pages/User/Login/Login";
import Register from "./pages/User/Register/Register";
import Booking from "./pages/User/Booking/Booking";
import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import Checkout from "./pages/User/Checkout/Checkout";
import LoginAdmin from "./pages/Admin/LoginAdmin/LoginAdmin";
import Dashboard from "./pages/Admin/Dashboard/Dashboad";
import ManageTypeRoom from "./pages/Admin/ManageTypeRoom/ManageTypeRoom";
import ManageService from "./pages/Admin/ManageService/ManageService";
import ManageRoom from "./pages/Admin/ManageRoom/ManageRoom";
import ManageStaff from "./pages/Admin/ManageStaff/ManageStaff";
import ManageCustomer from "./pages/Admin/ManageCustomer/ManageCustomer";
import PrivateRoute from "./components/PrivateRouter/PrivateRouter";
import { getRoleFromLS } from "./utils/auth";
import ManageNumberRoom from "./pages/Admin/ManageNumberRoom/ManageNumberRoom";
import ManageBooking from "./pages/Admin/ManageBooking/ManageBooking";
import CheckOutAdmin from "./pages/Admin/CheckOutAdmin/CheckOutAdmin";
import BookingHistoryAdmin from "./pages/Admin/BookingHistoryAdmin/BookingHistoryAdmin";
import BookingHistory from "./pages/User/BookingHistory/BookingHistory";
import StatusPayment from "./components/StatusPayment/StatusPayment";

function App() {
  const [userRole, setUserRole] = useState(getRoleFromLS()); // Lấy userRole từ localStorage

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = getRoleFromLS(); // Lấy giá trị mới từ localStorage
      setUserRole(updatedRole); // Cập nhật state với giá trị mới
    };

    // Lắng nghe sự kiện storage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={path.home} element={<Home />} />
        <Route path={path.login} element={<Login setUserRole={setUserRole} />} />
        <Route path={path.register} element={<Register />} />
        <Route path={path.forgotPassword} element={<ForgotPassword />} />
        <Route
          path={path.booking}
          element={
            <PrivateRoute element={Booking} roles={["ROLE_USER"]} userRole={userRole} />
          }
        />
        <Route
          path={path.checkout}
          element={
            <PrivateRoute element={Checkout} roles={["ROLE_USER"]} userRole={userRole} />
          }
          
        />
        <Route
          path={path.statusPayment}
          element={
            <PrivateRoute element={StatusPayment} roles={["ROLE_USER", "ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
          
        />
        <Route
          path={path.bookingHistory}
          element={
            <PrivateRoute element={BookingHistory} roles={["ROLE_USER"]} userRole={userRole} />
          }
          
        />

        {/* Admin Routes */}
        <Route path={path.loginAdmin} element={<LoginAdmin  setUserRole={setUserRole} />} />

        {/* Private Routes for Admin */}
        <Route
          path={path.dashboard}
          element={
            <PrivateRoute element={Dashboard} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.manageTypeRoom}
          element={
            <PrivateRoute element={ManageTypeRoom} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.manageService}
          element={
            <PrivateRoute element={ManageService} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.manageRoom}
          element={
            <PrivateRoute element={ManageRoom} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.manageNumberRoom}
          element={
            <PrivateRoute element={ManageNumberRoom} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.manageStaff}
          element={
            <PrivateRoute element={ManageStaff} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.manageCustomer}
          element={
            <PrivateRoute element={ManageCustomer} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.manageBooking}
          element={
            <PrivateRoute element={ManageBooking} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.checkOutAdmin}
          element={
            <PrivateRoute element={CheckOutAdmin} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
        <Route
          path={path.bookingHistoryAdmin}
          element={
            <PrivateRoute element={BookingHistoryAdmin} roles={["ROLE_ADMINISTRATOR"]} userRole={userRole} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;