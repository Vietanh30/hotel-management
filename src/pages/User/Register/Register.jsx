import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import bgLogin from "../../../assets/Login/bg-login.svg";
import flagVietnam from "../../../assets/Header/flagsVietnam.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faPhone } from '@fortawesome/free-solid-svg-icons'; // Import phone icon
import { Link } from "react-router-dom";
import path from "../../../constants/path";
import authApi from '../../../api/authApi';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const errors = {};
        if (!formData.firstName) {
            errors.firstName = "Tên không được để trống!";
        }
        if (!formData.lastName) {
            errors.lastName = "Họ không được để trống!";
        }
        if (!formData.email) {
            errors.email = "Email không được để trống!";
        }
        if (!formData.password) {
            errors.password = "Mật khẩu không được để trống!";
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Mật khẩu không khớp!";
        }
        if (!formData.phone) {
            errors.phone = "Số điện thoại không được để trống!";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            const errorMessages = Object.values(validationErrors).join('\n');
            Swal.fire({
                title: 'Lỗi!',
                text: errorMessages,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        setLoading(true);
        try {
            const { firstName, lastName, email, password, phone } = formData; 
            const response = await authApi.register(firstName, lastName, email, password, phone); 
            console.log(response);
            if (response.data.statusCode === 200) {
                Swal.fire({
                    title: 'Thành công!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phone: ''
                });
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.log(error);
            let errorMessage = 'Đăng ký không thành công! Vui lòng kiểm tra lại thông tin.';
            if (error.response && error.response.status === 409) {
                errorMessage = error.response.data.description || errorMessage;
            }
            Swal.fire({
                title: 'Lỗi!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen">
                <div className="grid grid-cols-12">
                    <div className="col-span-7">
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
                                <div className="font-inter text-2xl mt-8 font-bold pb-2 border-b-4 w-[50%] text-center border-b-[#F2A900]">Đăng ký</div>
                                <form onSubmit={handleSubmit}>
                                    <div className="mt-8">
                                        <div className="relative">
                                            <input
                                                className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                                name="firstName"
                                                type="text"
                                                placeholder="Tên"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                autoComplete=''
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <div className="relative">
                                            <input
                                                className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                                name="lastName"
                                                type="text"
                                                placeholder="Họ"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                autoComplete=''
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                            <input
                                                className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                autoComplete=''
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faPhone} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                            <input
                                                className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                                name="phone"
                                                type="text"
                                                placeholder="Số điện thoại"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                autoComplete=''
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                            <input
                                                className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                                name="password"
                                                type="password"
                                                placeholder="Mật khẩu"
                                                value={formData.password}
                                                onChange={handleChange}
                                                autoComplete=''
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                            <input
                                                className="border border-[#ccc] appearance-none rounded-lg w-full py-3 pl-10 pr-3 focus:outline-[#F2A900] focus:shadow-orange-400"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="Nhập lại mật khẩu"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                autoComplete=''
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-6">
                                        <button
                                            className="bg-yellow-500 w-full hover:bg-yellow-600 font-inter text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
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

export default Register;