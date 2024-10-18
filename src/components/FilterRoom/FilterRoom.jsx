import React from "react";

function FilterRoom() {
  return (
    <>
      <div className="grid grid-cols-11 gap-3 items-end justify-center">
        <div className='col-span-2'>
        <label htmlFor="location" className="font-inter font-semibold mb-2 text-sm">
            Địa điểm
          </label>
          <div className="flex items-center mt-3">
            <input
              id="location"
              type="text"
              className="border w-full bg-[#f5f5f5] rounded text-sm p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Nhập địa điểm"
            />
          </div>
        </div>
        <div className='col-span-2'>
            <label htmlFor="check-in" className="font-inter font-semibold mb-2 text-sm">
            Ngày nhận phòng
            </label>
            <div className="flex items-center mt-3">
            <input
                id="check-in"
                type="date"
                className="border w-full bg-[#f5f5f5] rounded text-sm p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            </div>
        </div>
        <div className='col-span-2'>
            <label htmlFor="check-in" className="font-inter font-semibold mb-2 text-sm">
            Ngày nhận phòng
            </label>
            <div className="flex items-center mt-3">
            <input
                id="check-in"
                type="date"
                className="border w-full bg-[#f5f5f5] rounded text-sm p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            </div>
        </div>
        <div className='col-span-2'>
        <label htmlFor="room-count" className="font-inter font-semibold mb-2 text-sm">
            Số phòng
          </label>
          <div className="flex items-center mt-3">
            <select
              id="room-count"
              className="border bg-[#f5f5f5] rounded text-sm p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Chọn số phòng</option>
              <option value="1">1 Phòng</option>
              <option value="2">2 Phòng</option>
              <option value="3">3 Phòng</option>
            </select>
          </div>
        </div>
        <div className="col-span-2">
        <label htmlFor="promo-code" className="font-inter font-semibold mb-2 text-sm">
            Mã khuyến mại/Voucher
          </label>
          <div className="flex items-center mt-3">
            <input
              id="promo-code"
              type="text"
              className="border bg-[#f5f5f5] rounded text-sm p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Nhập mã khuyến mại/Voucher"
            />
          </div>
        </div>
        <div className="col-span-1 text-right">
          <button className="bg-yellow-500 text-nowrap hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded">
            Tìm kiếm
          </button>
        </div>
      </div>
    </>
  );
}

export default FilterRoom;