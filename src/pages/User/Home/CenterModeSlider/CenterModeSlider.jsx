import React, { useState } from 'react';
import Slider from 'react-slick';
import chill from '../../../../assets/Home/chill.svg';
import wedding from '../../../../assets/Home/wedding.svg';
import spa from '../../../../assets/Home/spa.svg';
import pool from '../../../../assets/Home/pool.svg';
import restaurant from '../../../../assets/Home/restaurant.svg';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const CenterModeSlider = () => {
    const slides = [
        { title: 'Chill', image: chill },
        { title: 'Wedding', image: wedding },
        { title: 'Pool', image: pool },
        { title: 'Spa', image: spa },
        { title: 'Restaurant', image: restaurant },
    ];

    const [activeIndex, setActiveIndex] = useState(2); // Start with the center slide

    const settings = {
        centerMode: true,
        infinite: true,
        centerPadding: '0',
        slidesToShow: 5,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 1500,
        beforeChange: (current, next) => setActiveIndex(next), // Update active index
    };

    return (
        <div className="overflow-hidden">
            <Slider {...settings}>
                {slides.map((slide, index) => {
                    // Calculate the center index based on the active index
                    const centerIndex = (activeIndex + 1) % slides.length; // Center should be the 3rd slide in the view
                    const isCenter = index === centerIndex;
                    const isSide = index === (centerIndex - 1 + slides.length) % slides.length || index === (centerIndex + 1) % slides.length;

                    return (
                        <div key={index} className="py-10">
                            <div className={`relative cursor-pointer group h-[350px] flex items-center justify-center transition-transform duration-300 ${isCenter ? 'scale-125 z-10' : isSide ? 'scale-90 z-5' : 'scale-100 z-0'} overflow-visible`}>
                                <img 
                                    src={slide.image} 
                                    alt={slide.title} 
                                    className="w-full h-full object-cover rounded-lg" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                    <h2 className="text-2xl font-bold">{slide.title}</h2>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

export default CenterModeSlider;