import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import BackToTopButton from '../../../components/BackToTopButton/BackToTopButton';
import userApi from '../../../api/userApi';
import { getAccessTokenFromLS } from '../../../utils/auth';
import Swal from 'sweetalert2';
import Navbar from '../../../components/Navbar/Navbar';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { formatDate, formatDateAndTime } from '../../../utils/utils';
import path from '../../../constants/path';

function BookingHistory() {
    const [searchText, setSearchText] = useState('');
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchBookingHistory = async () => {
        try {
            const accessToken = getAccessTokenFromLS();
            const response = await userApi.getBookingHistory(accessToken);
            console.log(response);
            if (response.data.statusCode === 200) {
                setBookingHistory(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching booking history:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể tải lịch sử đặt hàng.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    const filteredData = useMemo(() => {
        return bookingHistory.filter(item =>
            (item.customer && item.customer.toLowerCase().includes(searchText.toLowerCase())) ||
            (item.bookingId && item.bookingId.toString().includes(searchText))
        );
    }, [searchText, bookingHistory]);

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        console.log("slect", booking);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedBooking(null);
        setShowModal(false);
    };

    const columns = useMemo(() => [
        {
            name: 'Mã đặt phòng',
            selector: (row) => row.bookingId,
            sortable: true,
            cell: (row) => (
                <div className="text-sm font-semibold text-center">{row.bookingId}</div>
            ),
        },
        {
            name: 'Trạng thái thanh toán',
            selector: (row) => (
                <div
                    className={`px-2 py-1 rounded-full text-white text-sm font-bold ${row.paymentStatus === 'BOOKED'
                            ? 'bg-green-500'
                            : row.paymentStatus === 'CANCELLED'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                        } text-center`}
                >
                    {row.paymentStatus}
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Tổng giá phòng',
            selector: (row) => (
                <div className="text-sm font-semibold text-center">
                    {row.totalRoomPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Số phòng đặt',
            selector: (row) => (
                <div className="text-sm font-semibold text-center">{row.totalRoomBooking}</div>
            ),
            sortable: true,
        },
        {
            name: 'Khách hàng',
            selector: (row) => (
                <div className="text-sm font-semibold text-center">{row.customer}</div>
            ),
            sortable: true,
        },
        {
            name: 'Ngày đặt',
            selector: (row) => (
                <div className="text-sm font-semibold text-center">{row.bookingDate}</div>
            ),
            sortable: true,
        },
        {
            name: 'Hành động',
            cell: (row) => (
                <button className="text-yellow-500 hover:text-yellow-700 focus:outline-none" onClick={() => handleViewDetails(row)}>
                    <FontAwesomeIcon icon={faEye} />
                </button>
            ),
        },
    ], []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-lg font-semibold">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <>
            <div className='min-h-screen'>

                <Header />
                <Navbar />
                <div className="w-full ">
                    <div className='container mx-auto'>
                        <div className="overflow-x-auto">
                            <div className="my-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="font-semibold text-2xl font-inter">
                                        Lịch sử đặt hàng
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm theo mã, tên..."
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            className="p-2 border border-gray-500 rounded w-56 mb-4 focus:outline-none focus:ring focus:ring-yellow-500"
                                        />
                                    </div>
                                </div>
                                {filteredData.length === 0 ? (
                                    <div className="text-center text-gray-500 text-2xl font-semibold py-6">
                                        Chưa đặt phòng nào. <br />
                                        <button
                                            onClick={() => navigate(path.booking)}
                                            className="mt-4 px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
                                            Đặt phòng ngay
                                        </button>
                                    </div>
                                ) : (
                                    <DataTable
                                        columns={columns}
                                        data={filteredData}
                                        pagination
                                        highlightOnHover
                                        striped
                                        noDataComponent={
                                            <div className="text-center text-gray-500 font-semibold py-6 ">
                                                Không tìm thấy lịch sử đặt hàng nào.
                                            </div>
                                        }
                                        customStyles={{
                                            headRow: {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#edce94',
                                                    borderTopLeftRadius: '14px',
                                                    borderTopRightRadius: '14px',
                                                    textAlign: 'center',
                                                },
                                            },
                                            rows: {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    fontFamily: 'inter',
                                                    paddingTop: '6px',
                                                    paddingBottom: '6px',
                                                    textOverflow: 'ellipsis',
                                                    textAlign: 'center',
                                                },
                                            },
                                        }}
                                        paginationComponentOptions={{
                                            rowsPerPageText: 'Hiển thị',
                                            rangeSeparatorText: 'trên',
                                            noRowsPerPage: false,
                                            selectAllRowsItem: false,
                                            selectAllRowsItemText: 'Tất cả',
                                        }}
                                        paginationPerPage={10}
                                        paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                                    />
                                )}
                            </div>
                        </div>

                        {selectedBooking && (
                            <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${showModal ? 'visible' : 'invisible'}`}>
                                <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-4xl overflow-auto max-h-[90%] relative">
                                    <h2 className="text-2xl font-bold mb-4">Chi tiết đơn đặt phòng</h2>
                                    <button
                                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                        onClick={handleCloseModal}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { label: 'Mã đặt phòng:', value: selectedBooking.bookingId },
                                            { label: 'Khách hàng:', value: selectedBooking.customer },
                                            { label: 'Ngày đặt phòng:', value: selectedBooking.bookingDate },
                                            { label: 'Tổng giá phòng:', value: selectedBooking.totalRoomPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) },
                                            { label: 'Tổng giá chính sách:', value: selectedBooking.totalPolicyPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) },
                                            { label: 'Tổng giá đặt phòng:', value: selectedBooking.totalBookingPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) },
                                            { label: 'Số phòng đặt:', value: selectedBooking.totalRoomBooking },
                                            {
                                                label: 'Trạng thái thanh toán:',
                                                value: (
                                                    <div className={`px-2 py-1 rounded-full text-white text-sm font-bold ${selectedBooking.paymentStatus === 'BOOKED'
                                                            ? 'bg-green-500'
                                                            : selectedBooking.paymentStatus === 'CANCELLED'
                                                                ? 'bg-red-500'
                                                                : 'bg-yellow-500'
                                                        }`}>
                                                        {selectedBooking.paymentStatus}
                                                    </div>
                                                ),
                                            },
                                        ].map((item, index) => (
                                            <div key={index} className="flex justify-start gap-2 items-center">
                                                <span className="">{item.label}</span>
                                                <span className="font-semibold text-lg">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-lg font-bold mb-2">Thông tin chi tiết các phòng đặt:</h3>
                                        {selectedBooking.bookingRoomDetails.map((room, index) => (
                                            <>
                                                <div key={index} className="mt-6">
                                                    <div className="grid grid-cols-6 gap-2">
                                                        <div className="bg-gray-100 p-4 rounded">
                                                            <span className="block font-bold">Số phòng: {room.roomNumber}</span>
                                                        </div>
                                                        <div className="bg-gray-100 p-4 rounded">
                                                            <span className="block font-bold">Loại phòng: {room.roomType}</span>
                                                        </div>
                                                        <div className="bg-gray-100 p-4 rounded">
                                                            <span className="block font-bold">Số người: {room.adults} người lớn, {room.children} trẻ em, {room.infant} trẻ sơ sinh</span>
                                                        </div>
                                                        <div className="bg-gray-100 p-4 rounded">
                                                            <span className="block font-bold">Ngày nhận : {formatDateAndTime(room.checkIn)}</span>
                                                        </div>
                                                        <div className="bg-gray-100 p-4 rounded">
                                                            <span className="block font-bold">Ngày trả : {formatDateAndTime(room.checkOut)}</span>
                                                        </div>
                                                        <div className="bg-gray-100 p-4 rounded">
                                                            <span className="block font-bold">Giá phòng: {room.roomPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pb-6 border-b-2 border-dashed">
                                                    <h3 className="text-lg font-bold my-2">Dịch vụ đã chọn:</h3>
                                                    {room.serviceList?.length > 0 ? (
                                                        room.serviceList.map((service, index) => (
                                                            <div key={index} className="bg-gray-100 p-4 rounded mb-2 flex justify-between">
                                                                <span className="font-semibold">{service.name}</span>
                                                                <span className="font-semibold">{service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="bg-gray-100 p-4 rounded mb-2 text-center">
                                                            <span className="font-semibold">Không chọn dịch vụ nào</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {selectedBooking.feedback && (
                                                    <>
                                                        <h3 className="text-lg font-bold mb-2">Đánh giá:</h3>
                                                        <div className="bg-gray-100 p-4 rounded">
                                                            <span className="block font-bold">{selectedBooking.feedback}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <Footer />
                <BackToTopButton />
            </div>
        </>
    );
}

export default BookingHistory;