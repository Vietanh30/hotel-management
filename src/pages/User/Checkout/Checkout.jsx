import React, { useState } from 'react';
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import iconFile from "../../../assets/Checkout/iconFile.svg"
import BackToTopButton from '../../../components/BackToTopButton/BackToTopButton';
function Checkout() {
  const [title, setTitle] = useState('Ông');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Việt Nam');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu form tại đây
    console.log({
      title,
      name,
      email,
      confirmEmail,
      phone,
      country,
      message
    });
  }

  return (
    <>
      <Header />
      <div className="bg-[#E5E5E5] w-full">
        <div className="container py-9 mx-auto">
            <div className="text-center text-[#002864] text-4xl">
                Thông tin đặt phòng
            </div>
            <div className='px-8 grid grid-cols-10 gap-6 mt-6'>
                <div className="col-span-7">
                    <div className='bg-white rounded p-5 h-fit w-full'>
                        <div className="font-inter font-medium text-xl">
                            Thông tin người đặt phòng
                        </div>
                        <hr className="my-5" />
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-1 flex flex-col justify-end">
                                <label
                                htmlFor="title"
                                className="font-inter text-sm font-medium text-gray-700"
                                >
                                Tiêu đề
                                </label>
                                <select
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                >
                                <option>Ông</option>
                                <option>Bà</option>
                                </select>
                            </div>
                            <div className="col-span-1 flex flex-col justify-end">
                                <label
                                htmlFor="name"
                                className="font-inter text-sm font-medium text-gray-700"
                                >
                                Họ và Tên <span className='text-red-500'>*</span>
                                </label>
                                <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="font-inter text-sm mt-1 w-full border px-4 py-2 border-gray-300 rounded-md focus:border-yellow-500 hover:border-yellow-500"
                                />
                            </div>
                            <div className="col-span-1 flex flex-col justify-end">
                                <label
                                htmlFor="email"
                                className="font-inter text-sm font-medium text-gray-700"
                                >
                                Email <span className='text-red-500'>*</span>
                                </label>
                                <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="font-inter text-sm mt-1 w-full border px-4 py-2 border-gray-300 rounded-md focus:border-yellow-500 hover:border-yellow-500"
                                />
                            </div>
                            <div className="col-span-1 flex flex-col justify-end">
                                <label
                                htmlFor="confirm-email"
                                className="font-inter text-sm font-medium text-gray-700"
                                >
                                Nhập lại email <span className='text-red-500'>*</span>
                                </label>
                                <input
                                type="email"
                                name="confirm-email"
                                id="confirm-email"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                className="font-inter text-sm mt-1 w-full border px-4 py-2 border-gray-300 rounded-md focus:border-yellow-500 hover:border-yellow-500"
                                />
                            </div>
                            <div className="col-span-1 flex flex-col justify-end">
                                <label
                                htmlFor="phone"
                                className="font-inter text-sm font-medium text-gray-700"
                                >
                                Số điện thoại <span className='text-red-500'>*</span>
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm group">
                                <div className="mt-1 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md  px-3 flex items-center justify-center group-focus:border-yellow-500 group-hover:border-yellow-500">
                                    <span>+84</span>
                                </div>
                                <input
                                    type="number"
                                    name="phone"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1 w-full border border-l-0 rounded-l-none px-4 py-2 border-gray-300 rounded-md group-focus:border-yellow-500 group-hover:border-yellow-500"
                                />
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col justify-end">
                                <label
                                htmlFor="country"
                                className="font-inter text-sm font-medium text-gray-700"
                                >
                                Quốc gia <span className='text-red-500'>*</span>
                                </label>
                                <select
                                id="country"
                                name="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="mt-1 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                >
                                <option>Việt Nam</option>
                                {/* Thêm các quốc gia khác vào đây */}
                                </select>
                            </div>
                            </div>
                            <div className="mt-6">
                            <label
                                htmlFor="message"
                                className="font-inter text-sm font-medium text-gray-700"
                            >
                                Yêu cầu thêm
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="3"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="font-inter text-sm mt-1 w-full border px-4 py-2 border-gray-300 rounded-md focus:border-yellow-500 hover:border-yellow-500"
                                placeholder="Ví dụ: Số thích về Giường, địa điểm đón hoặc trả khách">
                            </textarea>
                            </div>
                        </form>
                    </div>
                    <div className="bg-white rounded p-5 h-fit mt-5">
                        <div className="font-inter font-medium text-xl">
                            Chính sách đặt phòng
                        </div>
                        <hr className="my-4" />
                        <div className='flex items-start gap-4 font-inter'>
                            <div>
                                <img className='w-7 h-auto' src={iconFile} alt="" />
                            </div>
                            <div >
                                <div className='font-semibold'>
                                Deluxe King
                                </div>
                                <div className='mt-3 text-sm'><span className='font-semibold'>Hủy:</span>  Nếu hủy, thay đổi hoặc không đến, khách sẽ trả toàn bộ giá trị tiền đặt phòng.</div>
                                <div className='mt-2 text-sm'><span className='font-semibold'>Thanh toán:</span>Thanh toán toàn bộ giá trị tiền đặt phòng.</div>
                                <div className='mt-2 text-sm font-semibold'>Đã bao gồm ăn sáng</div>
                            </div>
                        </div>
                    <div className='border-2 border-b border-dashed my-5'></div>
                    </div>
                </div>
                <div className="col-span-3 p-5 rounded bg-white h-fit">
                    <div className='font-inter font-medium text-xl'>
                        Yêu cầu đặt phòng của bạn
                    </div>
                    <hr className="my-4" />
                    <div>
                        <div className='font-inter font-semibold text-lg'>Khách sạn nhóm 7</div>
                        <div className='font-inter font-semibold mt-3 text-sm'>Nhận phòng: Thứ 4, 30/10/2024 từ 14:00</div>
                        <div className='font-inter font-semibold mt-3 text-sm'>Trả phòng: Thứ 6, 08/11/2024 cho đến 12:00</div>
                        <div className='font-inter font-semibold mt-3 text-sm'>(3 ngày 2 đêm)</div>
                        <div className='border-b border-dashed my-5 border-2'></div>
                        <div className='font-inter font-medium'>Thông tin phòng</div>
                        <div className='mt-3 font-inter text-sm font-light'>
                            <span className='font-semibold'>Phòng 1: </span>Phòng Deluxe King Ocean Views
                        </div>
                        <div className='font-inter text-sm font-light'>
                            <div className='mt-2'>FLASH DEAL _3D</div>
                            <div className='mt-2'>Dành cho 1 Người lớn - 2 Trẻ em - 0 Em bé</div>
                            <div className='mt-2'>Phụ thu trẻ em: 188,000 VNĐ /đêm</div>
                            <div className='mt-2'>Giá phòng: 1,580,985 VNĐ</div>
                        </div>
                        <div className='mt-4 font-semibold font-inter text-end'>1,580,985 VNĐ</div>
                        <div className='my-4 border-b border-dashed'></div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='font-inter font-semibold'>Giá phòng</div>
                        <div className='font-inter font-semibold'>3,580,985 VNĐ</div>
                    </div>
                    <hr  className='mt-6 mb-4'/>
                    <div className='flex justify-between items-center'>
                        <div className='font-inter font-semibold'>Tổng phòng</div>
                        <div className='font-inter font-semibold text-yellow-500 text-xl'>3,580,985 VNĐ</div>
                    </div>
                    <div className='font-inter text-sm font-light mt-6'>Bao gồm tất cả các loại thuế và phí dịch vụ</div>
                    <div className='font-inter text-sm mt-1 text-red-500'>(Theo quy định của Ngân hàng Nhà nước Việt Nam, Quý khách vui lòng thanh toán bằng VNĐ)</div>
                    <div className='my-6 border-2 border-dashed'></div>
                    </div>
            </div>
        
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default Checkout;