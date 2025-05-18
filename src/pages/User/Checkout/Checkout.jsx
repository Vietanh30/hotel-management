import React, { useCallback, useEffect, useState } from 'react';
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import userApi from '../../../api/userApi';
import { getAccessTokenFromLS, setPaymentIdToLS } from '../../../utils/auth';
import RoomPolicy from '../../../components/RoomPolicy/RoomPolicy';
import ServiceChange from '../../Admin/CheckOutAdmin/ServiceChange/ServiceChange';
import Swal from 'sweetalert2';
import Navbar from '../../../components/Navbar/Navbar';
import BackToTopButton from '../../../components/BackToTopButton/BackToTopButton';
import { useNavigate } from 'react-router-dom';
import path from '../../../constants/path';
function Checkout() {
    const [bookingData, setBookingData] = useState(() => {
        const savedData = localStorage.getItem('checkout_booking_data');
        return savedData ? JSON.parse(savedData) : {
            totalRoomPrice: 0,
            totalPolicyPrice: 0,
            totalBookingPrice: 0,
            totalRoomBooking: 0,
            bookingRoomDetails: [],
        };
    });
    const [showDropdown, setShowDropdown] = useState(null);
    const [serviceModalIndex, setServiceModalIndex] = useState(null);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [selectedRoomPolicies, setSelectedRoomPolicies] = useState([]);
    const [originalRoomValues, setOriginalRoomValues] = useState(null);

    const accessToken = getAccessTokenFromLS();
    const navigate = useNavigate();

    const fetchBookingData = useCallback(async () => {
        try {
            const response = await userApi.getCheckout(accessToken);
            console.log("response", response)
            setBookingData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch booking data:', error);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchBookingData();
        window.scrollTo(0, 0);
    }, [fetchBookingData]);

    // Lưu bookingData vào localStorage mỗi khi nó thay đổi
    useEffect(() => {
        localStorage.setItem('checkout_booking_data', JSON.stringify(bookingData));
    }, [bookingData]);

    const handleOccupancyChange = useCallback((index, type, value) => {
        const newBookingRoomDetails = [...bookingData.bookingRoomDetails];
        const room = newBookingRoomDetails[index];

        // Save original values when changing occupancy for the first time
        if (!originalRoomValues) {
            setOriginalRoomValues({ adults: room.adults, children: room.children, infant: room.infant });
        }

        newBookingRoomDetails[index] = { ...room, [type]: value };
        setBookingData((prev) => ({ ...prev, bookingRoomDetails: newBookingRoomDetails }));
    }, [bookingData, originalRoomValues]);

    const handleViewPolicy = (policies) => {
        setSelectedRoomPolicies(policies);
        setIsPolicyModalOpen(true);
    };

    const handleClosePolicyModal = () => setIsPolicyModalOpen(false);

    const updateBookingRoom = async (index, params) => {
        try {
            const response = await userApi.editCartItem(accessToken, params);
            if (response.data.statusCode === 200) {
                Swal.fire({ title: 'Thành công!', text: 'Cập nhật phòng đặt thành công.', icon: 'success' });
                await fetchBookingData();
                setOriginalRoomValues(null);
            }
        } catch (error) {
            console.error('Cập nhật phòng đặt thất bại:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.description || 'Cập nhật phòng đặt thất bại.',
                icon: 'error'
            }).then(() => {
                if (originalRoomValues) {
                    const newBookingRoomDetails = [...bookingData.bookingRoomDetails];
                    newBookingRoomDetails[index] = { ...newBookingRoomDetails[index], ...originalRoomValues };
                    setBookingData((prev) => ({ ...prev, bookingRoomDetails: newBookingRoomDetails }));
                }
            });
        }
    };

    const handlePayment = async () => {
        try {
            const response = await userApi.bookingRoom(accessToken);
            console.log("response", response)
            if (response.status === 200) {
                const paymentId = response.data.paymentId;
                const orderurl = response.data.orderurl;
                setPaymentIdToLS(paymentId);
                // Lưu thông tin vào localStorage
                localStorage.setItem('paymentId', paymentId);
                // Chuyển hướng đến trang thanh toán và ngăn quay lại
                window.location.replace(orderurl);
            }
        } catch (error) {
            console.error('Thanh toán thất bại:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.description || 'Có lỗi xảy ra trong quá trình thanh toán.',
                icon: 'error'
            });
        }
    };

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            // Chỉ xóa data khi thanh toán thành công hoặc người dùng rời khỏi trang checkout
            if (!localStorage.getItem('booking_paymentId')) {
                localStorage.removeItem('checkout_booking_data');
            }
        };
    }, []);

    const renderOccupancyModal = (room, index) => {
        if (showDropdown !== index) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-[#F5E8D0] p-4 rounded shadow-xl">
                    <h4 className="text-lg font-semibold mb-2">Chọn số lượng khách</h4>
                    <div className="grid grid-cols-3 gap-4">
                        {['adults', 'children', 'infant'].map((type, idx) => (
                            <label key={type} className="flex flex-col font-semibold">
                                {type === 'adults' ? 'Người lớn' : type === 'children' ? 'Trẻ em' : 'Trẻ sơ sinh'}:
                                <input
                                    type="number"
                                    value={room[type]}
                                    onChange={(e) => handleOccupancyChange(index, type, Number(e.target.value))}
                                    min={type === 'adults' ? 1 : 0}
                                    max={type === 'infant' ? 3 : undefined}
                                    className="mt-1 border border-gray-300 rounded p-1"
                                />
                            </label>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-yellow-500 font-semibold text-white py-1 px-2 rounded hover:bg-yellow-600"
                            onClick={() => {
                                const params = {
                                    adult: room.adults,
                                    child: room.children,
                                    infant: room.infant,
                                    serviceId: room.serviceList.filter((s) => s.selected).map(s => s.id).join(','),
                                    bookingRoomId: room.bookingRoomId,
                                };
                                updateBookingRoom(index, params);
                                setShowDropdown(null);
                            }}
                        >
                            Xác nhận
                        </button>
                        <button
                            className="ml-2 text-white bg-gray-500 font-semibold py-1 px-2 rounded hover:bg-gray-600"
                            onClick={() => setShowDropdown(null)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleServiceSelect = (service, isSelected, roomIndex) => {
        const newBookingRoomDetails = bookingData.bookingRoomDetails.map((room, idx) => {
            if (idx === roomIndex) {
                return {
                    ...room,
                    serviceList: room.serviceList.map((s) => ({
                        ...s,
                        selected: s.id === service.id ? isSelected : s.selected,
                    })),
                };
            }
            return room;
        });
        setBookingData({ ...bookingData, bookingRoomDetails: newBookingRoomDetails });
    };

    const handleServiceConfirm = async (roomIndex) => {
        const room = bookingData.bookingRoomDetails[roomIndex];
        const params = {
            adult: room.adults,
            child: room.children,
            infant: room.infant,
            serviceId: room.serviceList.filter((s) => s.selected).map(s => s.id).join(','),
            bookingRoomId: room.bookingRoomId,
        };

        await updateBookingRoom(roomIndex, params);
        setServiceModalIndex(null);
    };

    // Tính toán số tiền cần cọc
    const calculateDepositAmount = useCallback(() => {
        if (!bookingData.bookingRoomDetails || bookingData.bookingRoomDetails.length === 0) return 0;

        const totalDeposit = bookingData.bookingRoomDetails.reduce((total, room) => {
            const paymentPolicy = room.policyList.find(policy => policy.type === 'Thanh toán');
            if (paymentPolicy) {
                const depositPercentage = parseInt(paymentPolicy.content);
                return total + (room.totalPrice * depositPercentage / 100);
            }
            return total;
        }, 0);

        return totalDeposit;
    }, [bookingData]);

    return (
        <>
            <Header />
            <Navbar />
            <div className="bg-[#E5E5E5] w-full">
                <div className='container mx-auto'>
                    <div className="p-4 min-h-screen">
                        <div className="mt-4 py-4 border border-[#aeaeae] bg-gray-50 shadow-lg rounded-lg overflow-x-auto">
                            <div className="w-full flex justify-between items-center p-4 pt-0">
                                <div className="font-semibold text-2xl font-inter">Thông tin đặt phòng</div>
                            </div>
                            <div className="max-w-full overflow-x-auto">
                                <table className="table-auto border-collapse w-max">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {['Mã Phòng', 'Hình ảnh', 'Hạng phòng', 'Thời gian', 'Số người', 'Phụ phí', 'Giá phòng', 'Tổng', 'Dịch vụ', 'Chính sách'].map(th => (
                                                <th key={th} className="py-2 px-4 border-b text-left font-semibold">{th}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookingData.bookingRoomDetails.map((room, index) => (
                                            <tr key={room.bookingRoomId} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 border-b">{room.roomNumber}</td>
                                                <td className="py-4 px-4 border-b">
                                                    <img className='w-24 h-24' src={room.image} alt="" />
                                                </td>
                                                <td className="py-4 px-4 border-b">{room.roomType}</td>
                                                <td className="py-4 px-4 border-b">
                                                    {new Date(room.checkIn).toLocaleString()} <br /> {new Date(room.checkOut).toLocaleString()}
                                                </td>
                                                <td className="py-4 px-4 border-b">
                                                    <button
                                                        className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                                                        onClick={() => setShowDropdown(index)}
                                                    >
                                                        {`${room.adults} Adults, ${room.children} Children, ${room.infant} Infants`}
                                                    </button>
                                                    {renderOccupancyModal(room, index)}
                                                </td>
                                                <td className="py-4 px-4 border-b">
                                                    {room.adultSurcharge.toLocaleString('vi-VN')} đ + {room.childSurcharge.toLocaleString('vi-VN')} đ
                                                </td>
                                                <td className="py-4 px-4 border-b">{room.roomPrice.toLocaleString('vi-VN')} đ</td>
                                                <td className="py-4 px-4 border-b">{room.totalPrice.toLocaleString('vi-VN')} đ</td>
                                                <td className="py-4 px-4 border-b">
                                                    <button
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                                                        onClick={() => setServiceModalIndex(index)}
                                                    >
                                                        Chọn dịch vụ
                                                    </button>
                                                    {serviceModalIndex === index && (
                                                        <ServiceChange
                                                            services={room.serviceList}
                                                            selectedServices={room.serviceList.filter((s) => s.selected)}
                                                            onServiceSelect={(service, isSelected) => handleServiceSelect(service, isSelected, index)}
                                                            onConfirm={() => handleServiceConfirm(index)}
                                                            onClose={() => setServiceModalIndex(null)}
                                                        />
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 border-b">
                                                    <button
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                                                        onClick={() => handleViewPolicy(room.policyList)}
                                                    >
                                                        Xem chính sách
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-between mt-4 p-5">
                                    <div className="text-lg font-semibold">
                                        Số tiền cần cọc: {calculateDepositAmount().toLocaleString('vi-VN')} đ
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                                    >
                                        Thanh toán ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <RoomPolicy
                    onClose={handleClosePolicyModal}
                    policyList={selectedRoomPolicies}
                    isOpen={isPolicyModalOpen}
                />
            </div>
            <Footer />
            <BackToTopButton />
        </>
    );
}

export default Checkout;