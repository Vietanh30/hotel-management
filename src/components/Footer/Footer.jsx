import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import flagVietnam from "../../assets/Header/flagsVietnam.svg";
import be from "../../assets/Footer/be.svg";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#232323] text-white py-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-start">
                        <div className="flex flex-col items-center">
                            <div className='text-white text-4xl font-bold'>
                                Nhóm 7
                            </div>
                            <div className='flex gap-5 items-center'>
                                <div className='w-11 border-b border-white'></div>
                                <img src={flagVietnam} alt="Vietnam Flag" />
                                <div className='w-11 border-b border-white'></div>
                            </div>
                        </div>
                        <div className="flex space-x-10 mt-6">
                            <Link className="hover:text-gray-400">
                                <FontAwesomeIcon className='w-5 h-5' icon={faFacebook} /> {/* Biểu tượng Facebook */}
                            </Link>
                            <div>
                                <img className='w-5 h-5' src={be} alt="" />
                            </div>
                            <Link className="hover:text-gray-400">
                                <FontAwesomeIcon  className='w-5 h-5'icon={faInstagram} /> {/* Biểu tượng Instagram */}
                            </Link>
                        </div>
                        <div className="mt-10 font-garamond text-gray-300">Privacy policy</div>
                        <div className='mt-3 font-garamond text-gray-300'>Cookie policy</div>
                        <div className='mt-3 font-garamond text-gray-300'>Terms of use</div>
                    </div>
                    <div className="flex flex-col items-start mt-10">
                        <div className="text-xl font-semibold">Contact</div>
                        <div className='mt-10'>Mo - Fr: 09:00 - 18:00</div>
                        <div className='text-[#B5986D] mt-3'>+12 345 678 89</div>
                        <div className='text-[#B5986D] mt-3'>+12 345 678 89</div>
                        <div className='mt-3'>lovevietnam.vn</div>
                    </div>
                    <div className="flex flex-col items-start mt-10">
                        <div className="text-xl font-semibold">Menu</div>
                        <div className='flex gap-14'>
                            <div>
                                <div className='mt-10'>For tourists</div>
                                <div className='mt-3'>For travel agencies</div>
                                <div className='mt-3'>For travel agencies</div>
                            </div>
                            <div>
                                <div className='mt-10'>Stocks</div>
                                <div className='mt-3'>Contacts</div>
                                <div className='mt-3'>About us</div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;