import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';

const EditCustomer = ({ isOpen, onClose, customerData, fetchData }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customerData) {
            setEmail(customerData.email);
            setFirstName(customerData.firstName);
            setLastName(customerData.lastName);
            setPhone(customerData.phone);
            setBirthday(customerData.birthday);
        }
    }, [customerData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Kiểm tra các trường bắt buộc
        if (!email || !firstName || !lastName || !phone || !birthday) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setLoading(false);
            return;
        }

        const updatedCustomer = {
            "email" :email,
            "firstName":firstName,
            "lastName":lastName,
            "phone":phone,
            "birthday":birthday,
            "userId": customerData.id
        };

        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.editCustomer(accessToken, updatedCustomer); // Giả sử có phương thức updateCustomer
            if (response.data.statusCode === 200) {
                Swal.fire('Thành công!', 'Khách hàng đã được cập nhật thành công.', 'success');
                fetchData(); // Tải lại dữ liệu
                onClose(); // Đóng modal
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi cập nhật khách hàng.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4">Chỉnh sửa khách hàng</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Họ"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Tên"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Số điện thoại"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Đang cập nhật...' : 'Cập nhật khách hàng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCustomer;