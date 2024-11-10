import { faTimesCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import path from "../../../../constants/path";
import { formatDate } from "../../../../utils/utils";
import adminApi from "../../../../api/adminApi";
import { getAccessTokenFromLS } from "../../../../utils/auth"; 
import Swal from "sweetalert2"; 

const CartBooking = ({ onClose, dataCart, fetchCart, resetSearch }) => {
    const accessToken = getAccessTokenFromLS();
    const [cartOptions, setCartOptions] = useState(dataCart.roomCart || []);
    const [totalAmount, setTotalAmount] = useState(dataCart.totalPrice || 0);
    const [policyPrice, setPolicyPrice] = useState(dataCart.policyPrice || 0);

    // This effect runs only when dataCart changes
    useEffect(() => {
        if (dataCart) {
            setCartOptions(dataCart.roomCart);
            setTotalAmount(dataCart.totalPrice);
            setPolicyPrice(dataCart.policyPrice);
        }
    }, [dataCart]);

    const handleRemoveItem = useCallback(async (bookingRoomId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn muốn xóa phòng này khỏi giỏ hàng!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const response = await adminApi.removeCartItem(accessToken, bookingRoomId);
                if (response.data.statusCode === 200) {
                    await fetchCart();
                    resetSearch();
                    Swal.fire('Đã xóa!', 'Phòng đã được xóa khỏi giỏ hàng.', 'success');
                }
            } catch (error) {
                console.error("Error removing item from cart:", error);
                Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa phòng.', 'error');
            }
        }
    }, [accessToken, fetchCart, resetSearch]);

    const handleCheckout = () => {
        if (cartOptions.length === 0) {
            Swal.fire({
                title: 'Không có phòng nào trong giỏ hàng!',
                text: 'Vui lòng thêm phòng vào giỏ hàng trước khi đặt.',
                icon: 'warning',
                confirmButtonText: 'Đồng ý'
            });
        } else {
            // Redirect to checkout page if there are rooms in the cart
            window.location.href = path.checkOutAdmin;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-end items-center mb-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTimesCircle} className="w-6 h-6" />
                    </button>
                </div>
                <div className="overflow-auto max-h-[70vh]">
                    {cartOptions.length > 0 ? (
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b">Mã phòng</th>
                                    <th className="py-2 px-4 border-b">Loại phòng</th>
                                    <th className="py-2 px-4 border-b">Thời gian</th>
                                    <th className="py-2 px-4 border-b">Giá</th>
                                    <th className="py-2 px-4 border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartOptions.map((option) => (
                                    <tr key={option.bookingRoomId} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{option.roomNumber}</td>
                                        <td className="py-2 px-4 border-b">{option.roomType}</td>
                                        <td className="py-2 px-4 border-b">
                                            {`${formatDate(new Date(option.checkin))} - ${formatDate(new Date(option.checkout))}`}
                                        </td>
                                        <td className="py-2 px-4 border-b">{option.price.toLocaleString()} đ</td>
                                        <td className="py-2 px-4 border-b">
                                            <button 
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveItem(option.bookingRoomId)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-500 py-4">Không có phòng nào trong giỏ hàng.</div>
                    )}
                </div>
                <div className="mt-4 bg-gray-100 p-4 py-2 rounded">
                    <div className='flex justify-between items-center'>
                        <div>Phụ phí:</div>
                        <div className='font-black text-xl'>{policyPrice.toLocaleString()} đ</div>
                    </div>
                </div>
                <div className="mt-4 bg-gray-100 p-4 rounded">
                    <div className='flex justify-between items-center'>
                        <div className='text-lg'>Tổng tiền:</div>
                        <div className='font-black text-2xl'>{totalAmount.toLocaleString()} đ</div>
                    </div>
                </div>
                <div className='flex justify-end mt-3'>
                    <button 
                        onClick={handleCheckout}
                        className="bg-yellow-500 font-semibold text-white py-2 px-4 rounded hover:bg-yellow-600 mt-2"
                    >
                        ĐẶT NGAY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartBooking;