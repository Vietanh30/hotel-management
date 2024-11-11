import React, { useCallback, useEffect, useState } from 'react';
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import iconFile from "../../../assets/Checkout/iconFile.svg"
import BackToTopButton from '../../../components/BackToTopButton/BackToTopButton';
import userApi from '../../../api/userApi';
import { getAccessTokenFromLS } from '../../../utils/auth';
import RoomPolicy from '../../../components/RoomPolicy/RoomPolicy';
import ServiceChange from '../../Admin/CheckOutAdmin/ServiceChange/ServiceChange';
import Swal from 'sweetalert2';
function Checkout() {
    const [bookingData, setBookingData] = useState({
        totalRoomPrice: 0,
        totalPolicyPrice: 0,
        totalBookingPrice: 0,
        totalRoomBooking: 0,
        bookingRoomDetails: [],
      });
      const [showDropdown, setShowDropdown] = useState(null);
      const [selectedCustomer, setSelectedCustomer] = useState(null);
      const [serviceModalIndex, setServiceModalIndex] = useState(null);
      const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
      const [selectedRoomPolicies, setSelectedRoomPolicies] = useState([]);
      const [originalRoomValues, setOriginalRoomValues] = useState(null); 
    
      const accessToken = getAccessTokenFromLS();
    
      
    
      const fetchBookingData = useCallback(async () => {
        try {
          const response = await userApi.getCheckout(accessToken);
          console.log(response)
          setBookingData(response.data.data);
        } catch (error) {
          console.error('Failed to fetch booking data:', error);
        }
      }, [accessToken]);
    
      useEffect(() => {
        fetchBookingData();
      }, [ fetchBookingData]);
    
      const handleOccupancyChange = useCallback((index, type, value) => {
        const newBookingRoomDetails = [...bookingData.bookingRoomDetails];
        const room = newBookingRoomDetails[index];
    
        // Save original values when changing occupancy for the first time
        if (!originalRoomValues) {
            setOriginalRoomValues({
                adults: room.adults,
                children: room.children,
                infant: room.infant,
            });
        }
    
        newBookingRoomDetails[index] = {
            ...room,
            [type]: value,
        };
        setBookingData((prev) => ({ ...prev, bookingRoomDetails: newBookingRoomDetails }));
    }, [bookingData, originalRoomValues]);
        
      const handleViewPolicy = (policies) => {
        setSelectedRoomPolicies(policies);
        setIsPolicyModalOpen(true);
      };
    
      const handleClosePolicyModal = () => {
        setIsPolicyModalOpen(false);
      };
    
      const updateBookingRoom = async (index, params) => {
        console.log(params);
        try {
            const response = await userApi.editCartItem(accessToken, params);
            console.log(response);
            if (response.data.statusCode === 200) {
                // Hiển thị thông báo thành công
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Cập nhật phòng đặt thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
    
                await fetchBookingData(); // Lấy dữ liệu đặt phòng đã cập nhật
                setOriginalRoomValues(null); // Reset original values after a successful update
            }
        } catch (error) {
            console.error('Cập nhật phòng đặt thất bại:', error);
            
            // Hiển thị thông báo lỗi
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.description || 'Cập nhật phòng đặt thất bại. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(() => {
                // Reset số lượng khách về giá trị gốc khi cập nhật thất bại
                if (originalRoomValues) {
                    const newBookingRoomDetails = [...bookingData.bookingRoomDetails];
                    newBookingRoomDetails[index] = {
                        ...newBookingRoomDetails[index],
                        adults: originalRoomValues.adults,
                        children: originalRoomValues.children,
                        infant: originalRoomValues.infant,
                    };
                    setBookingData((prev) => ({ ...prev, bookingRoomDetails: newBookingRoomDetails }));
                }
            });
        }
    };
    const handlePayment = async () => {
        console.log(selectedCustomer)
        if (!selectedCustomer) {
            Swal.fire({
                title: 'Chưa chọn khách hàng!',
                text: 'Vui lòng chọn một khách hàng trước khi thanh toán.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        try {
            const response = await userApi.bookingRoom(accessToken,);
            console.log(response);
            if (response.status === 200) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Thanh toán thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                // Optionally, you can reset the form or redirect the user
                await fetchBookingData(); // Refresh booking data if necessary
                window.location.href = response.data.orderurl
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: response.data.description || 'Có lỗi xảy ra trong quá trình thanh toán.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Thanh toán thất bại:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.description || 'Có lỗi xảy ra trong quá trình thanh toán.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
      const renderOccupancyModal = (room, index) => {
        if (showDropdown !== index) return null;
    
        return (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#F5E8D0] p-4 rounded shadow-xl">
              <h4 className="text-lg font-semibold mb-2">Chọn số lượng khách</h4>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex flex-col font-semibold">
                  Người lớn:
                  <input
                    type="number"
                    value={room.adults}
                    onChange={(e) => handleOccupancyChange(index, 'adults', Number(e.target.value))}
                    min="1"
                    className="mt-1 border border-gray-300 rounded p-1"
                  />
                </label>
                <label className="flex flex-col font-semibold">
                  Trẻ em:
                  <input
                    type="number"
                    value={room.children}
                    onChange={(e) => handleOccupancyChange(index, 'children', Number(e.target.value))}
                    min="0"
                    className="mt-1 border border-gray-300 rounded p-1"
                  />
                </label>
                <label className="flex flex-col font-semibold">
                  Trẻ sơ sinh:
                  <input
                    type="number"
                    value={room.infant}
                    onChange={(e) => handleOccupancyChange(index, 'infant', Number(e.target.value))}
                    min="0"
                    max="3"
                    className="mt-1 border border-gray-300 rounded p-1"
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-yellow-500 font-semibold text-white py-1 px-2 rounded hover:bg-yellow-600"
                  onClick={() => {
                    const params = {
                      adult: room.adults,
                      child: room.children,
                      infant: room.infant,
                      serviceId: room.serviceList.filter((s) => s.selected).map(s => s.id).join(','), // Assuming serviceId is a comma-separated string
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
        const newBookingRoomDetails = [...bookingData.bookingRoomDetails];
        const selectedServices = newBookingRoomDetails[roomIndex].serviceList.map((s) => ({
          ...s,
          selected: s.id === service.id ? isSelected : s.selected,
        }));
        newBookingRoomDetails[roomIndex] = {
          ...newBookingRoomDetails[roomIndex],
          serviceList: selectedServices,
        };
        setBookingData({ ...bookingData, bookingRoomDetails: newBookingRoomDetails });
      };
    
      const handleServiceConfirm = async (roomIndex) => {
        const room = bookingData.bookingRoomDetails[roomIndex];
        const params = {
          adult: room.adults,
          child: room.children,
          infant: room.infant,
          serviceId: room.serviceList.filter((s) => s.selected).map(s => s.id).join(','), // Assuming serviceId is a comma-separated string
          bookingRoomId: room.bookingRoomId,
        };
    
        await updateBookingRoom(roomIndex, params);
        setServiceModalIndex(null);
      };   
  return (
    <>
      <Header />
      <div className="bg-[#E5E5E5] w-full">
        <div className='container mx-auto'>

            <div className="">
                <div className="p-4 min-h-screen">
                <div className="mt-4 py-4 border border-[#aeaeae] bg-gray-50 shadow-lg rounded-lg overflow-x-auto">
                    <div className="w-full flex justify-between items-center p-4 pt-0">
                        <div className="font-semibold text-2xl font-inter">Thông tin đặt phòng</div>
                    </div>
                    <div className="max-w-full overflow-x-auto">
                    <table className="table-auto border-collapse w-max">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left font-semibold">Mã Phòng</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Hình ảnh</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Hạng phòng</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Thời gian</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Số người</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Phụ phí</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Giá phòng</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Tổng</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Dịch vụ</th>
                            <th className="py-2 px-4 border-b text-left font-semibold">Chính sách</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookingData.bookingRoomDetails.map((room, index) => (
                            <tr key={room.bookingRoomId} className="hover:bg-gray-50">
                            <td className="py-4 px-4 border-b">{room.roomNumber}</td>
                            <td className="py-4 px-4 border-b">
                                <img className='w-24 h-2w-24' src={room.image} alt="" />
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
                    <div className="flex justify-end mt-4 p-5">
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
        </div>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default Checkout;