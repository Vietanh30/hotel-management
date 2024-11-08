import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function FilterRoom() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    
    const [checkInDate, setCheckInDate] = useState(params.get("startDate") || "");
    const [checkOutDate, setCheckOutDate] = useState(params.get("endDate") || "");
    const [numberRoom, setNumberRoom] = useState(params.get("roomNumber") || "");

    const handleCheckInChange = (e) => {
        const selectedDate = e.target.value;
        setCheckInDate(selectedDate);
        // Đặt ngày trả phòng tối thiểu là ngày nhận phòng + 1
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(nextDay.toISOString().split("T")[0]);
    };

    const handleSearch = () => {
        navigate(`/booking?startDate=${checkInDate}&endDate=${checkOutDate}&roomNumber=${numberRoom}`);
    };

    return (
        <>
            <div className="grid grid-cols-7 gap-3 items-end justify-center">
                <div className='col-span-2'>
                    <label htmlFor="check-in" className="font-inter font-semibold mb-2 text-sm">
                        Ngày nhận phòng
                    </label>
                    <div className="flex items-center mt-3">
                        <input
                            id="check-in"
                            type="date"
                            min={new Date().toISOString().split("T")[0]} // Ngày nhỏ nhất là hôm nay
                            value={checkInDate}
                            onChange={handleCheckInChange}
                            className="border w-full bg-[#f5f5f5] rounded text-sm p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                </div>
                <div className='col-span-2'>
                    <label htmlFor="check-out" className="font-inter font-semibold mb-2 text-sm">
                        Ngày trả phòng
                    </label>
                    <div className="flex items-center mt-3">
                        <input
                            id="check-out"
                            type="date"
                            min={checkInDate ? new Date(new Date(checkInDate).getTime() + 86400000).toISOString().split("T")[0] : ""}
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="border w-full bg-[#f5f5f5] rounded text-sm p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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