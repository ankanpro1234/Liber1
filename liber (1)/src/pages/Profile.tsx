import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Book, UserBook } from '../types';
import { SAMPLE_BOOKS, CATEGORIES, DEFAULT_AVATAR } from '../constants';
import BookCard from '../components/BookCard';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Library, Heart, History, User as UserIcon, BookOpen, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [activeTab, setActiveTab] = useState<'reading' | 'want_to_read' | 'read'>('reading');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'userBooks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserBooks(snapshot.docs.map(d => d.data() as UserBook));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'userBooks');
    });
    return () => unsubscribe();
  }, [user]);

  const filteredBooks = SAMPLE_BOOKS.filter(b =>
    userBooks.some(ub => ub.bookId === b.id && ub.status === activeTab)
  );

  const toggleGenre = (genre: string) => {
    const current = profile?.preferences?.genres || [];
    const updated = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    updateProfile({ preferences: { genres: updated } });
  };

  if (!user) return <div className="p-20 text-center text-text-muted italic">Please sign in to access your archives.</div>;

  return (
    <div className="max-w-6xl mx-auto px-10 py-12 space-y-16">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row items-center gap-10 bg-bg-sidebar p-12 rounded-[40px] border border-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold/20" />
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-bg-main shadow-2xl bg-bg-main">
             {profile?.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  onError={(e) => e.currentTarget.src = DEFAULT_AVATAR}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon size={64} className="text-border" />
                </div>
              )}
          </div>
          <button className="absolute bottom-2 right-2 p-3 bg-gold text-bg-main rounded-full shadow-xl hover:bg-gold-hover transition-colors border-4 border-bg-sidebar">
            <Settings size={18} />
          </button>
        </div>

        <div className="text-center md:text-left space-y-3">
          <h1 className="text-4xl font-serif italic text-text-main">{profile?.displayName}</h1>
          <p className="text-text-muted font-medium tracking-wide">{profile?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <span className="px-5 py-1.5 bg-bg-main border border-border rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
               {userBooks.length} Collected Works
            </span>
            <span className="px-5 py-1.5 bg-bg-main border border-border rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
               Member of Liber.
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar: Preferences */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Heart className="text-gold" size={20} />
              <h2 className="text-xl font-serif italic text-text-main">Genre Preferences</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                    profile?.preferences?.genres.includes(genre)
                      ? "bg-gold text-bg-main border-gold shadow-lg shadow-gold/10"
                      : "bg-bg-input text-text-muted border-border hover:border-gold hover:text-text-main"
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-3">
              <History className="text-gold" size={20} />
              <h2 className="text-xl font-serif italic text-text-main">Personal Stats</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-bg-sidebar border border-border p-8 rounded-3xl text-center">
                <span className="text-4xl font-serif italic text-gold">
                  {userBooks.filter(b => b.status === 'read').length}
                </span>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-subtle mt-2">Completed</p>
              </div>
              <div className="bg-bg-sidebar border border-border p-8 rounded-3xl text-center">
                <span className="text-4xl font-serif italic text-text-main">
                   {userBooks.filter(b => b.status === 'reading').length}
                </span>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-subtle mt-2">Reading</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content: Library */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center gap-6 border-b border-border pb-4">
            {[
              { id: 'reading', label: 'Currently Reading', icon: BookOpen },
              { id: 'want_to_read', label: 'Wishlist', icon: Heart },
              { id: 'read', label: 'Full Archives', icon: CheckCircle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all",
                  activeTab === tab.id ? "bg-bg-sidebar border border-gold text-gold" : "text-text-subtle hover:text-text-main"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredBooks.map(book => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredBooks.length === 0 && (
            <div className="py-24 text-center space-y-6 border border-dashed border-border rounded-3xl bg-bg-sidebar/50">
              <Library size={48} className="mx-auto text-border" />
              <p className="text-text-subtle italic text-sm">This section of your library is currently silent.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
