import { useState, useEffect } from "react";
import breakfast from "../../../assets/Booking/breakfast.svg";
import fee from "../../../assets/Booking/fee.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Collapse({ isOpen, onSelectTypeRoom, onOpenModal }) {
    const [numRooms, setNumRooms] = useState(0);
    const [roomData, setRoomData] = useState([]);
    // Function to log the number of people in each room
    const RoomInPeople = () => {
        roomData.forEach((room, index) => {
            const totalPeople = room.adults + room.children + room.infants;
            console.log(`Room ${index + 1}: ${room.adults} adults, ${room.children} children, ${room.infants} infants (Total: ${totalPeople})`);
        });
    };

    useEffect(() => {
        RoomInPeople();
    }, [roomData]);

    const handleRoomChange = (e) => {
        const newNumRooms = parseInt(e.target.value);
        setNumRooms(newNumRooms);
        setRoomData(Array.from({ length: newNumRooms }, () => ({ adults: 1, children: 0, infants: 0 })));
    };

    const handleChange = (index, type, value) => {
        const newRoomData = [...roomData];
        newRoomData[index][type] = parseInt(value);
        setRoomData(newRoomData);
    };

    return (
        <div className={`transition-all duration-900 ${isOpen ? 'opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <hr className="mt-6 mb-8" />
            <div className="w-full grid grid-cols-7 gap-5 items-center">
                <div className="col-span-3">
                    <div className="text-red-400 font-inter font-semibold">Tên phòng</div>
                    <div className="flex gap-3 mt-4 items-center">
                        <img className="w-5 h-5" src={breakfast} alt="" />
                        <div className="font-inter font-semibold">Đã bao gồm ăn sáng</div>
                    </div>
                    <div className="flex gap-3 mt-4 items-center">
                        <img className="w-5 h-5" src={fee} alt="" />
                        <div className="font-inter font-semibold">Không hoàn trả phí khi hủy phòng</div>
                    </div>
                    <div className="mt-3 font-inter font-semibold text-yellow-400 text-sm cursor-pointer" onClick={onOpenModal}>
                        Xem chi tiết
                    </div>
                </div>
                <div className="col-span-1 font-inter flex flex-col justify-center items-center">
                    <div className="flex items-center space-x-1">
                        <FontAwesomeIcon icon={faUser} />
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <span className="text-sm">2 Người lớn</span>
                </div>
                <div className="col-span-2">
                    <span className="text-[#FFC745] font-medium text-3xl">1,367,000</span>{" "} / đêm
                </div>
                <div className="col-span-1 font-inter">
                    <select
                        value={numRooms}
                        onChange={handleRoomChange}
                        className="p-3 text-sm w-full border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500"
                    >
                        <option value={0}>0 Phòng</option>
                        {[...Array(4)].map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1} Phòng</option>
                        ))}
                    </select>
                </div>
            </div>

            {Array.from({ length: numRooms }).map((_, index) => (
                <div key={index}>
                    <div className="border-b-2 border-dashed" />
                    <div className="w-full grid grid-cols-12 gap-20 items-start mt-6 py-6 hover:bg-[#f5f5f5] rounded">
                        <div className="col-span-3 font-inter font-medium text-nowrap">Chọn số người phòng {index + 1}</div>
                        <div className="col-span-3">
                            <label htmlFor={`adult-${index}`} className="font-inter text-sm">Người lớn</label>
                            <select
                                className="p-1 mt-2 w-full border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500"
                                id={`adult-${index}`}
                                value={roomData[index]?.adults || 1}
                                onChange={(e) => handleChange(index, 'adults', e.target.value)}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                            </select>
                        </div>
                        <div className="col-span-3">
                            <label htmlFor={`children-${index}`} className="font-inter text-sm">Trẻ em(6-11 tuổi)</label>
                            <select
                                className="p-1 mt-2 w-full border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500"
                                id={`children-${index}`}
                                value={roomData[index]?.children || 0}
                                onChange={(e) => handleChange(index, 'children', e.target.value)}
                            >
                                {[...Array(4)].map((_, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-3">
                            <label htmlFor={`infant-${index}`} className="font-inter text-sm">Em bé(0-5 tuổi)</label>
                            <select
                                className="p-1 mt-2 w-full border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500"
                                id={`infant-${index}`}
                                value={roomData[index]?.infants || 0}
                                onChange={(e) => handleChange(index, 'infants', e.target.value)}
                            >
                                {[...Array(4)].map((_, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Collapse;