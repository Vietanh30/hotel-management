import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import userApi from '../../../../api/userApi';
import Swal from 'sweetalert2';
import path from '../../../../constants/path';

const CheckStatusBookingServiceHotel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const paymentId = localStorage.getItem('paymentId');
    const transId = new URLSearchParams(location.search).get('apptransid');

    useEffect(() => {
        let intervalId;
        let timeoutId;

        const checkPaymentStatus = async () => {
            const accessToken = getAccessTokenFromLS();
            try {
                console.log("paymentId", paymentId);
                const response = await userApi.statusBookingServiceHotel(accessToken, paymentId, transId);

                if (response.data.statusCode === 200) {
                    // Thanh toán thành công
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Thanh toán dịch vụ thành công.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Xóa paymentId khỏi localStorage
                        localStorage.removeItem('paymentId');
                        // Chuyển về trang chủ
                        navigate(path.home);
                    });
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                }
            } catch (error) {
                console.error("Error checking payment status:", error);
            }
        };

        if (paymentId && transId) {
            // Kiểm tra ngay lập tức
            checkPaymentStatus();
            // Sau đó kiểm tra mỗi 5 giây
            intervalId = setInterval(checkPaymentStatus, 5000);
            // Dừng kiểm tra sau 5 phút
            timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                Swal.fire({
                    title: 'Thông báo',
                    text: 'Hết thời gian chờ thanh toán. Vui lòng kiểm tra lại trạng thái đơn hàng của bạn.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                }).then(() => {
                    localStorage.removeItem('paymentId');
                    navigate(path.home);
                });
            }, 300000); // 5 phút
        } else {
            setIsLoading(false);
            Swal.fire({
                title: 'Lỗi',
                text: 'Không tìm thấy thông tin thanh toán.',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate(path.home);
            });
        }

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [paymentId, transId, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                        <p className="mt-4 text-lg text-gray-600">Đang kiểm tra trạng thái thanh toán...</p>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default CheckStatusBookingServiceHotel;