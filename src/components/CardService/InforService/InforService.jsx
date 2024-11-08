import React, { useEffect, useRef } from 'react';
import poolService from "../../../assets/Home/poolService.svg"; // Keep this if you want a default image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const InforService = ({ isOpen, onClose, serviceDetails }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={modalRef} className="bg-white rounded-lg max-w-screen-xl w-full relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-600"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="grid grid-cols-12">
                    <div className="col-span-8">
                        <img className='w-full' src={serviceDetails.image || poolService} alt="Hồ bơi" />
                    </div>
                    <div className="col-span-4 p-4 font-garamond">
                        <div className="text-2xl font-bold">{serviceDetails.name}</div>
                        <div className='w-full my-3 border-b border-b-gray-400' />
                        <div className="mt-2">Mô tả: {serviceDetails.description}</div>
                        <div className="mt-4 flex items-center gap-5">
                            <div className="font-bold text-xl">Vị trí:</div>
                            <div className='text-lg'>{serviceDetails.location}</div>
                        </div>
                        <div className="mt-2 flex gap-5">
                            <div className="font-semibold text-xl">Giờ mở cửa:</div>
                            <div className='text-lg'>{serviceDetails.startTime} - {serviceDetails.endTime}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InforService;