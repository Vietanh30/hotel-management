import React from 'react';

const Rating = ({ averageRating, totalReviews, criteriaRatings }) => {
    const totalStars = 5;

    return (
        <div className="flex items-center gap-5 mt-5">
            <div className="">
                <div className="text-7xl font-inter font-semibold mr-2">{averageRating}</div>
                <div className="text-gray-600 text-end">({totalReviews} đánh giá)</div>
            </div>
            <div className="flex justify-evenly w-5/6">
                {criteriaRatings.map((criteria, index) => (
                    <div key={index} className="flex items-center">
                        <span className="mr-2 text-gray-700">{criteria.label}</span>
                        <div className="flex items-center gap-1">
                            {[...Array(totalStars)].map((_, starIndex) => {
                                const starRating = criteria.rating;
                                let starClass = '';

                                if (starIndex < Math.floor(starRating)) {
                                    starClass = 'bg-[#49D426]'; // Full star
                                } else if (starIndex < Math.ceil(starRating)) {
                                    starClass = 'bg-gradient-to-r from-[#49D426] to-[#49D426]'; // Half star
                                } else {
                                    starClass = 'bg-transparent'; // Empty star
                                }

                                return (
                                    <div
                                        key={starIndex}
                                        className={`w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#49D426] transition-all duration-300`}
                                    >
                                        <div className={`w-6 h-6 rounded-full ${starClass}`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rating;