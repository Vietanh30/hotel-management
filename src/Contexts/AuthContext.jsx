// AuthContext.js - Quản lý trạng thái xác thực và phân quyền
import React, { createContext, useState, useContext, useEffect } from "react";
import authApi from "../api/authApi";
import { clearLS, getAccessTokenFromLS, getRoleFromLS, setAccessTokenToLS, setProfileToLS, setRoleTokenToLS } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import path from "../constants/path";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(getRoleFromLS());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  // Note: useNavigate can't be used in a component that's outside Router
  // We'll handle navigation separately in login/logout functions

  useEffect(() => {
    // Kiểm tra đăng nhập khi khởi động
    const token = getAccessTokenFromLS();
    if (token) {
      // fetchUserInfo();
    } else {
      setLoading(false);
    }

    // Lắng nghe sự kiện storage để đồng bộ trạng thái giữa các tab
    const handleStorageChange = () => {
      setUserRole(getRoleFromLS());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // const fetchUserInfo = async () => {
  //   try {
  //     // Thực hiện gọi API lấy thông tin người dùng
  //     const userData = await authApi.getUserInfo(); // Giả sử API này tồn tại
  //     setProfileToLS(userData.data);
  //     setLoading(false);
  //     return userData.data;
  //   } catch (error) {
  //     console.error("Error fetching user info:", error);
  //     logout(); // Đăng xuất nếu không lấy được thông tin
  //     setLoading(false);
  //     return null;
  //   }
  // };

  const login = async (email, password) => {
    try {
      // Gọi API đăng nhập
      const response = await authApi.login(email, password);
      console.log(response.data.data.roles[0]);
      console.log(response);
      if (response.data.statusCode === 200) {
        // Lưu token và vai trò
        setAccessTokenToLS(response.data.data.accessToken);
        setRoleTokenToLS(response.data.data.roles[0]);
        setUserRole(response.data.data.roles[0]);
        // setProfileToLS(response.data.data);
        if (response.data.data.roles[0] === "ROLE_USER") {
          console.log("đây là user")
          // Chuyển hướng đến trang đặt phòng nếu là người dùng
          navigate(path.home);
        }
        else if (response.data.data.roles[0] === "ROLE_ADMINISTRATOR") {
          // Chuyển hướng đến trang quản lý nếu là quản trị viên
          navigate(path.dashboard);
        }
        else if (response.data.data.roles[0] === "ROLE_STAFF") {
          // Chuyển hướng đến trang quản lý nếu là nhân viên
          navigate(path.dashboard);
        }


        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          error: response.data.description || "Đăng nhập không thành công",
        };
      }
    } catch (error) {
      let errorMessage = 'Đăng nhập không thành công! Vui lòng kiểm tra lại thông tin.';

      // Check if error.response exists
      if (error.response) {
        // If response exists, check status code and set appropriate message
        if (error.response.data) {
          errorMessage = error.response.data.description || errorMessage;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Không nhận được phản hồi từ máy chủ.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Lỗi!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearLS();
    // We can't navigate here since we're outside the Router context
    // Navigation should be handled in components that use this function
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        setUserRole,
        login,
        logout,
        loading,
        // fetchUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);