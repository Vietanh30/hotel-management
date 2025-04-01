import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import React, { useState, useMemo, useEffect } from 'react';
import adminApi from "../../../api/adminApi";
import { getAccessTokenFromLS, getRoleFromLS } from "../../../utils/auth";
import Swal from 'sweetalert2';
import AddServiceRoom from "./AddServiceRoom/AddServiceRoom";
import EditServiceRoom from "./EditServiceRoom/EditServiceRoom";

function ManageServiceRoom() {
    const [searchText, setSearchText] = useState('');
    const [selectedServiceRoom, setSelectedServiceRoom] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [serviceRooms, setServiceRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const userRole = getRoleFromLS(); // Get the user role

    const fetchData = async () => {
        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.getAllServiceRoom(accessToken);
            console.log(response);
            if (response.data.statusCode === 200) {

                setServiceRooms(response.data.data);
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
        return serviceRooms.filter(item =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, serviceRooms]);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (serviceRoom) => {
        setSelectedServiceRoom(serviceRoom);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleDelete = async (serviceRoom) => {
        const action = serviceRoom.active ? 'dừng hoạt động' : 'khôi phục';
        const apiAction = serviceRoom.active ? 'Dừng' : 'Khôi phục';

        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn ${action} dịch vụ phòng này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                const accessToken = getAccessTokenFromLS();
                await adminApi.activeServiceRoom(serviceRoom.id, accessToken);
                fetchData();
                Swal.fire(
                    'Thành công!',
                    `Dịch vụ phòng đã được ${apiAction} thành công.`,
                    'success'
                );
            } catch (error) {
                console.error("Error updating service room:", error);
                Swal.fire(
                    'Lỗi!',
                    'Có lỗi xảy ra khi cập nhật trạng thái dịch vụ phòng.',
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
                width: '15%',
            },
        ] : []),

        {
            name: 'STT',
            selector: (row, index) => index + 1,
            sortable: true,
            width: '8%',
            center: true,
        },
        {
            name: 'Biểu tượng',
            cell: row => (
                <div className="flex justify-center">
                    <img
                        src={row.icon}
                        alt={row.name}
                        className="w-10 h-10 object-cover rounded"
                    />
                </div>
            ),
            width: '12%',
            center: true,
        },
        {
            name: 'Tên dịch vụ',
            selector: row => row.name,
            sortable: true,
            width: '20%',
            cell: row => <div className="text-center w-full">{row.name}</div>
        },
        {
            name: 'Mô tả',
            selector: row => row.description,
            sortable: true,
            width: '25%',
            cell: row => <div className="text-center w-full truncate">{row.description}</div>
        },
        {
            name: 'Trạng thái',
            selector: row => row.active === true ? 'Hoạt động' : 'Tạm dừng',
            sortable: true,
            width: '10%',
            center: true,
        }
    ];

    if (loading) {
        return <div className="text-center">Đang tải dữ liệu...</div>;
    }

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-60">
                <div className="p-4 mt-20">
                    <div className="w-full flex justify-between items-center">
                        <div className="font-semibold text-2xl font-inter">
                            Quản lý dịch vụ phòng
                        </div>
                        <div>
                            {userRole === 'ROLE_ADMINISTRATOR' && (
                                <button onClick={openAddModal} className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
                                    Thêm dịch vụ phòng
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 overflow-x-auto w-full">
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ phòng..."
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
                                headRow: {
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        backgroundColor: '#edce94',
                                        borderStartStartRadius: '15px',
                                        borderStartEndRadius: '15px',
                                        display: 'flex',
                                        width: '100%',
                                    }
                                },
                                headCells: {
                                    style: {
                                        flex: '1',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        padding: '10px 5px',
                                    }
                                },
                                rows: {
                                    style: {
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        fontFamily: 'inter',
                                        display: 'flex',
                                        width: '100%',
                                    }
                                },
                                cells: {
                                    style: {
                                        flex: '1',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        padding: '6px 5px',
                                    }
                                }
                            }}
                            noDataComponent={<div className="text-center bg-[#000] w-full p-3 text-white">Không tìm thấy dịch vụ phòng nào.</div>}
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

            <AddServiceRoom isOpen={isAddModalOpen} onClose={closeAddModal} fetchData={fetchData} />
            <EditServiceRoom isOpen={isEditModalOpen} onClose={closeEditModal} initialData={selectedServiceRoom} fetchData={fetchData} />
        </>
    );
}

export default ManageServiceRoom;