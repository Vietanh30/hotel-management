import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function InforTypeRoomAdmin({ isOpen, onClose, roomDetails }) {
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

    if (!isOpen || !roomDetails) return null;

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
                        <img className='w-full' src={roomDetails.image} alt={roomDetails.name} />
                    </div>
                    <div className="col-span-4 p-4 font-inter">
                        <div className="text-xl font-bold">{roomDetails.name}</div>
                        <div className='w-full my-3 border-b border-b-gray-400' />
                        <div className="mt-2 text-sm">{roomDetails.description}</div>
                        <div className="mt-4 text-sm">
                            <h3 className="font-semibold mb-2">Tiện nghi của phòng:</h3>
                            <div className="grid grid-cols-2 gap-2 pl-5">
                                {roomDetails.amenities.map((amenity) => (
                                    <div key={amenity.id} className="flex items-center my-1">
                                        <img src={amenity.icon || ''} alt={amenity.name} className="mr-2 w-6 h-6" />
                                        <span>{amenity.name}</span>
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

export default InforTypeRoomAdmin;