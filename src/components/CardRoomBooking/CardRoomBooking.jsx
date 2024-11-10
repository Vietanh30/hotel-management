import { useState, useRef, useCallback } from "react";
import area from "../../assets/Home/area.svg";
import bed from "../../assets/Home/bed.svg";
import Collapse from "./Collapse/Collapse";
import InforRoom from "../CardRoom/InforRoom/InforRoom";
import RoomPolicy from "../RoomPolicy/RoomPolicy";
import Slider from "react-slick"; 
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userApi from "../../api/userApi"; 

function CardRoomBooking({ typeRoom }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isRoomPolicyModalOpen, setIsRoomPolicyModalOpen] = useState(false);
    const [isInforRoomModalOpen, setIsInforRoomModalOpen] = useState(false);
    const [roomDetails, setRoomDetails] = useState(null);
    const [policyInfor, setPolicyInfor] = useState([]);
    const sliderRef = useRef(null);

    const handleSelectTypeRoom = useCallback((room) => {
        setSelectedRoom(room);
        setIsDropdownOpen(false);
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
    const toggleModal = () => setIsRoomPolicyModalOpen(prev => !prev);
    const toggleInfoModal = () => setIsInforRoomModalOpen(prev => !prev);

    const handleChooseRoom = async (idTypeRoom) => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
            return;
        }
        
        setIsDropdownOpen(true);
        try {
            const response = await userApi.getRoomById(idTypeRoom);
            if (response.data.statusCode === 200) {
                setRoomDetails(response.data.data);
                setPolicyInfor(response.data.data.policyList || []);
            } else {
                console.error("Failed to fetch room details:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching room details:", error);
        }
    };

    const handleOpenPolicyModal = useCallback((policyList) => {
        setPolicyInfor(policyList);
        toggleModal();
    }, []);

    const sliderSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
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
                    <div className="absolute top-1/2 transform -translate-y-1/2 -left-0 z-10">
                        <button
                            className="bg-[#f2a900] text-white font-semibold px-2 py-1 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
                            onClick={() => sliderRef.current.slickPrev()}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    </div>
                    <div className="absolute top-1/2 transform -translate-y-1/2 right-[54.2%] z-10">
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
                        <div className="font-inter font-semibold text-xl">{typeRoom.name}</div>
                        <div className="mt-3 flex gap-5">
                            <div className="flex gap-2 items-center">
                                <img className="w-6 h-auto" src={area} alt="Area" />
                                <div className="font-inter font-medium">{typeRoom.area} m²</div>
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
                            <span className="text-[#FFC745] font-medium text-3xl">{typeRoom.price.toLocaleString()} VNĐ</span> / đêm
                        </div>
                        <button
                            className="bg-yellow-500 text-nowrap hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded"
                            onClick={() => handleChooseRoom(typeRoom.id)}
                        >
                            Chọn phòng
                        </button>
                    </div>
                </div>
            </div>
            <Collapse 
                isOpen={isDropdownOpen} 
                rooms={roomDetails} 
                onOpenModal={handleOpenPolicyModal} 
            />
            {isRoomPolicyModalOpen && 
                <RoomPolicy 
                    onClose={toggleModal} 
                    policyList={policyInfor} 
                />
            }
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