import { useState, useEffect, useCallback } from "react";
import breakfast from "../../../assets/Booking/breakfast.svg";
import fee from "../../../assets/Booking/fee.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Collapse({ isOpen, rooms, onOpenModal }) {
    const [roomData, setRoomData] = useState([]);

    useEffect(() => {
        if (rooms && rooms.length > 0) {
            setRoomData(rooms.map(() => ({ count: 0, adults: 0, children: 0, infants: 0 })));
        } else {
            setRoomData([]);
        }
    }, [rooms]);

    const handleChange = useCallback((index, type, value) => {
        setRoomData(prevData => {
            const newData = [...prevData];
            newData[index][type] = parseInt(value) || 0; // Fallback to 0
            return newData;
        });
    }, []);

    const handleRoomCountChange = useCallback((index, value) => {
        const newRoomCount = parseInt(value) || 0;
        setRoomData(prevData => {
            const newData = [...prevData];
            newData[index].count = newRoomCount;

            if (newRoomCount < newData[index].adults) {
                newData[index].adults = newRoomCount;
            }

            if (newRoomCount === 0) {
                newData[index] = { count: 0, adults: 0, children: 0, infants: 0 }; // Clear all fields
            }

            return newData;
        });
    }, []);

    const handleViewDetails = useCallback((room) => {
        onOpenModal(room.policyList);
    }, [onOpenModal]);

    return (
        <div className={`transition-all duration-900 ${isOpen ? 'opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <hr className="mt-6 mb-8" />
            {rooms && rooms.length > 0 ? (
                rooms.map((room, roomIndex) => (
                    <div key={room.id} className="w-full mb-6">
                        <div className="grid grid-cols-7 gap-5 items-center">
                            <div className="col-span-3">
                                <div className="text-red-400 font-inter font-semibold">{room.name}</div>
                                <div className="flex gap-3 mt-4 items-center">
                                    <img className="w-5 h-5" src={breakfast} alt="Breakfast included" />
                                    <div className="font-inter font-semibold">Đã bao gồm ăn sáng</div>
                                </div>
                                <div className="flex gap-3 mt-4 items-center">
                                    <img className="w-5 h-5" src={fee} alt="No refund on cancellation" />
                                    <div className="font-inter font-semibold">Không hoàn trả phí khi hủy phòng</div>
                                </div>
                                <div className="mt-3 font-inter font-semibold text-yellow-400 text-sm cursor-pointer" 
                                     onClick={() => handleViewDetails(room)}>
                                    Xem chi tiết
                                </div>
                            </div>
                            <div className="col-span-1 font-inter flex flex-col justify-center items-center">
                                <div className="flex items-center space-x-1">
                                    <FontAwesomeIcon icon={faUser} />
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <span className="text-sm">{room.adultNumber} Người lớn</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[#FFC745] font-medium text-3xl">{room.price.toLocaleString()} VNĐ</span>{" "} / đêm
                            </div>
                            <div className="col-span-1 font-inter">
                                <select
                                    onChange={(e) => handleRoomCountChange(roomIndex, e.target.value)}
                                    value={roomData[roomIndex]?.count || 0}
                                    className="p-3 text-sm w-full border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500"
                                >
                                    {[...Array(room.quantity + 1)].map((_, i) => (
                                        <option key={i} value={i}>{i} Phòng</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="border-b-2 border-dashed mt-4" />
                        {roomData[roomIndex]?.count > 0 && Array.from({ length: roomData[roomIndex]?.count }).map((_, index) => (
                            <RoomOccupancySelector 
                                key={index}
                                room={room}
                                roomIndex={roomIndex}
                                occupancyData={roomData[roomIndex]}
                                onChange={handleChange}
                            />
                        ))}
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">Không có phòng nào để hiển thị.</div>
            )}
        </div>
    );
}

function RoomOccupancySelector({ room, roomIndex, occupancyData, onChange }) {
    return (
        <div className="w-full grid grid-cols-12 gap-20 items-start mt-6 py-6 hover:bg-[#f5f5f5] rounded">
            <div className="col-span-3 font-inter font-medium text-nowrap">Chọn số người phòng</div>
            <div className="col-span-3">
                <label htmlFor={`adult-${roomIndex}`} className="font-inter text-sm">Người lớn</label>
                <select
                    className="p-1 mt-2 w-full border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500"
                    id={`adult-${roomIndex}`}
                    value={occupancyData.adults || 0}
                    onChange={(e) => onChange(roomIndex, 'adults', e.target.value)}
                >
                    {[...Array(room.adultMax)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
            </div>
            <div className="col-span-3">
                <label htmlFor={`children-${roomIndex}`} className="font-inter text-sm">Trẻ em(6-11 tuổi)</label>
                <select
                    className="p-1 mt-2 w-full border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500"
                    id={`children-${roomIndex}`}
                    value={occupancyData.children || 0}
                    onChange={(e) => onChange(roomIndex, 'children', e.target.value)}
                >
                    {[...Array(4)].map((_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
            </div>
            <div className="col-span-3">
                <label htmlFor={`infant-${roomIndex}`} className="font-inter text-sm">Em bé(0-5 tuổi)</label>
                <select
                    className="p-1 mt-2 w-full border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500"
                    id={`infant-${roomIndex}`}
                    value={occupancyData.infants || 0}
                    onChange={(e) => onChange(roomIndex, 'infants', e.target.value)}
                >
                    {[...Array(4)].map((_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Collapse;