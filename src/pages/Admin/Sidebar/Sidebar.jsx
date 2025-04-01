import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faConciergeBell, faBed, faUserGroup, faCalendarCheck, faChartLine, faCommentDots, faDoorOpen, faUser, faHistory } from '@fortawesome/free-solid-svg-icons';
import path from "../../../constants/path";
import { Link, useNavigate } from "react-router-dom";
import flagVietnam from "../../../assets/Header/flagsVietnam.svg";
import { useLocation } from "react-router-dom";
import { clearLS, getRoleFromLS } from "../../../utils/auth";

function Sidebar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const userRole = getRoleFromLS(); // Get the user role

    const isActive = (targetPath) => location.pathname === targetPath;
    const handleLogOut = () => {
        clearLS();
        navigate(path.login);
    };

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-[#F5E8D0] border-b border-yellow-500">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <Link to={path.dashboard} className="flex flex-col items-center cursor-pointer">
                                <div className="text-[#B5986D] text-4xl font-bold">Hotel Del Luna</div>
                                <div className="flex gap-5 items-center">
                                    <div className="w-11 border-b border-[#B5986D]"></div>
                                    <img src={flagVietnam} alt="Vietnam Flag" />
                                    <div className="w-11 border-b border-[#B5986D]"></div>
                                </div>
                            </Link>
                        </div>
                        <div className="flex items-center relative">
                            <div className="flex items-center me-10">
                                <button
                                    type="button"
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                                    aria-expanded={dropdownOpen}
                                    onClick={toggleDropdown}
                                >
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                        alt="user photo"
                                    />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute z-50 my-4 text-sm min-w-40 list-none bg-[#a27b41] hover:bg-[#885d37] divide-y divide-gray-100 rounded shadow-md right-[40%] top-[55%]">
                                        <ul>
                                            <li>
                                                <button className="block w-full py-2 text-sm text-white shadow-md font-semibold" onClick={handleLogOut}>Đăng xuất</button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-60 h-screen pt-20 transition-transform -translate-x-full bg-[#F5E8D0] border-r border-gray-200 sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-6 overflow-y-auto bg-[#F5E8D0] text-black">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to={path.dashboard} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.dashboard) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faHome} className="mr-2" />
                                <span className="ms-3">Trang chủ</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={path.manageTypeRoom} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageTypeRoom) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faList} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý hạng phòng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={path.manageService} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageService) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faConciergeBell} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý dịch vụ khách sạn</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={path.manageRoom} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageRoom) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faBed} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý phòng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={path.manageNumberRoom} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageNumberRoom) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý số phòng</span>
                            </Link>
                        </li>
                        {/* Add the new Room Service Management link */}
                        <li>
                            <Link to={path.manageRoomService} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageRoomService) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faConciergeBell} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý dịch vụ phòng</span>
                            </Link>
                        </li>
                        {userRole === 'ROLE_ADMINISTRATOR' && (
                            <li>
                                <Link to={path.manageStaff} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageStaff) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                    <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Quản lý nhân viên</span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link to={path.manageCustomer} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageCustomer) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý khách hàng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={path.manageBooking} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageBooking) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý đặt phòng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={path.bookingHistoryAdmin} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.bookingHistory) ? 'bg-yellow-500 text-white' : 'text-gray-900 hover:bg-yellow-500 hover:text-white'}`}>
                                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Lịch sử đặt phòng</span>
                            </Link>
                        </li>

                    </ul>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;