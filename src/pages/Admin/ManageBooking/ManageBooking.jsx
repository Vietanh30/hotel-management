import Sidebar from "../Sidebar/Sidebar";

function ManageBooking() {
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-60">
        <div className="p-4 mt-20">
        <div className="w-full flex justify-between items-center">
            <div className="font-semibold text-2xl font-inter">
                Quản lý đặt phòng
            </div>
           
        </div>
          <div className="flex">
            <div className="w-1/2 p-4">
              <div className="booking-form">
                <h2 className="text-lg font-bold mb-4">Biểu mẫu đặt phòng</h2>
                <form>
                  <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="check-in">
                      Ngày nhận phòng
                    </label>
                    <input
                      className="border rounded p-2 w-full datepicker"
                      type="text"
                      id="check-in"
                      defaultValue="07-11-2024"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="check-out">
                      Ngày trả phòng
                    </label>
                    <input
                      className="border rounded p-2 w-full datepicker"
                      type="text"
                      id="check-out"
                      defaultValue="10-11-2024"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="hotel-name">
                      Tên khách sạn
                    </label>
                    <select className="border rounded p-2 w-full" id="hotel-name">
                      <option value="The Hotel Prime">The Hotel Prime</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="occupancy">
                      Số lượng
                    </label>
                    <input
                      className="border rounded p-2 w-full"
                      type="text"
                      id="occupancy"
                      defaultValue="1 Người lớn, 1 Phòng"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="room-type">
                      Loại phòng
                    </label>
                    <select className="border rounded p-2 w-full" id="room-type">
                      <option value="All Types">Tất cả các loại</option>
                    </select>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    type="button"
                  >
                    Tìm kiếm
                  </button>
                </form>
              </div>
            </div>
            <div className="w-1/2 p-4">
              <div className="booking-calender">
                <h2 className="text-lg font-bold mb-4">Lịch đặt phòng</h2>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  <div className="font-bold">CN</div>
                  <div className="font-bold">T2</div>
                  <div className="font-bold">T3</div>
                  <div className="font-bold">T4</div>
                  <div className="font-bold">T5</div>
                  <div className="font-bold">T6</div>
                  <div className="font-bold">T7</div>
                  {/* Các ngày trong tháng */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageBooking;