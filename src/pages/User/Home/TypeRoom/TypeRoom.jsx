import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import CardRoom from "../../../../components/CardRoom/CardRoom";
import InforRoom from "../../../../components/CardRoom/InforRoom/InforRoom";
import CalendarModal from "../../../../components/CalendarModal/CalendarModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import userApi from '../../../../api/userApi'; // Import the userApi

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
    const [roomTypeList, setRoomTypeList] = useState([]);
    const sliderRef = useRef(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State for CalendarModal
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await userApi.getAllTypeRoom();
                console.log(response)
                if(response.data.statusCode === 200) {
                    setRoomTypeList(response.data.data.content); // Assuming response.data contains the room details
                }
            } catch (err) {
                setError("Failed to load room types");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomTypes();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: roomTypeList.length < 3 ? roomTypeList.length : 3,
        slidesToScroll: 1,
        nextArrow: <NextButton />,
        prevArrow: <PrevButton />,
    };

    const handleCardClick = (roomDetails) => {
        setSelectedRoom(roomDetails);
        setIsModalOpen(true);
    };

    const handleOpenCalendar =(roomDetails) => {
        setIsCalendarOpen(true);
        setSelectedRoom(roomDetails);
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Error state
    }

    return ( 
        <>
            <div className="relative">
                <Slider ref={sliderRef} {...settings}>
                    {roomTypeList.map((roomDetails, index) => (
                        <div key={index}>
                            <CardRoom 
                                roomDetails={roomDetails}
                                onClick={() => handleCardClick(roomDetails)} 
                                onCalendarClick={() => handleOpenCalendar(roomDetails)} // Pass the idTypeRoom
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
                idTypeRoom={selectedRoom?.id} // Pass the idTypeRoom prop
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)} // Close calendar modal
            />
        </>
    );
}

export default TypeRoom;