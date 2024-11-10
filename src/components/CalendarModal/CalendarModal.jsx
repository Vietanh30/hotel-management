import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import path from "../../constants/path";

const CalendarModal = ({ isOpen, onClose, idTypeRoom }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Set default dates when the modal opens
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      setStartDate(today);
      setEndDate(tomorrow);

      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearchCalender = () => {
    const start = startDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    const end = endDate.toISOString().split('T')[0];
    const roomNumber = 1; // Default room number
    navigate(`${path.booking}?startDate=${start}&endDate=${end}&roomNumber=${roomNumber}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-4 rounded-lg max-w-5xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="flex justify-between px-5 items-start my-6">
          <div className="text-3xl font-bold">Khách sạn Nhóm 7</div>
          <div className="">
            {startDate && (
              <p className="">
                <strong>Ngày nhận:</strong> {startDate.toLocaleDateString("vi-VN")}
              </p>
            )}
            {endDate && (
              <p className="mt-2">
                <strong>Ngày trả:</strong> {endDate.toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
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
            calendarClassName="rounded-lg"
            dayClassName={() =>
              "min-w-32 min-h-14 text-center transition duration-200 ease-in-out"
            }
            renderDayContents={(day, date) => {
              return (
                <span className="custom-day-class">{day}</span>
              );
            }}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div className="flex justify-between p-5 custom-header-class">
                <div className="font-inter text-2xl uppercase font-bold">
                  {date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
                </div>
                <div>
                  <button
                    onClick={decreaseMonth}
                    className="focus:outline-none px-2 py-1 rounded hover:bg-[#f2a900] font-inter text-xl"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button
                    onClick={increaseMonth}
                    className="focus:outline-none px-2 py-1 rounded hover:bg-[#f2a900] font-inter text-xl"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            )}
          />
        </div>
        <div className="flex justify-end w-full px-4">
          <button
            onClick={handleSearchCalender}
            className="mt-4 bg-[#f2a900] text-white py-2 px-4 rounded hover:bg-[#f2a900] focus:bg-[#f2a900] font-inter font-semibold"
          >
            Đặt Phòng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;