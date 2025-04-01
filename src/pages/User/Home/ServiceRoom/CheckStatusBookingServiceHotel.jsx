import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import userApi from '../../../../api/userApi';

const CheckStatusBookingServiceHotel = () => {
    const location = useLocation();
    const { bookingHotelId, transId } = location.state || {};
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            const accessToken = getAccessTokenFromLS();
            try {
                const response = await userApi.statusBookingServiceHotel(accessToken, bookingHotelId, transId);
                if (response.data.statusCode === 200) {
                    setStatusMessage('Thanh toán thành công!');
                } else {
                    setStatusMessage(response.data.data.status || 'Có lỗi xảy ra khi kiểm tra trạng thái.');
                }
            } catch (error) {
                setStatusMessage('Có lỗi xảy ra khi kiểm tra trạng thái.');
                console.error("Error fetching payment status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();

        const timer = setTimeout(() => {
            window.location.href = '/'; // Redirect to homepage after a delay
        }, 3000); // Redirects after 3 seconds

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [bookingHotelId, transId]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
                {isLoading ? (
                    <p>Đang kiểm tra trạng thái thanh toán...</p>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4">{statusMessage}</h2>
                        <p className="text-gray-500">Bạn sẽ được chuyển hướng về trang chủ trong giây lát...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckStatusBookingServiceHotel;