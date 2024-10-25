import { useState } from "react";
import imgRoom from "../../assets/Booking/Room.svg";
import area from "../../assets/Home/area.svg";
import bed from "../../assets/Home/bed.svg";
import Collapse from "./Collapse/Collapse";
import InforRoom from "../CardRoom/InforRoom/InforRoom";
import RoomPolicy from "../RoomPolicy/RoomPolicy";

function CardRoomBooking() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isRoomPolicyModalOpen, setIsRoomPolicyModalOpen] = useState(false);
    const [isInforRoomModalOpen, setIsInforRoomModalOpen] = useState(false);

    const roomDetails = {
        title: "Deluxe King",
        description: "Phòng Deluxe King thoáng đãng với nội thất sang trọng và đầy đủ tiện nghi.",
        amenities: [
            "Tủ quần áo", 
            "Máy sấy tóc", 
            "Ga trải giường, gối", 
            "Wifi", 
            "Điều hòa"
        ],
    };

    const handleSelectTypeRoom = (typeRoom) => {
        setSelectedRoom(typeRoom);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const toggleModal = () => setIsRoomPolicyModalOpen((prev) => !prev);
    const toggleInfoModal = () => setIsInforRoomModalOpen((prev) => !prev);

    return (
        <>
            <div className="grid grid-cols-2">
                <div className="col-span-1 w-11/12">
                    <img className="rounded w-full" src={imgRoom} alt="Room" />
                </div>
                <div className="col-span-1 flex flex-col justify-between">
                    <div>
                        <div className="font-inter font-semibold text-xl">{roomDetails.title}</div>
                        <div className="mt-3">
                            <div className="flex gap-5 mt-3">
                                <div className="flex gap-2 items-center">
                                    <img className="w-6 h-auto" src={area} alt="Area" />
                                    <div className="font-inter font-medium text-sm">32m²</div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img className="w-6 h-auto" src={bed} alt="Bed" />
                                    <div className="font-inter font-medium text-sm">1 giường đôi</div>
                                </div>
                            </div>
                        </div>
                        <div 
                            className="mt-3 font-inter font-semibold text-yellow-400 text-sm cursor-pointer" 
                            onClick={toggleInfoModal}
                        >
                            Xem chi tiết
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 items-center">
                        <div className="font-bold">
                            Chỉ từ{" "}
                            <span className="text-[#FFC745] font-medium text-3xl">1,367,000</span>{" "} / đêm
                        </div>
                        <button
                            className="bg-yellow-500 text-nowrap hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded"
                            onClick={toggleDropdown}
                        >
                            Chọn phòng
                        </button>
                    </div>
                </div>
            </div>
            <Collapse isOpen={isDropdownOpen} onSelectTypeRoom={handleSelectTypeRoom} onOpenModal={toggleModal} />
            {isRoomPolicyModalOpen && <RoomPolicy onClose={toggleModal} />}
            {isInforRoomModalOpen && (
                <InforRoom 
                    isOpen={isInforRoomModalOpen} 
                    onClose={toggleInfoModal} 
                    roomDetails={roomDetails} 
                />
            )}
        </>
    );
}

export default CardRoomBooking;