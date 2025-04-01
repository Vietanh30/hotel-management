import React, { useState } from 'react';
import userApi from '../../../../api/userApi';
import { getAccessTokenFromLS, setBookingIdToLS, setPaymentIdToLS } from '../../../../utils/auth';
import Swal from 'sweetalert2'; // Import SweetAlert2

export function BookingModal({ isOpen, onClose, serviceDetails }) {
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const accessToken = getAccessTokenFromLS();

    if (!isOpen) return null;

    const handleError = (message) => {
        Swal.fire('Error', message, 'error');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!note.trim()) {
            handleError('Ghi chú không được để trống.');
            setIsSubmitting(false);
            return;
        }

        if (note.length > 200) {
            handleError('Ghi chú không được vượt quá 200 ký tự.');
            setIsSubmitting(false);
            return;
        }

        try {
            const requestBody = {
                serviceHotelId: serviceDetails.id,
                note: note,
            };
            const response = await userApi.bookingServiceHotel(accessToken, requestBody);
            console.log(response);
            if (response.data.statusCode === 200) {
                Swal.fire('Success', 'Đặt dịch vụ thành công!', 'success');
                setNote('');
                setPaymentIdToLS(response.data.data.payment_id)
                setBookingIdToLS(response.data.data.booking_id)
                window.location.href = response.data.data.orderurl;
            } else {
                handleError(response.data.message || 'Có lỗi xảy ra khi đặt dịch vụ.');
            }
        } catch (error) {
            handleError(error.response?.data?.message || 'Có lỗi xảy ra khi đặt dịch vụ.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Đặt dịch vụ: {serviceDetails?.name}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Giá dịch vụ</label>
                        <div className="font-semibold text-[#f2a900] text-lg">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(serviceDetails?.price || 0)}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="note" className="block text-gray-700 font-medium mb-2">Ghi chú</label>
                        <textarea
                            id="note"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2a900]"
                            rows="4"
                            placeholder="Nhập ghi chú của bạn (nếu có)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#f2a900] text-white rounded-md hover:bg-yellow-600 transition flex items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span>Đang xử lý...</span>
                            ) : (
                                'Thanh toán'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
