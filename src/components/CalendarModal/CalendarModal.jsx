import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

const CalendarModal = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg max-w-5xl w-full">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold mb-4">Mường Thanh Luxury Nha Trang</div>
          {/* Hiển thị ngày đã chọn */}
          <div className="mt-2">
            {startDate && (
              <p className="text-sm">
                <strong>Ngày nhận:</strong> {startDate.toLocaleDateString("vi-VN")}
              </p>
            )}
            {endDate && (
              <p className="text-sm">
                <strong>Ngày trả:</strong> {endDate.toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <DatePicker
          locale={vi}
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            minDate={new Date()}
            inline
            className="w-full text-sm"
            calendarClassName="bg-gray-100 rounded-lg w-full" // Calendar container
            dayClassName={() =>
              "min-w-32 min-h-14 text-center hover:bg-[#f2a900] focus:bg-[#f2a900] transition duration-200 ease-in-out"
            }
            wrapperClassName="w-full"
            popperClassName="bg-white"
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
            }) => (
                <div className="flex justify-between p-5">
                <div className="font-inter text-3xl uppercase font-bold">{date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}</div>
                <div>
                    <button onClick={decreaseMonth} className="focus:outline-none px-2 py-1 rounded hover:bg-[#f2a900]">
                    {"<"}
                    </button>
                    <button onClick={increaseMonth} className="focus:outline-none px-2 py-1 rounded hover:bg-[#f2a900]">
                    {">"}
                    </button>
                    
                </div>    
              </div>
            )}
          />
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-[#f2a900] text-white py-2 px-4 rounded hover:bg-[#f2a900] focus:bg-[#f2a900] w-full"
        >
          Đặt Phòng
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;
