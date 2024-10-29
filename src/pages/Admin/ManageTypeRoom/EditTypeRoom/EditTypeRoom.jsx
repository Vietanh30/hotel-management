import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import Swal from 'sweetalert2';

function EditTypeRoom({ isOpen, onClose, initialData, fetchData }) { 
    const accessToken = getAccessTokenFromLS();
    const [idTypeRoom, setIdTypeRoom] = useState(initialData?.id || '');
    const [name, setName] = useState(initialData?.name || '');
    const [area, setArea] = useState(initialData?.area || '');
    const [selectedBeds, setSelectedBeds] = useState(initialData?.bed?.map(bed =>({
        value: bed.id, label: bed.name
    })) || []);
    const [amenities, setAmenities] = useState(initialData?.amenity?.map(amenity => ({
        value: amenity.id,
        label: amenity.name
    })) || []);
    const [description, setDescription] = useState(initialData?.description || '');
    const [images, setImages] = useState(
        initialData?.images?.map((image, index) => ({
            name: `Hình ${index + 1}`,
            url: image.path,
            id: image.id
        })) || []
    );
    const [bedOptions, setBedOptions] = useState([]);
    const [amenityOptions, setAmenityOptions] = useState([]);

    const fetchDataTypeRoom = async () => {
        try {
            const [responseBed, responseAmenity] = await Promise.all([
                adminApi.getAllBed(accessToken),
                adminApi.getAllAmenity(accessToken),
            ]);
            setBedOptions(responseBed.data.data);
            setAmenityOptions(responseAmenity.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchDataTypeRoom();
    }, [accessToken]);

    useEffect(() => {
        if (initialData) {
            setIdTypeRoom(initialData.id || '');
            setName(initialData.name || '');
            setArea(initialData.area || '');
            setSelectedBeds(initialData.bed || []);
            setAmenities(initialData.amenity?.map(amenity => ({
                value: amenity.id,
                label: amenity.name
            })) || []);
            setDescription(initialData.description || '');
            setImages(initialData.images?.map((img, index) => ({
                name: `Hình ${index + 1}`,
                url: img.path,
                id: img.id
            })) || []);
        }
    }, [initialData]);

    const handleEdit = async () => {
        if (!name || !area || !description || selectedBeds.length === 0 || images.length === 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const bedData = selectedBeds.map(bed => `${bed.bedId}:${bed.quantity}`);
        const selectedAmenitiesIds = amenities.map(amenity => amenity.value);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('bed', bedData);
        formData.append('area', area);
        formData.append('amenityId', selectedAmenitiesIds);
        formData.append('description', description);

        // Find new images that are not already in initialData.images
        const newImages = images.filter(
            img => !initialData.images.some(initImg => initImg.path === img.url)
        );
        // Append images to formData based on whether there are new images
        if (newImages.length > 0) {
            newImages.forEach(image => formData.append('images', image.file));
        }
        formData.append('rankId', idTypeRoom);
        formData.append('imageId', images.map(image => image.id));
        try {
            
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            await adminApi.editTypeRoom(accessToken, formData);
            fetchData()
            Swal.fire({
                title: 'Thành công!',
                text: 'Hạng phòng đã được chỉnh sửa thành công.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            onClose();
        } catch (error) {
            console.error('Error editing type room:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi chỉnh sửa hạng phòng. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleImagesChange = (newImages) => {
        setImages(prevImages => [...prevImages, ...newImages]);

    };

    const handleRemoveImage = (imageName) => {
        setImages(images.filter(image => image.name !== imageName));
    };

    const handleBedChange = (selectedOption) => {
    
        if (selectedOption) {
            // Check the structure of selectedOption
            
            // Find the index of the existing bed based on the value
            const existingBedIndex = selectedBeds.findIndex(bed => {
                return bed.bedId === selectedOption.value;
            });
    
            if (existingBedIndex > -1) {
                // If the bed already exists, increment the quantity
                const updatedBed = {
                    ...selectedBeds[existingBedIndex],
                    quantity: selectedBeds[existingBedIndex].quantity + 1
                };    
                setSelectedBeds(prev => {
                    const newSelectedBeds = [...prev];
                    newSelectedBeds[existingBedIndex] = updatedBed; // Update the existing bed
                    return newSelectedBeds;
                });
            } else {
                // If it's a new bed, create a new entry
                const bedName = bedOptions.find(bed => bed.id === selectedOption.value)?.name || 'Không rõ';
                const newBed = { 
                    bedId: selectedOption.value, 
                    quantity: 1, 
                    name: bedName 
                };
                setSelectedBeds(prev => [...prev, newBed]);
            }
        }
    };

    const handleRemoveBed = (bedToRemove) => {
        setSelectedBeds(prev => prev.filter(bed => bed.bedId !== bedToRemove.bedId));
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
                <div className="text-xl font-semibold mb-4">Chỉnh sửa hạng phòng</div>
                <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-3">
                        <input 
                            type="text" 
                            placeholder="Tên hạng phòng" 
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
                            options={bedOptions.map(bed => ({ value: bed.id, label: bed.name }))}
                            onChange={handleBedChange}
                            placeholder="Chọn giường"
                            className="mb-4"
                            isClearable={true}
                        />
                        
                        {selectedBeds.length > 0 && (
                            <div className="mb-4">
                                <div className="mt-2 flex items-center gap-1 w-full flex-wrap">
                                    {selectedBeds.map((bed) => (
                                        <li key={`${bed.bedId}-${bed.quantity}`} className="flex justify-between items-center gap-2 border rounded px-2 py-1 text-sm">
                                            <span>{`${bed.name} (${bed.quantity})`}</span>
                                            <button onClick={() => handleRemoveBed(bed)} className="text-red-600">
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </li>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Select
                            isMulti
                            options={amenityOptions.map(amenity => ({ value: amenity.id, label: amenity.name }))}
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
                                                src={image.url}  // Sử dụng image.url để hiển thị
                                                alt={image.name}
                                                className="w-16 h-16 object-cover mr-2 rounded-lg"
                                            />
                                            <div className="w-full px-3">
                                                <div className="flex mb-2 items-center justify-between">
                                                    <span className='line-clamp-1'>{image.name}</span>
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
                        onClick={handleEdit} 
                        className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                    >
                        Chỉnh sửa hạng phòng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditTypeRoom;