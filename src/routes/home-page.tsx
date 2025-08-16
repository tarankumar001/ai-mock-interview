import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50 overflow-hidden relative font-['Inter']">
      {/* Material UI Inspired Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Soft Architectural Arches */}
        <div className="absolute top-20 left-10 w-64 h-80 border-l-2 border-r-2 border-t-2 border-pink-200/40 rounded-t-full opacity-30"></div>
        <div className="absolute top-32 left-20 w-48 h-64 border-l-2 border-r-2 border-t-2 border-purple-200/30 rounded-t-full opacity-25"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-pink-100/20 to-purple-100/20 rounded-lg blur-sm opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-tr from-blue-100/15 to-pink-100/15 rounded-full blur-md opacity-30"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-100/25 to-blue-100/25 rounded-lg blur-sm opacity-35"></div>
      </div>

      {/* Subtle Water Reflection Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-100/20 via-pink-100/10 to-transparent blur-sm"></div>
      </div>

      {/* Floating Translucent Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-300/30 to-purple-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.div 
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Title - Enhanced Typography with Elegant Fonts */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-sm md:text-base font-medium text-gray-600 uppercase tracking-widest mb-4 font-['Inter']">
              AI-Powered Interview Platform
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-gray-800 mb-6 font-['Cormorant_Garamond'] leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Echohire
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-['Cormorant_Garamond'] font-light">
              Creating the unexpected interview experience
            </p>
          </motion.div>

          {/* CTA Buttons - Material UI Style */}
          <motion.div 
            className="flex justify-center items-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group font-['Inter'] font-medium">
                Try it out
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>

          {/* Material UI Feature Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { title: "Smart Questions", desc: "AI-generated interview questions tailored to your role" },
              { title: "Real-time Feedback", desc: "Instant scoring and detailed performance analysis" },
              { title: "Personalized Experience", desc: "Customized interviews based on your expertise" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-gray-200/50 hover:bg-white/80 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-400 rounded-sm"></div>
                </div>
                <h3 className="text-gray-800 font-semibold text-lg mb-2 font-['Inter']">{feature.title}</h3>
                <p className="text-gray-600 text-sm font-['Inter'] font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <span className="text-xs mb-2 font-['Inter'] font-light">Scroll to explore</span>
          <div className="w-0.5 h-6 bg-gradient-to-b from-gray-400 to-transparent"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

