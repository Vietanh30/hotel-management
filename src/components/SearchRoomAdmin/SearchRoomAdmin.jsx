// SearchRoomAdmin.js
import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import { getAccessTokenFromLS } from '../../utils/auth';
import { formatDateToYYYYMMDD } from '../../utils/utils';

function SearchRoomAdmin({ onDateChange, onSearchResults }) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(0);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    setCheckInDate(formatDateToYYYYMMDD(today));
    setCheckOutDate(formatDateToYYYYMMDD(tomorrow));

    const fetchRoomTypes = async () => {
      try {
        const accessToken = getAccessTokenFromLS();
        const response = await adminApi.getAllTypeRoom(accessToken);
        setRoomTypes(response.data.data);
        
        // Gọi hàm tìm kiếm sau khi nhận được loại phòng
        await searchRooms(accessToken, today, tomorrow);
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    };

    fetchRoomTypes();
  }, []);

  const searchRooms = async (accessToken, today, tomorrow) => {
    const params = {
      checkInDate: formatDateToYYYYMMDD(today),
      checkOutDate: formatDateToYYYYMMDD(tomorrow),
      adults: adultCount,
      children: childrenCount,
      rankId: selectedRoomType,
    };

    try {
      const response = await adminApi.searchRoomAdmin(accessToken, params);
      console.log('Search Results:', response.data);
      onSearchResults(response.data);
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  const handleCheckInChange = (e) => {
    const newCheckInDate = e.target.value;
    setCheckInDate(newCheckInDate);
    if (newCheckInDate >= checkOutDate) {
      const nextDate = new Date(newCheckInDate);
      nextDate.setDate(nextDate.getDate() + 1);
      setCheckOutDate(nextDate.toISOString().split('T')[0]);
    }
  };

  const handleCheckOutChange = (e) => {
    setCheckOutDate(e.target.value);
  };

  const handleSearch = async () => {
    const accessToken = getAccessTokenFromLS();
    const params = {
      checkInDate,
      checkOutDate,
      adults: adultCount,
      children: childrenCount,
      rankId: selectedRoomType,
    };
  
    onDateChange({ startDate: checkInDate, endDate: checkOutDate });
  
    try {
      const response = await adminApi.searchRoomAdmin(accessToken, params);
      console.log('Search Results:', response.data);
      
      onSearchResults(response.data);
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  return (
    <div className="p-4 rounded border border-[#aeaeae] bg-gray-50">
      <h2 className="text-lg font-bold mb-4">Tìm kiếm phòng</h2>
      <form>
        <div className="mb-4 grid grid-cols-3 gap-1 items-center">
          <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="check-in">
            Ngày nhận phòng
          </label>
          <input
            className="border rounded p-2 col-span-2 w-full datepicker text-sm"
            type="date"
            id="check-in"
            value={checkInDate}
            onChange={handleCheckInChange}
          />
        </div>
        <div className="mb-4 grid grid-cols-3 gap-1 items-center">
          <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="check-out">
            Ngày trả phòng
          </label>
          <input
            className="border rounded p-2 col-span-2 w-full datepicker text-sm"
            type="date"
            id="check-out"
            value={checkOutDate}
            onChange={handleCheckOutChange}
          />
        </div>
        <div className="mb-4 grid grid-cols-3 gap-1 items-center">
          <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="adult-occupancy">
            Số lượng người lớn
          </label>
          <input
            className="border rounded p-2 col-span-2 w-full"
            type="number"
            id="adult-occupancy"
            value={adultCount}
            onChange={(e) => setAdultCount(e.target.value)}
          />
        </div>
        <div className="mb-4 grid grid-cols-3 gap-1 items-center">
          <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="children-occupancy">
            Số lượng trẻ em
          </label>
          <input
            className="border rounded p-2 col-span-2 w-full"
            type="number"
            id="children-occupancy"
            value={childrenCount}
            onChange={(e) => setChildrenCount(e.target.value)}
          />
        </div>
        <div className="mb-4 grid grid-cols-3 gap-1 items-center">
          <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="room-type">
            Hạng phòng
          </label>
          <select
            className="border rounded p-2 col-span-2 w-full"
            id="room-type"
            value={selectedRoomType}
            onChange={(e) => {
              setSelectedRoomType(e.target.value);
              // Gọi lại tìm kiếm khi thay đổi hạng phòng
              searchRooms(getAccessTokenFromLS(), new Date(checkInDate), new Date(checkOutDate));
            }}
          >
            <option value="0">Tất cả các loại</option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
          type="button"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </form>
    </div>
  );
}

export default SearchRoomAdmin;