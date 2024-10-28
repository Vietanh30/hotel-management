import React, { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import bedsData from '../../../../utils/beds.json';
import amenitiesData from '../../../../utils/amenity.json';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';

function AddRoom({ isOpen, onClose }) {
    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [selectedBeds, setSelectedBeds] = useState([]); // Lưu trữ tất cả các giường đã chọn
    const [amenities, setAmenities] = useState([]);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    const handleAdd = () => {
        const selectedAmenitiesIds = amenities.map(amenity => amenity.value);
        console.log({
            name,
            bed: selectedBeds.map(bed => bed.value), // Gửi tất cả các giường đã chọn
            area,
            amenityId: selectedAmenitiesIds,
            description,
            images,
        });
        onClose();
    };

    const handleImagesChange = (newImages) => {
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    const handleRemoveImage = (imageName) => {
        setImages(images.filter(image => image.name !== imageName));
    };

    const bedOptions = bedsData.map(bed => ({ value: bed.id, label: bed.name }));
    const amenityOptions = amenitiesData.map(amenity => ({ value: amenity.id, label: amenity.name }));

    const handleBedChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedBeds(prev => [...prev, selectedOption]); // Thêm giường đã chọn vào danh sách
        }
    };

    const handleRemoveBed = (bedToRemove) => {
        setSelectedBeds(prev => prev.filter(bed => bed.value !== bedToRemove.value)); // Xóa giường khỏi danh sách
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <div className="text-xl font-inter font-semibold mb-4">Thêm phòng</div>
                <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-3">
                        <input 
                            type="text" 
                            placeholder="Tên phòng" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <input 
                            type="number" 
                            placeholder="Diện tích" 
                            value={area} 
                            onChange={(e) => setArea(e.target.value)} 
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        
                        <Select
                            options={bedOptions}
                            onChange={handleBedChange}
                            placeholder="Chọn giường"
                            className="mb-4"
                            isClearable={true}
                        />
                        
                        <div className={selectedBeds? 'mb-4': ''}>
                            <div className="mt-2 flex items-center gap-1 w-full flex-wrap">
                                {selectedBeds.map((bed, index) => (
                                    <li key={index} className="flex justify-between items-center gap-2 border rounded px-2 py-1 text-sm">
                                        <span>{bed.label}</span>
                                        <button onClick={() => handleRemoveBed(bed)} className="text-red-600">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </li>
                                ))}
                            </div>
                        </div>

                        <Select
                            isMulti
                            options={amenityOptions}
                            value={amenities}
                            onChange={setAmenities}
                            placeholder="Chọn tiện ích"
                            className="mb-4"
                        />
                        
                        <textarea 
                            placeholder="Mô tả" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4 resize-none h-24"
                        />
                    </div>
                    <div className="col-span-2">
                        <ImageUploader onImagesChange={handleImagesChange} />
                        <div className="mt-5">
                            <h2 className="font-semibold text-xl">Hình đã chọn:</h2>
                            {images.length > 0 ? (
                                <ul className="mt-2 overflow-y-auto max-h-80">
                                    {images.map((image, index) => (
                                        <li key={index} className="flex items-center justify-between mt-2 p-3 border rounded-lg bg-[#FAFAFA]">
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="w-16 h-auto object-cover mr-2 rounded-lg"
                                            />
                                            <div className="w-full px-3">
                                                <div className="flex mb-2 items-center justify-between">
                                                    <span>{image.name}</span>
                                                    <button
                                                        className="text-white rounded-full ml-2 px-2 py-1 bg-red-600 text-xs"
                                                        onClick={() => handleRemoveImage(image.name)}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} size="xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 mt-2">Chưa có hình nào được chọn.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button 
                        onClick={handleAdd} 
                        className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                    >
                        Thêm phòng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRoom;