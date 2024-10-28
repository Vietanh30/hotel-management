import React from "react";
import { clearLS, getAccessTokenFromLS } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import path from "../../constants/path";

function Navbar() {
  const navigate = useNavigate()
  const accessToken = getAccessTokenFromLS();

  const handleAuthToggle = () => {
    if (accessToken) {
      clearLS()
      navigate(path.login)
    } else {
      navigate(path.login)
    }
  };

  return (
    <div className="bg-[#F5E8D0] sticky top-0 py-4 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <a href="#overview" className="text-base text-[#a27b41] hover:text-[#885d37] font-garamond font-medium">Tổng quan</a>
          <a href="#typeRoom" className="text-base text-[#a27b41] hover:text-[#885d37] font-garamond font-medium">Hạng phòng</a>
          <a href="#rating" className="text-base text-[#a27b41] hover:text-[#885d37] font-garamond font-medium">Đánh giá</a>
          <a href="#services" className="text-base text-[#a27b41] hover:text-[#885d37] font-garamond font-medium">Dịch vụ</a>
          <a href="#location" className="text-base text-[#a27b41] hover:text-[#885d37] font-garamond font-medium">Vị trí</a>
          <a href="#faqs" className="text-base text-[#a27b41] hover:text-[#885d37] font-garamond font-medium">Hỏi đáp</a>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring focus:ring-[#B5986D] w-48"
          />
          <button 
            className="bg-[#B5986D] text-white rounded-md py-2 px-4 hover:bg-[#8A6A4E]"
            onClick={handleAuthToggle}
          >
            {accessToken ? 'Đăng xuất' : 'Đăng nhập'}
          </button>
          {!accessToken && (
            <button className="bg-[#B5986D] text-white rounded-md py-2 px-4 hover:bg-[#8A6A4E]">
              Đăng ký
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;