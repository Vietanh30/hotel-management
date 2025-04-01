import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import iconVietNam from "../../assets/Header/iconVietNam.svg";
import flagVietnam from "../../assets/Header/flagsVietnam.svg";
import { Link } from 'react-router-dom';
import path from '../../constants/path';

function Header() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center py-7">
                <div className="flex items-center gap-8 w-1/3">
                    <div className="flex font-bold gap-2 items-center text-base">
                        <FontAwesomeIcon icon={faPhone} />
                        0352830916
                    </div>
                    <div className='flex gap-2 items-center'>
                        <FontAwesomeIcon icon={faFacebook} size="lg" />
                        <FontAwesomeIcon icon={faInstagram} size="lg" />
                        <FontAwesomeIcon icon={faYoutube} size="lg" />
                    </div>
                </div>
                <Link to={path.home} className="flex flex-col items-center cursor-pointer">
                    <div className='text-[#B5986D] text-4xl font-bold'>
                        Hotel Del Luna
                    </div>
                    <div className='flex gap-5 items-center'>
                        <div className='w-11 border-b border-[#B5986D]'></div>
                        <img src={flagVietnam} alt="Vietnam Flag" />
                        <div className='w-11 border-b border-[#B5986D]'></div>
                    </div>
                </Link>
                <div className='flex items-center gap-4 w-1/3 justify-end'>
                    <img src={iconVietNam} alt="Vietnam Icon" />
                    {/* <div className='flex items-center gap-4 relative'>
                        <FontAwesomeIcon icon={faGlobe} size="lg" onClick={toggleDropdown} className="cursor-pointer" />
                        {isDropdownOpen && (
                            <div className="absolute -left-8 top-5 mt-2 w-32 bg-white border rounded-lg shadow-lg z-30">
                                <ul className="py-1">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Vietnamese</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">English</li>
                                </ul>
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Header;