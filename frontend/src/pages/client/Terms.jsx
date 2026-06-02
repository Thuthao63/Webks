import React, { useEffect } from 'react';
import { FileText, Clock, CreditCard, UserCheck, AlertTriangle } from 'lucide-react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const terms = [
    {
      icon: <FileText className="text-amber-500" size={24} />,
      title: '1. Quy định đặt phòng & Thanh toán',
      desc: 'Yêu cầu đặt phòng của Quý khách chỉ được hệ thống xác nhận chính thức sau khi hoàn tất thanh toán (hoặc đặt cọc 50%). Giá phòng và các khoản phụ phí sẽ được liệt kê minh bạch trước khi Quý khách xác nhận giao dịch.'
    },
    {
      icon: <Clock className="text-amber-500" size={24} />,
      title: '2. Thời gian Nhận/Trả phòng',
      desc: 'Giờ nhận phòng tiêu chuẩn là từ 14:00 và giờ trả phòng là trước 12:00 trưa hôm sau. Yêu cầu nhận phòng sớm hoặc trả phòng trễ sẽ tùy thuộc vào tình trạng phòng trống và có thể phát sinh thêm phụ phí theo bảng giá niêm yết.'
    },
    {
      icon: <CreditCard className="text-amber-500" size={24} />,
      title: '3. Chính sách hoàn hủy',
      desc: 'Quý khách được miễn phí hủy phòng nếu thông báo trước 7 ngày so với ngày nhận phòng. Các trường hợp hủy cận ngày hoặc không đến nhận phòng (No-show) sẽ bị tính phí tương đương 100% giá trị đêm lưu trú đầu tiên.'
    },
    {
      icon: <UserCheck className="text-amber-500" size={24} />,
      title: '4. Trách nhiệm của khách lưu trú',
      desc: 'Quý khách vui lòng xuất trình giấy tờ tùy thân hợp lệ khi nhận phòng. Tuyệt đối tuân thủ các quy định về an ninh, phòng cháy chữa cháy và không mang các vật dụng cấm, chất gây cháy nổ, thú cưng vào khu vực phòng nghỉ.'
    },
    {
      icon: <AlertTriangle className="text-amber-500" size={24} />,
      title: '5. Sửa đổi điều khoản',
      desc: 'Uy Nam Luxury Hotel bảo lưu quyền thay đổi, chỉnh sửa các điều khoản và quy định này vào bất kỳ lúc nào để phù hợp với quy trình vận hành. Các thay đổi sẽ có hiệu lực ngay khi được công bố trên website chính thức.'
    }
  ];

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-10 fade-in duration-1000">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-6 text-amber-500 border border-amber-500/20">
            <FileText size={32} />
          </div>
          <p className="text-amber-500 text-xs font-black uppercase tracking-[0.2em] mb-4">Uy Nam Luxury</p>
          <h1 className="text-xl font-medium md:text-xl font-sans text-slate-900 mb-6 leading-tight">
            Quy định <span className="text-amber-500 not-italic font-bold">Lưu trú</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-loose text-sm md:text-base">
            Những quy định dưới đây được thiết lập nhằm mang lại một môi trường nghỉ dưỡng an toàn, đẳng cấp và chuyên nghiệp nhất cho mọi quý khách hàng.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-slate-900/5 rounded-full blur-[80px] -ml-32 -mt-32"></div>
          
          <div className="space-y-12 relative z-10">
            {terms.map((term, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 items-start group">
                <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-amber-50 group-hover:border-amber-100 transition-all duration-500">
                  {term.icon}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">{term.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base text-justify">
                    {term.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100 text-center">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Cập nhật lần cuối: Tháng 5, 2026</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;
