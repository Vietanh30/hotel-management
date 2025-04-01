import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import Swal from 'sweetalert2';

function EditServiceRoom({ isOpen, onClose, initialData, fetchData }) {
    const accessToken = getAccessTokenFromLS();
    const [serviceRoomId, setServiceRoomId] = useState(initialData?.id || '');
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [image, setImage] = useState(initialData?.icon ? {
        name: 'Icon',
        url: initialData.icon,
    } : null);

    useEffect(() => {
        if (initialData) {
            setServiceRoomId(initialData.id || '');
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setImage(initialData.icon ? {
                name: 'Icon',
                url: initialData.icon,
            } : null);
        }
    }, [initialData]);

    const handleEdit = async () => {
        if (!name || !description || !image) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('id', serviceRoomId);
        formData.append('name', name);
        formData.append('description', description);
        // Chỉ thêm hình ảnh nếu có tệp hình ảnh mới
        if (image && image.file) {
            formData.append('image', image.file);
        }

        try {
            const response = await adminApi.editServiceRoom(accessToken, formData);
            if (response.data.statusCode === 200) {
                fetchData();
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Dịch vụ phòng đã được chỉnh sửa thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                onClose();
            }
        } catch (error) {
            console.error('Error editing service room:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi chỉnh sửa dịch vụ phòng. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleImageChange = (newImages) => {
        setImage(newImages[0]);
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <div className="text-xl font-inter font-semibold mb-4">Chỉnh sửa dịch vụ phòng</div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <input
                            type="text"
                            placeholder="Tên dịch vụ phòng"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <textarea
                            placeholder="Mô tả"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4 resize-none h-24"
                        />
                    </div>
                    <div className="col-span-1">
                        <ImageUploader onImagesChange={handleImageChange} />
                        <div className="mt-5">
                            <h2 className="font-semibold text-lg">Biểu tượng hiện tại:</h2>
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
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditServiceRoom;