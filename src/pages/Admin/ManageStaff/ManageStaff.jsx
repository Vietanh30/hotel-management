import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import React, { useState, useMemo, useEffect } from 'react';
import adminApi from "../../../api/adminApi";
import { getAccessTokenFromLS } from "../../../utils/auth";
import Swal from 'sweetalert2';
import AddStaff from "./AddStaff/AddStaff";
import EditStaff from "./EditStaff/EditStaff";
import { formatDate } from "../../../utils/utils";

function ManageStaff() {
    const [searchText, setSearchText] = useState('');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.getAllStaff(accessToken);
            if (response.data.statusCode === 200) {
                setStaffList(response.data.data);
                console.log(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể tải danh sách nhân viên.',
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
        return staffList.filter(item =>
            item.email.toLowerCase().includes(searchText.toLowerCase()) ||
            item.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.lastName.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, staffList]);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (staff) => {
        setSelectedStaff(staff);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleDelete = async (staff) => {
        const action = staff.active ? 'dừng hoạt động' : 'khôi phục';
        const apiAction = staff.active ? 'dừng' : 'khôi phục';

        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn ${action} nhân viên này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                const accessToken = getAccessTokenFromLS();
                const response = await adminApi.activeStaff(staff.id, accessToken);
                console.log(response);
                fetchData();
                Swal.fire(
                    'Thành công!',
                    `Nhân viên đã được ${apiAction} thành công.`,
                    'success'
                );
            } catch (error) {
                console.error("Error updating staff:", error);
                Swal.fire(
                    'Lỗi!',
                    'Có lỗi xảy ra khi cập nhật trạng thái nhân viên.',
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
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            width: "15%",
        },
        {
            name: 'Họ',
            selector: row => row.firstName,
            sortable: true,
            width: "10%",
        },
        {
            name: 'Tên',
            selector: row => row.lastName,
            sortable: true,
            width: "10%",
        },
        {
            name: 'Số điện thoại',
            selector: row => row.phone || 'N/A',
            sortable: true,
            width: "15%",
        },
        {
            name: 'Ngày sinh',
            selector: row =>formatDate(row.birthday) || 'N/A',
            sortable: true,
            width: "10%",
        },
       
        {
            name: 'Trạng thái',
            selector: row => row.active === true ? 'Hoạt động' : 'Không hoạt động',
            sortable: true,
            width: "10%",
        },
        {
            name: 'Ngày tạo',
            selector: row => row.createAt.toLocaleString(),
            sortable: true,
            width: "15%",
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
                            Quản lý nhân viên
                        </div>
                        <div>
                            <button onClick={openAddModal} className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
                                Thêm nhân viên
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhân viên..."
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
                                        whiteSpace: 'normal', // Cho phép text xuống dòng
                                        overflow: 'visible', // Đảm bảo không bị cắt
                                    } 
                                },
                            }}
                            noDataComponent={<div className="text-center bg-[#000] w-full p-3 text-white">Không tìm thấy nhân viên nào.</div>}
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

            {/* Modal cho thêm và chỉnh sửa nhân viên */}
             <AddStaff isOpen={isAddModalOpen} onClose={closeAddModal} fetchData={fetchData} />
            <EditStaff isOpen={isEditModalOpen} onClose={closeEditModal} staffData={selectedStaff} fetchData={fetchData} />
        </>
    );
}

export default ManageStaff;