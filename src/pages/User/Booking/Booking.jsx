import React, { useEffect, useState } from "react";
import BackToTopButton from "../../../components/BackToTopButton/BackToTopButton";
import CardRoomBooking from "../../../components/CardRoomBooking/CardRoomBooking";
import FilterRoom from "../../../components/FilterRoom/FilterRoom";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { useLocation } from "react-router-dom";
import userApi from "../../../api/userApi";


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
    }, [search]); // Theo dõi thay đổi của search

    return (
        <>
            <Header />

            <div className="w-full bg-[#E5E5E5] py-8 relative">
                <div className="container sticky mx-auto bg-white rounded px-4 py-6 top-0 z-10 shadow-lg left-[6.5%]">
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
                    <div className="grid grid-cols-1 gap-5">
                        {typeRoom.map((typeRoom, index) => (
                            <div key={typeRoom.id} className="col-span-1 w-full bg-white rounded p-4 mb-8">
                                <CardRoomBooking typeRoom={typeRoom} /> {/* Giả sử CardRoomBooking nhận từng phòng */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
            <BackToTopButton />
        </>
    );
}

export default Booking;