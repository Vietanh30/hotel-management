import React from 'react';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/Navbar';
import imagebanner from "../../../assets/Home/imagebanner.svg"
import SearchRoom from '../../../components/SearchRoom/SearchRoom';
import CenterModeSlider from './CenterModeSlider/CenterModeSlider';
import TypeRoom from './TypeRoom/TypeRoom';
import ServiceRoom from './ServiceRoom/ServiceRoom';
import Rating from '../../../components/Rating/Rating';
import FAQSection from './FAQSection/FAQSection';
import Footer from '../../../components/Footer/Footer';
import BackToTopButton from '../../../components/BackToTopButton/BackToTopButton';
function Home() {
    const averageRating = 4.5;
    const totalReviews = 696;
    const criteriaRatings = [
        { label: 'Vị trí', rating: 5 },
        { label: 'Sạch sẽ', rating: 4.5 },
        { label: 'Dịch vụ', rating: 4 },
        { label: 'Giá tiền', rating: 3.2 },
    ];

    return (
        <>
            <Header />
            <Navbar />
            <div className="container-fluid" id='overview'>
                <div className="relative">
                    <img className="w-full" src={imagebanner} alt="" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="flex items-center gap-5 justify-center">
                            <div className="w-24 border-b border-white opacity-80"></div>
                            <div className="font-taprom text-[32px] text-white">The</div>
                            <div className="w-24 border-b border-white opacity-80"></div>
                        </div>
                        <div className="mt-5 font-garamond text-5xl text-white text-center">
                            <div>Beautiful Country</div>
                            <div className="mt-4">
                                <span className="text-white text-2xl font-taprom">of</span> The Whole World
                            </div>
                        </div>
                    </div>
                    <SearchRoom />
                    <div className='absolute z-0 bottom-0 w-full h-24 bg-[#232323] blur-xl'></div>
                </div>
            </div>
            <div className='container-fluid'>
                <div className='bg-[#232323] w-full text-white text-center py-14 '>
                    <div className='font-garamond text-xl w-fit mx-auto border-t-2 border-t-[#B5986D] pt-2'>
                        Mục
                    </div>
                    <div className='text-5xl font-garamond pb-20'>
                        Yêu Thích
                    </div>
                    <CenterModeSlider />
                    <button className="bg-[#B5986D] text-white rounded-md py-2 px-6 font-semibold text-xl hover:bg-[#8A6A4E] mt-10">Xem thêm</button>
                </div>
            </div>
            <div className='bg-[#f4f4f5] w-full' id='typeRoom'>
                <div className='container mt-10 py-10 mx-auto'>
                    <div className='font-inter text-4xl font-semibold uppercase px-4'>Các hạng phòng</div>
                    <div className="mt-5">
                        <TypeRoom />
                    </div>
                </div>
            </div>
            <div className='bg-[#f4f4f5] w-full' id='services'>
                <div className='container mt-10 py-10 mx-auto'>
                    <div className='font-inter text-4xl font-semibold uppercase px-4'>Dịch vụ và tiện ích của Hotel Del Luna</div>
                    <div className="mt-5">
                        <ServiceRoom />
                    </div>
                </div>
            </div>
            <div className='mt-4' >
                <div className='text-center font-inter font-semibold text-5xl'>Khách sạn Hotel Del Luna</div>
                <div className='mt-20'>
                    <CenterModeSlider />
                </div>
            </div>
            <div className='my-20' id='rating'>
                <div className="container mx-auto px-4">
                    <div className='font-inter font-semibold uppercase text-4xl'>
                        ĐÁNH GIÁ CỦA KHÁCH HÀNG VỀ khách sạn Hotel Del Luna
                    </div>
                    <Rating
                        averageRating={averageRating}
                        totalReviews={totalReviews}
                        criteriaRatings={criteriaRatings}
                    />
                </div>
            </div>
            <div className='bg-[#f4f4f5] w-full' id='faqs'>
                <div className='container mt-10 py-10 mx-auto'>
                    <div className='font-inter text-4xl font-semibold uppercase'>Câu hỏi thường gặp</div>
                    <div className="mt-5">
                        <FAQSection />
                    </div>
                </div>
            </div>
            <div className='mt-10' id='location'>
                <div className="container mx-auto">
                    <div className='font-inter font-semibold uppercase text-4xl'>
                        Vị trí tuyệt vời của khách sạn Hotel Del Luna
                    </div>
                    <div className='my-10'>
                        <iframe
                            className='w-full min-h-[500px] rounded-xl'
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.816939728028!2d105.73938337490307!3d21.040009480612152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135096b31fa7abb%3A0xff645782804911af!2zVHLGsOG7nW5nIMSR4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgxJDDtG5nIMOB!5e0!3m2!1svi!2s!4v1742884670324!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
            <Footer />
            <BackToTopButton />
        </>
    );
}

export default Home;