import React from 'react';
import { Star, BookMarked, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Book } from '../types';
import { formatRating, cn } from '../lib/utils';
import { DEFAULT_BOOK_COVER } from '../constants';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export default function BookCard({ book, compact = false }: BookCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_BOOK_COVER;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group transition-all duration-300",
        compact ? "flex gap-4 p-3 bg-bg-sidebar rounded-xl border border-border" : "flex flex-col gap-4"
      )}
    >
      <Link 
        to={`/book/${book.id}`} 
        className={cn(
          "overflow-hidden rounded-md border border-border group-hover:border-gold transition-colors relative", 
          compact ? "w-20 h-28 flex-shrink-0" : "aspect-[2/3] w-full"
        )}
      >
        <img
          src={book.coverUrl}
          alt={book.title}
          onError={handleImageError}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </Link>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold/60">
          {book.category}
        </span>
        <Link to={`/book/${book.id}`} className="block">
          <h3 className={cn("font-serif italic text-text-main leading-tight truncate transition-colors group-hover:text-gold", compact ? "text-sm" : "text-base")}>
            {book.title}
          </h3>
        </Link>
        <p className="text-[11px] text-text-muted font-medium">by {book.author}</p>

        {!compact && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={cn(i < Math.floor(book.rating) ? "fill-gold" : "opacity-20")} />
              ))}
            </div>
            <span className="text-[10px] text-text-subtle font-bold">{(book.ratingCount / 1000).toFixed(1)}k Ratings</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
