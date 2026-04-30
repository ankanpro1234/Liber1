import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Star, Users } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { user, signIn } = useAuth();

  if (user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden bg-bg-main text-text-main">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[150px] -mr-96 -mt-96 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/2 blur-[100px] -ml-64 -mb-64 rounded-full" />

      {/* Left Decoration (Visible on Mobile too) */}
      <div className="relative p-12 md:p-24 flex flex-col justify-center space-y-16 border-r border-border backdrop-blur-3xl">
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border border-gold/20">
            <Sparkles size={14} /> AI-Curated Experience
          </div>
          <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none text-text-main">
            Liber<span className="text-gold">.</span>
          </h1>
          <div className="space-y-6">
            <p className="text-2xl text-text-muted max-w-lg font-light leading-relaxed serif italic">
              "A room without books is like a body without a soul." 
            </p>
            <span className="block text-[10px] uppercase tracking-widest font-bold text-text-subtle">— Cicero</span>
          </div>
        </div>

        <div className="relative z-10 pt-4">
          <button
            onClick={signIn}
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-gold text-bg-main rounded-full font-bold text-xs uppercase tracking-[0.25em] hover:bg-gold-hover transition-all active:scale-95 shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5 bg-white rounded-full p-0.5" />
            Enter Library
          </button>
        </div>

        <div className="grid grid-cols-2 gap-12 relative z-10 pt-12 border-t border-border/50">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-bg-sidebar border border-border rounded-xl flex items-center justify-center text-gold">
              <Star size={18} />
            </div>
            <h4 className="font-serif italic text-text-main text-lg leading-none">Curated Lists</h4>
            <p className="text-[10px] text-text-subtle uppercase tracking-widest font-bold leading-tight">Tailored to your history</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-bg-sidebar border border-border rounded-xl flex items-center justify-center text-gold">
              <Users size={18} />
            </div>
            <h4 className="font-serif italic text-text-main text-lg leading-none">Global Circle</h4>
            <p className="text-[10px] text-text-subtle uppercase tracking-widest font-bold leading-tight">Shared reflections</p>
          </div>
        </div>
      </div>

      {/* Right Visual (Desktop Only) */}
      <div className="hidden lg:flex relative overflow-hidden flex-col items-center justify-center p-20 bg-bg-sidebar/30">
        <motion.div
           initial={{ rotateY: -20, rotateX: 10, y: 50, opacity: 0 }}
           animate={{ rotateY: -10, rotateX: 5, y: 0, opacity: 1 }}
           transition={{ duration: 1.5, ease: 'easeOut' }}
           className="relative group"
        >
          <div className="absolute inset-0 bg-gold/30 blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className="w-[420px] aspect-[2/3] bg-bg-main shadow-2xl overflow-hidden border-[12px] border-bg-sidebar/50 backdrop-blur rounded-2xl shadow-black/80 relative">
            <img
              src="https://images.unsplash.com/photo-1543004218-2fe497d73fd1?auto=format&fit=crop&q=80&w=1200"
              alt="Classic Library"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent flex flex-col justify-end p-12 text-text-main">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-3">Featured Anthology</p>
              <h3 className="text-4xl font-serif italic mb-2 leading-none">The Great Gatsby</h3>
              <p className="text-sm text-text-muted serif italic">F. Scott Fitzgerald</p>
            </div>
          </div>
        </motion.div>
        
        {/* Cinematic Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20 overflow-hidden">
           <div className="w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent absolute top-1/4 animate-pulse" />
           <div className="h-full w-px bg-gradient-to-b from-transparent via-gold to-transparent absolute left-1/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
