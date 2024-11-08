import { useState, useRef } from "react";
import area from "../../assets/Home/area.svg";
import bed from "../../assets/Home/bed.svg";
import Collapse from "./Collapse/Collapse";
import InforRoom from "../CardRoom/InforRoom/InforRoom";
import RoomPolicy from "../RoomPolicy/RoomPolicy";
import Slider from "react-slick"; // Import slider
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userApi from "../../api/userApi"; // Đảm bảo đường dẫn đúng

function CardRoomBooking({ typeRoom }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isRoomPolicyModalOpen, setIsRoomPolicyModalOpen] = useState(false);
    const [isInforRoomModalOpen, setIsInforRoomModalOpen] = useState(false);
    const [roomDetails, setRoomDetails] = useState(null); // State để lưu thông tin phòng

    // Slider reference
    const sliderRef = useRef(null);

    const handleSelectTypeRoom = (typeRoom) => {
        setSelectedRoom(typeRoom);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const toggleModal = () => setIsRoomPolicyModalOpen((prev) => !prev);
    const toggleInfoModal = () => setIsInforRoomModalOpen((prev) => !prev);

    const handleChooseRoom = async (idTypeRoom) => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false); // Đóng dropdown
            return
        }
        setIsDropdownOpen(true); // Mở dropdown để hiển thị thông tin
        try {
            const response = await userApi.getRoomById(idTypeRoom);
            console.log(response);
            if (response.data.statusCode === 200) {
                // Đóng dropdown nếu đã mở

                setRoomDetails(response.data.data); // Lưu thông tin phòng từ API

                // Chờ một chút trước khi mở lại dropdown để đảm bảo hoạt động mượt mà
                // setTimeout(() => {
                // }, 100);
            }
        } catch (error) {
            console.error("Error fetching room details:", error);
            // Xử lý lỗi nếu cần
        }
    };

    // Slider settings
    const sliderSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <>
            <div className="relative grid grid-cols-2">
                <div className="col-span-1 w-11/12">
                    <Slider ref={sliderRef} {...sliderSettings}>
                        {typeRoom.image.map((img, index) => (
                            <div className="relative" key={index}>
                                <img className="relative rounded w-full h-96" src={img} alt={`Room ${index + 1}`} />
                            </div>
                        ))}
                    </Slider>
                    <div className="absolute top-1/2 transform -translate-y-1/2 -left-6 z-10">
                        <button
                            className="bg-[#f2a900] text-white font-semibold px-2 py-1 items-center rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
                            onClick={() => sliderRef.current.slickPrev()}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    </div>
                    <div className="absolute top-1/2 transform -translate-y-1/2 right-[53%] z-10">
                        <button
                            className="bg-[#f2a900] text-white font-semibold px-2 py-1 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
                            onClick={() => sliderRef.current.slickNext()}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>
                <div className="col-span-1 flex flex-col justify-between">
                    <div>
                        <div className="font-inter font-semibold text-xl">{typeRoom.title}</div>
                        <div className="mt-3">
                            <div className="flex gap-5 mt-3">
                                <div className="flex gap-2 items-center">
                                    <img className="w-6 h-auto" src={area} alt="Area" />
                                    <div className="font-inter font-medium">{typeRoom.area}m²</div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img className="w-6 h-auto" src={bed} alt="Bed" />
                                    <div className="font-inter font-medium">
                                        {typeRoom.bed.map((bed, index) => (
                                            <span className="mr-2" key={index}>
                                                {bed.quantity} {bed.name}
                                            </span>
                                        ))}
                                    </div>
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
                            onClick={() => handleChooseRoom(typeRoom.id)} // Gọi hàm khi nhấn nút
                        >
                            Chọn phòng
                        </button>
                    </div>
                </div>
            </div>
            <Collapse 
                isOpen={isDropdownOpen} 
                rooms={roomDetails} // Truyền thông tin phòng vào Collapse
                onSelectTypeRoom={handleSelectTypeRoom} 
                onOpenModal={toggleModal} 
            />
            {isRoomPolicyModalOpen && <RoomPolicy onClose={toggleModal} />}
            {isInforRoomModalOpen && (
                <InforRoom 
                    isOpen={isInforRoomModalOpen} 
                    onClose={toggleInfoModal} 
                    roomDetails={roomDetails} // Truyền thông tin phòng vào modal
                />
            )}
        </>
    );
}

export default CardRoomBooking;