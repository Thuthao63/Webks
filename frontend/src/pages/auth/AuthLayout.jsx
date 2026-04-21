import React from 'react';
import { motion } from 'framer-motion';
import { Bed } from 'lucide-react';
import loginBg from '../../assets/auth/login-bg.png';

const AuthLayout = ({ children, title, subtitle, image = loginBg, imageAlt = "Luxury Hotel" }) => {
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
              Uy Nam Luxury Hotel
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl font-serif text-white max-w-md leading-tight"
          >
            Nơi Vẻ Đẹp Gặp Gỡ <br />
            <span className="text-amber-500 italic font-light">Sự Đẳng Cấp</span>
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
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-amber-500/30 mb-4 bg-white/5 backdrop-blur-sm">
              <Bed className="text-amber-500 w-7 h-7" />
            </div>
            <p className="text-amber-500/60 text-[10px] uppercase tracking-widest font-bold">Uy Nam Luxury Hotel</p>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight tracking-tight break-keep"
            >
              {title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-400 text-sm tracking-wide"
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
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
              &copy; 2026 Uy Nam Luxury Hotel. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
