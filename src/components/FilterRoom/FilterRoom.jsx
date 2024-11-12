import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS cho DatePicker

function FilterRoom() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    // Thiết lập giá trị mặc định
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [checkInDate, setCheckInDate] = useState(params.get("startDate") ? new Date(params.get("startDate")) : today);
    const [checkOutDate, setCheckOutDate] = useState(params.get("endDate") ? new Date(params.get("endDate")) : tomorrow);
    const [numberRoom, setNumberRoom] = useState(params.get("roomNumber") || "1");

    const handleCheckInChange = (date) => {
        setCheckInDate(date);
        // Đặt ngày trả phòng tối thiểu là ngày nhận phòng + 1
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(nextDay);
    };

    const handleSearch = () => {
        const formattedCheckInDate = `${checkInDate.getFullYear()}-${String(checkInDate.getMonth() + 1).padStart(2, '0')}-${String(checkInDate.getDate()).padStart(2, '0')}`;
        const formattedCheckOutDate = `${checkOutDate.getFullYear()}-${String(checkOutDate.getMonth() + 1).padStart(2, '0')}-${String(checkOutDate.getDate()).padStart(2, '0')}`;
        navigate(`/booking?startDate=${formattedCheckInDate}&endDate=${formattedCheckOutDate}&roomNumber=${numberRoom}`);
    };

    // Hàm chuyển đổi định dạng ngày
    const formatDateToDDMMYYYY = (date) => {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <div className="grid grid-cols-7 gap-3 items-end justify-center relative">
                <div className='col-span-2'>
                    <label htmlFor="check-in" className="font-inter font-semibold mb-2 text-sm">
                        Ngày nhận phòng
                    </label>
                    <div className="w-full mt-3 grid">
                        <DatePicker
                            selected={checkInDate}
                            onChange={handleCheckInChange}
                            minDate={today}
                            className="border w-full bg-[#f5f5f5] rounded text-sm p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            dateFormat="dd/MM/yyyy" // Định dạng hiển thị
                        />
                    </div>
                </div>
                <div className='col-span-2'>
                    <label htmlFor="check-out" className="font-inter font-semibold mb-2 text-sm">
                        Ngày trả phòng
                    </label>
                    <div className="w-full mt-3 grid">
                        <DatePicker
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            minDate={new Date(checkInDate.getTime() + 86400000)} // Ngày tối thiểu là ngày nhận phòng + 1
                            className="border w-full bg-[#f5f5f5] rounded text-sm p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            dateFormat="dd/MM/yyyy" // Định dạng hiển thị
                        />
                    </div>
                </div>
                <div className='col-span-3'>
                    <label htmlFor="room-count" className="font-inter font-semibold mb-2 text-sm">
                        Số phòng
                    </label>
                    <div className="flex gap-5 items-center mt-3">
                        <input
                            id="room-count"
                            placeholder="Nhập số phòng"
                            type="number"
                            value={numberRoom}
                            onChange={(e) => setNumberRoom(e.target.value)}
                            className="border bg-[#f5f5f5] rounded text-sm p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button 
                            className="bg-yellow-500 text-nowrap hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded"
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FilterRoom;