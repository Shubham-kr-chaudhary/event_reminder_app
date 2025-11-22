import { motion as _motion } from "motion/react"; 

const StatCard = ({ title, value }) => {
  return (
    <_motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="bg-card p-6 rounded-xl shadow-sm border border-border border-l-4 border-l-primary"
    >
      <h3 className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
        {title}
      </h3>
      <p className="text-4xl font-bold text-card-foreground mt-2">
        {value}
      </p>
    </_motion.div>
  );
};

export default StatCard;