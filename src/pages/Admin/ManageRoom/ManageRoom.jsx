import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import React, { useState, useMemo, useEffect } from 'react';
import adminApi from "../../../api/adminApi";
import { getAccessTokenFromLS, getRoleFromLS } from "../../../utils/auth";
import Swal from 'sweetalert2';
import AddRoom from "./AddRoom/AddRoom";
import EditRoom from "./EditRoom/EditRoom";
import Select from 'react-select';

function ManageRoom() {
    const [searchText, setSearchText] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomRank, setSelectedRoomRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRole = getRoleFromLS(); // Get the user role

    const fetchData = async () => {
        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.getAllRoom(accessToken);
            if (response.data.statusCode === 200) {
                console.log("rooms", response.data)
                setRooms(response.data.data);
            }

            const typeResponse = await adminApi.getAllTypeRoom(accessToken);
            if (typeResponse.data.statusCode === 200) {
                setRoomTypes(typeResponse.data.data);
                console.log("typeResponse", typeResponse)
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
        return rooms.filter(item => {
            const matchesSearchText = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.description.toLowerCase().includes(searchText.toLowerCase());

            const matchesRoomRank = selectedRoomRank ?
                (selectedRoomRank.value === null || item.roomRankId === selectedRoomRank.value) : true;

            return matchesSearchText && matchesRoomRank;
        });
    }, [searchText, rooms, selectedRoomRank]);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (room) => {
        setSelectedRoom(room);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleDelete = async (room) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn ${room.active ? 'dừng hoạt động' : 'kích hoạt'} phòng này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                const accessToken = getAccessTokenFromLS();
                const response = await adminApi.activeRoom(room.id, accessToken, !room.active); // Chuyển trạng thái active
                console.log(response)
                if (response.data.statusCode === 200) {
                    fetchData();
                    Swal.fire(
                        'Thành công!',
                        `Phòng đã được ${room.active ? 'dừng hoạt động' : 'kích hoạt'} thành công.`,
                        'success'
                    );
                }
            } catch (error) {
                console.error("Error updating room status:", error);
                Swal.fire(
                    'Lỗi!',
                    'Có lỗi xảy ra khi cập nhật trạng thái phòng.',
                    'error'
                );
            }
        }
    };

    const columns = [
        ...(userRole === 'ROLE_ADMINISTRATOR' ? [
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
        ] : []),
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            sortable: true,
            width: '7%', // Adjust width as needed
        },
        {
            name: 'Tên',
            selector: row => row.name,
            sortable: true,
            cell: row => (
                <div className="whitespace-normal">{row.name}</div> // Allow wrapping if necessary
            ),
            width: '20%', // Adjust width as needed
        },
        {
            name: 'Giá',
            selector: row => row.price,
            sortable: true,
            cell: row => (
                <div className="whitespace-normal">{row.price}</div>
            ),
            width: '10%', // Adjust width as needed
        },
        {
            name: 'Số người lớn tối đa',
            selector: row => row.adultMax,
            sortable: true,
            width: '15%',
            cell: row => (
                <div className="whitespace-normal">{row.adultMax}</div>
            ),
        },
        {
            name: 'Số lượng',
            selector: row => row.quantity,
            sortable: true,
            width: '10%',
            cell: row => (
                <div className="whitespace-normal">{row.quantity}</div>
            ),
        },
        {
            name: 'Trạng thái',
            selector: row => row.active,
            sortable: true,
            width: '10%',

            cell: row => (
                <div className="whitespace-normal">{row.active ? 'Đang hoạt động' : 'Dừng hoạt động'}</div>
            ),
        },
        {
            name: 'Hạng phòng',
            selector: row => row.roomRank,
            sortable: true,
            width: '15%',

            cell: row => (
                <div className="whitespace-normal">{row.roomRank}</div>
            ),
        },
        {
            name: 'Mô tả',
            selector: row => row.description,
            sortable: true,

            cell: row => (
                <div className="whitespace-normal">{row.description}</div>
            ),
            width: '25%', // Adjust width as needed
        },
    ];

    if (loading) {
        return <div className="text-center">Đang tải dữ liệu...</div>;
    }

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-60 overflow-x-auto min-h-screen">
                <div className="p-4 mt-20">
                    <div className="w-full flex justify-between items-center">
                        <div className="font-semibold text-2xl font-inter">
                            Quản lý phòng
                        </div>
                        <div>
                            {userRole === 'ROLE_ADMINISTRATOR' && (
                                <button onClick={openAddModal} className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
                                    Thêm phòng
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between">
                            <Select
                                options={[
                                    { value: null, label: 'Tất cả' }, // Tùy chọn "Tất cả"
                                    ...roomTypes.map(type => ({ value: type.id, label: type.name })),
                                ]}
                                onChange={setSelectedRoomRank}
                                placeholder="Chọn hạng phòng"
                                className="mb-4"
                            />
                            <input
                                type="text"
                                placeholder="Tìm kiếm phòng..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="p-2 border border-gray-500 rounded w-56 float-end mb-4 text-sm"
                            />

                        </div>
                        <DataTable
                            className="min-w-max overflow-auto "
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