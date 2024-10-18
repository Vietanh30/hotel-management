import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';

const CalendarModal = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg max-w-5xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="flex justify-between px-5 items-start my-6">
          <div className="text-3xl font-bold">Mường Thanh Luxury Nha Trang</div>
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
            // Tùy chỉnh tên các ngày trong tuần
            renderDayContents={(day, date) => {
                return (
                <span className="custom-day-class">{day}</span> // Thay đổi lớp ở đây
                );
            }}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                <div className="flex justify-between p-5 custom-header-class"> {/* Thay đổi lớp ở đây */}
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
            onClick={onClose}
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
