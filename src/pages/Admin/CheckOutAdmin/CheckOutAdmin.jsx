import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import adminApi from '../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../utils/auth';
import Select from 'react-select';
import AddCustomer from '../ManageCustomer/AddCustomer/AddCustomer';

const CheckOutAdmin = () => {
  const cartOptions = [
    {
      roomNo: 'GR-104',
      roomType: 'General Rooms',
      duration: '11/07/2024 - 11/08/2024',
      occupancy: { adults: 2, children: 0, infants: 0 },
      unitPrice: '1000',
      extraServices: '550.00 đ',
      totalPrice: '1,550.00 đ'
    },
    {
      roomNo: 'GR-105',
      roomType: 'General Rooms',
      duration: '11/07/2024 - 11/08/2024',
      occupancy: { adults: 2, children: 0, infants: 0 },
      unitPrice: '1000',
      extraServices: '500.00 đ',
      totalPrice: '1,500.00 đ'
    },
    {
      roomNo: 'GR-101',
      roomType: 'General Rooms',
      duration: '11/09/2024 - 11/13/2024',
      occupancy: { adults: 2, children: 0, infants: 0 },
      unitPrice: '1000',
      extraServices: '1,250.00 đ',
      totalPrice: '5,250.00 đ'
    }
  ];

  const [showDropdown, setShowDropdown] = useState(null); // Track which room's dropdown is open
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const accessToken = getAccessTokenFromLS();
  const [occupancy, setOccupancy] = useState(cartOptions.map(option => option.occupancy)); // Initialize occupancy for each room

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await adminApi.getAllCustomer(accessToken);
        setCustomers(response.data.data.map(customer => ({
          value: customer.id,
          label: `${customer.firstName} ${customer.lastName} - ${customer.email}`
        })));
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, [accessToken]);

  const handleConfirmGuests = (index) => {
    setShowDropdown(null); // Close dropdown
  };

  const handleOccupancyChange = (index, type, value) => {
    const newOccupancy = [...occupancy];
    newOccupancy[index] = {
      ...newOccupancy[index],
      [type]: value
    };
    setOccupancy(newOccupancy);
  };

  const handleAddCustomer = () => {
    setIsAddCustomerOpen(true);
  };

  const fetchData = () => {
    const fetchCustomers = async () => {
      try {
        const response = await adminApi.getAllCustomer(accessToken);
        setCustomers(response.data.data.map(customer => ({
          value: customer.id,
          label: `${customer.firstName} ${customer.lastName}`
        })));
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  };

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-60 overflow-x-auto">
        <div className="p-4 mt-20 min-h-screen">
          <div className="w-full flex justify-between items-center">
            <div className="font-semibold text-2xl font-inter">Thông tin đặt phòng</div>
          </div>
          <div className="mt-4 py-4 border border-[#aeaeae] bg-gray-50 shadow-lg rounded-lg">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left font-semibold">Mã Phòng</th>
                  <th className="py-2 px-4 border-b text-left font-semibold">Hạng Phòng</th>
                  <th className="py-2 px-4 border-b text-left font-semibold">Thời gian</th>
                  <th className="py-2 px-4 border-b text-left font-semibold">Số người</th>
                  <th className="py-2 px-4 border-b text-left font-semibold">Phụ phí</th>
                  <th className="py-2 px-4 border-b text-left font-semibold">Giá phòng</th>
                  <th className="py-2 px-4 border-b text-left">Tổng</th>
                  <th className="py-2 px-4 border-b text-left"></th>
                </tr>
              </thead>
              <tbody>
                {cartOptions.map((option, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-4 border-b">{option.roomNo}</td>
                    <td className="py-4 px-4 border-b">{option.roomType}</td>
                    <td className="py-4 px-4 border-b">{option.duration}</td>
                    <td className="py-4 px-4 border-b">
                      <button
                        className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                        onClick={() => setShowDropdown(index)}
                      >
                        {`${occupancy[index].adults} Adults, ${occupancy[index].children} Children, ${occupancy[index].infants} Infants`}
                      </button>
                      {showDropdown === index && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                          <div className="bg-[#F5E8D0] p-4 rounded shadow-xl">
                            <h4 className="text-lg font-semibold mb-2">Chọn số lượng khách</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <label className="flex flex-col font-semibold">
                                Người lớn:
                                <input
                                  type="number"
                                  value={occupancy[index].adults}
                                  onChange={(e) => handleOccupancyChange(index, 'adults', Number(e.target.value))}
                                  min="1"
                                  className="mt-1 border border-gray-300 rounded p-1"
                                />
                              </label>
                              <label className="flex flex-col font-semibold">
                                Trẻ em:
                                <input
                                  type="number"
                                  value={occupancy[index].children}
                                  onChange={(e) => handleOccupancyChange(index, 'children', Number(e.target.value))}
                                  min="0"
                                  className="mt-1 border border-gray-300 rounded p-1"
                                />
                              </label>
                              <label className="flex flex-col font-semibold">
                                Trẻ sơ sinh:
                                <input
                                  type="number"
                                  value={occupancy[index].infants}
                                  onChange={(e) => handleOccupancyChange(index, 'infants', Number(e.target.value))}
                                  min="0"
                                  max="3"
                                  className="mt-1 border border-gray-300 rounded p-1"
                                />
                              </label>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <button
                                className="bg-yellow-500 font-semibold text-white py-1 px-2 rounded hover:bg-yellow-600"
                                onClick={() => handleConfirmGuests(index)}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="ml-2 text-white bg-gray-500 font-semibold py-1 px-2 rounded hover:bg-gray-600"
                                onClick={() => setShowDropdown(null)}
                              >
                                Đóng
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 border-b">{option.unitPrice} đ</td>
                    <td className="py-4 px-4 border-b">{option.extraServices}</td>
                    <td className="py-4 px-4 border-b">{option.totalPrice}</td>
                    <td className="py-4 px-4 border-b">
                      <div className="flex space-x-2">
                        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                          Delete
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                          Services
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full mt-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-2xl font-inter">Khách hàng</div>
              <button
                onClick={handleAddCustomer}
                className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
              >
                Thêm mới khách hàng
              </button>
            </div>
            <div className="mt-4 p-4 border border-[#aeaeae] bg-gray-50 shadow-lg rounded-lg">
              <label className="block font-semibold mb-2">Chọn khách hàng:</label>
              <Select
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                options={customers}
                placeholder="-- Chọn khách hàng --"
                className="w-full"
              />
            </div>
          </div>
          <div className='w-full mt-4'>
            <div className='flex justify-end'>
                <button className='px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold'>Thanh toán ngay</button>
            </div>
          </div>
        </div>
      </div>

      {/* AddCustomer Modal */}
      <AddCustomer
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        fetchData={fetchData}
      />
    </>
  );
};

export default CheckOutAdmin;