import React, { useEffect } from 'react';
import { Shield, Lock, Eye, CheckCircle2, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const policies = [
    {
      icon: <Eye className="text-amber-500" size={24} />,
      title: '1. Thu thập dữ liệu',
      desc: 'Uy Nam Luxury Hotel chỉ thu thập những thông tin cá nhân cần thiết (họ tên, email, số điện thoại, thông tin định danh) khi Quý khách thực hiện đặt phòng hoặc đăng ký hội viên. Mọi dữ liệu đều được thu thập với sự đồng ý minh bạch từ phía khách hàng.'
    },
    {
      icon: <CheckCircle2 className="text-amber-500" size={24} />,
      title: '2. Mục đích sử dụng',
      desc: 'Dữ liệu của Quý khách được sử dụng duy nhất cho các mục đích: xác nhận và quản lý đặt phòng, nâng cao trải nghiệm cá nhân hóa tại khách sạn, hỗ trợ dịch vụ chăm sóc khách hàng và gửi các thông tin ưu đãi đặc quyền (nếu Quý khách đồng ý nhận).'
    },
    {
      icon: <Shield className="text-amber-500" size={24} />,
      title: '3. Bảo mật tuyệt đối',
      desc: 'Hệ thống lưu trữ của chúng tôi áp dụng tiêu chuẩn mã hóa SSL 256-bit và các biện pháp bảo mật đa tầng nhằm ngăn chặn tuyệt đối mọi hành vi truy cập trái phép, sửa đổi hay rò rỉ dữ liệu cá nhân của Quý khách.'
    },
    {
      icon: <Server className="text-amber-500" size={24} />,
      title: '4. Không chia sẻ cho bên thứ ba',
      desc: 'Chúng tôi cam kết không mua bán, trao đổi hay chia sẻ thông tin cá nhân của Quý khách cho bất kỳ bên thứ ba nào vì mục đích thương mại, ngoại trừ các trường hợp bắt buộc theo yêu cầu của cơ quan thực thi pháp luật.'
    },
    {
      icon: <Lock className="text-amber-500" size={24} />,
      title: '5. Quyền lợi của khách hàng',
      desc: 'Quý khách hoàn toàn có quyền yêu cầu truy xuất, chỉnh sửa hoặc xóa bỏ thông tin cá nhân của mình khỏi hệ thống cơ sở dữ liệu của khách sạn vào bất kỳ lúc nào bằng cách liên hệ với đội ngũ Quản gia (Butler) hoặc Bộ phận Chăm sóc khách hàng.'
    }
  ];

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-10 fade-in duration-1000">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-6 text-amber-500 border border-amber-500/20">
            <Shield size={32} />
          </div>
          <p className="text-amber-500 text-xs font-black uppercase tracking-[0.2em] mb-4">Uy Nam Luxury</p>
          <h1 className="text-4xl md:text-6xl font-serif italic text-slate-900 mb-6 leading-tight">
            Chính sách <span className="text-amber-500 not-italic font-bold">Bảo mật</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-loose text-sm md:text-base">
            Sự riêng tư của Quý khách là đặc quyền tối thượng. Chúng tôi cam kết bảo vệ mọi thông tin cá nhân với tiêu chuẩn an ninh khắt khe nhất, đảm bảo một kỳ nghỉ an tâm trọn vẹn.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="space-y-12 relative z-10">
            {policies.map((policy, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 items-start group">
                <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-amber-50 group-hover:border-amber-100 transition-all duration-500">
                  {policy.icon}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">{policy.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base text-justify">
                    {policy.desc}
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

export default Privacy;
