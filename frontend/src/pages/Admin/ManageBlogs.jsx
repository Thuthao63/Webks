import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { FileText, Plus, Trash2, Edit, X, Calendar, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const ManageBlogs = () => {
    const [articles, setArticles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ title: '', slug: '', image: null, tags: '', content: '' });

    // Helper: Lấy link ảnh từ backend
    const getImageUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1542314831-c6a4d1407287';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    const fetchArticles = async () => {
        try {
            const res = await axiosClient.get('/articles');
            setArticles(res.data);
        } catch (error) {
            console.error("Lỗi lấy bài viết", error);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const luxurySwal = Swal.mixin({
        background: '#ffffff',
        color: '#0f172a',
        backdrop: 'rgba(15,23,42,0.4)',
        customClass: {
            popup: 'border border-amber-500/20 rounded-[2.5rem] shadow-luxury backdrop-blur-3xl',
            title: 'font-sans text-amber-500 text-2xl',
            confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black  tracking-widest px-8 py-3 rounded-2xl transition-all',
            cancelButton: 'bg-slate-100 border border-slate-200 text-slate-700 font-bold  tracking-widest px-8 py-3 rounded-2xl hover:bg-slate-100 transition-colors'
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('slug', formData.slug);
        data.append('tags', formData.tags);
        data.append('content', formData.content);
        data.append('status', 'published');
        if (formData.image) {
            data.append('thumbnail', formData.image);
        }

        try {
            if (editId) {
                await axiosClient.put(`/articles/${editId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
                luxurySwal.fire({ icon: 'success', title: 'Cập nhật thành công', timer: 1500, showConfirmButton: false });
            } else {
                await axiosClient.post('/articles', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                luxurySwal.fire({ icon: 'success', title: 'Hoàn tất quy trình', timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            setEditId(null);
            setFormData({ title: '', slug: '', image: null, tags: '', content: '' });
            fetchArticles();
        } catch (error) {
            luxurySwal.fire('Lỗi', 'Không thể lưu bài viết.', 'error');
        }
    };

    const handleEdit = (article) => {
        setEditId(article.id);
        setFormData({ title: article.title, slug: article.slug, image: null, tags: article.tags, content: article.content });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await luxurySwal.fire({
            title: 'Xoá bài viết?',
            text: "Thao tác này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý xóa',
        });

        if (result.isConfirmed) {
            try {
                await axiosClient.delete(`/articles/${id}`);
                luxurySwal.fire({ icon: 'success', title: 'Đã thanh trừng!', timer: 1500, showConfirmButton: false });
                fetchArticles();
            } catch (err) {
                luxurySwal.fire('Thất bại', 'Lỗi khi xóa bài viết.', 'error');
            }
        }
    };

    return (
        <AdminLayout title="Quản lý Bài viết" subtitle="Quản lý nội dung Cẩm nang & Tin tức khách sạn">
            <div className="space-y-8 pb-10">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl">
                    <div className="flex items-center gap-4 pl-2">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold  tracking-widest">Tổng bài viết</p>
                            <p className="text-base font-medium font-sans text-slate-900 leading-none mt-1">{articles.length} bài đăng</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black  tracking-widest text-[10px] rounded-2xl shadow-luxury hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Soạn bài mới
                    </button>
                </div>

                {/* Table Container */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto admin-scrollbar">
                        <table className="w-full text-left">
                            <thead className="text-[10px] text-slate-500  font-medium tracking-[0.2em] border-b border-slate-100 bg-slate-50/50 font-sans">
                                <tr>
                                    <th className="px-8 py-6">Bài viết</th>
                                    <th className="px-6 py-6">Chủ đề (Tags)</th>
                                    <th className="px-6 py-6">Ngày đăng</th>
                                    <th className="px-8 py-6 text-right">Tùy chỉnh</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {articles.map((article) => (
                                    <tr key={article.id} className="group hover:bg-slate-50/50 font-sans transition-all">
                                        <td className="px-8 py-5 flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-200">
                                                <img src={getImageUrl(article.thumbnail)} alt={article.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <a href={`/blog/${article.slug}`} target="_blank" rel="noreferrer" className="text-slate-900 font-bold text-sm max-w-xs truncate hover:text-amber-600 transition-colors inline-block">{article.title}</a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black  tracking-widest text-slate-500 bg-slate-100">
                                                {article.tags || 'Tin tức'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                                            {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all">
                                                <a href={`/blog/${article.slug}`} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-400 hover:bg-blue-500 hover:text-white transition-all" title="Xem bài viết">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                                </a>
                                                <button onClick={() => handleEdit(article)} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(article.id)} className="p-2.5 rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-black transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {articles.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50 font-sans">
                        <FileText size={40} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] ">Chưa có bài viết nào</p>
                    </div>
                )}

                {/* Modal Form */}
                {showModal && createPortal(
                    <div className="fixed inset-0 z-[100]">
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditId(null); setFormData({ title: '', slug: '', image: null, tags: '', content: '' }); }} />
                        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
                            <div className="flex min-h-full items-start justify-center p-4 pt-16 pb-20">
                                <form onSubmit={handleSubmit} className="relative bg-white border border-slate-200 w-full max-w-2xl p-6 sm:p-10 rounded-[3.5rem] shadow-luxury z-10 animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <button type="button" onClick={() => { setShowModal(false); setEditId(null); setFormData({ title: '', slug: '', image: null, tags: '', content: '' }); }} className="absolute top-8 right-8 text-slate-500 hover:text-slate-900 bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-medium font-sans text-slate-900 mb-2">
                                {editId ? 'Cập nhật' : 'Soạn'} <span className="text-amber-500">{editId ? 'Bài Viết' : 'Bài Mới'}</span>
                            </h2>
                            <p className="text-[10px] text-slate-500  tracking-[0.2em] font-bold mb-10">Lan tỏa phong cách sống thượng lưu</p>

                            <div className="space-y-6 pb-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500  font-black tracking-widest ml-1">Tiêu đề bài viết</label>
                                    <input type="text" placeholder="Khám phá ẩm thực 5 sao..." required value={formData.title}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold"
                                        onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-500  font-black tracking-widest ml-1">Đường dẫn tĩnh (Slug)</label>
                                        <input type="text" placeholder="kham-pha-am-thuc" required value={formData.slug}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold"
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-slate-500  font-black tracking-widest ml-1">Chủ đề (Tags)</label>
                                        <input type="text" placeholder="Ẩm thực, Khám phá" required value={formData.tags}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-bold text-amber-600"
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500  font-black tracking-widest ml-1">Hình ảnh bìa (Thumbnail)</label>
                                    <label className="w-full bg-slate-50 border border-dashed border-slate-300 text-slate-500 p-4 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                                        <ImageIcon size={18} />
                                        <span className="text-[10px] font-bold  truncate max-w-[200px]">{formData.image ? formData.image.name : 'Nhấp để tải ảnh lên (PNG, JPG)'}</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500  font-black tracking-widest ml-1">Nội dung (HTML Hỗ trợ)</label>
                                    <textarea placeholder="<b>Nội dung bài viết...</b>" required rows={6} value={formData.content}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-slate-100 transition-all placeholder:text-slate-400 font-medium font-mono text-sm leading-relaxed"
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-2xl font-black  tracking-widest text-[11px] shadow-luxury hover:scale-[1.02] active:scale-100 transition-all">
                                {editId ? 'Lưu cập nhật' : 'Xuất bản bài viết'}
                            </button>
                            </form>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageBlogs;
