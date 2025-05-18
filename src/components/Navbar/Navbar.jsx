import React, { useState } from "react";
import { clearLS, getAccessTokenFromLS } from "../../utils/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import path from "../../constants/path";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = getAccessTokenFromLS();

  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-[#F5E8D0] sticky top-0 py-4 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-12">
          <a href={`${path.home}#overview`} className={`text-base text-black ${getTextClass('#overview')} hover:text-[#935d2e] font-garamond font-medium`}>Tổng quan</a>
          <a href={`${path.home}#typeRoom`} className={`text-base text-black ${getTextClass('#typeRoom')} hover:text-[#935d2e] font-garamond font-medium`}>Hạng phòng</a>
          <a href={`${path.home}#rating`} className={`text-base text-black ${getTextClass('#rating')} hover:text-[#935d2e] font-garamond font-medium`}>Đánh giá</a>
          <a href={`${path.home}#services`} className={`text-base text-black ${getTextClass('#services')} hover:text-[#935d2e] font-garamond font-medium`}>Dịch vụ</a>
          <a href={`${path.home}#location`} className={`text-base text-black ${getTextClass('#location')} hover:text-[#935d2e] font-garamond font-medium`}>Vị trí</a>
          <a href={`${path.home}#faqs`} className={`text-base text-black ${getTextClass('#faqs')} hover:text-[#935d2e] font-garamond font-medium`}>Hỏi đáp</a>
        </div>
        <div className="flex items-center space-x-4 relative">
          {accessToken && (
            <div>
              <button
                className="bg-[#B5986D] text-white rounded-md py-[5px] px-4 hover:bg-[#8A6A4E]"
                onClick={toggleDropdown}
              >
                Tùy chọn
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm font-semibold hover:text-white hover:bg-yellow-400"
                    onClick={handleBookingHistory}
                  >
                    Lịch sử đặt
                  </button>
                  <Link
                    to={path.changePassword}
                    className="block w-full text-left px-4 py-2 text-sm font-semibold hover:text-white hover:bg-yellow-400"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm font-semibold hover:text-white hover:bg-yellow-400"
                    onClick={handleAuthToggle}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
          {!accessToken && (
            <button
              className="bg-[#B5986D] text-white rounded-md py-[5px] px-4 hover:bg-[#8A6A4E]"
              onClick={handleAuthToggle}
            >
              {accessToken ? 'Đăng xuất' : 'Đăng nhập'}
            </button>

          )}
          {!accessToken && (
            <button className="bg-[#B5986D] text-white rounded-md py-[5px] px-4 hover:bg-[#8A6A4E]"
              onClick={() => navigate(path.register)}
            >
              Đăng ký
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;