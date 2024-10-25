import BackToTopButton from "../../../components/BackToTopButton/BackToTopButton";
import CardRoomBooking from "../../../components/CardRoomBooking/CardRoomBooking";
import FilterRoom from "../../../components/FilterRoom/FilterRoom";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";

function Booking() {
  return (
    <>
      <Header />

      <div className="w-full bg-[#E5E5E5] py-8 relative">
        <div
          className="container sticky mx-auto bg-white rounded px-4 py-6 top-0 z-10 shadow-lg left-[6.5%]"
        >
          <FilterRoom />
        </div>
        <div className="container mx-auto bg-white rounded p-4 mt-8">
          <div className="font-inter py-3">
            <span className="font-semibold">Vui lòng chọn phòng</span> (Có 6 loại phòng theo tìm kiếm)
          </div>
        </div>
        <div className="container mx-auto mt-8 relative">
          <div className="grid grid-cols-10 gap-5">
            <div className="col-span-7">
              <div className="col-span-1 w-full bg-white rounded p-4 mb-8">
                <CardRoomBooking />
              </div>
             
            </div>
            <div
              className="col-span-3"
            >
              <div className="w-full bg-white rounded p-4 sticky top-[20%]">
                <div className="font-inter text-lg font-semibold">Thông tin đặt phòng</div>
                <hr className="my-4" />
                <div className="font-inter font-semibold text-base">
                  <div>Khách sạn nhóm 7</div>
                  <div className="mt-2">
                    18/10/2024 - 20/10/2024 <span className="font-medium">(3 ngày 2 đêm)</span>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="font-inter font-semibold text-base">
                  <div>Thông tin phòng</div>
                  <div></div>
                </div>
                <hr className="my-4" />
                <div className="font-inter flex justify-between font-semibold text-base">
                  <div>Tổng cộng</div>
                  <div className="text-yellow-500">2,734,200 VNĐ</div>
                </div>
                <div className="mt-3">
                  <button className="w-full bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 py-3 text-white font-inter font-semibold rounded">
                    Đặt ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default Booking;