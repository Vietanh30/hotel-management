import React, { useState } from 'react';
import Swal from 'sweetalert2';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AddStaff = ({ isOpen, onClose, fetchData }) => {
    const accessToken = getAccessTokenFromLS();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [roleId, setRoleId] = useState(1); // Mặc định chọn Quản trị

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password || !firstName || !lastName || !phone || !birthday) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const newStaff = {
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "phone": phone,
            "birthday": birthday,
            "roleId": roleId
        };

        try {
            const response = await adminApi.addStaff(accessToken, newStaff);
            console.log(response);
            if (response.data.statusCode === 201) {
                Swal.fire('Thành công!', 'Nhân viên đã được thêm thành công.', 'success');
                fetchData(); // Tải lại dữ liệu
                onClose(); // Đóng modal
                // Reset state variables
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
                setPhone('');
                setBirthday('');
                setRoleId(1); // Reset về giá trị mặc định
            }
        } catch (error) {
            console.error("Error adding staff:", error);
            Swal.fire('Lỗi!', error.response.data.description, 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <h2 className="text-xl font-bold mb-4">Thêm nhân viên</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                            autoComplete=''
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Họ"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Tên"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Số điện thoại"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            placeholder="Ngày sinh"
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                    <div className="mb-4">
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(Number(e.target.value))}
                            className="border rounded w-full p-2 focus:outline-none focus:border-yellow-500"
                        >
                            <option value={1}>Quản trị</option>
                            <option value={2}>Nhân viên</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold"
                        >
                            Thêm nhân viên
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaff;