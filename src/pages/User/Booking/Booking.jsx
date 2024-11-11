import React, { useEffect, useState } from "react";
import BackToTopButton from "../../../components/BackToTopButton/BackToTopButton";
import CardRoomBooking from "../../../components/CardRoomBooking/CardRoomBooking";
import FilterRoom from "../../../components/FilterRoom/FilterRoom";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import userApi from "../../../api/userApi";
import Navbar from "../../../components/Navbar/Navbar";
import { getAccessTokenFromLS } from "../../../utils/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import path from "../../../constants/path";

function Booking() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);
    const [typeRoom, setTypeRoom] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartDetails, setCartDetails] = useState(null);
    const [dataCheckout, setDataCheckout] = useState(null);
    const [areAllCollapsed, setAreAllCollapsed] = useState(false);
    const accessToken = getAccessTokenFromLS();

    const searchRoom = async (startDate, endDate, numberRoom) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userApi.searchRoom(startDate, endDate, numberRoom);
            setTypeRoom(response.data.data.content);
        } catch (err) {
            setError("Có lỗi xảy ra trong quá trình tìm kiếm phòng.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCartDetails = async () => {
        try {
            const response = await userApi.getCart(accessToken);
            if (response.data.statusCode === 200) {
                setCartDetails(response.data.data);
            } else {
                console.error("Failed to fetch cart details:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching cart details:", error);
        }
    };

    const removeCartItem = async (idCartItem) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            text: "Bạn sẽ không thể khôi phục lại điều này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa nó!'
        });

        if (result.isConfirmed) {
            try {
                const response = await userApi.removeCartItem(accessToken, idCartItem);
                if (response.data.statusCode === 200) {
                    Swal.fire(
                        'Đã xóa!',
                        response.data.message || 'Phòng đã được xóa khỏi giỏ hàng.',
                        'success'
                    );
                    await fetchCartDetails(); // Refresh cart details after removal
                    await fetchCheckout();
                }
            } catch (error) {
                console.error("Error removing cart item:", error);
            }
        }
    };

    const toggleCollapseAll = () => {
        setAreAllCollapsed(prev => !prev);
    };

    const fetchCheckout = async () => {
        try {
            const response = await userApi.getCheckout(accessToken);
            if (response.data.statusCode === 200) {
                setDataCheckout(response.data.data);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };
    useEffect(() => {
        const startDate = params.get("startDate");
        const endDate = params.get("endDate");
        const numberRoom = params.get("roomNumber");

        if (startDate && endDate && numberRoom) {
            searchRoom(startDate, endDate, numberRoom);
        }

        fetchCartDetails();
        fetchCheckout();
        window.scrollTo(0, 0);
    }, [search]);

    // Prepare the data for CardRoomBooking
    const getFilteredBookingDetails = (roomId) => {
        if (!dataCheckout || !dataCheckout.bookingRoomDetails) return [];
        return dataCheckout.bookingRoomDetails.filter(detail => detail.roomTypeId === roomId);
    };

    return (
        <>
            <Header />
            <Navbar />
            <div className="w-full bg-[#E5E5E5] py-8 relative">
                <div className="container sticky z-20 mx-auto bg-white rounded px-4 py-6 top-0 shadow-lg left-[6.5%]">
                    <FilterRoom />
                </div>
                <div className="container mx-auto bg-white rounded p-4 mt-8">
                    <div className="font-inter py-3">
                        <span className="font-semibold">Vui lòng chọn phòng</span> (Có {typeRoom.length} hạng phòng theo tìm kiếm)
                    </div>
                </div>
                <div className="container mx-auto mt-8 relative">
                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="grid grid-cols-10 gap-5">
                        <div className="col-span-7">
                            {typeRoom.map((room) => (
                                <div className="w-full bg-white rounded p-4 mb-8" key={room.id}>
                                    <CardRoomBooking 
                                        typeRoom={room} 
                                        fetchCart={fetchCartDetails} 
                                        fetchCheckout={fetchCheckout} 
                                        dataCheckout={getFilteredBookingDetails(room.id)} 
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="col-span-3 p-5 rounded bg-white h-fit">
                            <div className='font-inter font-medium text-xl'>
                                Yêu cầu đặt phòng của bạn
                            </div>
                            <hr className="my-4" />
                            <div>
                                <div className='font-inter font-semibold text-lg'>Khách sạn nhóm 7</div>
                                <div className='border-b border-dashed my-4 border-2'></div>
                                <div className="flex justify-between">
                                    {cartDetails && (
                                        <>
                                            <div className='font-inter font-semibold'>Thông tin phòng</div>
                                            <button onClick={toggleCollapseAll} className="flex items-center justify-end">
                                                <FontAwesomeIcon icon={areAllCollapsed ? faPlusCircle : faMinusCircle} className="mr-2" />
                                                {areAllCollapsed ? 'Mở rộng' : 'Thu gọn'}
                                            </button>
                                        </>
                                    )}
                                </div>
                                {!areAllCollapsed && cartDetails && (
                                    <>
                                        {cartDetails.roomCart.map((room, index) => (
                                            <div key={room.bookingRoomId} className='mt-3 font-inter text-sm font-light border-dashed py-3 border-b-2'>
                                                <div className="flex justify-between gap-20 items-start">
                                                    <span className='font-semibold'>Phòng {index + 1}: {room.roomName} - {room.roomNumber}</span>
                                                    <button onClick={() => removeCartItem(room.bookingRoomId)}>
                                                        <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700" />
                                                    </button>
                                                </div>
                                                <div className='mt-2'>
                                                    <div><span className="font-semibold">Nhận phòng:</span> {new Date(room.checkin).toLocaleString()}</div>
                                                    <div><span className="font-semibold">Trả phòng:</span> {new Date(room.checkout).toLocaleString()}</div>
                                                    <div><span className="font-semibold">Giá phòng:</span> {room.price.toLocaleString()} VNĐ</div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <div className='flex justify-between items-center mt-4'>
                                <div className='font-inter font-semibold'>Tổng cộng</div>
                                <div className='font-inter font-semibold text-yellow-500 text-xl'>{cartDetails ? `${cartDetails.totalPrice.toLocaleString()} VNĐ` : '0 VNĐ'}</div>
                            </div>
                            <div className='font-inter text-sm font-light mt-6'>Bao gồm tất cả các loại thuế và phí dịch vụ</div>
                            <div className='font-inter text-sm mt-1 text-red-500'>(Theo quy định của Ngân hàng Nhà nước Việt Nam, Quý khách vui lòng thanh toán bằng VNĐ)</div>
                            <div className='my-6 border-2 border-dashed'></div>
                            <div className="mt-4">
                                <button
                                    className={`w-full text-nowrap font-bold py-3 px-4 rounded ${
                                        cartDetails && cartDetails.roomCart.length > 0
                                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    }`}
                                    disabled={!cartDetails || cartDetails.roomCart.length === 0}
                                    onClick={() => {
                                        if (cartDetails && cartDetails.roomCart.length > 0) {
                                            navigate(path.checkout);
                                        }
                                    }}
                                >
                                    Đặt ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <BackToTopButton />
        </>
    );
}

export default Booking;