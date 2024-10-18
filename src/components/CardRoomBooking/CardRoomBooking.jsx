import { useState } from "react";
import imgRoom from "../../assets/Booking/Room.svg";
import area from "../../assets/Home/area.svg";
import bed from "../../assets/Home/bed.svg";
import Collapse from "./Collapse/Collapse";

function CardRoomBooking() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
        setIsDropdownOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="grid grid-cols-2">
                <div className="col-span-1 w-11/12">
                    <img className="rounded w-full" src={imgRoom} alt="" />
                </div>
                <div className="col-span-1 flex flex-col justify-between">
                    <div>
                        <div className="font-inter font-semibold text-xl">Deluxe King</div>
                        <div className="mt-3">
                            <div className="flex gap-5 mt-3">
                                <div className="flex gap-2 items-center">
                                    <img className="w-6 h-auto" src={area} alt="Area" />
                                    <div className="font-inter font-medium text-sm">32m²</div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img className="w-6 h-auto" src={bed} alt="Bed" />
                                    <div className="font-inter font-medium text-sm">1 giường đôi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 items-center">
                        <div className="font-bold">
                            Chỉ từ{" "}
                            <span className="text-[#FFC745] font-medium text-3xl">1,367,000</span>{" "} / đêm
                        </div>
                        <div className="relative">
                            <button
                                className="bg-yellow-500 text-nowrap hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                Chọn phòng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Collapse isOpen={isDropdownOpen} onSelectRoom={handleSelectRoom} onOpenModal={handleOpenModal} />
            {selectedRoom && (
                <div className="mt-4">
                    <div className="font-bold">Phòng đã chọn:</div>
                    <div className="font-inter font-semibold text-base">{selectedRoom}</div>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-inter">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                        <div className="text-2xl font-bold font-inter">Thông tin phòng</div>
                        <hr className="my-4" />
                        <div className="font-bold font-inter">Chính sách hoàn hủy</div>
                        <div className="my-2">Nếu hủy, thay đổi hoặc không đến, khách sẽ trả toàn bộ giá trị tiền đặt phòng.</div>
                        <div className="mb-2">
                            <span className="font-bold">Thanh toán:</span> Thanh toán toàn bộ giá trị tiền đặt phòng.
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Nhận phòng:</span> 14:00
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Trả phòng:</span> 12:00
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Phụ thu người lớn:</span> 380,000 VNĐ /đêm
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Phụ thu trẻ em:</span> 188,000 VNĐ /đêm
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Chính sách khác:</span>
                        </div>
                        <div className="">
                            Email xác nhận dịch vụ sẽ được gửi đến địa chỉ email Quý khách cung cấp. Khách sạn sẽ không chịu trách nhiệm trong trường hợp email gửi không thành công do địa chỉ email điền không đúng, email bị đánh dấu spam, hoặc hòm thư quá tải... Bất cứ yêu cầu hủy hoặc thay đổi booking nào cũng phải được thông báo với Khách sạn qua email.
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                                onClick={handleCloseModal}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CardRoomBooking;