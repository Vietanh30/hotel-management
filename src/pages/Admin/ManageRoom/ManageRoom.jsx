import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import React, { useState, useMemo, useEffect } from 'react';
import AddRoom from "./AddRoom/AddRoom";
import EditRoom from "./EditRoom/EditRoom";
import RoomDetail from "./RoomDetail/RoomDetail";
import adminApi from "../../../api/adminApi";
import { getAccessTokenFromLS } from "../../../utils/auth";

function ManageRoom() {
    const [searchText, setSearchText] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [room, setRoom] = useState([]); // State để lưu dữ liệu từ API
    const [loading, setLoading] = useState(true); // State xử lý trạng thái tải

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = getAccessTokenFromLS();
                const response = await adminApi.getAllRoom(accessToken);
                console.log(response);
                if(response.data.statusCode === 200){
                    setRoom(response.data.data.content); // Giả sử response.data chứa danh sách phòng
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Đảm bảo loading được tắt
            }
        };

        fetchData();
    }, []); // Chạy một lần khi component mount

    const filteredData = useMemo(() => {
        return room.filter(item =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, room]);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (room) => {
        setSelectedRoom(room);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const openDetailModal = (room) => {
        setSelectedRoom(room);
        setIsDetailModalOpen(true);
    };
    const closeDetailModal = () => setIsDetailModalOpen(false);

    const columns = [
        {
            name: 'Hành động',
            cell: row => (
                <div>
                    <button onClick={() => openDetailModal(row)} className="text-blue-500 hover:underline">
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button onClick={() => openEditModal(row)} className="text-yellow-500 hover:underline mx-2">
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button className="text-red-500 hover:underline">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
            width: '110px'
        },
        {
            name: 'STT',
            selector: (row, index) => index + 1, // Sử dụng index để hiển thị STT
            sortable: true,
            width: '80px'
        },
        { name: 'Tên', selector: row => row.name, sortable: true, width: '17%' },
        { name: 'Diện tích', selector: row => row.area + 'm2', sortable: true, width: '150px' },
        { name: 'Mô tả', selector: row => row.description, sortable: true, },
    ];

    if (loading) {
        return <div className="text-center">Đang tải dữ liệu...</div>; // Thông báo khi đang tải
    }

    return ( 
        <>
            <Sidebar />
            <div className="p-4 sm:ml-60">
                <div className="p-4 mt-20">
                    <div className="w-full flex justify-between items-center">
                        <div className="font-semibold text-2xl font-inter">
                            Quản lý phòng
                        </div>
                        <div>
                            <button onClick={openAddModal} className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
                                Thêm phòng
                            </button>
                        </div>
                    </div>
                    <div className=" mt-6">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phòng..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="p-2 border border-gray-500 rounded w-56 flex float-end mb-4 text-sm"
                        />
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            striped
                            customStyles={{
                                headRow: { style: { fontSize: '15px', fontWeight: 'bold', backgroundColor: '#edce94', } },
                                rows: { style: { fontSize: '14px', fontWeight: '500', fontFamily: 'inter', } },
                            }}
                            noDataComponent={<div className="text-center bg-[#000] w-full p-3 text-white">Không có phòng nào.</div>}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Hiển thị',
                                rangeSeparatorText: 'trên',
                                noRowsPerPage: false,
                                selectAllRowsItem: false,
                                selectAllRowsItemText: 'Tất cả',
                            }}
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[5,10, 25, 50, 100]}
                        />
                    </div>
                </div>
            </div>

            <AddRoom isOpen={isAddModalOpen} onClose={closeAddModal} />
            <EditRoom isOpen={isEditModalOpen} onClose={closeEditModal} room={selectedRoom} />
            <RoomDetail isOpen={isDetailModalOpen} onClose={closeDetailModal} room={selectedRoom} />
        </>
    );
}

export default ManageRoom;