import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import path from '../../constants/path';

function SearchRoom() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Định dạng ngày để phù hợp với input type="date"
        const formattedToday = today.toISOString().split('T')[0];
        const formattedTomorrow = tomorrow.toISOString().split('T')[0];

        // Thiết lập giá trị mặc định
        setStartDate(formattedToday);
        setEndDate(formattedTomorrow);
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
        if (new Date(startDate) > new Date(endDate)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Ngày bắt đầu không được lớn hơn ngày kết thúc.'
            });
            return;
        }

        // Chuyển hướng đến trang booking với các tham số
        navigate(`${path.booking}?startDate=${startDate}&endDate=${endDate}&roomNumber=${numberOfRooms}`);
    };

    return ( 
        <>
            <div className='absolute bottom-0 transform -translate-x-1/2 left-1/2 z-10'>
                <div className="container mx-auto">
                    <div className="bg-white bg-opacity-35 rounded-3xl shadow-lg px-8 py-6 text-white mx-auto w-3/4">
                        <div className="grid grid-cols-9 items-center">
                            <div className="col-span-5 flex gap-6 justify-evenly">
                                {/* Check-in Input with Icon */}
                                <div>
                                    <div className='text-white font-garamond text-base mb-1'>Ngày bắt đầu</div>
                                    <div className="flex items-center border-r-2 border-r-white mr-8">
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]} // Ngày tối thiểu là hôm nay
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="bg-transparent text-xl rounded-md w-full focus:outline-none mr-8"
                                        />
                                    </div>
                                </div>
                                {/* Check-out Input with Icon */}
                                <div>
                                    <div className='text-white font-garamond text-base mb-1'>Ngày kết thúc</div>
                                    <div className="flex items-center border-r-2 border-r-white mr-8">
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="bg-transparent text-xl rounded-md w-full focus:outline-none mr-8"
                                        />
                                    </div>
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