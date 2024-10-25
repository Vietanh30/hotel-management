
function RoomPolicy({ onClose }) {
    return ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-inter">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <div className="text-2xl font-bold">Thông tin phòng</div>
                <hr className="my-4" />
                <div className="font-bold">Chính sách hoàn hủy</div>
                <p className="my-2">Nếu hủy, thay đổi hoặc không đến, khách sẽ trả toàn bộ giá trị tiền đặt phòng.</p>
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
                <p>
                    Email xác nhận dịch vụ sẽ được gửi đến địa chỉ email Quý khách cung cấp. Khách sạn sẽ không chịu trách nhiệm trong trường hợp email gửi không thành công do địa chỉ email điền không đúng, email bị đánh dấu spam, hoặc hòm thư quá tải... Bất cứ yêu cầu hủy hoặc thay đổi booking nào cũng phải được thông báo với Khách sạn qua email.
                </p>
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                        onClick={onClose} // Sử dụng hàm từ props
                        aria-label="Đóng chính sách phòng"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}


export default RoomPolicy;