/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Bed, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import loginBg from '../../assets/auth/login-bg.png';

const AuthLayout = ({ children, title, subtitle, image = loginBg, imageAlt = "Luxury Hotel" }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex bg-[#050505] text-white overflow-hidden font-inter">
      {/* Left side: Image (Hidden on small screens) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={image} 
          alt={imageAlt}
          className="h-full w-full object-cover"
        />
        
        {/* Branding on Image */}
        <div className="absolute bottom-12 left-12 z-20">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.8 }}
             className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-black/20 backdrop-blur-md">
              <Bed className="text-amber-500 w-6 h-6" />
            </div>
            <span className="text-amber-500/80 font-serif tracking-widest uppercase text-xs font-bold">
              {t('auth.brand_name')}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl font-serif text-white max-w-md leading-tight"
          >
            {t('auth.slogan_1')} <br />
            <span className="text-amber-500 italic font-light">{t('auth.slogan_2')}</span>
          </motion.h1>
        </div>
      </motion.div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(180,130,50,0.05),transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(180,130,50,0.03),transparent_40%)] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[480px] relative z-10"
        >
          {/* Header for Mobile */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-amber-500/30 mb-3 bg-white/5 backdrop-blur-sm">
              <Bed className="text-amber-500 w-6 h-6" />
            </div>
            <p className="text-amber-500/60 text-[10px] uppercase tracking-widest font-bold">{t('auth.brand_name')}</p>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-amber-500/70 hover:text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-4 transition-colors group">
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              {t('auth.back_to_home')}
            </Link>
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl md:text-3xl font-serif text-white mb-2 leading-tight tracking-tight break-words"
            >
              {title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-400 text-xs tracking-wide"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {children}
          </div>

          {/* Footer branding or contact */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center lg:items-start">
            <p className="text-xs uppercase tracking-widest text-gray-600 font-bold" dangerouslySetInnerHTML={{ __html: t('auth.rights_reserved') }}>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;


