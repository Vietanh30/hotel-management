import React, { useState } from 'react';
import Slider from 'react-slick';
import CardService from "../../../../components/CardService/CardService";
import InforService from "../../../../components/CardService/InforService/InforService";
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

function ServiceRoom() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const servicesList = [
        {
            title: "Hồ bơi",
            description: "Bể bơi ngoài trời với diện tích 400m2...",
            position: "Tầng 4",
            openingHours: "06h00 - 22h00",
        },
        {
            title: "Hồ bơi",
            description: "Bể bơi ngoài trời với diện tích 400m2...",
            position: "Tầng 4",
            openingHours: "06h00 - 22h00",
        },
        {
            title: "Hồ bơi",
            description: "Bể bơi ngoài trời với diện tích 400m2...",
            position: "Tầng 4",
            openingHours: "06h00 - 22h00",
        },
        // Add more services as needed
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: servicesList.length < 3 ? servicesList.length : 3,
        slidesToScroll: 1,
        nextArrow: <NextButton />,
        prevArrow: <PrevButton />,
    };

    const handleServiceClick = (serviceDetails) => {
        setSelectedService(serviceDetails);
        setIsModalOpen(true);
    };

    return ( 
        <>
            <div className="relative">
                <Slider {...settings}>
                    {servicesList.map((serviceDetails, index) => (
                        <div key={index}>
                            <CardService 
                                onServiceClick={handleServiceClick} 
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <InforService
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceDetails={selectedService}
            />
        </>
    );
}

export default ServiceRoom;