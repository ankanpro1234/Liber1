import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function TopHeader() {
  const { user, signIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="flex justify-between items-center px-10 py-8 bg-bg-main/80 backdrop-blur-md sticky top-0 z-30">
      <form onSubmit={handleSearch} className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle group-focus-within:text-gold transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search by title, author, or genre..."
          className="w-full bg-bg-input border border-border rounded-full py-2.5 px-11 text-sm text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      <div className="flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] text-text-muted">
        <span className="hidden md:block">85,200 Books Accessible</span>
        {!user && (
          <button 
            onClick={signIn}
            className="text-gold font-bold hover:text-gold-hover transition-colors cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
