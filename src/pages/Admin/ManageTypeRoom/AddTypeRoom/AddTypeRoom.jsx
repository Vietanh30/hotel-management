import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import Swal from 'sweetalert2';  // Import SweetAlert2

function AddTypeRoom({ isOpen, onClose, fetchData }) {
    const accessToken = getAccessTokenFromLS();
    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [selectedBeds, setSelectedBeds] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [bedOptions, setBedOptions] = useState([]);
    const [amenityOptions, setAmenityOptions] = useState([]);

    const fetchDataTypeRoom = async () => {
        try {
            const responseBed = await adminApi.getAllBed(accessToken);
            const responseAmenity = await adminApi.getAllAmenity(accessToken);
            setBedOptions(responseBed.data.data);
            setAmenityOptions(responseAmenity.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchDataTypeRoom();
    }, [accessToken]);

    const handleAdd = async () => {
        // Kiểm tra các trường bắt buộc
        if (!name || !area || !description || selectedBeds.length === 0 || images.length === 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Tính toán lại số lượng giường
        const bedCounts = selectedBeds.reduce((acc, bed) => {
            const [id, quantity] = bed.split(':');
            acc[id] = (acc[id] || 0) + parseInt(quantity);
            return acc;
        }, {});

        const bedData = Object.entries(bedCounts).map(([id, quantity]) => `${id}:${quantity}`);
        const selectedAmenitiesIds = amenities.map(amenity => amenity.value);

        // Tạo FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('bed', bedData); // Chuyển đổi mảng thành chuỗi JSON
        formData.append('area', area);
        formData.append('amenityId', selectedAmenitiesIds); // Chuyển đổi mảng thành chuỗi JSON
        formData.append('description', description);

        // Thêm hình ảnh vào FormData
        images.forEach(image => {
            formData.append('images', image.file);
        });

        try {
            // Gọi API
            console.log(images);
            
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }            
            const responeAddTypeRoom = await adminApi.addTypeRoom(accessToken, formData);
            console.log(responeAddTypeRoom);
            if(responeAddTypeRoom.data.statusCode === 201){
                fetchData()
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Hạng phòng đã được thêm thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                onClose(); // Đóng modal sau khi thêm thành công
                    // Reset state variables to clear inputs
                setName('');
                setArea('');
                setSelectedBeds([]);
                setAmenities([]);
                setDescription('');
                setImages([]);
            }
        } catch (error) {
            console.error('Error adding type room:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi thêm hạng phòng. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleImagesChange = (newImages, files) => {
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    const handleRemoveImage = (imageName) => {
        setImages(images.filter(image => image.name !== imageName));
    };

    const handleBedChange = (selectedOption) => {
        if (selectedOption) {
            const existingBed = selectedBeds.find(bed => bed.startsWith(selectedOption.value));
            if (existingBed) {
                const [id, quantity] = existingBed.split(':');
                const newQuantity = parseInt(quantity) + 1;
                const updatedBed = `${id}:${newQuantity}`;
                setSelectedBeds(prev => prev.map(bed => (bed === existingBed ? updatedBed : bed)));
            } else {
                const bedWithQuantity = `${selectedOption.value}:1`;
                setSelectedBeds(prev => [...prev, bedWithQuantity]);
            }
        }
    };

    const handleRemoveBed = (bedToRemove) => {
        setSelectedBeds(prev => prev.filter(bed => bed !== bedToRemove));
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
                <div className="text-xl font-inter font-semibold mb-4">Thêm hạng phòng</div>
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
                            options={bedOptions.map(bed => ({ value: bed.id, label: bed.name, quantity: 1 }))}
                            onChange={handleBedChange}
                            placeholder="Chọn giường"
                            className="mb-4"
                            isClearable={true}
                        />
                        <div className={selectedBeds.length > 0 ? 'mb-4' : 'hidden'}>
                            <div className="mt-2 flex items-center gap-1 w-full flex-wrap">
                                {selectedBeds.map((bed, index) => {
                                    const [id, quantity] = bed.split(':');
                                    const bedOption = bedOptions.find(option => option.id.toString() === id);
                                    return (
                                        <li key={index} className="flex justify-between items-center gap-2 border rounded px-2 py-1 text-sm">
                                            <span>{bedOption ? `${bedOption.name} (${quantity})` : `Giường ID ${id} (Số lượng: ${quantity})`}</span>
                                            <button onClick={() => handleRemoveBed(bed)} className="text-red-600">
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </li>
                                    );
                                })}
                            </div>
                        </div>

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
                        <ImageUploader onImagesChange={handleImagesChange}  />
                        <div className="mt-5">
                            <h2 className="font-semibold text-xl">Hình đã chọn:</h2>
                            {images.length > 0 ? (
                                <ul className="mt-2 overflow-y-auto max-h-80">
                                    {images.map((image, index) => (
                                        <li key={index} className="flex items-center justify-between mt-2 p-3 border rounded-lg bg-[#FAFAFA]">
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="w-16 h-16 object-cover mr-2 rounded-lg"
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
                        Thêm hạng phòng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddTypeRoom;