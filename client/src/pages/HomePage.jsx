import { motion as _motion } from "motion/react";
import { Cloud, Clock, Calendar } from 'lucide-react';

const Widget = ({ icon, title, sub }) => (
  <_motion.div 
    whileHover={{ scale: 1.05 }} 
    className="bg-card/50 backdrop-blur-md p-6 rounded-xl border border-border shadow-sm"
  >
    <div className="text-primary flex justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-bold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{sub}</p>
  </_motion.div>
);

const HomePage = () => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-muted/50 to-background text-foreground overflow-hidden relative">
      
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <nav className="p-6 flex justify-between items-center relative z-10 container mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">EventMind</h1>
        <a href="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:opacity-90 transition shadow-md">
          Get Started
        </a>
      </nav>
      
      <div className="container mx-auto px-6 pt-20 text-center relative z-10">
        <_motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-6xl font-extrabold mb-6 tracking-tight text-foreground"
        >
          Never Miss a Moment
        </_motion.h1>
        
        <_motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="text-xl mb-10 text-muted-foreground max-w-2xl mx-auto"
        >
          Organize events, track progress, and get notified instantly with a workspace designed for clarity.
        </_motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
           <Widget 
             icon={<Cloud className="w-10 h-10" />} 
             title="Weather Ready" 
             sub="24°C Sunny" 
           />
           <Widget 
             icon={<Clock className="w-10 h-10" />} 
             title="Real-time" 
             sub={getCurrentTime()} 
           />
           <Widget 
             icon={<Calendar className="w-10 h-10" />} 
             title="Upcoming" 
             sub="3 Events Today" 
           />
        </div>
      </div>
    </div>
  );
};

export default HomePage;