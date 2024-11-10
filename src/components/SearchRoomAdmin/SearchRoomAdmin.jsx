import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import { getAccessTokenFromLS } from '../../utils/auth';
import { formatDateToYYYYMMDD } from '../../utils/utils';

function SearchRoomAdmin({ onDateChange, onSearchResults, onSearch }) {
    const [formData, setFormData] = useState({
        checkInDate: '',
        checkOutDate: '',
        adults: 1,
        children: 0,
        rankId: 0,
    });
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const initialCheckInDate = formatDateToYYYYMMDD(today); // Ngày hôm nay
        const initialCheckOutDate = formatDateToYYYYMMDD(tomorrow); // Ngày mai
    
        setFormData((prev) => ({
            ...prev,
            checkInDate: initialCheckInDate,
            checkOutDate: initialCheckOutDate,
        }));

        const fetchRoomTypes = async () => {
            try {
                const accessToken = getAccessTokenFromLS();
                const response = await adminApi.getAllTypeRoom(accessToken);
                setRoomTypes(response.data.data);
            } catch (error) {
                console.error('Error fetching room types:', error);
                setError('Failed to fetch room types. Please try again.');
            }
        };

        fetchRoomTypes();
    }, []);

    const searchRooms = async () => {
        if (!formData.checkInDate || !formData.checkOutDate) return; // Không tìm kiếm nếu ngày chưa hợp lệ

        onDateChange({ startDate: formData.checkInDate, endDate: formData.checkOutDate });

        const searchCriteria = {
            checkInDate: formData.checkInDate,
            checkOutDate: formData.checkOutDate,
            adults: formData.adults,
            children: formData.children,
            rankId: formData.rankId,
        };

        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.searchRoomAdmin(accessToken, searchCriteria);
            onSearchResults(response.data);
        } catch (error) {
            console.error('Error searching rooms:', error);
            setError('Failed to search for rooms. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'checkInDate' && value >= formData.checkOutDate) {
            const nextDate = new Date(value);
            nextDate.setDate(nextDate.getDate() + 1);
            setFormData((prev) => ({ ...prev, checkOutDate: formatDateToYYYYMMDD(nextDate) }));
        }
    };

    const handleSearch = () => {
        searchRooms();
    };

    // Expose the search function to the parent component
    useEffect(() => {
        if (onSearch) {
            onSearch(searchRooms); // Gọi hàm tìm kiếm từ props
        }
    }, [onSearch]);

    // Gọi hàm tìm kiếm khi component được khởi tạo và formData có giá trị hợp lệ
    useEffect(() => {
        if (formData.checkInDate && formData.checkOutDate) {
            searchRooms();
        }
    }, [formData.checkInDate, formData.checkOutDate]);

    return (
        <div className="p-4 rounded border border-[#aeaeae] bg-gray-50">
            <h2 className="text-lg font-bold mb-4">Tìm kiếm phòng</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form>
                <div className="mb-4 grid grid-cols-3 gap-1 items-center">
                    <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="check-in">
                        Ngày nhận phòng
                    </label>
                    <input
                        className="border rounded p-2 col-span-2 w-full datepicker text-sm"
                        type="date"
                        id="check-in"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4 grid grid-cols-3 gap-1 items-center">
                    <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="check-out">
                        Ngày trả phòng
                    </label>
                    <input
                        className="border rounded p-2 col-span-2 w-full datepicker text-sm"
                        type="date"
                        id="check-out"
                        name="checkOutDate"
                        value={formData.checkOutDate}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4 grid grid-cols-3 gap-1 items-center">
                    <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="adult-occupancy">
                        Số lượng người lớn
                    </label>
                    <input
                        className="border rounded p-2 col-span-2 w-full"
                        type="number"
                        id="adult-occupancy"
                        name="adults"
                        min="1"
                        value={formData.adults}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4 grid grid-cols-3 gap-1 items-center">
                    <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="children-occupancy">
                        Số lượng trẻ em
                    </label>
                    <input
                        className="border rounded p-2 col-span-2 w-full"
                        type="number"
                        id="children-occupancy"
                        name="children"
                        min="0"
                        value={formData.children}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4 grid grid-cols-3 gap-1 items-center">
                    <label className="block font-bold mb-1 text-sm font-inter col-span-1" htmlFor="room-type">
                        Hạng phòng
                    </label>
                    <select
                        className="border rounded p-2 col-span-2 w-full"
                        id="room-type"
                        name="rankId"
                        value={formData.rankId}
                        onChange={handleInputChange}
                    >
                        <option value="0">Tất cả các loại</option>
                        {roomTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                    type="button"
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>
            </form>
        </div>
    );
}

export default SearchRoomAdmin;