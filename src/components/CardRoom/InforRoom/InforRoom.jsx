import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import room from "../../../assets/Home/roomtype.svg";
import wardrobeImage from "../../../assets/ServiceRoom/wardrobe.svg";
import hairDryerImage from "../../../assets/ServiceRoom/hair-dryer.svg";
import beddingImage from "../../../assets/ServiceRoom/bedding.svg";
import bathtubImage from "../../../assets/ServiceRoom/minibar.svg";
import noSmokingImage from "../../../assets/ServiceRoom/no-smoking.svg";
import wifiImage from "../../../assets/ServiceRoom/wifi.svg";
import showerImage from "../../../assets/ServiceRoom/shower.svg";
import bathroomItemsImage from "../../../assets/ServiceRoom/bathroom-items.svg";
import minibarImage from "../../../assets/ServiceRoom/minibar.svg";
import towelImage from "../../../assets/ServiceRoom/towel.svg";
import acImage from "../../../assets/ServiceRoom/minibar.svg";
import phoneImage from "../../../assets/ServiceRoom/phone.svg";
import deskLampImage from "../../../assets/ServiceRoom/desk-lamp.svg";
import deskImage from "../../../assets/ServiceRoom/desk.svg";

const amenitiesImages = {
    "Tủ quần áo": wardrobeImage,
    "Máy sấy tóc": hairDryerImage,
    "Ga trải giường, gối": beddingImage,
    "Phòng có bồn tắm": bathtubImage,
    "Phòng không hút thuốc": noSmokingImage,
    "Wifi": wifiImage,
    "Vòi sen": showerImage,
    "Đồ phòng tắm": bathroomItemsImage,
    "Quầy bar mini": minibarImage,
    "Khăn tắm": towelImage,
    "Điều hòa": acImage,
    "Điện thoại": phoneImage,
    "Đèn bàn": deskLampImage,
    "Bàn làm việc": deskImage,
};

function InforRoom({ isOpen, onClose, roomDetails }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div 
                className="bg-white rounded-lg max-w-screen-xl w-full relative"
                ref={modalRef}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-600"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                
                <div className="grid grid-cols-12">
                    <div className="col-span-8">
                        <img className='w-full' src={room} alt="" />
                    </div>
                    <div className="col-span-4 p-4 font-inter">
                        <div className="text-xl font-bold">{roomDetails.title}</div>
                        <div className='w-full my-3 border-b border-b-gray-400' />
                        <div className="mt-2 text-sm">{roomDetails.description}</div>
                        <div className="mt-4 text-sm">
                            <h3 className="font-semibold mb-2">Tiện nghi của phòng:</h3>
                            <div className="grid grid-cols-2 gap-2 pl-5">
                                {roomDetails.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center my-1">
                                        <img src={amenitiesImages[amenity]} alt={amenity} className="mr-2 w-6 h-6" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InforRoom;