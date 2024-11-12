import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import CSS cho DatePicker
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import path from '../../constants/path';

function SearchRoom() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Thiết lập giá trị mặc định
        setStartDate(today);
        setEndDate(tomorrow);
    }, []);

    const handleSearch = () => {
        if (!startDate || !endDate) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.'
            });
            return;
        }
        if (startDate > endDate) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Ngày bắt đầu không được lớn hơn ngày kết thúc.'
            });
            return;
        }

        // Chuyển đổi định dạng sang yyyy-mm-dd
        const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
        const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

        // Chuyển hướng đến trang booking với các tham số
        navigate(`${path.booking}?startDate=${formattedStartDate}&endDate=${formattedEndDate}&roomNumber=${numberOfRooms}`);
    };

    return ( 
        <>
            <div className='absolute bottom-0 transform -translate-x-1/2 left-1/2 z-10'>
                <div className="container mx-auto">
                    <div className="bg-white bg-opacity-35 rounded-3xl shadow-lg px-8 py-6 text-white mx-auto w-3/4">
                        <div className="grid grid-cols-9 items-center">
                            <div className="col-span-5 flex gap-6 justify-evenly">
                                {/* Check-in Input with DatePicker */}
                                <div>
                                    <div className='text-white font-garamond text-base mb-1'>Ngày bắt đầu</div>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="bg-transparent rounded-md w-full focus:outline-none cursor-pointer border p-1"
                                        minDate={new Date()} // Ngày tối thiểu là hôm nay
                                    />
                                </div>
                                {/* Check-out Input with DatePicker */}
                                <div>
                                    <div className='text-white font-garamond text-base mb-1'>Ngày kết thúc</div>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="bg-transparent rounded-md w-full focus:outline-none cursor-pointer border p-1"
                                        minDate={startDate || new Date()} // Ngày tối thiểu là ngày bắt đầu
                                    />
                                </div>
                            </div>

                            {/* Number of Rooms Input */}
                            <div className='col-span-3 pr-20'>
                                <div className='text-white font-garamond text-base mb-1'>Số phòng</div>
                                <div className="flex items-center justify-start gap-2">
                                    <FontAwesomeIcon icon={faHouse} className="text-[#B5986D] mr-2" />
                                    <input
                                        type="number"
                                        min="1"
                                        value={numberOfRooms}
                                        onChange={(e) => setNumberOfRooms(e.target.value)}
                                        className="bg-transparent border font-bold rounded-md p-1 w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-start mt-4 col-span-1">
                                <button 
                                    className="bg-[#B5986D] text-white rounded-[20px] py-2 px-8 hover:bg-[#8A6A4E]"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchRoom;