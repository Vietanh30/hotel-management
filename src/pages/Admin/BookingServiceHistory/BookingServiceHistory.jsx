import React, { useEffect, useState } from 'react';
import { getAccessTokenFromLS } from '../../../utils/auth';
import adminApi from '../../../api/adminApi';

function BookingServiceHistory() {
    const [serviceHistory, setServiceHistory] = useState([]);
    const accessToken = getAccessTokenFromLS();

    useEffect(() => {
        const fetchServiceHistory = async () => {
            try {
                const response = await adminApi.getBookingServiceHistory(accessToken);
                if (response.data.statusCode === 200) {
                    setServiceHistory(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching service history:", error);
            }
        };

        fetchServiceHistory();
    }, [accessToken]);

    return (
        <div className="">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">ID Dịch vụ</th>
                            <th className="py-2 px-4 border-b">Tên người đặt</th>
                            <th className="py-2 px-4 border-b">Số điện thoại</th>
                            <th className="py-2 px-4 border-b">Tên dịch vụ</th>
                            <th className="py-2 px-4 border-b">Giá</th>
                            <th className="py-2 px-4 border-b">Trạng thái thanh toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceHistory.map((service, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-center">{service.serviceId}</td>
                                <td className="py-2 px-4 border-b text-center">{service.userName}</td>
                                <td className="py-2 px-4 border-b text-center">{service.phone}</td>
                                <td className="py-2 px-4 border-b text-center">{service.serviceName}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(service.price)}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <span className={`px-2 py-1 rounded-full text-sm ${service.statusPayment === 'SUCCESS'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {service.statusPayment}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookingServiceHistory; 