import React from "react";
import area from "../../assets/Home/area.svg";
import bed from "../../assets/Home/bed.svg";

function CardRoom({ roomDetails, onClick, onCalendarClick }) {
  return (
    <div className="px-4">
      <div className="bg-white cursor-pointer hover:shadow-lg rounded-lg overflow-hidden border">
        <div className="relative group">
          <img
            src={roomDetails.image[0]}
            onClick={onClick} // Trigger the onClick function passed as prop
            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
            alt="Room Type"
          />
        </div>
        <div className="p-4">
          <div className="text-xl font-semibold font-inter text-stroke">
            {roomDetails.name}
          </div>
          <div className="flex gap-5 mt-3">
            <div className="flex gap-2 items-center">
              <img className="w-6 h-auto" src={area} alt="Area" />
              <div className="font-inter font-medium text-sm">{roomDetails.area}m²</div>
            </div>
            <div className="flex gap-2 items-center">
              <img className="w-6 h-auto" src={bed} alt="Bed" />
              <div className="font-inter font-medium text-sm">
                {roomDetails.bed.map((bed, index) => (
                  <span key={index}>
                    {bed.quantity} {bed.name}
                    {index < roomDetails.bed.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4 items-center">
            <div className="font-bold">
              Chỉ từ{" "}
              <span className="text-[#FFC745] font-medium text-3xl">
                {roomDetails.price}
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