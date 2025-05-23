import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import Swal from 'sweetalert2';

function EditService({ isOpen, onClose, initialData, fetchData }) {
    const accessToken = getAccessTokenFromLS();
    const [idService, setIdService] = useState(initialData?.id || '');
    const [name, setName] = useState(initialData?.name || '');
    const [location, setLocation] = useState(initialData?.location || '');
    const [capacity, setCapacity] = useState(initialData?.capacity || '');
    const [openTime, setOpenTime] = useState(initialData?.openTime || '');
    const [closeTime, setCloseTime] = useState(initialData?.closeTime || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price || '');
    const [image, setImage] = useState(initialData?.image ? {
        name: 'Hình 1',
        url: initialData.image,
    } : null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(initialData?.category ? {
        value: initialData.category.id,
        label: initialData.category.name
    } : null);

    const fetchDataCategories = async () => {
        try {
            const response = await adminApi.getAllCategory(accessToken);
            setCategoryOptions(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchDataCategories();
    }, [accessToken]);

    useEffect(() => {
        if (initialData) {
            setIdService(initialData.id || '');
            setName(initialData.name || '');
            setLocation(initialData.location || '');
            setCapacity(initialData.capacity || '');
            setOpenTime(initialData.openTime || '');
            setCloseTime(initialData.closeTime || '');
            setDescription(initialData.description || '');
            setPrice(initialData.price || '');
            setImage(initialData.image ? {
                name: 'Hình 1',
                url: initialData.image,
            } : null);
            setSelectedCategory(initialData.category ? {
                value: initialData.category.id,
                label: initialData.category.name
            } : null);
        }
    }, [initialData]);

    const handleEdit = async () => {
        if (!name || !location || !capacity || !openTime || !closeTime || !description || !selectedCategory || image.length === 0 || !price) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', location);
        formData.append('capacity', capacity);
        formData.append('startTime', openTime);
        formData.append('endTime', closeTime);
        formData.append('description', description);
        formData.append('categoryId', selectedCategory.value);
        formData.append('price', price);
        // Chỉ thêm hình ảnh nếu có tệp hình ảnh mới
        if (image && image.file) {
            formData.append('image', image.file); // Chỉ thêm hình ảnh nếu có
        }
        formData.append('serviceHotelId', idService);

        try {
            console.log(image.file)
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            const response = await adminApi.editService(accessToken, formData);
            console.log(response)
            fetchData();
            Swal.fire({
                title: 'Thành công!',
                text: 'Dịch vụ đã được chỉnh sửa thành công.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            onClose();
        } catch (error) {
            console.log(error)
            console.error('Error editing service:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi chỉnh sửa dịch vụ. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleImageChange = (newImages) => {
        console.log(newImages);
        setImage(newImages[0])
    };

    const handleRemoveImage = () => {
        setImage(null); // Xóa hình ảnh
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
                <div className="text-xl font-semibold mb-4">Chỉnh sửa dịch vụ</div>
                <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-3">
                        <input
                            type="text"
                            placeholder="Tên dịch vụ"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Vị trí"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Sức chứa"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Giá"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <input
                            type="time"
                            placeholder="Thời gian bắt đầu"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <input
                            type="time"
                            placeholder="Thời gian kết thúc"
                            value={closeTime}
                            onChange={(e) => setCloseTime(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <Select
                            options={categoryOptions.map(category => ({ value: category.id, label: category.name }))}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="Chọn danh mục"
                            className="mb-4"
                            isClearable={true}
                        />
                        <textarea
                            placeholder="Mô tả"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4 resize-none h-24"
                        />
                    </div>
                    <div className="col-span-2">
                        <ImageUploader onImagesChange={handleImageChange} />
                        <div className="mt-5">
                            <h2 className="font-semibold text-xl">Hình đã chọn:</h2>
                            {image ? (
                                <div className="flex items-center justify-between mt-2 p-3 border rounded-lg bg-[#FAFAFA]">
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="w-16 h-16 object-cover mr-2 rounded-lg"
                                    />
                                    <div className="w-full px-3">
                                        <div className="flex mb-2 items-center justify-between">
                                            <span className='line-clamp-1'>{image.name}</span>
                                            <button
                                                className="text-white rounded-full ml-2 px-2 py-1 bg-red-600 text-xs"
                                                onClick={handleRemoveImage}
                                            >
                                                <FontAwesomeIcon icon={faTimes} size="xs" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                        Chỉnh sửa dịch vụ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditService;