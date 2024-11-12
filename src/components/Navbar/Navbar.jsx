import React from "react";
import { clearLS, getAccessTokenFromLS } from "../../utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import path from "../../constants/path";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = getAccessTokenFromLS();

  // Get the current hash from the URL
  const currentHash = location.hash;

  // Function to determine the text color based on the current hash
  const getTextClass = (hash) => {
    return currentHash === hash ? "text-yellow-500" : "text-[#a27b41]";
  };

  const handleAuthToggle = () => {
    if (accessToken) {
      clearLS();
      navigate(path.login);
    } else {
      navigate(path.login);
    }
  };

  const handleBookingHistory = () => {
    if (accessToken) {
      navigate(path.bookingHistory); // Thay đổi đường dẫn tới trang lịch sử đặt
    }
  };

  return (
    <div className="bg-[#F5E8D0] sticky top-0 py-4 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <a href={`${path.home}#overview`} className={`text-base ${getTextClass('#overview')} hover:text-[#885d37] font-garamond font-medium`}>Tổng quan</a>
          <a href={`${path.home}#typeRoom`}  className={`text-base ${getTextClass('#typeRoom')} hover:text-[#885d37] font-garamond font-medium`}>Hạng phòng</a>
          <a href={`${path.home}#rating`}  className={`text-base ${getTextClass('#rating')} hover:text-[#885d37] font-garamond font-medium`}>Đánh giá</a>
          <a href={`${path.home}#services`} className={`text-base ${getTextClass('#services')} hover:text-[#885d37] font-garamond font-medium`}>Dịch vụ</a>
          <a href={`${path.home}#location`} className={`text-base ${getTextClass('#location')} hover:text-[#885d37] font-garamond font-medium`}>Vị trí</a>
          <a href={`${path.home}#faqs`}  className={`text-base ${getTextClass('#faqs')} hover:text-[#885d37] font-garamond font-medium`}>Hỏi đáp</a>
        </div>
        <div className="flex items-center space-x-4">
          {accessToken && (
            <button 
              className="bg-[#B5986D] text-white rounded-md py-[5px] px-4 hover:bg-[#8A6A4E]"
              onClick={handleBookingHistory}
            >
              Lịch sử đặt
            </button>
          )}
          <button 
            className="bg-[#B5986D] text-white rounded-md py-[5px] px-4 hover:bg-[#8A6A4E]"
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