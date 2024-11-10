import React, { useState } from 'react';

const ServiceChange = ({ services, selectedServices, onServiceSelect, onClose, onConfirm }) => {
  const [selectedServiceIds, setSelectedServiceIds] = useState(
    selectedServices.map((service) => service.id)
  );

  const handleServiceSelect = (service) => {
    const isSelected = selectedServiceIds.includes(service.id);
    if (isSelected) {
      setSelectedServiceIds(selectedServiceIds.filter((id) => id !== service.id));
      onServiceSelect(service, false);
    } else {
      setSelectedServiceIds([...selectedServiceIds, service.id]);
      onServiceSelect(service, true);
    }
  };

  const handleConfirm = () => {
    // Gọi hàm xác nhận và truyền lại các dịch vụ đã chọn
    const confirmedServices = services.filter((service) => selectedServiceIds.includes(service.id));
    onConfirm(confirmedServices);
    onClose(); // Đóng modal sau khi xác nhận
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#F5E8D0] p-4 rounded shadow-xl">
        <h4 className="text-lg font-semibold mb-2">Chọn dịch vụ</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`border border-gray-300 p-4 rounded-lg cursor-pointer ${
                selectedServiceIds.includes(service.id)
                  ? 'bg-yellow-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="font-bold">{service.name}</div>
              <div className="text-gray-600 font-semibold">
                {service.price.toLocaleString('vi-VN')} đ
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-yellow-500 font-semibold text-white py-1 px-2 rounded hover:bg-yellow-600"
            onClick={handleConfirm} // Thêm hàm xác nhận
          >
            Xác nhận
          </button>
          <button
            className="ml-2 bg-gray-500 font-semibold text-white py-1 px-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceChange;