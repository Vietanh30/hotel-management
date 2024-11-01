import React, { useState } from 'react';
import Swal from 'sweetalert2';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AddNumberRoom = ({ isOpen, onClose, fetchData }) => {
    const accessToken = getAccessTokenFromLS();
    const [roomNumber, setRoomNumber] = useState('');
    const [capacity, setCapacity] = useState(''); // Mặc định chọn 1
    const [location, setLocation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!roomNumber || !capacity || !location) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const newNumberRoom = {
            "roomNumber": Number(roomNumber),
            "capacity": Number(capacity),
            "location": location
        };

        try {
            const response = await adminApi.addNumberRoom(accessToken, newNumberRoom);
            console.log(response);
            if (response.data.statusCode === 201) {
                Swal.fire('Thành công!', 'Số phòng đã được thêm thành công.', 'success');
                fetchData(); // Tải lại dữ liệu
                onClose(); // Đóng modal
                // Reset state variables
                setRoomNumber('');
                setCapacity(1); // Reset về giá trị mặc định
                setLocation('');
            }
        } catch (error) {
            console.error("Error adding number room:", error);
            Swal.fire('Lỗi!', error.response.data.description, 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <h2 className="text-xl font-bold mb-4">Thêm số phòng</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input 
                            type="number"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            placeholder="Số phòng"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="Tầng"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Địa điểm"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold"
                        >
                            Thêm số phòng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNumberRoom;