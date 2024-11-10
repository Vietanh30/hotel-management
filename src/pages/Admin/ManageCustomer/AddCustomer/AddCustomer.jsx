import React, { useState } from 'react';
import Swal from 'sweetalert2';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AddCustomer = ({ isOpen, onClose, fetchData }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Kiểm tra các trường bắt buộc
        if (!email || !firstName || !lastName || !phone || !birthday || !password) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setLoading(false);
            return;
        }

        const newCustomer = {
            email,
            password,
            firstName,
            lastName,
            phone,
            birthday,
        };

        try {
            const accessToken = getAccessTokenFromLS();
            const response = await adminApi.addCustomer(accessToken, newCustomer);
            if (response.data.statusCode === 201) {
                Swal.fire('Thành công!', 'Khách hàng đã được thêm thành công.', 'success');
                fetchData(); // Tải lại dữ liệu
                onClose(); // Đóng modal
                // Reset state variables
                setEmail('');
                setFirstName('');
                setLastName('');
                setPhone('');
                setBirthday('');
                setPassword('');
            }
        } catch (error) {
            console.error("Error adding customer:", error);
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi thêm khách hàng.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4">Thêm khách hàng</h2>
                
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                        <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                    </button>

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
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
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
                            type="number"
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
                            {loading ? 'Đang thêm...' : 'Thêm khách hàng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;