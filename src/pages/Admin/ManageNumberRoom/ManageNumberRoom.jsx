import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import React, { useState, useMemo, useEffect } from 'react';
import adminApi from "../../../api/adminApi"; // Giả sử có API quản lý phòng
import { getAccessTokenFromLS } from "../../../utils/auth";
import Swal from 'sweetalert2';
import AddNumberRoom from "./AddNumberRoom/AddNumberRoom";
import EditNumberRoom from "./EditNumberRoom/EditNumberRoom";

function ManageNumberRoom() {
    const [searchText, setSearchText] = useState('');
    const [selectedNumberRoom, setSelectedNumberRoom] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [numberRoomList, setNumberRoomList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.getAllNumberRoom(accessToken); // API lấy danh sách số phòng
            if (response.data.statusCode === 200) {
                setNumberRoomList(response.data.data);
                console.log(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể tải danh sách số phòng.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        return numberRoomList.filter(item =>
            item.roomNumber.toString().includes(searchText) ||
            (item.roomCode && item.roomCode.toLowerCase().includes(searchText.toLowerCase())) ||
            item.location.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, numberRoomList]);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (numberRoom) => {
        setSelectedNumberRoom(numberRoom);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleDelete = async (numberRoom) => {
        const action = numberRoom.status === 'AVAILABLE' ? 'dừng hoạt động' : 'khôi phục';
        const apiAction = numberRoom.status === 'AVAILABLE' ? 'dừng' : 'khôi phục';

        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn ${action} số phòng này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                const accessToken = getAccessTokenFromLS();
                const response = await adminApi.activeNumberRoom(numberRoom.id, accessToken); // API cập nhật trạng thái số phòng
                console.log(response);
                fetchData();
                Swal.fire(
                    'Thành công!',
                    `Số phòng đã được ${apiAction} thành công.`,
                    'success'
                );
            } catch (error) {
                console.error("Error updating number room:", error);
                Swal.fire(
                    'Lỗi!',
                    'Có lỗi xảy ra khi cập nhật trạng thái số phòng.',
                    'error'
                );
            }
        }
    };

    const columns = [
        {
            name: 'Hành động',
            cell: row => (
                <div>
                    <button onClick={() => openEditModal(row)} className="text-yellow-500 hover:underline mx-2">
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button onClick={() => handleDelete(row)} className="text-red-500 hover:underline">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
        },
        {
            name: 'Số phòng',
            selector: row => row.roomNumber,
            sortable: true,
        },
        {
            name: 'Tầng',
            selector: row => row.capacity,
            sortable: true,
        },
        {
            name: 'Địa điểm',
            selector: row => row.location,
            sortable: true,
        },
        {
            name: 'Trạng thái',
            selector: row => row.status,
            sortable: true,
        },
    ];

    if (loading) {
        return <div className="text-center">Đang tải dữ liệu...</div>;
    }

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-60 overflow-x-auto">
                <div className="p-4 mt-20">
                    <div className="w-full flex justify-between items-center">
                        <div className="font-semibold text-2xl font-inter">
                            Quản lý số phòng
                        </div>
                        <div>
                            <button onClick={openAddModal} className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
                                Thêm số phòng
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <input
                            type="text"
                            placeholder="Tìm kiếm số phòng..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="p-2 border border-gray-500 rounded w-56 flex float-end mb-4 text-sm"
                        />
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            className="min-w-full"
                            pagination
                            highlightOnHover
                            striped
                            customStyles={{
                                headRow: { 
                                    style: { 
                                        fontSize: '15px', 
                                        fontWeight: 'bold', 
                                        backgroundColor: '#edce94', 
                                        borderStartStartRadius: '15px', 
                                        borderStartEndRadius: '15px', 
                                    } 
                                },
                                rows: { 
                                    style: { 
                                        fontSize: '14px', 
                                        fontWeight: '500', 
                                        fontFamily: 'inter', 
                                        paddingTop: '6px', 
                                        paddingBottom: '6px', 
                                        // overflow: 'hidden', // Prevent overflow
                                        textOverflow: 'ellipsis', // Add ellipsis for overflowing text
                                        // whiteSpace: 'nowrap' // Prevent text from wrapping
                                    } 
                                },
                            }}
                            noDataComponent={<div className="text-center bg-[#000] w-full p-3 text-white">Không tìm thấy số phòng nào.</div>}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Hiển thị',
                                rangeSeparatorText: 'trên',
                                noRowsPerPage: false,
                                selectAllRowsItem: false,
                                selectAllRowsItemText: 'Tất cả',
                            }}
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                        />
                    </div>
                </div>
            </div>

            {/* Modal cho thêm và chỉnh sửa số phòng */}
            <AddNumberRoom isOpen={isAddModalOpen} onClose={closeAddModal} fetchData={fetchData} />
            <EditNumberRoom isOpen={isEditModalOpen} onClose={closeEditModal} numberRoomData={selectedNumberRoom} fetchData={fetchData} />
        </>
    );
}

export default ManageNumberRoom;