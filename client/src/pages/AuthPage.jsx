import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as _motion } from "motion/react";
import { useAuth } from '../hooks/useAuth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await login(email, password);
      else await register(email, password);
      navigate('/dashboard');
    } catch (err) { 
      alert('Error: ' + (err.response?.data?.msg || 'Failed')); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <_motion.div 
        key={isLogin ? 'login' : 'register'}
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-foreground text-center tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full p-3 bg-background border border-input rounded-lg outline-none focus:ring-2 focus:ring-ring focus:border-input transition text-foreground placeholder:text-muted-foreground" 
            value={email} onChange={e=>setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 bg-background border border-input rounded-lg outline-none focus:ring-2 focus:ring-ring focus:border-input transition text-foreground placeholder:text-muted-foreground" 
            value={password} onChange={e=>setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-200" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </_motion.div>
    </div>
  );
};

export default AuthPage;