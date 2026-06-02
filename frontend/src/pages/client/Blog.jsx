import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Blog = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const getImageUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1542314831-c6a4d1407287';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    useEffect(() => {
        axiosClient.get('/articles?status=published')
            .then(res => {
                setArticles(res.data);
            })
            .catch(err => console.error("Lỗi lấy bài viết:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center text-amber-600">{t('blog.loading')}</div>;

    return (
        <div className="pt-40 pb-24 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-amber-600 text-xs font-black uppercase tracking-[0.2em] block">{t('blog.subtitle')}</span>
                    <h1 className="text-xl font-medium md:text-xl font-sans text-slate-900">
                        {t('blog.title_main')} <span className="not-italic text-amber-500">{t('blog.title_highlight')}</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto pt-4">{t('blog.desc')}</p>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center text-slate-400 italic py-20">{t('blog.no_articles')}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {articles.map((article, idx) => (
                            <a href={`/blog/${article.slug}`} key={article.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col cursor-pointer relative z-20">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={getImageUrl(article.thumbnail)} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800">
                                        {article.tags?.split(',')[0] || t('blog.default_tag')}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-[10px] text-amber-600 uppercase tracking-widest font-bold mb-4">
                                        <Calendar size={14} />
                                        {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">
                                        {article.content ? article.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : ''}
                                    </p>
                                    <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-amber-500 transition-colors">
                                        {t('blog.read_more')} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
