export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences?: {
    genres: string[];
  };
  wishlist?: string[];
  readingHistory?: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl: string;
  rating: number;
  ratingCount: number;
  pageCount?: number;
  publishedDate?: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface UserBook {
  userId: string;
  bookId: string;
  status: 'want_to_read' | 'reading' | 'read';
  progress?: number;
  lastRead?: any;
}

export interface RecommendationRequest {
  readingHistory: string[];
  preferences: string[];
  currentBook?: string;
}
