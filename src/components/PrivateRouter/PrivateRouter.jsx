import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from '../../constants/path';

const PrivateRoute = ({ element: Component, roles, userRole }) => {
    console.log(roles);
    console.log(userRole);
    
  const isAuthorized = roles.includes(userRole);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Bạn cần đăng nhập để thực hiện thao tác này.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        cancelButtonText: 'Hủy',
        backdrop: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(path.loginAdmin);
        }
      });
    }
  }, [isAuthorized, navigate]); // Theo dõi isAuthorized và navigate

  // Nếu không có quyền truy cập, trả về null
  if (!isAuthorized) return null;

  // Render component khi có quyền
  return <Component />;
};

export default PrivateRoute;