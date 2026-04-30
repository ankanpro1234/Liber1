import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SAMPLE_BOOKS, DEFAULT_BOOK_COVER, DEFAULT_AVATAR } from '../constants';
import { Star, Clock, BookOpen, CheckCircle, MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { doc, collection, addDoc, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Review, UserBook } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatRating } from '../lib/utils';

export default function BookDetails() {
  const { id } = useParams();
  const { profile, user } = useAuth();
  const book = SAMPLE_BOOKS.find(b => b.id === id);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [userBook, setUserBook] = useState<UserBook | null>(null);

  if (!book) return <div className="p-20 text-center text-text-muted">Book not found</div>;

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('bookId', '==', id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews');
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    const q = query(
      collection(db, 'userBooks'),
      where('userId', '==', user.uid),
      where('bookId', '==', id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setUserBook(snapshot.docs[0].data() as UserBook);
      } else {
        setUserBook(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'userBooks');
    });
    return () => unsubscribe();
  }, [user, id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !newReview.trim()) return;

    try {
      await addDoc(collection(db, 'reviews'), {
        bookId: id,
        userId: user.uid,
        userName: profile.displayName,
        userAvatar: profile.photoURL,
        rating: newRating,
        comment: newReview,
        createdAt: Timestamp.now()
      });
      setNewReview('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    }
  };

  const updateStatus = async (status: UserBook['status']) => {
    if (!user || !id) return;
    try {
      await addDoc(collection(db, 'userBooks'), {
        userId: user.uid,
        bookId: id,
        status,
        lastRead: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'userBooks');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-10 py-12 space-y-20">
      {/* Book Header */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-4 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[2/3] rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-border sticky top-32"
          >
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              onError={(e) => e.currentTarget.src = DEFAULT_BOOK_COVER}
              className="w-full h-full object-cover" 
            />
          </motion.div>
          
          <div className="bg-bg-sidebar p-6 rounded-2xl border border-border space-y-4">
             <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-subtle">Quick Stats</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xl font-serif italic text-gold">{formatRating(book.rating)}</p>
                  <p className="text-[9px] uppercase tracking-widest text-text-subtle">Avg Rating</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-serif italic text-text-main">{book.pageCount}</p>
                  <p className="text-[9px] uppercase tracking-widest text-text-subtle">Pages</p>
                </div>
             </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-10">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-gold/20">
              {book.category}
            </span>
            <h1 className="text-6xl font-serif italic tracking-tight text-text-main leading-tight">
              {book.title}
            </h1>
            <p className="text-2xl text-text-muted font-light serif italic">— {book.author}</p>
          </div>

          <div className="prose prose-invert prose-lg text-text-muted max-w-none">
            <p className="leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-gold first-letter:italic">
              {book.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-10 border-t border-border">
            <button
              onClick={() => updateStatus('want_to_read')}
              className={cn(
                "flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
                userBook?.status === 'want_to_read' ? "bg-gold/10 text-gold border border-gold/30" : "bg-gold text-bg-main hover:bg-gold-hover shadow-xl shadow-gold/10"
              )}
            >
              <Clock size={16} />
              {userBook?.status === 'want_to_read' ? 'In Journal' : 'Add to Wishlist'}
            </button>
            <button
               onClick={() => updateStatus('reading')}
              className={cn(
                "flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all border border-border",
                userBook?.status === 'reading' ? "bg-bg-input text-text-main" : "bg-bg-sidebar text-text-muted hover:border-gold hover:text-text-main"
              )}
            >
              <BookOpen size={16} />
              {userBook?.status === 'reading' ? 'Currently Reading' : 'Start Reading'}
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-20 border-t border-border">
        <aside className="lg:col-span-4 space-y-10">
          <div className="bg-bg-sidebar p-8 rounded-3xl space-y-8 border border-border">
            <h2 className="text-2xl font-serif italic text-text-main">Leave a Review</h2>

            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={cn("transition-transform hover:scale-125", newRating >= star ? "text-gold" : "text-border")}
                    >
                      <Star className={cn("w-6 h-6", newRating >= star && "fill-current")} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your literary reflections..."
                  className="w-full p-5 bg-bg-input border border-border rounded-xl focus:outline-none focus:border-gold text-sm text-text-main min-h-[150px] placeholder:text-text-subtle/50"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-bg-main border border-gold text-gold rounded-full font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-gold hover:text-bg-main transition-all"
                >
                  <Send size={14} /> Submit Reflection
                </button>
              </form>
            ) : (
              <p className="text-xs text-text-subtle italic">Sign in to share your thoughts.</p>
            )}
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <h2 className="text-3xl font-serif italic text-text-main">Community Reflections</h2>
            <span className="text-[10px] text-text-subtle font-bold uppercase tracking-widest">{reviews.length} Insights</span>
          </div>

          <div className="space-y-8">
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-border overflow-hidden border border-border">
                        {review.userAvatar ? (
                          <img 
                            src={review.userAvatar} 
                            alt="" 
                            onError={(e) => e.currentTarget.src = DEFAULT_AVATAR}
                          />
                        ) : (
                          <UserIcon className="p-2 text-text-subtle" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">{review.userName}</p>
                        <p className="text-[9px] text-text-subtle uppercase tracking-[0.2em]">
                          {review.createdAt?.toDate().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={cn(i < review.rating ? "fill-gold" : "opacity-10")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-muted leading-relaxed italic text-base border-l-2 border-gold/20 pl-6 py-2">
                    "{review.comment}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {reviews.length === 0 && (
              <div className="py-20 text-center text-text-subtle italic">
                <p>The archives are empty. Be the first to reflect on this work.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

