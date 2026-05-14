import { CalendarDays, Users, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  // Staggering variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center text-white pt-20 bg-gradient-to-br from-[#0b2a3d] via-[#1e4a6a] to-[#0b2a3d] overflow-hidden">
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#81A6C6]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative container mx-auto px-6 z-10">
        {/* TOP CONTENT */}
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={itemVariants} className="inline-block bg-white/5 border border-white/10 px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide shadow-sm mb-6 backdrop-blur-md text-cyan-100">
            Smart Scheduling for Institutions
          </motion.span>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-4 leading-[1.1] tracking-tight">
            Campus Timetable <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
              Management
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-base sm:text-lg md:text-xl text-blue-100/80 font-light max-w-2xl mx-auto leading-relaxed">
            Effortlessly create, manage, and share college timetables.
            Streamline scheduling for departments, faculty, and students with intelligent automation.
          </motion.p>

          {/* BUTTONS */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 mt-10 w-full px-4 sm:px-0">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-500 text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400 transition-all duration-300 w-full sm:w-auto"
            >
              Get Started
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-300 w-full sm:w-auto"
            >
              View Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-20 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />, title: "5k+", sub: "Schedules" },
            { icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#81A6C6]" />, title: "1.2k+", sub: "Users" },
            { icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />, title: "50+", sub: "Depts" },
            { icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />, title: "10k+", sub: "Hrs Saved" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-center mb-3 sm:mb-4">{item.icon}</div>
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-1">{item.title}</h2>
              <p className="text-xs sm:text-sm font-medium text-cyan-100 uppercase tracking-wider">{item.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
