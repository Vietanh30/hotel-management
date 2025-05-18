import React, { useEffect, useState } from 'react';
import userApi from '../../api/userApi';
import { getAccessTokenFromLS, getPaymentIdToLS, getRoleFromLS } from '../../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import path from '../../constants/path';
import Swal from 'sweetalert2';

function StatusPayment() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const paymentId = getPaymentIdToLS();
  const role = getRoleFromLS();

  const getQueryParams = (query) => {
    const params = new URLSearchParams(query);
    return {
      transId: params.get('apptransid'),
    };
  };

  const handleGetPaymentStatus = async () => {
    try {
      const accessToken = getAccessTokenFromLS();
      const { transId } = getQueryParams(location.search);

      const response = await userApi.statusBookingRoom(accessToken, {
        paymentId,
        transId,
      });

      setPaymentStatus(response.data);

      // Hiển thị thông báo trạng thái
      Swal.fire({
        title: response.data.statusCode === 200 ? 'Thành công!' : 'Thông báo',
        text: response.data.description,
        icon: response.data.statusCode === 200 ? 'success' : 'info',
        confirmButtonText: 'OK'
      }).then(() => {
        // Chuyển hướng về trang chủ sau khi đóng thông báo
        const destination = role === 'ROLE_USER' ? path.home : path.dashboard;
        navigate(destination);
      });

    } catch (error) {
      console.error('Error fetching payment status:', error);
      Swal.fire({
        title: 'Lỗi',
        text: error.response?.data?.description || 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        const destination = role === 'ROLE_USER' ? path.home : path.dashboard;
        navigate(destination);
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const handleGetPaymentStatus = async () => {
      try {
        const accessToken = getAccessTokenFromLS();
        const { transId } = getQueryParams(location.search);

        const response = await userApi.statusBookingRoom(accessToken, {
          paymentId,
          transId,
        });

        setPaymentStatus(response.data);

        // Hiển thị thông báo trạng thái
        if (isMounted) {
          Swal.fire({
            title: response.data.statusCode === 200 ? 'Thành công!' : 'Thông báo',
            text: response.data.description,
            icon: response.data.statusCode === 200 ? 'success' : 'info',
            confirmButtonText: 'OK'
          }).then(() => {
            // Chuyển hướng về trang chủ sau khi đóng thông báo
            const destination = role === 'ROLE_USER' ? path.home : path.dashboard;
            navigate(destination);
          });
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
        if (isMounted) {
          Swal.fire({
            title: 'Lỗi',
            text: error.response?.data?.description || 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            const destination = role === 'ROLE_USER' ? path.home : path.dashboard;
            navigate(destination);
          });
        }
      }
    };
    handleGetPaymentStatus();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Đang kiểm tra trạng thái thanh toán...</p>
      </div>
    </div>
  );
}

export default StatusPayment;