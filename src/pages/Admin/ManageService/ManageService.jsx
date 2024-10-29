import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import React, { useState, useMemo, useEffect } from 'react';
import AddService from "./AddService/AddService"; 
import EditService from "./EditService/EditService"; 
import adminApi from "../../../api/adminApi";
import { getAccessTokenFromLS } from "../../../utils/auth";
import Swal from 'sweetalert2';

function ManageService() {
    const [searchText, setSearchText] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.getAllService(accessToken);
            if (response.data.statusCode === 200) {
                setServices(response.data.data);
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
        return services.filter(item =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, services]);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (service) => {
        setSelectedService(service);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleDelete = async (service) => {
        const action = service.active ? 'dừng hoạt động' : 'khôi phục';
        const apiAction = service.active ? 'Dừng' : 'Khôi phục';

        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn ${action} dịch vụ này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            try {
                const accessToken = getAccessTokenFromLS();
                await adminApi.activeService(service.id, accessToken);
                fetchData();
                Swal.fire(
                    'Thành công!',
                    `Dịch vụ đã được ${apiAction} thành công.`,
                    'success'
                );
            } catch (error) {
                console.error("Error updating service:", error);
                Swal.fire(
                    'Lỗi!',
                    'Có lỗi xảy ra khi cập nhật trạng thái dịch vụ.',
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
          width: '7%'
        },
        {
          name: 'STT',
          selector: (row, index) => index + 1,
          sortable: true,
          width: '7%'
        },
        {
          name: 'Tên',
          selector: row => row.name,
          sortable: true,
          width: '12%',
          cell: row => (
            <div className="line-clamp-2">
              {row.name}
            </div>
          )
        },
        { name: 'Vị trí', selector: row => row.location, sortable: true, width: '10%' },
        { name: 'Sức chứa', selector: row => row.capacity, sortable: true, width: '10%' },
        { name: 'Bắt đầu', selector: row => row.openTime, sortable: true, width: '10%' },
        { name: 'Kết thúc', selector: row => row.closeTime, sortable: true, width: '10%' },
        { name: 'Trạng thái', selector: row => row.active === true ? 'Hoạt động' : 'Tạm dừng', sortable: true, width: '10%' },
        {
          name: 'Danh mục',
          selector: row => row.category.name,
          sortable: true,
          cell: row => (
            <div className="line-clamp-3">
              {row.category.name}
            </div>
          ),
          width: '10%'
        },
        {
          name: 'Mô tả',
          selector: row => row.description,
          sortable: true,
          cell: row => (
            <div className="line-clamp-3">
              {row.description}
            </div>
          ),
          width: '13%'
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
                            Quản lý dịch vụ
                        </div>
                        <div>
                            <button onClick={openAddModal} className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
                                Thêm dịch vụ
                            </button>
                        </div>
                    </div>
                    <div className="mt-6"> {/* Thêm class overflow-x-auto */}
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
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
                                headRow: { style: { fontSize: '15px', fontWeight: 'bold', backgroundColor: '#edce94', borderStartStartRadius: '15px', borderStartEndRadius: '15px', } },
                                rows: { style: { fontSize: '14px', fontWeight: '500', fontFamily: 'inter', paddingTop: '6px', paddingBottom: '6px' } },
                            }}
                            noDataComponent={<div className="text-center bg-[#000] w-full p-3 text-white">Không tìm thấy dịch vụ nào.</div>}
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

            <AddService isOpen={isAddModalOpen} onClose={closeAddModal} fetchData={fetchData} />
            <EditService isOpen={isEditModalOpen} onClose={closeEditModal} initialData={selectedService} fetchData={fetchData} />
        </>
    );
}

export default ManageService;