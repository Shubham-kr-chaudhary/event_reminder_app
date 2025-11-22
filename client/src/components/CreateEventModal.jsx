import { useState } from 'react';
import { motion as _motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const getCurrentDate = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getCurrentTimeData = () => {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const isPM = h >= 12;
  const ampm = isPM ? 'PM' : 'AM';
  
  h = h % 12;
  h = h ? h : 12;

  return {
    hour: h.toString(),
    minute: m.toString().padStart(2, '0'),
    ampm
  };
};
const EventForm = ({ onClose, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [datePart, setDatePart] = useState(getCurrentDate);
  const [timeData, setTimeData] = useState(getCurrentTimeData);

  const { hour, minute, ampm } = timeData;

  const updateTime = (field, value) => {
    setTimeData(prev => ({ ...prev, [field]: value }));
  };

  const handleMinuteBlur = () => {
    if (minute.length === 1) {
      updateTime('minute', '0' + minute);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hInt = parseInt(hour);
      const mInt = parseInt(minute);
      
      if (!title.trim()) return alert("Title is required");
      if (isNaN(hInt) || hInt < 1 || hInt > 12) return alert("Invalid Hour (1-12)");
      if (isNaN(mInt) || mInt < 0 || mInt > 59) return alert("Invalid Minute (0-59)");

      let hour24 = hInt;
      if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
      if (ampm === 'AM' && hour24 === 12) hour24 = 0;

      const finalDate = new Date(`${datePart}T${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);

      await api.post('/events', { title, date: finalDate });
      
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to create event", error);
      alert("Error creating event");
    }
  };
  const inputBaseClass = "w-full p-3 bg-background border border-input rounded-lg focus:border-ring focus:ring-1 focus:ring-ring outline-none transition text-foreground placeholder:text-muted-foreground";
  const labelClass = "block text-sm font-bold text-foreground/80 mb-2";

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
      <div>
        <label className={labelClass}>Event Title</label>
        <input 
          type="text" 
          required 
          autoFocus
          className={inputBaseClass}
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="e.g., Team Meeting" 
        />
      </div>

      <div>
        <label className={labelClass}>Date</label>
        <input 
          type="date" 
          required 
          className={inputBaseClass}
          value={datePart} 
          onChange={e => setDatePart(e.target.value)} 
        />
      </div>

      <div>
        <label className={labelClass}>Time</label>
        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border border-border">
          <input 
            type="number" min="1" max="12" placeholder="HH" required
            value={hour}
            onChange={(e) => updateTime('hour', e.target.value)}
            className="w-16 p-2 text-center text-xl font-bold bg-background border border-input rounded-md focus:border-ring focus:ring-1 focus:ring-ring outline-none text-foreground"
          />
          <span className="text-2xl font-bold text-muted-foreground pb-1">:</span>
          <input 
            type="number" min="0" max="59" placeholder="MM" required
            value={minute}
            onChange={(e) => updateTime('minute', e.target.value)}
            onBlur={handleMinuteBlur}
            className="w-16 p-2 text-center text-xl font-bold bg-background border border-input rounded-md focus:border-ring focus:ring-1 focus:ring-ring outline-none text-foreground"
          />
          
          <select 
            value={ampm} 
            onChange={(e) => updateTime('ampm', e.target.value)}
            className="flex-1 p-2 ml-2 text-center font-bold bg-secondary text-secondary-foreground border border-transparent rounded-md outline-none cursor-pointer hover:bg-secondary/80 transition"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-2 ml-1">Enter hour (1-12) and minute (0-59)</p>
      </div>
      
      <button type="submit" className="mt-auto bg-primary text-primary-foreground py-4 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-md transform active:scale-95">
        Set Reminder
      </button>
      
      <button type="button" onClick={onClose} className="text-center text-muted-foreground hover:text-foreground font-medium py-2 transition">
        Cancel
      </button>
    </form>
  );
};

const CreateEventModal = ({ isOpen, onClose, onRefresh }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <_motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
          />
          <_motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-2xl z-50 p-8 flex flex-col border-l border-border"
          >
            <h2 className="text-2xl font-bold mb-8 text-foreground">Add New Event</h2>
            
            <EventForm onClose={onClose} onRefresh={onRefresh} />
            
          </_motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateEventModal;