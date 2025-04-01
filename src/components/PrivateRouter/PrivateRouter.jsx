// Modify your PrivateRoute component to use the AuthContext directly
import React from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from '../../constants/path';

const PrivateRoute = ({ element: Component, roles }) => {
  const navigate = useNavigate();
  const { userRole } = useAuth(); // Get userRole from context
  const isAuthorized = roles.includes(userRole);

  React.useEffect(() => {
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
          navigate(path.login);
        }
      });
    }
  }, [isAuthorized, navigate, roles]);

  if (!isAuthorized) return null;
  return <Component />;
};

export default PrivateRoute;