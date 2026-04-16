import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, Phone, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "Giờ nhận phòng và trả phòng là khi nào?",
            answer: "Tại Uy Nam Luxury, giờ nhận phòng tiêu chuẩn là từ 14:00 và giờ trả phòng là trước 12:00 trưa. Nếu quý khách có nhu cầu nhận phòng sớm hoặc trả phòng muộn, vui lòng liên hệ trước với chúng tôi để được hỗ trợ tùy vào tình trạng phòng trống."
        },
        {
            question: "Khách sạn có dịch vụ đưa đón sân bay không?",
            answer: "Chúng tôi cung cấp dịch vụ đưa đón sân bay bằng xe hạng sang (Mercedes/BMW). Dịch vụ này được miễn phí đối với các hạng phòng Suite và có tính phí ưu đãi đối với các hạng phòng tiêu chuẩn. Quý khách vui lòng cung cấp thông tin chuyến bay trước 24 giờ."
        },
        {
            question: "Chính sách hủy phòng như thế nào?",
            answer: "Quý khách có thể hủy phòng miễn phí trước 48 giờ so với ngày nhận phòng. Nếu hủy trong vòng 48 giờ hoặc không đến nhận phòng, phí phạt tương đương giá phòng một đêm sẽ được áp dụng."
        },
        {
            question: "Khách sạn có cho phép mang theo thú cưng không?",
            answer: "Để đảm bảo không gian yên tĩnh và vệ sinh tuyệt đối cho mọi khách hàng, hiện tại Uy Nam Luxury chưa có chính sách cho phép mang theo thú cưng vào khu vực lưu trú."
        },
        {
            question: "Tôi có được mang theo trẻ em không? Phí phụ thu là bao nhiêu?",
            answer: "Trẻ em dưới 6 tuổi được ở miễn phí nếu sử dụng chung giường với cha mẹ. Trẻ từ 6-12 tuổi phụ thu 500.000 VNĐ/đêm (bao gồm bữa sáng). Trẻ trên 12 tuổi được tính như người lớn và yêu cầu sử dụng giường phụ."
        },
        {
            question: "Làm thế nào để tôi nhận hóa đơn VAT?",
            answer: "Quý khách vui lòng cung cấp thông tin xuất hóa đơn tại quầy lễ tân khi làm thủ tục nhận phòng hoặc trả phòng. Hóa đơn điện tử sẽ được gửi qua email của quý khách trong vòng 24-48 giờ sau khi hoàn tất thanh toán."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-40 pb-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto space-y-20">
                
                {/* Header section */}
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                            <HelpCircle className="text-amber-500" size={32} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] block">Hỗ trợ khách hàng</span>
                        <h1 className="text-5xl md:text-7xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Câu hỏi <span className="text-amber-500 not-italic">thường gặp</span>
                        </h1>
                        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
                            Mọi thông tin bạn cần để chuẩn bị cho kỳ nghỉ thượng lưu hoàn hảo tại Uy Nam Luxury.
                        </p>
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`group border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 ${
                                openIndex === index ? 'bg-white/[0.03] border-amber-500/30 shadow-2xl shadow-amber-500/5' : 'bg-[#0a0a0a] hover:border-white/20'
                            }`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full p-8 md:p-10 flex items-center justify-between gap-6 text-left"
                            >
                                <span className={`text-lg md:text-xl font-serif italic transition-colors duration-500 ${
                                    openIndex === index ? 'text-amber-500' : 'text-white'
                                }`} style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {faq.question}
                                </span>
                                <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                                    openIndex === index ? 'bg-amber-500 border-amber-500 text-black rotate-180' : 'border-white/10 text-gray-500'
                                }`}>
                                    <ChevronDown size={16} />
                                </div>
                            </button>
                            
                            <div 
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="px-8 md:px-10 pb-8 md:pb-10 pt-2 text-gray-400 text-sm md:text-base leading-loose italic border-t border-white/5">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] p-12 rounded-[3rem] border border-white/5 relative overflow-hidden text-center space-y-10 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    
                    <div className="space-y-4 relative z-10">
                        <h3 className="text-3xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>Vẫn còn thắc mắc?</h3>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Đội ngũ đại sứ dịch vụ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 relative z-10">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col items-center gap-4">
                            <Phone className="text-amber-500" size={24} strokeWidth={1} />
                            <div className="space-y-1">
                                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Điện thoại</p>
                                <p className="text-sm font-bold">0123.456.789</p>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col items-center gap-4">
                            <Mail className="text-amber-500" size={24} strokeWidth={1} />
                            <div className="space-y-1">
                                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Email</p>
                                <p className="text-sm font-bold">contact@uynam.com</p>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col items-center gap-4">
                            <MessageSquare className="text-amber-500" size={24} strokeWidth={1} />
                            <div className="space-y-1">
                                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Trực tuyến</p>
                                <p className="text-sm font-bold">Live Chat 24/7</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/contact')}
                        className="relative z-10 px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-amber-500 transition-all flex items-center gap-3 mx-auto"
                    >
                        Gửi yêu cầu hỗ trợ <ArrowRight size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FAQ;
