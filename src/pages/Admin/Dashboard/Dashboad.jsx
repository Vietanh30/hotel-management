import { useState, useEffect } from 'react';
import Sidebar from "../Sidebar/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faBed, faArrowUp, faUser } from '@fortawesome/free-solid-svg-icons';
import adminApi from '../../../api/adminApi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getAccessTokenFromLS } from '../../../utils/auth';
import { faServicestack } from '@fortawesome/free-brands-svg-icons';

Chart.register(...registerables); // Register all components

function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalCustomers: 0,
        totalServices: 0,
        totalRooms: 0,
        revenueData: [],
        roomStatusData: {}
    });
    const [reportType, setReportType] = useState('day'); // Thống kê theo ngày mặc định

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const accessToken = getAccessTokenFromLS();
                const response = await adminApi.getDashBoard(accessToken, reportType);
                const data = response.data.data;

                setDashboardData({
                    totalUsers: data.countUser,
                    totalCustomers: data.countCustomer,
                    totalServices: data.countService,
                    totalRooms: data.countRoom,
                    revenueData: data.chart,
                    roomStatusData: data.circleChart
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, [reportType]); // Gọi lại khi reportType thay đổi

    // Cấu trúc dữ liệu cho biểu đồ doanh thu
    const revenueChartData = {
        labels: dashboardData.revenueData.map(item => item.day),
        datasets: [{
            label: 'Doanh thu',
            data: dashboardData.revenueData.map(item => item.price),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    // Cấu trúc dữ liệu cho biểu đồ trạng thái phòng
    const roomStatusData = {
        labels: ['Phòng đã đặt', 'Phòng còn lại', 'Phòng trong giỏ'],
        datasets: [{
            data: [
                dashboardData.roomStatusData.roomBooked,
                dashboardData.roomStatusData.roomAvailable,
                dashboardData.roomStatusData.roomCart
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
    };

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-60 bg-slate-50 min-h-screen">
                <div className="grid grid-cols-4 gap-4 mt-20 p-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <FontAwesomeIcon icon={faUser} className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Tổng nhân viên</h3>
                                <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
                                
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                                <FontAwesomeIcon icon={faUserFriends} className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Tổng khách hàng</h3>
                                <p className="text-3xl font-bold">{dashboardData.totalCustomers}</p>
                                
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="bg-yellow-100 p-2 rounded-full mr-3">
                                <FontAwesomeIcon icon={faServicestack} className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Tổng dịch vụ</h3>
                                <p className="text-3xl font-bold">{dashboardData.totalServices}</p>
                                
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <FontAwesomeIcon icon={faBed} className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Tổng phòng</h3>
                                <p className="text-3xl font-bold">{dashboardData.totalRooms}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-4 p-4">
                    <div className='col-span-2'>
                        <h2 className="text-xl font-bold">Doanh thu theo ngày</h2>
                        <div className="flex mb-4 gap-4">
                            <button 
                                onClick={() => setReportType('day')} 
                                className={`px-3 py-2 rounded ${reportType === 'day' ? ' text-base bg-yellow-500 text-white hover:bg-yellow-600 font-semibold' : 'bg-gray-200'}`}
                            >
                                Theo Ngày
                            </button>
                            <button 
                                onClick={() => setReportType('month')} 
                                className={`px-3 py-2 rounded ${reportType === 'month' ? ' text-base bg-yellow-500 text-white hover:bg-yellow-600 font-semibold' : 'bg-gray-200'}`}
                            >
                                Theo Tháng
                            </button>
                        </div>
                        {dashboardData.revenueData.length > 0 ? (
                            <Bar data={revenueChartData} options={{ responsive: true }} />
                        ) : (
                            <p className="text-center text-gray-500">Chưa có dữ liệu</p>
                        )}
                    </div>
                    <div className='col-span-1'>
                        <h2 className="text-xl font-bold">Trạng thái phòng</h2>
                        {dashboardData.roomStatusData.roomBooked !== undefined ? (
                            <Pie data={roomStatusData} options={{ responsive: true }} />
                        ) : (
                            <p className="text-center text-gray-500">Chưa có dữ liệu</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;