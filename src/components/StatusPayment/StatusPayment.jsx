import React, { useEffect, useState } from 'react';
import userApi from '../../api/userApi';
import DataTable from 'react-data-table-component';
import { getAccessTokenFromLS, getPaymentIdToLS, getRoleFromLS } from '../../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import path from '../../constants/path';

function StatusPayment() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const paymentId = getPaymentIdToLS();

  const getQueryParams = (query) => {
    const params = new URLSearchParams(query);
    return {
      paymentId: paymentId,
      transId: params.get('apptransid'),
    };
  };

  const handleGetPaymentStatus = async () => {
    try {
      const accessToken = getAccessTokenFromLS();
      const { paymentId, transId } = getQueryParams(location.search);
      const response = await userApi.statusBookingRoom(accessToken, {
        paymentId,
        transId,
      });
      if (response.data.statusCode === 200) {
        setPaymentStatus(response.data);
        setModalOpen(true);
      }
    } catch (error) {
      if (error.response.data.statusCode === 400) {
        setPaymentStatus(error.response.data);
        setModalOpen(true);
      }
    }
  };

  useEffect(() => {
    handleGetPaymentStatus();
  }, []);

  const columns = [
    {
      name: 'Mã phòng',
      selector: (row) => row.roomNumber,
      sortable: true,
    },
    {
      name: 'Loại phòng',
      selector: (row) => row.roomType,
      sortable: true,
    },
    {
      name: 'Thời gian',
      selector: (row) => (
        <div>
          {new Date(row.checkIn).toLocaleString()} - {new Date(row.checkOut).toLocaleString()}
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Giá',
      selector: (row) => `${row.totalPrice.toLocaleString()} đ`,
      sortable: true,
    },
    {
      name: 'Chính sách',
      selector: (row) => (
        <button onClick={() => handleViewPolicy(row)} className="text-blue-500 underline">
          Xem chính sách
        </button>
      ),
    },
    {
      name: 'Dịch vụ',
      selector: (row) => (
        <button onClick={() => handleViewService(row)} className="text-blue-500 underline">
          Xem dịch vụ
        </button>
      ),
    },
  ];

  const handleViewPeople = (room) => {
    setSelectedRoom(room);
    setShowPeopleModal(true);
  };

  const handleViewPolicy = (room) => {
    setSelectedRoom(room);
    setShowPolicyModal(true);
  };

  const handleViewService = (room) => {
    setSelectedRoom(room);
    setShowServiceModal(true);
  };

  const handleCloseModal = () => {
    setShowPeopleModal(false);
    setShowPolicyModal(false);
    setShowServiceModal(false);
    setSelectedRoom(null);
  };

  const handleNavigateHome = () => {
    const role = getRoleFromLS();
    if (role === 'ROLE_USER') {
      navigate(path.home);
    } else if (role === 'ROLE_ADMINISTRATOR') {
      navigate(path.dashboard);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-11/12 lg:w-10/12 overflow-y-auto max-h-[80%]">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{paymentStatus.description}</h2>
            </div>
            <DataTable
              columns={columns}
              data={paymentStatus.data.bookingRoomDetails}
              responsive
              striped
              highlightOnHover
              pagination={false}
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
              className="bg-white rounded-lg shadow-md"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNavigateHome} // Gọi hàm điều hướng
                className="px-3 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold transition duration-200"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem người */}
      {showPeopleModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <h3 className="text-xl font-bold">Thông tin khách</h3>
            <div className="mt-4">
              <p>Người lớn: {selectedRoom.adults}</p>
              <p>Trẻ em: {selectedRoom.children}</p>
              <p>Trẻ sơ sinh: {selectedRoom.infant}</p>
            </div>
            <button onClick={handleCloseModal} className="mt-4 px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal xem chính sách */}
      {showPolicyModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <h3 className="text-xl font-bold">Chính sách phòng</h3>
            <div className="mt-4">
              {selectedRoom.policyList.map((policy) => (
                <div key={policy.id}>
                  <strong>{policy.type}:</strong> {policy.content} - {policy.description}
                </div>
              ))}
            </div>
            <button onClick={handleCloseModal} className="mt-4 px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal xem dịch vụ */}
      {showServiceModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <h3 className="text-xl font-bold">Dịch vụ phòng</h3>
            <div className="mt-4">
              {selectedRoom.serviceList.map((service) => (
                <div key={service.id}>
                  <strong>{service.name}:</strong> {service.price.toLocaleString()} đ
                </div>
              ))}
            </div>
            <button onClick={handleCloseModal} className="mt-4 px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusPayment;