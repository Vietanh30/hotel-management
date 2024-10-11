import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import CardRoom from "../../../../components/CardRoom/CardRoom";
import InforRoom from "../../../../components/CardRoom/InforRoom/InforRoom";
import CalendarModal from "../../../../components/CalendarModal/CalendarModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const NextButton = ({ onClick }) => (
    <button 
        className="absolute z-10 top-1/2 -right-3 transform -translate-y-1/2 bg-[#f2a900] text-white font-semibold px-5 py-4 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
        onClick={onClick}
    >
        <FontAwesomeIcon icon={faArrowRight} />
    </button>
);

const PrevButton = ({ onClick }) => (
    <button 
        className="absolute z-10 top-1/2 -left-3 transform -translate-y-1/2 bg-[#f2a900] text-white font-semibold px-5 py-4 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
        onClick={onClick}
    >
        <FontAwesomeIcon icon={faArrowLeft} />
    </button>
);

function TypeRoom() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const sliderRef = useRef(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State for CalendarModal

    const roomDetailsList = [
        {
            title: "Deluxe King",
            description: "Được thiết kế sang trọng và hoàn hảo với các tiện nghi hiện đại...",
            price: "1,367,100 VND",
            area: "32m²",
            amenities: [
                "Tủ quần áo", "Máy sấy tóc", "Ga trải giường, gối",
                "Phòng có bồn tắm", "Phòng không hút thuốc",
                "Wifi", "Vòi sen", "Đồ phòng tắm",
                "Quầy bar mini", "Khăn tắm", "Điều hòa",
                "Điện thoại", "Đèn bàn", "Bàn làm việc",
            ],
        },
        {
            title: "Deluxe King",
            description: "Được thiết kế sang trọng và hoàn hảo với các tiện nghi hiện đại...",
            price: "1,367,100 VND",
            area: "32m²",
            amenities: [
                "Tủ quần áo", "Máy sấy tóc", "Ga trải giường, gối",
                "Phòng có bồn tắm", "Phòng không hút thuốc",
                "Wifi", "Vòi sen", "Đồ phòng tắm",
                "Quầy bar mini", "Khăn tắm", "Điều hòa",
                "Điện thoại", "Đèn bàn", "Bàn làm việc",
            ],
        },
        {
            title: "Deluxe King",
            description: "Được thiết kế sang trọng và hoàn hảo với các tiện nghi hiện đại...",
            price: "1,367,100 VND",
            area: "32m²",
            amenities: [
                "Tủ quần áo", "Máy sấy tóc", "Ga trải giường, gối",
                "Phòng có bồn tắm", "Phòng không hút thuốc",
                "Wifi", "Vòi sen", "Đồ phòng tắm",
                "Quầy bar mini", "Khăn tắm", "Điều hòa",
                "Điện thoại", "Đèn bàn", "Bàn làm việc",
            ],
        },
        // Thêm nhiều phòng nếu cần
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: roomDetailsList.length < 3 ? roomDetailsList.length : 3,
        slidesToScroll: 1,
        nextArrow: <NextButton />,
        prevArrow: <PrevButton />,
    };

    const handleCardClick = (roomDetails) => {
        setSelectedRoom(roomDetails);
        setIsModalOpen(true);
    };

    // Function to open the CalendarModal
    const handleOpenCalendar = () => {
        setIsCalendarOpen(true);
    };

    return ( 
        <>
            <div className="relative">
                <Slider ref={sliderRef} {...settings}>
                    {roomDetailsList.map((roomDetails, index) => (
                        <div key={index}>
                            <CardRoom 
                                roomDetails={roomDetails}
                                onClick={() => handleCardClick(roomDetails)} 
                                onCalendarClick={handleOpenCalendar} // Pass the calendar click handler
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <InforRoom
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                roomDetails={selectedRoom}
            />
            
            <CalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)} // Close calendar modal
            />
        </>
    );
}

export default TypeRoom;