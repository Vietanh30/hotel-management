import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from '../../constants/path';

const PrivateRoute = ({ element: Component, roles, userRole }) => {
  const [showAlert, setShowAlert] = useState(false);
  const isAuthorized = roles.includes(userRole);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized && !showAlert) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Bạn cần đăng nhập để thực hiện thao tác này.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(path.loginAdmin);
        }
      });

      setShowAlert(true);
    } else if (isAuthorized) {
      setShowAlert(false); // Reset alert if authorized
    }
  }, [isAuthorized, showAlert, navigate]);

  // Nếu không có quyền truy cập, trả về null
  if (!isAuthorized) return null;

  // Render component khi có quyền
  return <Component />;
};

export default PrivateRoute;