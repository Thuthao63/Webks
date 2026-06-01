import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Calendar, ArrowLeft, Clock, Share2, Link as LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BlogDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const getThumbnailUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1542314831-c6a4d1407287?q=80&w=2070&auto=format&fit=crop';
        
        // Handle YouTube links
        const ytMatch = path.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        if (ytMatch && ytMatch[1]) {
            return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
        }
        
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    useEffect(() => {
        // Scroll to top on load
        window.scrollTo(0, 0);
        
        axiosClient.get(`/articles/${slug}`)
            .then(res => setArticle(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    try {
        if (loading) return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
        
        if (!article) return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-4">
                <h2 className="text-2xl font-serif">{t('blogDetail.not_found')}</h2>
                <Link to="/blog" className="text-amber-600 hover:text-amber-700 underline underline-offset-4">{t('blogDetail.back_to_blog')}</Link>
            </div>
        );

        return (
            <div className="min-h-screen bg-slate-50 pb-24">
                {/* Hero Section */}
                <div className="w-full h-[60vh] lg:h-[70vh] relative mb-12">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80 z-10"></div>
                    <img 
                        src={getThumbnailUrl(article?.thumbnail)} 
                        alt={article?.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1542314831-c6a4d1407287?q=80&w=2070&auto=format&fit=crop';
                        }}
                    />
                    
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-16 text-center px-6">
                        <div className="max-w-4xl mx-auto w-full animate-fade-in-up">
                            <div className="mb-6">
                                <span className="bg-amber-500/90 backdrop-blur-sm text-white text-xs font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg">
                                    {article?.tags ? String(article.tags).split(',')[0] : t('blogDetail.default_tag')}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-8 drop-shadow-lg">
                                {article?.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90 font-medium tracking-wider uppercase">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-amber-400" />
                                    {article?.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                                </div>
                                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-amber-400" />
                                    {t('blogDetail.read_time')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        
                        {/* Left Sidebar - Sharing */}
                        <div className="hidden lg:flex flex-col gap-6 sticky top-32 w-16 items-center shrink-0">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest transform -rotate-180 mb-4" style={{ writingMode: 'vertical-rl' }}>{t('blogDetail.share')}</div>
                            <div className="w-px h-12 bg-slate-300 mb-2"></div>
                            <button onClick={handleCopyLink} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all relative group">
                                <LinkIcon size={18} />
                                {copied && <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap">{t('blogDetail.copied')}</span>}
                            </button>
                        </div>

                        {/* Article Content */}
                        <div className="flex-1 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 relative -mt-32 z-30 w-full">
                            <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-amber-600 transition-colors mb-10 group">
                                <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" /> {t('blogDetail.back_to_blog')}
                            </Link>

                            <div 
                                className="prose prose-lg md:prose-xl prose-slate prose-a:text-amber-600 hover:prose-a:text-amber-700 max-w-none prose-headings:font-serif prose-headings:font-normal prose-h2:text-3xl prose-h2:mt-12 prose-img:rounded-2xl prose-img:shadow-md prose-img:w-full" 
                                style={{ fontFamily: "'Inter', sans-serif" }}
                                dangerouslySetInnerHTML={{ __html: article?.content || '' }}>
                            </div>

                            {/* Mobile Share */}
                            <div className="lg:hidden mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('blogDetail.share_article')}</span>
                                <div className="flex gap-3">
                                    <button onClick={handleCopyLink} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 relative">
                                        <LinkIcon size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden lg:block w-16 shrink-0"></div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        return <div className="p-10 text-red-500 bg-red-50 h-screen overflow-auto">
            <h1 className="text-2xl font-bold">Render Error in BlogDetail</h1>
            <pre className="mt-4">{error.message}</pre>
            <pre className="mt-4 text-xs">{error.stack}</pre>
        </div>;
    }
};

export default BlogDetail;
