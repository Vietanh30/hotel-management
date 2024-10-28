import React from 'react';

function TypeRoomDetail({ isOpen, onClose, roomType }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">Chi tiết hạng phòng</h2>
                <div className="space-y-2">
                    <p><strong className="font-medium">Tên:</strong> {roomType?.name}</p>
                    <p><strong className="font-medium">Diện tích:</strong> {roomType?.area}</p>
                    <p><strong className="font-medium">Số giường:</strong> {roomType?.beds}</p>
                    <p><strong className="font-medium">Tiện ích:</strong> {roomType?.amenities}</p>
                    <p><strong className="font-medium">Mô tả:</strong> {roomType?.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TypeRoomDetail;
