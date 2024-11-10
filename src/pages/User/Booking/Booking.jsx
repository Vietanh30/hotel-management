import React, { useEffect, useState } from "react";
import BackToTopButton from "../../../components/BackToTopButton/BackToTopButton";
import CardRoomBooking from "../../../components/CardRoomBooking/CardRoomBooking";
import FilterRoom from "../../../components/FilterRoom/FilterRoom";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { useLocation } from "react-router-dom";
import userApi from "../../../api/userApi";
import Navbar from "../../../components/Navbar/Navbar";

function Booking() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const [typeRoom, setTypeRoom] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hàm gọi API
    const searchRoom = async (startDate, endDate, numberRoom) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userApi.searchRoom(startDate, endDate, numberRoom);
            console.log(response);
            setTypeRoom(response.data.data.content); // Giả sử API trả về danh sách phòng trong response.data
        } catch (err) {
            setError("Có lỗi xảy ra trong quá trình tìm kiếm phòng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const startDate = params.get("startDate");
        const endDate = params.get("endDate");
        const numberRoom = params.get("roomNumber");

        if (startDate && endDate && numberRoom) {
            searchRoom(startDate, endDate, numberRoom);
        }
        
        // Scroll to top on component mount
        window.scrollTo(0, 0);
    }, [search]); // Theo dõi thay đổi của search

    return (
        <>
            <Header />
            <Navbar />
            <div className="w-full bg-[#E5E5E5] py-8 relative">
                <div className="container sticky z-20 mx-auto bg-white rounded px-4 py-6 top-0 shadow-lg left-[6.5%]">
                    <FilterRoom />
                </div>
                <div className="container mx-auto bg-white rounded p-4 mt-8">
                    <div className="font-inter py-3">
                        <span className="font-semibold">Vui lòng chọn phòng</span> (Có {typeRoom.length} hạng phòng theo tìm kiếm)
                    </div>
                </div>
                <div className="container mx-auto mt-8 relative">
                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="grid grid-cols-10 gap-5">
                      <div  className="col-span-7 ">
                        {typeRoom.map((room, index) => (
                                <div className="w-full bg-white rounded p-4 mb-8" key={room.id}>
                                  <CardRoomBooking typeRoom={room} /> 
                                </div>
                              ))}
                          </div>
                        <div className="col-span-3 p-5 rounded bg-white h-fit">
                          <div className='font-inter font-medium text-xl'>
                              Yêu cầu đặt phòng của bạn
                          </div>
                          <hr className="my-4" />
                          <div>
                              <div className='font-inter font-semibold text-lg'>Khách sạn nhóm 7</div>
                              <div className='font-inter font-semibold mt-3 text-sm'>Nhận phòng: Thứ 4, 30/10/2024 từ 14:00</div>
                              <div className='font-inter font-semibold mt-3 text-sm'>Trả phòng: Thứ 6, 08/11/2024 cho đến 12:00</div>
                              <div className='font-inter font-semibold mt-3 text-sm'>(3 ngày 2 đêm)</div>
                              <div className='border-b border-dashed my-5 border-2'></div>
                              <div className='font-inter font-medium'>Thông tin phòng</div>
                              <div className='mt-3 font-inter text-sm font-light'>
                                  <span className='font-semibold'>Phòng 1: </span>Phòng Deluxe King Ocean Views
                              </div>
                              <div className='font-inter text-sm font-light'>
                                  <div className='mt-2'>FLASH DEAL _3D</div>
                                  <div className='mt-2'>Dành cho 1 Người lớn - 2 Trẻ em - 0 Em bé</div>
                                  <div className='mt-2'>Phụ thu trẻ em: 188,000 VNĐ /đêm</div>
                                  <div className='mt-2'>Giá phòng: 1,580,985 VNĐ</div>
                              </div>
                              <div className='mt-4 font-semibold font-inter text-end'>1,580,985 VNĐ</div>
                              <div className='my-4 border-b border-dashed'></div>
                          </div>
                          <div className='flex justify-between'>
                              <div className='font-inter font-semibold'>Giá phòng</div>
                              <div className='font-inter font-semibold'>3,580,985 VNĐ</div>
                          </div>
                          <hr  className='mt-6 mb-4'/>
                          <div className='flex justify-between items-center'>
                              <div className='font-inter font-semibold'>Tổng phòng</div>
                              <div className='font-inter font-semibold text-yellow-500 text-xl'>3,580,985 VNĐ</div>
                          </div>
                          <div className='font-inter text-sm font-light mt-6'>Bao gồm tất cả các loại thuế và phí dịch vụ</div>
                          <div className='font-inter text-sm mt-1 text-red-500'>(Theo quy định của Ngân hàng Nhà nước Việt Nam, Quý khách vui lòng thanh toán bằng VNĐ)</div>
                          <div className='my-6 border-2 border-dashed'></div>
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