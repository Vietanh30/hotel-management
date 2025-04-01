import React, { useState } from 'react';

const FAQItem = ({ question, answer, isOpen, toggleAnswer }) => {
    return (
        <div className={`rounded-lg col-span-1 h-auto border-l-[5px] border-l-[#008F9D] transition-all duration-300 ${isOpen ? 'bg-[#008F9D]' : 'bg-white'}`}>
            <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={toggleAnswer}
            >
                <div className={`font-inter font-bold transition-colors duration-300 ${isOpen ? 'text-[#EEEE08]' : 'text-black'}`}>{question}</div>
                <span className={`text-3xl font-inter transition-colors duration-300 ${isOpen ? 'text-white' : '#008F9D'}`}>{isOpen ? '-' : '+'}</span>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className={`p-6 pt-0 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className='font-inter text-sm text-white'>{answer}</div>
                </div>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'Khách sạn có trang bị phòng tắm riêng không?',
            answer: 'Khách sạn có phòng tắm riêng với đầy đủ tiện nghi.'
        },
        {
            question: 'Khách sạn có bãi đậu xe không?',
            answer: 'Khách sạn có bãi đậu xe miễn phí cho khách.'
        },
        {
            question: 'Khách sạn có dịch vụ đưa đón không?',
            answer: 'Khách sạn có dịch vụ đưa đón tại sân bay theo yêu cầu.'
        },
        {
            question: 'Khách sạn có hồ bơi không?',
            answer: 'Khách sạn có hồ bơi ngoài trời và khu vực tắm nắng.'
        },
        {
            question: 'Có thể hủy đặt phòng miễn phí không?',
            answer: 'Chính sách hủy phòng phụ thuộc vào loại phòng và thời điểm đặt phòng.'
        },
        {
            question: 'Khách sạn có phục vụ bữa sáng không?',
            answer: 'Khách sạn có phục vụ bữa sáng miễn phí từ 6:30 đến 10:00 sáng.'
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    };

    return (
        <div className="grid grid-cols-3 gap-10">
            {faqs.map((faq, index) => (
                <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    toggleAnswer={() => toggleFAQ(index)}
                />
            ))}
        </div>
    );
};

export default FAQSection;
