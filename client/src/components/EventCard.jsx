import { motion as _motion } from 'framer-motion';
import { Calendar, Check } from 'lucide-react';
import moment from 'moment';

const EventCard = ({ event, onComplete }) => {
  const isCompleted = event.status === 'Completed';

  return (
    <_motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300"
    >
      <div 
        className={`h-2 w-full ${isCompleted ? 'bg-muted' : 'bg-primary'}`} 
      />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-lg font-bold ${isCompleted ? 'text-muted-foreground line-through' : 'text-card-foreground'}`}>
            {event.title}
          </h3>
          
          <span 
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              isCompleted 
                ? 'bg-secondary text-secondary-foreground' 
                : 'bg-primary/10 text-primary' 
            }`}
          >
            {event.status}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm flex items-center gap-2 mb-6">
          <Calendar size={14} />
          {moment(event.date).format('MMMM Do YYYY, h:mm a')}
        </p>

        {!isCompleted && (
          <button 
            onClick={() => onComplete(event._id)} 
            className="w-full border border-primary/50 text-primary py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-sm font-bold flex justify-center items-center gap-2 group"
          >
            <Check size={16} className="group-hover:scale-110 transition-transform" /> 
            Mark Done
          </button>
        )}
      </div>
    </_motion.div>
  );
};

export default EventCard;