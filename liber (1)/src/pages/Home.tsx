import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Book } from '../types';
import { SAMPLE_BOOKS, CATEGORIES, DEFAULT_BOOK_COVER } from '../constants';
import BookCard from '../components/BookCard';
import { Sparkles, ChevronRight, Book as BookIcon, Star, MessageSquare } from 'lucide-react';
import { getRecommendations, searchBooksAI } from '../services/geminiService';
import { cn } from '../lib/utils';

export default function Home() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [recs, setRecs] = useState<Book[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (q) {
        const results = await searchBooksAI(q, SAMPLE_BOOKS);
        setFilteredBooks(SAMPLE_BOOKS.filter(b => results.includes(b.id)));
      } else {
        setFilteredBooks(SAMPLE_BOOKS);
      }
    }
    performSearch();
  }, [q]);

  useEffect(() => {
    async function fetchRecs() {
      if (profile && !q) {
        setIsLoadingRecs(true);
        const bookIds = await getRecommendations(profile, SAMPLE_BOOKS);
        setRecs(SAMPLE_BOOKS.filter(b => bookIds.includes(b.id)));
        setIsLoadingRecs(false);
      }
    }
    fetchRecs();
  }, [profile, q]);

  const displayBooks = activeCategory
    ? filteredBooks.filter(b => b.category === activeCategory)
    : filteredBooks;

  const topPick = recs[0] || SAMPLE_BOOKS[Math.floor(Math.random() * SAMPLE_BOOKS.length)];

  return (
    <div className="p-10 pt-4 space-y-12">
      {/* Hero Recommendation */}
      <section className="bg-bg-card rounded-2xl p-10 flex flex-col md:flex-row items-center gap-10 border border-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        <Link to={`/book/${topPick.id}`} className="w-48 h-72 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-gold/20 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className="relative h-full bg-gradient-to-br from-border to-bg-main rounded-lg shadow-2xl overflow-hidden border border-white/5 p-2 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
            <img 
              src={topPick.coverUrl} 
              className="w-full h-full object-cover rounded shadow-inner" 
              alt={topPick.title} 
              onError={(e) => e.currentTarget.src = DEFAULT_BOOK_COVER}
            />
          </div>
        </Link>
        
        <div className="flex-1 space-y-6 relative z-10">
          <div className="space-y-4">
            <span className="bg-gold/10 text-gold text-[10px] px-3 py-1.5 rounded-full uppercase font-bold tracking-[0.2em] border border-gold/20">
              {recs.length > 0 ? "Top Pick For You" : "Library Spotlight"}
            </span>
            <h2 className="text-5xl font-serif italic leading-tight text-text-main line-clamp-2">
              {topPick.title}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed max-w-xl">
              {topPick.description}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                 <Star key={i} size={14} className={cn(i < Math.floor(topPick.rating) ? "fill-gold" : "opacity-30")} />
              ))}
            </div>
            <span className="text-xs text-text-subtle font-medium uppercase tracking-widest">
              ({topPick.ratingCount.toLocaleString()} Ratings)
            </span>
            <Link 
              to={`/book/${topPick.id}`}
              className="bg-gold text-bg-main px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-hover transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-gold/20"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Recommended List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif italic text-2xl text-text-main">
              {q ? `Results for "${q}"` : activeCategory ? activeCategory : "Discover the Collection"}
            </h3>
            {!q && !activeCategory && (
              <span className="text-[10px] text-text-subtle uppercase tracking-widest font-bold">
                Showing {displayBooks.length} Books
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {displayBooks.slice(0, 12).map((book) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {displayBooks.length > 12 && (
            <div className="pt-8 flex justify-center">
              <button className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-subtle hover:text-gold transition-colors py-4 px-10 border border-border rounded-full hover:border-gold">
                View Full Library
              </button>
            </div>
          )}

          {displayBooks.length === 0 && (
             <div className="py-20 text-center space-y-4 border border-dashed border-border rounded-xl bg-bg-sidebar">
               <BookIcon className="mx-auto text-text-subtle opacity-20" size={48} />
               <p className="text-text-muted italic">The library seems silent on this topic...</p>
               {q && (
                 <button 
                  onClick={() => window.location.href = '/'}
                  className="text-xs text-gold underline underline-offset-4 decoration-gold/30 hover:decoration-gold transition-all"
                 >
                   Clear your search
                 </button>
               )}
             </div>
          )}
        </div>

        {/* Categories/Discover */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h3 className="font-serif italic text-2xl text-text-main">Categories</h3>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all",
                  activeCategory === null ? "bg-gold text-bg-main shadow-lg shadow-gold/20" : "bg-bg-input border border-border text-text-muted hover:border-gold hover:text-text-main"
                )}
              >
                All Genres
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all",
                    activeCategory === cat ? "bg-gold text-bg-main shadow-lg shadow-gold/20" : "bg-bg-input border border-border text-text-muted hover:border-gold hover:text-text-main"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Review / Spotlight */}
          <div className="p-6 bg-bg-sidebar border border-border rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MessageSquare size={80} />
            </div>
            <p className="text-[10px] text-text-subtle uppercase font-bold tracking-[0.2em] mb-4">Recent Spotlight</p>
            <p className="text-sm italic leading-relaxed text-text-main">
              "An absolute masterpiece of modern prose. The atmosphere is so thick you can almost smell the old paper and ink."
            </p>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
              <p className="text-[10px] text-gold font-bold uppercase tracking-widest">— Marcus V.</p>
              <div className="text-[10px] text-text-subtle font-medium">4.8 Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
