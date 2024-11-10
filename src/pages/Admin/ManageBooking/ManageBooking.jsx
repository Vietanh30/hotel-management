import React, { useEffect, useState, useCallback } from "react";
import CalenderSearchRoomAdmin from "../../../components/CalenderSearchRoomAdmin/CalenderSearchRoomAdmin";
import SearchRoomAdmin from "../../../components/SearchRoomAdmin/SearchRoomAdmin";
import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import InforTypeRoomAdmin from "../../../components/InforTypeRoomAdmin/InforTypeRoomAdmin";
import CartBooking from "./CartBooking/CartBooking";
import { formatDateToYYYYMMDD } from "../../../utils/utils";
import Swal from 'sweetalert2';
import { getAccessTokenFromLS } from "../../../utils/auth";
import adminApi from "../../../api/adminApi";

function ManageBooking() {
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [searchResults, setSearchResults] = useState({});
    const [selectedIndex, setSelectedIndex] = useState({ rank: 0, room: 0 });
    const [modalState, setModalState] = useState({ show: false, roomDetails: null });
    const [cartData, setCartData] = useState({ show: false, data: {}, length: 0 });
    const [guestCounts, setGuestCounts] = useState({});
    const [guestSelection, setGuestSelection] = useState({ adults: 1, children: 0, infants: 0 });
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const accessToken = getAccessTokenFromLS();
    const [searchFunction, setSearchFunction] = useState(null);

    useEffect(() => {
        const initializeDates = () => {
            const today = new Date();
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + 1);
            setDates({
                checkIn: formatDateToYYYYMMDD(today),
                checkOut: formatDateToYYYYMMDD(nextDay),
            });
        };

        initializeDates();
        fetchCart(); // Call fetchCart directly
    }, []); // Only run once on mount

    const fetchCart = useCallback(async () => {
        try {
            const response = await adminApi.getCart(accessToken);
            if (response.data.statusCode === 200) {
                setCartData({ length: response.data.data.roomCart.length, data: response.data.data });
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }, [accessToken]);

    const handleDateChange = ({ startDate, endDate }) => {
        setDates({ checkIn: startDate, checkOut: endDate });
    };

    const handleSearchResults = (results) => {
        setSearchResults(results.data);
    };

    const handleRankClick = (index) => {
        setSelectedIndex(prev => ({ ...prev, rank: index, room: 0 }));
    };

    const handleInforTypeRoom = (index) => {
        setModalState({
            show: true,
            roomDetails: searchResults.rankList[index],
        });
    };

    const handleRoomPlaceClick = (index) => {
        setSelectedIndex(prev => ({ ...prev, room: index }));
    };

    const handleSelectGuests = (roomId) => {
        setCurrentRoomId(roomId);
        setShowDropdown(true);
    };

    const handleConfirmGuests = () => {
        if (currentRoomId !== null) {
            setGuestCounts(prev => ({
                ...prev,
                [currentRoomId]: guestSelection,
            }));
            setShowDropdown(false);
            setGuestSelection({ adults: 1, children: 0, infants: 0 });
        }
    };

    const handleAddRoomToCart = async (room) => {
        const bookingData = {
            checkinDate: dates.checkIn,
            checkoutDate: dates.checkOut,
            roomNumberId: room.id,
            ...guestCounts[room.id] || guestSelection,
        };

        const totalGuests = guestSelection.adults + guestSelection.children;
        const adultMax = room.adultMax;

        if (guestSelection.adults > adultMax) {
            Swal.fire('Lỗi!', `Số người lớn phải nhỏ hơn hoặc bằng ${adultMax}.`, 'error');
            return;
        }

        if (totalGuests > adultMax) {
            Swal.fire('Lỗi!', 'Tổng số khách (người lớn + trẻ em) không được vượt quá số lượng tối đa.', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn thêm phòng này vào giỏ hàng?',
            text: `Phòng số: ${room.roomNumber}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, thêm vào giỏ hàng',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                const response = await adminApi.addRoomToCart(accessToken, bookingData);
                Swal.fire('Đã thêm!', response.data.message || 'Phòng đã được thêm vào giỏ hàng.', 'success');
                fetchCart();
                if (searchFunction) {
                    await searchFunction(); // Gọi lại hàm tìm kiếm nếu có
                }
            } catch (error) {
                console.error("Error adding room to cart:", error);
                Swal.fire('Có lỗi xảy ra!', error.response?.data?.description || 'Không thể thêm phòng vào giỏ hàng.', 'error');
            }
        }
    };

    const handleSearch = (searchFunc) => {
        setSearchFunction(() => searchFunc);
    };

    const resetSearch = () => {
        if (searchFunction) {
            searchFunction(); // Call the search function to reset the search results
        }
      
    };

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-60">
                <div className="p-4 mt-20">
                    <div className="w-full flex justify-between items-center">
                        <div className="font-semibold text-2xl">Quản lý đặt phòng</div>
                        <button className="relative" onClick={() => setCartData(prev => ({ ...prev, show: true }))}>
                            <FontAwesomeIcon icon={faShoppingCart} className="text-xl text-yellow-500 hover:text-yellow-600 cursor-pointer" />
                            <div className="rounded-full text-xs text-white px-1 py-[1px] bg-red-500 absolute -right-2 -top-3 font-black">{cartData.length}</div>
                        </button>
                    </div>
                    <div className="flex gap-8 mt-4">
                        <div className="w-1/3">
                            <SearchRoomAdmin 
                                onDateChange={handleDateChange} 
                                onSearchResults={handleSearchResults} 
                                onSearch={handleSearch} 
                            />
                            <div className="p-4 rounded border border-[#aeaeae] bg-gray-50 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center border-r border-black py-3">
                                        <div className="text-lg font-medium">Tổng phòng</div>
                                        <div className="text-3xl font-black mt-2">{searchResults.totalRoom}</div>
                                    </div>
                                    <div className="text-center py-3">
                                        <div className="text-lg font-medium">Phòng trống</div>
                                        <div className="text-3xl font-black mt-2">{searchResults.availableRoom}</div>
                                    </div>
                                    <div className="text-center border-r border-black py-3">
                                        <div className="text-lg font-medium">Phòng đã đặt</div>
                                        <div className="text-3xl font-black mt-2">{searchResults.bookedRoom}</div>
                                    </div>
                                    <div className="text-center py-3">
                                        <div className="text-lg font-medium">Phòng hỏng</div>
                                        <div className="text-3xl font-black mt-2">0</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-2/3">
                            <CalenderSearchRoomAdmin 
                                checkInDate={dates.checkIn} 
                                checkOutDate={dates.checkOut} 
                                onDateChange={handleDateChange}
                                results={searchResults}
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="mt-4 p-4 rounded border border-[#aeaeae] bg-gray-50 overflow-auto">
                            <h3 className="text-lg font-bold mb-2">Danh sách phòng tìm thấy</h3>
                            <div className="flex space-x-4 mb-4">
                                {searchResults.rankList?.map((rank, index) => (
                                    <div className="flex py-2 gap-1 rounded font-semibold" key={rank.id}>
                                        <button 
                                            className={`flex px-4 py-2 rounded font-semibold group hover:bg-yellow-500 hover:text-white ${selectedIndex.rank === index ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                                            onClick={() => handleRankClick(index)}
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            {rank.name}
                                        </button>
                                        <div
                                            className={`flex items-center justify-center px-2 gap-3 cursor-pointer rounded font-semibold group hover:bg-yellow-500 hover:text-white ${selectedIndex.rank === index ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                                            onClick={() => handleInforTypeRoom(index)}
                                        >
                                            <FontAwesomeIcon icon={faInfoCircle} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {searchResults.rankList && (
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Danh sách phòng</h3>
                                    <div className="flex space-x-4 mb-4">
                                        {searchResults.rankList[selectedIndex.rank]?.roomPlaces.map((place, index) => (
                                            <button
                                                key={place.roomId}
                                                className={`flex px-4 py-2 rounded font-semibold group hover:bg-yellow-500 hover:text-white ${selectedIndex.room === index ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                                                onClick={() => handleRoomPlaceClick(index)}
                                            >
                                                {place.roomName}
                                            </button>
                                        ))}
                                    </div>
                                    <div>
                                        <table className="min-w-full bg-white border border-gray-300 text-center">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="py-2 px-4 border-b">Phòng số</th>
                                                    <th className="py-2 px-4 border-b">Mã phòng</th>
                                                    <th className="py-2 px-4 border-b">Trạng thái</th>
                                                    <th className="py-2 px-4 border-b">Chọn người</th>
                                                    <th className="py-2 px-4 border-b">Khách</th>
                                                    <th className="py-2 px-4 border-b">Thêm</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {searchResults.rankList[selectedIndex.rank]?.roomPlaces[selectedIndex.room]?.roomNumberList.length > 0 ? (
                                                    searchResults.rankList[selectedIndex.rank].roomPlaces[selectedIndex.room].roomNumberList.map(room => (
                                                        <tr key={room.id} className="hover:bg-gray-50">
                                                            <td className="py-2 px-4 border-b">{room.roomNumber}</td>
                                                            <td className="py-2 px-4 border-b">{room.roomCode}</td>
                                                            <td className="py-2 px-4 border-b">{room.status === 'AVAILABLE' ? 'Còn trống' : 'Đã khóa'}</td>
                                                            <td className="py-2 px-4 border-b">
                                                                <button 
                                                                    className="relative bg-yellow-500 font-semibold text-white py-1 px-2 rounded hover:bg-yellow-600"
                                                                    onClick={() => handleSelectGuests(room.id)}
                                                                >
                                                                    Chọn người
                                                                </button>
                                                            </td>
                                                            <td className="py-2 px-4 border-b">
                                                                {guestCounts[room.id] ? 
                                                                    `${guestCounts[room.id].adults} người lớn, ${guestCounts[room.id].children} trẻ em, ${guestCounts[room.id].infants} trẻ sơ sinh` 
                                                                    : 'Chưa chọn'}
                                                            </td>
                                                            <td className="py-2 px-4 border-b">
                                                                <button 
                                                                    className="bg-yellow-500 font-semibold text-white py-1 px-2 rounded hover:bg-yellow-600"
                                                                    onClick={() => handleAddRoomToCart(room)}
                                                                >
                                                                    Thêm vào giỏ
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="py-2 px-4 border-b text-center text-gray-500">
                                                            Không có phòng nào
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {showDropdown && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-[#F5E8D0] p-4 rounded shadow-xl">
                                <h4 className="text-lg font-semibold mb-2">Chọn số lượng khách</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <label className="flex flex-col font-semibold">
                                        Người lớn:
                                        <input
                                            type="number"
                                            value={guestSelection.adults}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                const adultMax = searchResults.rankList[selectedIndex.rank]?.roomPlaces[selectedIndex.room]?.adultMax;
                                                if (value <= adultMax && value > 0) {
                                                    setGuestSelection(prev => ({ ...prev, adults: value }));
                                                } else {
                                                    Swal.fire('Lỗi!', `Số người lớn phải nhỏ hơn hoặc bằng ${adultMax}.`, 'error');
                                                }
                                            }}
                                            min="1"
                                            className="mt-1 border border-gray-300 rounded p-1"
                                        />
                                    </label>
                                    <label className="flex flex-col font-semibold">
                                        Trẻ em:
                                        <input
                                            type="number"
                                            value={guestSelection.children}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                const totalGuests = value + guestSelection.adults;
                                                const adultMax = searchResults.rankList[selectedIndex.rank]?.roomPlaces[selectedIndex.room]?.adultMax;
                                                if (totalGuests <= adultMax) {
                                                    setGuestSelection(prev => ({ ...prev, children: value }));
                                                } else {
                                                    Swal.fire('Lỗi!', 'Tổng số khách (người lớn + trẻ em) không được vượt quá số lượng tối đa.', 'error');
                                                }
                                            }}
                                            min="0"
                                            className="mt-1 border border-gray-300 rounded p-1"
                                        />
                                    </label>
                                    <label className="flex flex-col font-semibold">
                                        Trẻ sơ sinh:
                                        <input
                                            type="number"
                                            value={guestSelection.infants}
                                            onChange={(e) => setGuestSelection(prev => ({ ...prev, infants: Number(e.target.value) }))}
                                            min="0"
                                            max="3"
                                            className="mt-1 border border-gray-300 rounded p-1"
                                        />
                                    </label>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        className="bg-yellow-500 font-semibold text-white py-1 px-2 rounded hover:bg-yellow-600"
                                        onClick={handleConfirmGuests}
                                    >
                                        Xác nhận
                                    </button>
                                    <button
                                        className="ml-2 text-white bg-gray-500 font-semibold py-1 px-2 rounded hover:bg-gray-600"
                                        onClick={() => {
                                            setShowDropdown(false);
                                            setGuestSelection({ adults: 1, children: 0, infants: 0 });
                                        }}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <InforTypeRoomAdmin
                isOpen={modalState.show} 
                onClose={() => setModalState({ ...modalState, show: false })} 
                roomDetails={modalState.roomDetails} 
            />
            {cartData.show && (
                <CartBooking 
                    onClose={() => setCartData(prev => ({ ...prev, show: false }))} 
                    dataCart={cartData.data} 
                    fetchCart={fetchCart} 
                    resetSearch={resetSearch} 
                />
            )}
        </>
    );
}

export default ManageBooking;