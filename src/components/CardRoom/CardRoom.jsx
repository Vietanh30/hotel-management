import React from "react";
import room from "../../assets/Home/roomtype.svg";
import area from "../../assets/Home/area.svg";
import bed from "../../assets/Home/bed.svg";

function CardRoom({ roomDetails, onClick, onCalendarClick }) {
  return (
    <div className="px-4">
      <div className="bg-white cursor-pointer hover:shadow-lg rounded-lg overflow-hidden border">
        <div className="relative group">
          <img
            src={room}
            onClick={onClick} // Trigger the onClick function passed as prop
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt="Room Type"
          />
        </div>
        <div className="p-4">
          <div className="text-xl font-semibold font-inter text-stroke">
            {roomDetails.title}
          </div>
          <div className="flex gap-5 mt-3">
            <div className="flex gap-2 items-center">
              <img className="w-6 h-auto" src={area} alt="Area" />
              <div className="font-inter font-medium text-sm">32m²</div>
            </div>
            <div className="flex gap-2 items-center">
              <img className="w-6 h-auto" src={bed} alt="Bed" />
              <div className="font-inter font-medium text-sm">
                1 giường đôi
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4 items-center">
            <div className="font-bold">
              Chỉ từ{" "}
              <span className="text-[#FFC745] font-medium text-3xl">
                1,367,000
              </span>{" "}
              / đêm
            </div>
            <button
              onClick={onCalendarClick} // Use the prop to open the calendar modal
              className="bg-[#002864] font-inter font-semibold text-white py-2 px-4 rounded-lg hover:bg-[#f2a900] transition"
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardRoom;