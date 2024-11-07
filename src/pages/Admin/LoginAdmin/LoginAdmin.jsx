import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import bgLogin from "../../../assets/Login/bg-login.svg";
import flagVietnam from "../../../assets/Header/flagsVietnam.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import path from "../../../constants/path";
import authApi from '../../../api/authApi'; // Import your API
import { setAccessTokenToLS, setRoleTokenToLS } from '../../../utils/auth'; // Ensure this function exists

function LoginAdmin({ setUserRole }) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const errors = {};
        if (!formData.email) {
            errors.email = "Email không được để trống!";
        }
        if (!formData.password) {
            errors.password = "Mật khẩu không được để trống!";
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
    
            // Focus on the first input with an error
            if (validationErrors.email) {
                document.querySelector('input[name="email"]').focus();
            } else if (validationErrors.password) {
                document.querySelector('input[name="password"]').focus();
            }
            return;
        }
    
        setLoading(true);
        try {
            const response = await authApi.login(formData.email, formData.password);
            console.log(response);
            if (response.data.statusCode === 200) {
                setAccessTokenToLS(response.data.data.accessToken);
                setRoleTokenToLS(response.data.data.roles[0])     
                setUserRole(response.data.data.roles[0]);           
                // Uncomment the line below to navigate to the home page after login
                navigate(path.dashboard);
            }
        } catch (error) {
            let errorMessage = 'Đăng nhập không thành công! Vui lòng kiểm tra lại thông tin.';
    
            // Check if error.response exists
            if (error.response) {
                // If response exists, check status code and set appropriate message
                if (error.response.data) {
                    errorMessage = error.response.data.description || errorMessage;
                }
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'Không nhận được phản hồi từ máy chủ.';
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = error.message;
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
                                <div className="font-inter text-2xl mt-8 font-bold pb-2 border-b-4 w-[50%] text-center border-b-[#F2A900]">Đăng nhập</div>
                                <form onSubmit={handleSubmit}>
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
                                                autoComplete="email"
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
                                                autoComplete="current-password"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-8">
                                        <div className="flex items-center">
                                            <input
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg"
                                                type="checkbox"
                                                id="remember"
                                            />
                                            <label className="ml-2 block text-gray-700" htmlFor="remember">
                                                Ghi nhớ mật khẩu
                                            </label>
                                        </div>
                                        <Link to={path.forgotPassword} className="text-blue-500 hover:text-blue-700">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                    <div className="flex justify-center mt-6">
                                        <button
                                            className="bg-yellow-500 w-full hover:bg-yellow-600 font-inter text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                        </button>
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default LoginAdmin;