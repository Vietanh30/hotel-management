import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import React, { useState, useMemo, useEffect } from 'react';
import adminApi from "../../../api/adminApi";
import { getAccessTokenFromLS } from "../../../utils/auth";
import Swal from 'sweetalert2';
import AddRoom from "./AddRoom/AddRoom";
import EditRoom from "./EditRoom/EditRoom";

function ManageRoom() {
    const [searchText, setSearchText] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.getAllRoom(accessToken);
            if (response.data.statusCode === 200) {
                setRooms(response.data.data);
                console.log(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        return rooms.filter(item =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, rooms]);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (room) => {
        console.log(room)
        setSelectedRoom(room);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleDelete = async (room) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa phòng này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                const accessToken = getAccessTokenFromLS();
                await adminApi.activeRoom(room.id, accessToken);
                fetchData();
                Swal.fire(
                    'Thành công!',
                    'Phòng đã được xóa thành công.',
                    'success'
                );
            } catch (error) {
                console.error("Error deleting room:", error);
                Swal.fire(
                    'Lỗi!',
                    'Có lỗi xảy ra khi xóa phòng.',
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
            name: 'STT',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Tên',
            selector: row => row.name,
            sortable: true,            
            cell: row => (
                <div className="">{row.name}</div>
            ),
            width: '10%',
        },
        { name: 'Giá', selector: row => row.price, sortable: true, },
        { name: 'Số người lớn tối đa', selector: row => row.adultMax, sortable: true, },
        { name: 'Số lượng', selector: row => row.quantity, sortable: true, },
        {
            name: 'Trạng thái',
            selector: row => row.active, // Updated to use a function
            sortable: true,
            cell: row => row.active ? 'Đang hoạt động' : 'Dừng hoạt động',
        },
        {
            name: 'Danh mục',
            selector: row => row.roomRank,
            sortable: true,
        },
        {
            name: 'Mô tả',
            selector: row => row.description,
            sortable: true,
            cell: row => (
                <div className="">{row.description}</div>
            ),
        },
        {
            name: 'Chính sách',
            selector: row => row.policyList.map(policy => `${policy.type}: ${policy.content}`).join(', '),
            sortable: true,
            cell: row => (
                <div className="space-y-1">
                    {row.policyList.map((policy, index) => (
                        <div key={index}>{`${policy.type}: ${policy.content}`}</div>
                    ))}
                </div>
            ),
        },
        {
            name: 'Chi tiết phòng',
            selector: row => row.roomDetailList.map(detail => `Phòng ${detail.roomNumber} (${detail.status})`).join(', '),
            sortable: true,
            cell: row => (
                <div className="">{row.roomDetailList.map(detail => `Phòng ${detail.roomNumber} (${detail.status})`).join(', ')}</div>
            ),
        }
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
                            Quản lý phòng
                        </div>
                        <div>
                            <button onClick={openAddModal} className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
                                Thêm phòng
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phòng..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="p-2 border border-gray-500 rounded w-56 float-end mb-4 text-sm"
                        />
                        <DataTable
                            className="min-w-max overflow-auto"
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            striped
                            overflow={true}
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
                                        textOverflow: 'ellipsis', 
                                    } 
                                },
                            }}
                            noDataComponent={<div className="text-center bg-[#000] w-full p-3 text-white">Không tìm thấy phòng nào.</div>}
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

            {/* Render modals conditionally */}
            {isAddModalOpen && <AddRoom isOpen={isAddModalOpen} onClose={closeAddModal} fetchData={fetchData} />}
            {isEditModalOpen && <EditRoom isOpen={isEditModalOpen} onClose={closeEditModal} roomData={selectedRoom} fetchData={fetchData} />}
        </>
    );
}

export default ManageRoom;