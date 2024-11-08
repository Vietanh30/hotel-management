import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from "../../utils/utils";
import { Tooltip as ReactTooltip } from 'react-tooltip';

const CalenderSearchRoomAdmin = ({ checkInDate, checkOutDate, results }) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const [startDate, setStartDate] = useState(checkInDate ? new Date(checkInDate) : today);
    const [endDate, setEndDate] = useState(checkOutDate ? new Date(checkOutDate) : tomorrow);
    useEffect(() => {
      setStartDate(checkInDate ? new Date(checkInDate) : today);
      setEndDate(checkOutDate ? new Date(checkOutDate) : tomorrow);
    }, [checkInDate, checkOutDate]);

  const getTooltipContent = (date) => {
    const formattedDate = formatDate(date);
    const result = results
    if (result) {
        return `Total Rooms: ${result.totalRoom}, Available: ${result.availableRoom}, Booked: ${result.bookedRoom}`;
    }
    return 'No data available';
  };

  return (
    <div className="flex justify-center">
      <div className="relative">
        <DatePicker
          showDateSelector="none"
          locale={vi}
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          className="w-full text-sm"
          calendarClassName="rounded-lg"
          dayClassName={() =>
            "min-w-28 min-h-20 text-center transition duration-200 ease-in-out border-none hover:bg-blue-200"
          }
          renderDayContents={(day, date) => (
            <span
              data-tip={getTooltipContent(date)} // Gán tooltip cho ngày
              data-for={`tooltip-${day}`}
              className="custom-day-class"
            >
              {day}
            </span>
          )}
          renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
            <div className="flex justify-between p-5 custom-header-class">
              <div className="font-inter text-2xl uppercase font-bold text-center">
                {formatDate(date)}
              </div>
              <div>
                <button
                  onClick={decreaseMonth}
                  className="focus:outline-none px-2 py-1 rounded font-inter text-xl"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  onClick={increaseMonth}
                  className="focus:outline-none px-2 py-1 rounded font-inter text-xl"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          )}
        />
        <ReactTooltip place="top" effect="solid" />
      </div>
    </div>
  );
};

export default CalenderSearchRoomAdmin;