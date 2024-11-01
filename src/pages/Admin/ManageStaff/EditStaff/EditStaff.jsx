import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditStaff = ({ isOpen, onClose, fetchData, staffData }) => {
    const accessToken = getAccessTokenFromLS();
    const [idStaff, setIdStaff] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [roleId, setRoleId] = useState(1); // Mặc định chọn Quản trị

    // Sử dụng useEffect để thiết lập giá trị ban đầu từ staffData
    useEffect(() => {
        if (staffData) {
            setIdStaff(staffData.id)
            setEmail(staffData.email);
            setFirstName(staffData.firstName);
            setLastName(staffData.lastName);
            setPhone(staffData.phone);
            setBirthday(staffData.birthday);
            setRoleId(staffData.role.id);
        }
    }, [staffData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !firstName || !lastName || !phone || !birthday) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const updatedStaff = {
            "email": email,
            "firstName": firstName,
            "lastName": lastName,
            "phone": phone,
            "birthday": birthday,
            "roleId": roleId,
            "userId": idStaff
        };
        
        console.log(updatedStaff);
        try {
            const response = await adminApi.editStaff(accessToken, updatedStaff);
            console.log(response);
            if (response.data.statusCode === 200) {
                Swal.fire('Thành công!', 'Nhân viên đã được cập nhật thành công.', 'success');
                fetchData(); // Tải lại dữ liệu
                onClose(); // Đóng modal
                // Reset state variables
                setEmail('');
                setFirstName('');
                setLastName('');
                setPhone('');
                setBirthday('');
                setRoleId(1); // Reset về giá trị mặc định
            }
        } catch (error) {
            console.error("Error updating staff:", error);
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
                <h2 className="text-xl font-bold mb-4">Chỉnh sửa nhân viên</h2>
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
                            Cập nhật nhân viên
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStaff;