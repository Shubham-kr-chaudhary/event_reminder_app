import { useState, useEffect } from 'react';
import { motion as _motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut } from 'lucide-react';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';

const Dashboard = () => {
  const { logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
    loadData();
  }, [refreshKey]); 

  const refreshEvents = () => setRefreshKey(prev => prev + 1);

  const markComplete = async (id) => {
    try {
      await api.put(`/events/${id}`, { status: 'Completed' });
      refreshEvents(); 
    } catch (error) {
      console.error("Error marking complete", error);
    }
  };

  const filteredEvents = events.filter(ev => filter === 'All' ? true : ev.status === filter);
  
  const stats = [
    { title: 'Total Events', value: events.length },
    { title: 'Active Events', value: events.filter(e => e.status === 'Upcoming').length },
    { title: 'Completed', value: events.filter(e => e.status === 'Completed').length }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="bg-card border-b border-border shadow-sm p-4 flex justify-between items-center px-6 md:px-12">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <button 
          onClick={logout} 
          className="flex items-center gap-2 text-destructive hover:bg-destructive/10 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} title={stat.title} value={stat.value} />
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-2 bg-card p-1 rounded-lg shadow-sm border border-border">
            {['All', 'Upcoming', 'Completed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter === f 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <_motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:opacity-90 w-full md:w-auto justify-center"
          >
            <Plus size={18} /> New Event
          </_motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEvents.map((ev) => (
              <EventCard key={ev._id} event={ev} onComplete={markComplete} />
            ))}
          </AnimatePresence>
          {filteredEvents.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No events found.
            </div>
          )}
        </div>
      </main>

      <CreateEventModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onRefresh={refreshEvents} 
      />
    </div>
  );
};

export default Dashboard;