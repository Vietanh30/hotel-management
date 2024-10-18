import { useState } from "react";
import breakfast from "../../../assets/Booking/breakfast.svg";
import fee from "../../../assets/Booking/fee.svg";

function Collapse({ isOpen, onSelectRoom, onOpenModal }) {
    return (
        <div
            className={`transition-all duration-900 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        >
            <hr className="mt-6 mb-8" />
            <div className="w-full grid grid-cols-7 gap-5 items-center">
                <div className="col-span-3">
                    <div className="text-red-400 font-inter font-semibold">Tên phòng</div>
                    <div className="flex gap-3 mt-4 items-center">
                        <img className="w-5 h-5" src={breakfast} alt="" />
                        <div className="font-inter font-semibold">Đã bao gồm ăn sáng</div>
                    </div>
                    <div className="flex gap-3 mt-4 items-center">
                        <img className="w-5 h-5" src={fee} alt="" />
                        <div className="font-inter font-semibold">Không hoàn trả phí khi hủy phòng</div>
                    </div>
                    <div className="mt-3 font-inter font-semibold text-yellow-400 text-sm cursor-pointer" onClick={onOpenModal}>
                        Xem chi tiết
                    </div>
                </div>
                <div className="col-span-1 font-inter">2 Người lớn</div>
                <div className="col-span-2">
                    <span className="text-[#FFC745] font-medium text-3xl">1,367,000</span>{" "} / đêm
                </div>
                <div className="col-span-1">
                    <select className="px-4 py-3 border-2 border-gray-300 rounded bg-white relative focus:outline-none focus:ring focus:ring-yellow-500">
                        <option value="">1 Phòng</option>
                        <option value="">2 Phòng</option>
                        <option value="">3 Phòng</option>
                        <option value="">4 Phòng</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Collapse;