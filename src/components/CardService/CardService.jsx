import React from "react";
import poolService from "../../assets/Home/poolService.svg";
import posititon from "../../assets/Home/posititon.svg";
import timeOpen from "../../assets/Home/timeOpen.svg";

function CardService({ serviceDetails, onServiceClick, onServiceBooking }) {
    // Check if the service has a price greater than 0
    const hasPrice = serviceDetails.price > 0;

    // Handle booking button click - prevent event propagation to avoid triggering onServiceClick
    const handleBookingClick = (e) => {
        e.stopPropagation();
        onServiceBooking(serviceDetails);
    };

    return (
        <div className="px-4">
            <div className="bg-white cursor-pointer hover:shadow-lg rounded-lg overflow-hidden border">
                <div className="relative group" onClick={() => onServiceClick(serviceDetails)}>
                    <img
                        src={serviceDetails.image || poolService}
                        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                        alt={serviceDetails.name}
                    />
                </div>
                <div className="p-4">
                    <div className="text-xl font-semibold font-inter text-stroke">{serviceDetails.name}</div>

                    {/* Show location only if it exists */}
                    {serviceDetails.location && (
                        <div className="grid grid-cols-12 mt-4">
                            <div className="col-span-4 flex gap-1 items-center">
                                <img className="w-5 h-full" src={posititon} alt="Vị trí" />
                                <div className="font-inter font-semibold">Vị trí</div>
                            </div>
                            <div className="col-span-7">{serviceDetails.location}</div>
                        </div>
                    )}

                    {/* Show time only if both startTime and endTime exist */}
                    {serviceDetails.startTime && serviceDetails.endTime && (
                        <div className="grid grid-cols-12 mt-4">
                            <div className="col-span-4 flex gap-1 items-center">
                                <img className="w-5 h-full" src={timeOpen} alt="Giờ mở cửa" />
                                <div className="font-inter font-semibold">Thời gian</div>
                            </div>
                            <div className="col-span-7">{`${serviceDetails.startTime} - ${serviceDetails.endTime}`}</div>
                        </div>
                    )}

                    {/* Show price if it exists */}
                    {hasPrice && (
                        <div className="grid grid-cols-12 mt-4">
                            <div className="col-span-4 flex gap-1 items-center">
                                <div className="font-inter font-semibold">Giá</div>
                            </div>
                            <div className="col-span-7 font-semibold text-[#f2a900]">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(serviceDetails.price)}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-12 mt-4">
                        <div className="col-span-12">
                            {hasPrice ? (
                                <button
                                    className="w-full bg-[#f2a900] text-white text-lg py-2 rounded-lg font-inter hover:bg-yellow-600 transition"
                                    onClick={handleBookingClick}
                                >
                                    Đặt dịch vụ ngay
                                </button>
                            ) : (
                                <button
                                    className="w-full border-[#000] border-2 text-lg py-2 rounded-lg font-inter text-[#828282] hover:bg-[#f2a900] hover:text-white hover:border-[#f2a900] transition"
                                    onClick={() => onServiceClick(serviceDetails)}
                                >
                                    Xem chi tiết
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardService;