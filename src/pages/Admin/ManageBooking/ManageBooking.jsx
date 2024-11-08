import React, { useEffect, useState } from "react";
import CalenderSearchRoomAdmin from "../../../components/CalenderSearchRoomAdmin/CalenderSearchRoomAdmin";
import SearchRoomAdmin from "../../../components/SearchRoomAdmin/SearchRoomAdmin";
import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { faInfoCircle ,faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import InforTypeRoomAdmin from "../../../components/InforTypeRoomAdmin/InforTypeRoomAdmin";
import CartBooking from "./CartBooking/CartBooking";
import { formatDateToYYYYMMDD } from "../../../utils/utils";
import Swal from 'sweetalert2';
import { getAccessTokenFromLS } from "../../../utils/auth";
import adminApi from "../../../api/adminApi";


function ManageBooking() {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [searchResults, setSearchResults] = useState({}); 
    const [selectedRankIndex, setSelectedRankIndex] = useState(0);
    const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [dataCart, setDataCart] = useState([]);
    const [lengthCart, setLengthCart] = useState(0)
    // Dropdown state
    const [showDropdown, setShowDropdown] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const accessToken = getAccessTokenFromLS()
    // State to hold guest counts for each room
    const [guestCounts, setGuestCounts] = useState({});

    useEffect(() => {
        const today = new Date();
        const nextDay = new Date();
        nextDay.setDate(today.getDate() + 1);
        
        setCheckInDate(formatDateToYYYYMMDD(today)); // Format to YYYY-MM-DD
        setCheckOutDate(formatDateToYYYYMMDD(nextDay)); // Format to YYYY-MM-DD
        const fetchCart = async () => {
            try {
              const response = await adminApi.getCart(accessToken);
              if (response.data.statusCode === 200) {
                setLengthCart(response.data.data.roomCart.length)
                setDataCart(response.data.data);
              }
            } catch (error) {
              console.error("Error fetching cart data:", error);
            }
          };
      
          fetchCart();
    }, []);

    const handleDateChange = ({ startDate, endDate }) => {
        setCheckInDate(startDate);
        setCheckOutDate(endDate);
    };

    const handleSearchResults = (results) => {
        console.log(results);
        setSearchResults(results.data);
    };

    const handleRankClick = (index) => {
        setSelectedRankIndex(index);
        setSelectedRoomIndex(0); // Reset room index when changing rank
        setSelectedRoomDetails(searchResults.rankList[index].roomPlaces[0]);
    };

    const handleRoomPlaceClick = (index) => {
        setSelectedRoomIndex(index);
        setSelectedRoomDetails(searchResults.rankList[selectedRankIndex].roomPlaces[index]);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const handleSelectGuests = (roomId) => {
        setSelectedRoomId(roomId);
        setShowDropdown(true); // Show the dropdown for guest selection
    };

    const handleConfirmGuests = () => {
        // Update guest counts for the selected room
        const updatedCounts = {
            adults,
            children,
            infants,
        };
        setGuestCounts((prev) => ({
            ...prev,
            [selectedRoomId]: updatedCounts,
        }));

        // Reset guest counts after confirmation
        setAdults(1);
        setChildren(0);
        setInfants(0);
        setShowDropdown(false); // Close dropdown after confirmation
    };

    const handleAddRoomToCart = (room) => {
        console.log(room)
        const bookingData = {
            checkinDate: checkInDate,
            checkoutDate: checkOutDate,
            roomNumberId: room.id, // Giả sử room.id là định danh đúng
            adults: guestCounts[room.id]?.adults || adults,
            children: guestCounts[room.id]?.children || children,
            infants: guestCounts[room.id]?.infants || infants,
        };
    
        // Hiển thị SweetAlert2 để hỏi người dùng
        Swal.fire({
            title: 'Bạn có chắc chắn muốn thêm phòng này vào giỏ hàng?',
            text: `Phòng số: ${room.roomNumber}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, thêm vào giỏ hàng',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(bookingData); // Log thông tin đặt phòng
                // Gửi bookingData đến API hoặc xử lý thêm
                // Ví dụ: addRoomToCart(bookingData);
                Swal.fire(
                    'Đã thêm!',
                    'Phòng đã được thêm vào giỏ hàng.',
                    'success'
                );
            }
        });
    };

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-60">
                <div className="p-4 mt-20">
                    <div className="w-full flex justify-between items-center">
                        <div className="font-semibold text-2xl font-inter">
                            Quản lý đặt phòng
                        </div>
                        <button className="relative" onClick={() => setShowCart(true)}>
                                <FontAwesomeIcon icon={faShoppingCart} className="text-xl text-yellow-500 hover:text-yellow-600 cursor-pointer" />
                                <div className=" rounded-full text-xs text-white px-1 py-[1px] bg-red-500 absolute -right-2 -top-3 font-black">{lengthCart}</div>
                        </button>
                    </div>
                    <div className="flex gap-8 mt-4">
                        <div className="w-1/3">
                            <SearchRoomAdmin onDateChange={handleDateChange} onSearchResults={handleSearchResults} />
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
                                checkInDate={checkInDate} 
                                checkOutDate={checkOutDate} 
                                onDateChange={handleDateChange}
                                results={searchResults}
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="mt-4 p-4 rounded border border-[#aeaeae] bg-gray-50 overflow-auto ">
                            <h3 className="text-lg font-bold mb-2">Danh sách phòng tìm thấy</h3>
                            <div className="flex space-x-4 mb-4">
                                {searchResults.rankList && searchResults.rankList.map((rank, index) => (
                                    <div
                                        className="flex py-2 gap-1 rounded font-semibold" key={rank.id}>
                                        <button 
                                            className={`flex px-4 py-2 rounded font-semibold group: hover:bg-yellow-500 hover:text-white ${selectedRankIndex === index ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                                            onClick={() => handleRankClick(index)}
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            {rank.name}
                                        </button>
                                        <div
                                            className={`flex items-center justify-center px-2 gap-3 cursor-pointer rounded font-semibold group: hover:bg-yellow-500 hover:text-white ${selectedRankIndex === index ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                                            onClick={() => {
                                                handleRankClick(index);
                                                openModal();
                                            }}>
                                            <FontAwesomeIcon icon={faInfoCircle} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {searchResults.rankList && (
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Danh sách phòng</h3>
                                    <div className="flex space-x-4 mb-4">
                                        {searchResults.rankList[selectedRankIndex].roomPlaces.map((place, index) => (
                                            <button
                                                key={place.roomId}
                                                className={`flex px-4 py-2 rounded font-semibold group: hover:bg-yellow-500 hover:text-white ${selectedRoomIndex === index ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                                                onClick={() => handleRoomPlaceClick(index)}
                                            >
                                                {place.roomName}
                                            </button>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="">
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
                                                    {searchResults.rankList[selectedRankIndex].roomPlaces[selectedRoomIndex].roomNumberList.length > 0 ? (
                                                        searchResults.rankList[selectedRankIndex].roomPlaces[selectedRoomIndex].roomNumberList.map(room => (
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
                                                                    {/* Display selected guests */}
                                                                    {guestCounts[room.id] ? 
                                                                        `${guestCounts[room.id].adults} người lớn, ${guestCounts[room.id].children} trẻ em, ${guestCounts[room.id].infants} trẻ sơ sinh` 
                                                                        : 'Chưa chọn'}
                                                                </td>
                                                                <td className="py-2 px-4 border-b">
                                                                    <button 
                                                                        className="bg-yellow-500 font-semibold text-white py-1 px-2 rounded hover:bg-yellow-600"
                                                                        onClick={() => handleAddRoomToCart(room)} // Call the add room function
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
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Dropdown for selecting guests */}
                    {showDropdown && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-[#F5E8D0] p-4 rounded shadow-xl">
                                <h4 className="text-lg font-semibold mb-2">Chọn số lượng khách</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <label className="flex flex-col font-semibold">
                                        Người lớn:
                                        <input
                                            type="number"
                                            value={adults}
                                            onChange={(e) => setAdults(Number(e.target.value))}
                                            min="1"
                                            className="mt-1 border border-gray-300 rounded p-1"
                                        />
                                    </label>
                                    <label className="flex flex-col font-semibold">
                                        Trẻ em:
                                        <input
                                            type="number"
                                            value={children}
                                            onChange={(e) => setChildren(Number(e.target.value))}
                                            min="0"
                                            className="mt-1 border border-gray-300 rounded p-1"
                                        />
                                    </label>
                                    <label className="flex flex-col font-semibold">
                                        Trẻ sơ sinh:
                                        <input
                                            type="number"
                                            value={infants}
                                            onChange={(e) => setInfants(Number(e.target.value))}
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
                                            // Reset counts when closing the dropdown without confirmation
                                            setAdults(1);
                                            setChildren(0);
                                            setInfants(0);
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
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                roomDetails={selectedRoomDetails} 
            />
            {showCart && (
                <CartBooking onClose={() => setShowCart(false)} dataCart={dataCart} />
            )}
        </>
    );
}

export default ManageBooking;