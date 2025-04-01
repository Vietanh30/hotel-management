import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import CardService from "../../../../components/CardService/CardService";
import InforService from "../../../../components/CardService/InforService/InforService";
import BookingModal from './BookingModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import userApi from '../../../../api/userApi';

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
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceCategories = async () => {
            try {
                const response = await userApi.getAllService();
                if (response.data.statusCode === 200) {
                    setServiceCategories(response.data.data);
                    setActiveTab(response.data.data[0]?.name);
                }
            } catch (err) {
                setError("Failed to load service categories");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceCategories();
    }, []);

    const handleServiceClick = (serviceDetails) => {
        setSelectedService(serviceDetails);
        setIsModalOpen(true);
    };

    const handleServiceBooking = (serviceDetails) => {
        setSelectedService(serviceDetails);
        setIsBookingModalOpen(true);
    };

    const handleTabClick = (categoryName) => {
        setActiveTab(categoryName);
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextButton />,
        prevArrow: <PrevButton />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Error state
    }

    const activeCategory = serviceCategories.find(category => category.name === activeTab);
    const hasServices = activeCategory?.serviceHotelList.length > 0;

    return (
        <>
            <div className="flex flex-col gap-8">
                <div className="flex flex-wrap justify-start gap-5 mb-4 px-4">
                    {serviceCategories.map((category) => (
                        <button
                            key={category.id}
                            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${activeTab === category.name ? 'bg-[#f2a900] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            onClick={() => handleTabClick(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {activeTab && (
                    <div className="relative">
                        {hasServices ? (
                            <Slider {...settings}>
                                {activeCategory.serviceHotelList.map((service, index) => (
                                    <div key={index}>
                                        <CardService
                                            serviceDetails={service}
                                            onServiceClick={handleServiceClick}
                                            onServiceBooking={handleServiceBooking}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <div className="text-center text-gray-500 font-semibold text-xl">
                                Chưa có dữ liệu
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Service Details Modal */}
            <InforService
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceDetails={selectedService}
            />

            {/* Service Booking Modal */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                serviceDetails={selectedService}
            />
        </>
    );
}

export default ServiceRoom;