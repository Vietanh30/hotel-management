import React, { useRef } from 'react';
import imgInputFile from '../../assets/TypeRoom/imgInputFile.svg'
function ImageUploader({ onImagesChange }) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        onImagesChange(newImages); // Gửi danh sách hình ảnh đã chọn về component cha
    };

    return (
        <div className="image-uploader">
            <div
                className="border-2 border-dashed border-gray-400 rounded-lg py-3 text-center cursor-pointer"
                onClick={handleClick}
            >
                <div className="flex justify-center mb-4">
                    <img src={imgInputFile} alt="Tải lên" />
                </div>
                <p className="text-yellow-500 font-semibold mb-2">
                    Nhấp để chọn ảnh
                </p>
                <p className="text-gray-500">Chỉ cho phép tệp jpeg, png, svg</p>
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept=".jpeg,.jpg,.png,.svg"
                    multiple
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}

export default ImageUploader;