import { Search, Home, Library, Heart, History, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const { user, profile, logOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/', section: 'Discovery' },
    { label: 'My Library', icon: Library, path: '/profile', section: 'Personal' },
  ];

  return (
    <aside className="w-64 bg-bg-sidebar border-r border-border flex flex-col p-8 h-screen sticky top-0">
      <div className="mb-12">
        <Link to="/" className="text-3xl font-serif italic text-gold tracking-tighter">Liber.</Link>
      </div>
      
      <nav className="flex-1 space-y-8">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-subtle font-bold">Discovery</p>
          <div className="space-y-1">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-3 py-2 px-3 rounded-lg transition-colors group",
                location.pathname === '/' ? "text-gold bg-gold/5" : "text-text-muted hover:text-text-main hover:bg-white/5"
              )}
            >
              <Home size={18} className={cn(location.pathname === '/' ? "text-gold" : "text-text-subtle group-hover:text-text-main")} />
              <span className="text-sm font-medium">Home</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-subtle font-bold">Personal</p>
          <div className="space-y-1">
            <Link 
              to="/profile" 
              className={cn(
                "flex items-center gap-3 py-2 px-3 rounded-lg transition-colors group",
                location.pathname === '/profile' ? "text-gold bg-gold/5" : "text-text-muted hover:text-text-main hover:bg-white/5"
              )}
            >
              <Library size={18} className={cn(location.pathname === '/profile' ? "text-gold" : "text-text-subtle group-hover:text-text-main")} />
              <span className="text-sm font-medium">My Library</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mt-auto flex items-center gap-3 pt-6 border-t border-border">
        {user ? (
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold/30 flex-shrink-0">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} className="w-full h-full rounded-full object-cover" alt="" />
                ) : (
                  <span className="font-bold text-xs">{profile?.displayName?.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="truncate">
                <p className="text-xs text-text-main font-medium truncate">{profile?.displayName}</p>
                <p className="text-[10px] text-text-subtle">Premium Reader</p>
              </div>
            </div>
            <button onClick={logOut} className="text-text-subtle hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <p className="text-xs text-text-subtle italic">Welcome to Liber</p>
        )}
      </div>
    </aside>
  );
}
