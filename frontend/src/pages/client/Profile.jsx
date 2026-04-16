import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { User, Package, Calendar, CreditCard, ChevronRight, Clock, CheckCircle, XCircle, MapPin, Edit2 } from 'lucide-react';

const Profile = () => {
    const { user, updateUserContext } = useContext(AuthContext);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleEditProfile = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Cập nhật thông tin',
            html:
                '<div class="flex flex-col gap-4 text-left mt-4">' +
                '<label class="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2">Họ và tên</label>' +
                `<input id="swal-edit-name" type="text" value="${user?.fullName || ''}" class="bg-black/50 border border-white/10 text-white p-3 rounded-2xl outline-none focus:border-amber-500/50 text-sm">` +
                '<label class="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2 mt-2">Số điện thoại</label>' +
                `<input id="swal-edit-phone" type="text" value="${user?.phone || ''}" class="bg-black/50 border border-white/10 text-white p-3 rounded-2xl outline-none focus:border-amber-500/50 text-sm">` +
                '<label class="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2 mt-2">Địa chỉ</label>' +
                `<input id="swal-edit-address" type="text" value="${user?.address || ''}" class="bg-black/50 border border-white/10 text-white p-3 rounded-2xl outline-none focus:border-amber-500/50 text-sm">` +
                '</div>',
            focusConfirm: false,
            background: '#0a0a0ae6',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Lưu Thông Tin',
            cancelButtonText: 'Hủy bỏ',
            customClass: {
                popup: 'border border-amber-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(217,119,6,0.15)] backdrop-blur-2xl p-8',
                title: 'font-serif italic text-amber-500 text-3xl',
                confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform',
                cancelButton: 'bg-white/5 text-gray-300 px-8 py-3.5 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition-colors'
            },
            preConfirm: () => {
                const username = document.getElementById('swal-edit-name').value;
                const phone = document.getElementById('swal-edit-phone').value;
                const address = document.getElementById('swal-edit-address').value;
                if (!username) {
                    Swal.showValidationMessage('Họ và tên không được để trống!');
                    return false;
                }
                return { username, phone, address };
            }
        });

        if (formValues) {
            try {
                // Hiển thị loading trong lúc gọi API
                Swal.fire({ title: 'Đang xử lý...', background: '#0a0a0ae6', color: '#fff', didOpen: () => { Swal.showLoading() } });
                const response = await axiosClient.put(`/auth/${user.id}`, formValues);
                
                // Cập nhật context
                updateUserContext({
                    fullName: response.data.user.fullName,
                    phone: response.data.user.phone,
                    address: response.data.user.address
                });

                Swal.fire({
                    icon: 'success', title: 'Thành công!', text: 'Đã cập nhật hồ sơ cá nhân.', background: '#0a0a0ae6', color: '#fff',
                    customClass: { popup: 'rounded-[2rem] border border-amber-500/20' }
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error', title: 'Thất bại', text: err.response?.data?.message || 'Có lỗi xảy ra cập nhật.', background: '#0a0a0ae6', color: '#fff',
                    customClass: { popup: 'rounded-[2rem] border border-red-500/20' }
                });
            }
        }
    };

    useEffect(() => {
        if (user) {
            axiosClient.get(`/bookings/user/${user.id}`)
                .then(res => {
                    setMyBookings(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handleWriteReview = async (roomId) => {
        const { value: formValues } = await Swal.fire({
            title: 'Trải nghiệm của bạn',
            html:
                '<div class="flex flex-col gap-4 text-left mt-4">' +
                '<label class="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2">Đánh giá sao (1-5)</label>' +
                '<input id="swal-input1" type="number" min="1" max="5" value="5" class="bg-black/50 border border-white/10 text-amber-500 font-black text-xl p-3 rounded-2xl outline-none focus:border-amber-500/50">' +
                '<label class="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2 mt-2">Góp ý / Cảm nhận</label>' +
                '<textarea id="swal-input2" class="bg-black/50 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-amber-500/50 text-sm" rows="4" placeholder="Phòng rất sạch sẽ, nhân viên thân thiện..."></textarea>' +
                '</div>',
            focusConfirm: false,
            background: '#0a0a0ae6',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Gửi Đánh Giá',
            cancelButtonText: 'Khép lại',
            customClass: {
                popup: 'border border-amber-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(217,119,6,0.15)] backdrop-blur-2xl p-8',
                title: 'font-serif italic text-amber-500 text-3xl',
                confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform',
                cancelButton: 'bg-white/5 text-gray-300 px-8 py-3.5 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition-colors'
            },
            preConfirm: () => {
                const rating = document.getElementById('swal-input1').value;
                const comment = document.getElementById('swal-input2').value;
                if (!rating || !comment) {
                    Swal.showValidationMessage('Vui lòng điền đủ sao và đánh giá!');
                    return false;
                }
                return { rating, comment };
            }
        });

        if (formValues) {
            try {
                await axiosClient.post('/reviews', {
                    roomId,
                    userId: user.id,
                    rating: Number(formValues.rating),
                    comment: formValues.comment
                });
                Swal.fire({
                    icon: 'success', title: 'Cảm ơn bạn!', text: 'Đánh giá chân thực của bạn đã được ghi nhận.', background: '#0a0a0ae6', color: '#fff',
                    customClass: { popup: 'rounded-[2rem] border border-amber-500/20' }
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error', title: 'Thất bại', text: err.response?.data?.message || 'Có lỗi xảy ra khi gửi.', background: '#0a0a0ae6', color: '#fff',
                    customClass: { popup: 'rounded-[2rem] border border-red-500/20' }
                });
            }
        }
    };

    // Hàm render Badge trạng thái cho chuyên nghiệp
    const renderStatus = (status) => {
        const config = {
            pending: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <Clock size={12}/>, text: 'Chờ duyệt' },
            confirmed: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle size={12}/>, text: 'Đã xác nhận' },
            cancelled: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: <XCircle size={12}/>, text: 'Đã hủy' },
            completed: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <Package size={12}/>, text: 'Hoàn thành' }
        };
        const s = config[status] || config.pending;
        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${s.color}`}>
                {s.icon} {s.text}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* HEADER: THÔNG TIN CÁ NHÂN SANG TRỌNG */}
                <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-xl shadow-amber-600/20 shrink-0">
                                <User size={40} className="text-black" />
                            </div>
                            <div className="text-center md:text-left space-y-2 flex-1 relative">
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <h2 className="text-4xl font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        Xin chào, <span className="text-amber-500 not-italic font-sans font-bold">{user?.fullName}</span>
                                    </h2>
                                    <button 
                                      onClick={handleEditProfile}
                                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-500/50 transition-all"
                                      title="Chỉnh sửa thông tin"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                                <p className="text-gray-500 text-sm tracking-widest uppercase font-medium">Hội viên đặc quyền của Uy Nam Luxury</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                                    <span className="text-[10px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-gray-400">{user?.email}</span>
                                    <span className="text-[10px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-gray-400">{user?.phone || 'Chưa cập nhật SĐT'}</span>
                                    {user?.address && (
                                        <span className="text-[10px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-gray-400 flex flex-row items-center gap-1">
                                            <MapPin size={10}/> {user.address}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THỐNG KÊ NHANH */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Tổng số đơn" value={myBookings.length} icon={<Package className="text-amber-500" />} />
                    <StatCard title="Phòng sắp nhận" value={myBookings.filter(b => b.status === 'confirmed').length} icon={<Calendar className="text-amber-500" />} />
                    <StatCard title="Điểm tích lũy" value="1,250" icon={<Star className="text-amber-500" />} />
                </div>

                {/* LỊCH SỬ ĐẶT PHÒNG */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-xl font-serif italic text-amber-500" style={{ fontFamily: "'Playfair Display', serif" }}>Lịch sử lưu trú</h3>
                        <span className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold">Dữ liệu cập nhật thời gian thực</span>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="py-20 text-center text-gray-600">Đang tải lịch sử...</div>
                        ) : myBookings.length > 0 ? (
                            myBookings.map((b) => (
                                <div key={b.id} className="group bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-amber-500/30 transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-16 h-16 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:bg-amber-500/10 transition-colors">
                                            <span className="text-[10px] text-gray-500 uppercase font-black">Phòng</span>
                                            <span className="text-xl font-bold text-white">{b.room?.roomNumber || '---'}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-white group-hover:text-amber-500 transition-colors">Premium Ocean Suite</h4>
                                            <div className="flex items-center gap-4 text-[11px] text-gray-500 italic">
                                                <div className="flex items-center gap-1"><Calendar size={12}/> {new Date(b.checkInDate).toLocaleDateString('vi-VN')}</div>
                                                <ChevronRight size={10} />
                                                <div className="flex items-center gap-1">{new Date(b.checkOutDate).toLocaleDateString('vi-VN')}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-amber-500 font-bold text-lg">{Number(b.totalPrice).toLocaleString()}đ</p>
                                            <p className="text-[9px] text-gray-600 uppercase tracking-tighter">Tổng thanh toán</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            {renderStatus(b.status)}
                                            {b.status === 'completed' && (
                                                <button 
                                                    onClick={() => handleWriteReview(b.roomId)} 
                                                    className="text-[9px] px-4 py-1.5 border border-amber-500/30 bg-amber-500/5 text-amber-500 rounded-full hover:bg-amber-500 hover:text-black font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(217,119,6,0.1)]"
                                                >
                                                    Mời đánh giá
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                                <p className="text-gray-600 italic text-sm">Thảo chưa có đơn đặt phòng nào. Khám phá các phòng nghỉ ngay!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component cho các thẻ thống kê
const StatCard = ({ title, value, icon }) => (
    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/[0.02] transition-all">
        <div className="space-y-1">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{title}</p>
            <p className="text-3xl font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
        </div>
    </div>
);

const Star = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export default Profile;