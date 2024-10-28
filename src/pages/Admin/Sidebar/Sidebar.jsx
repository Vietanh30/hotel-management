import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faConciergeBell , faBed, faUserGroup, faCalendarCheck, faChartLine, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import path from "../../../constants/path";
import { Link } from "react-router-dom";
import flagVietnam from "../../../assets/Header/flagsVietnam.svg";

function Sidebar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-[#F5E8D0] border-b border-yellow-500">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                data-drawer-target="logo-sidebar"
                                data-drawer-toggle="logo-sidebar"
                                aria-controls="logo-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 text-sm rounded-lg sm:hidden hover:bg-yellow-500 hover:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                    />
                                </svg>
                            </button>
                            <Link to={path.dashboard} className="flex flex-col items-center cursor-pointer">
                                <div className="text-[#B5986D] text-4xl font-bold">Nhóm 7</div>
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
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    aria-expanded={dropdownOpen}
                                    onClick={toggleDropdown}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                        alt="user photo"
                                    />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute z-50 my-4 text-base min-w-40 list-none bg-[#a27b41] divide-y divide-gray-100 rounded shadow-md right-[40%] top-[55%]">
                                        <ul className="py-1">
                                            <li>
                                                <Link to="" className="block px-4 py-2 text-sm text-white hover:bg-[#885d37] font-semibold">Đăng xuất</Link>
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
                            <Link to={path.dashboard} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-yellow-500 hover:text-white font-semibold text-base group">
                                <FontAwesomeIcon icon={faHome} className="mr-2" />
                                <span className="ms-3">Trang chủ</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={path.manageTypeRoom} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-yellow-500 hover:text-white font-semibold text-base group">
                                <FontAwesomeIcon icon={faList} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý hạng phòng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/service-management" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-yellow-500 hover:text-white font-semibold text-base group">
                                <FontAwesomeIcon icon={faConciergeBell } className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý dịch vụ</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/room-management" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-yellow-500 hover:text-white font-semibold text-base group">
                                <FontAwesomeIcon icon={faBed} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý phòng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/staff-management" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-yellow-500 hover:text-white font-semibold text-base group">
                                <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý nhân viên</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/booking-management" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-yellow-500 hover:text-white font-semibold text-base group">
                                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý đặt phòng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/report" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-yellow-500 hover:text-white font-semibold text-base group">
                                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Báo cáo, thống kê</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/feedback" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-yellow-500 hover:text-white font-semibold text-base group">
                                <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Quản lý phản hồi</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;