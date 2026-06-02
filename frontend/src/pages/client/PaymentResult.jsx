import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        const verifyPayment = async () => {
            try {
                // Gửi toàn bộ query string xuống backend để verify (vnpay_return)
                const queryString = searchParams.toString();
                if (!queryString) {
                    setStatus('error');
                    setMessage("Không tìm thấy thông tin thanh toán.");
                    return;
                }

                const res = await axiosClient.get(`/payments/vnpay_return?${queryString}`);
                
                if (res.data.code === '00') {
                    setStatus('success');
                    setMessage("Thanh toán thành công!");
                } else {
                    setStatus('error');
                    setMessage(res.data.message || "Thanh toán thất bại.");
                }
            } catch (err) {
                console.error(err);
                setStatus('error');
                setMessage("Có lỗi xảy ra khi xác thực thanh toán.");
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center py-20 px-6 font-sans">
            <div className="bg-white max-w-lg w-full p-10 md:p-16 rounded-[2.5rem] shadow-premium text-center">
                {status === 'processing' && (
                    <div className="flex flex-col items-center gap-6">
                        <Loader2 className="animate-spin text-amber-500" size={64} />
                        <h2 className="text-xl font-medium font-sans text-slate-900">
                            Đang xử lý kết quả...
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">Vui lòng không đóng trình duyệt lúc này.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={48} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-medium font-sans text-slate-900">
                            Giao dịch thành công
                        </h2>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Cảm ơn quý khách. Hệ thống đã xác nhận khoản thanh toán. Đội ngũ quản gia sẽ liên hệ trong ít phút để hỗ trợ nhận phòng.
                        </p>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="mt-4 w-full bg-slate-900 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-luxury shadow-lg flex items-center justify-center gap-3"
                        >
                            Xem đơn đặt phòng <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center">
                            <XCircle size={48} className="text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-medium font-sans text-slate-900">
                            Giao dịch thất bại
                        </h2>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            {message}
                        </p>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="mt-4 w-full bg-slate-900 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 transition-luxury shadow-lg flex items-center justify-center gap-3"
                        >
                            Quay về Hồ sơ <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
