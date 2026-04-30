/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import { cn } from './lib/utils';

function AppContent() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-main">
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] animate-pulse">Liber.</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex bg-bg-main min-h-screen text-text-main font-sans selection:bg-gold/30 selection:text-gold">
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          {user && <TopHeader />}
          <main className={cn("flex-1", !user && "w-full")}>
            <Routes>
              <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
              <Route path="/book/:id" element={user ? <BookDetails /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
