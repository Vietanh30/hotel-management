import React, { useState } from 'react';
import bgLogin from "../../../assets/Login/bg-login.svg";
import flagVietnam from "../../../assets/Header/flagsVietnam.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import path from "../../../constants/path";
import authApi from "../../../api/authApi";
import Swal from 'sweetalert2';
import { getAccessTokenFromLS } from "../../../utils/auth";

function ChangePassword() {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // State để quản lý loading
    const accessToken = getAccessTokenFromLS();

    const handleChangePassword = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của form

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Mật khẩu mới và xác nhận mật khẩu không khớp!',
            });
            return;
        }

        setLoading(true); // Bắt đầu loading
        try {
            const response = await authApi.changePassword(accessToken, email, currentPassword, newPassword, confirmPassword);
            console.log(response);
            if (response.data.statusCode === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: response.data.description || 'Đổi mật khẩu thành công!',
                });
                setEmail('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Swal.fire({
                icon: 'error',
                title: 'Đã xảy ra lỗi!',
                text: error.response?.data.description || 'Vui lòng thử lại.',
            });
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return ( 
        <>
        <div className="min-h-screen">
            <div className="grid grid-cols-12">
                <div className="col-span-7 ">
                    <img className="w-full min-h-screen relative" src={bgLogin} alt="" />
                    <div className="absolute top-[10%] left-[22%] transform -translate-x-1/2 -translate-y-1/2 text-white">
                        <div className="text-4xl font-bold mb-4">Trải nghiệm du lịch đẳng cấp tại Nhóm 7</div>
                        <div className="text-2xl">Hưởng nhiều ưu đãi và tích lũy điểm thưởng khi đăng ký thành viên</div>
                    </div>
                </div>
                <div className="col-span-5">
                    <div className="flex items-center justify-center mt-12">
                        <div className="rounded-lg w-full px-12">
                            <div className="flex flex-col items-center">
                                <div className='text-[#B5986D] text-4xl font-bold'>Nhóm 7</div>
                                <div className='flex gap-5 items-center'>
                                    <div className='w-11 border-b border-[#B5986D]'></div>
                                    <img src={flagVietnam} alt="Vietnam Flag" />
                                    <div className='w-11 border-b border-[#B5986D]'></div>
                                </div>
                            </div>
                            <div className="font-inter text-2xl mt-8 font-bold pb-2 border-b-4 w-[50%] text-center border-b-[#F2A900]">Đổi mật khẩu</div>
                            <form onSubmit={handleChangePassword}>
                                <div className="mt-8">
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                        <input
                                            className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                            id="email"
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                        <input
                                            className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                            id="currentPassword"
                                            type="password"
                                            placeholder="Mật khẩu hiện tại"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                        <input
                                            className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                            id="newPassword"
                                            type="password"
                                            placeholder="Mật khẩu mới"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                        <input
                                            className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Nhập lại mật khẩu mới"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center mt-6">
                                    <button
                                        className="bg-yellow-500 w-full hover:bg-yellow-600 font-inter text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                        type="submit" // Đặt type là submit
                                        disabled={loading} // Vô hiệu hóa nút khi đang loading
                                    >
                                        {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 text-end font-inter text-sm">
                                <Link to={path.login}>
                                    Đã có tài khoản? <span className="text-yellow-500 font-semibold hover:text-yellow-600">Đăng nhập ngay</span> 
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ChangePassword;