
import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  currentView: 'dashboard' | 'form' | 'manage';
  setView: (view: 'dashboard' | 'form' | 'manage') => void;
  currentUser: User;
  onLogout: () => void;
}

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentView, setView, currentUser, onLogout }) => {
  const navButtonClasses = (view: 'dashboard' | 'form' | 'manage') => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
        ? 'bg-white text-teal-600 shadow-sm' 
        : 'text-teal-100 hover:bg-teal-400 hover:bg-opacity-75'
    }`;

  return (
    <header className="bg-teal-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BookIcon />
            <h1 className="text-2xl font-bold text-white tracking-tight">Our Reading Adventures</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <span className="text-white font-semibold text-sm">{currentUser.name}</span>
                <span className="text-teal-200 text-xs block -mt-1">{currentUser.role}</span>
            </div>
            <nav className="flex space-x-2">
              <button onClick={() => setView('dashboard')} className={navButtonClasses('dashboard')}>
                Dashboard
              </button>
              {currentUser.role === 'student' && (
                <button onClick={() => setView('form')} className={navButtonClasses('form')}>
                    New Log Entry
                </button>
              )}
               {currentUser.role === 'teacher' && (
                <button onClick={() => setView('manage')} className={navButtonClasses('manage')}>
                    Manage Class
                </button>
              )}
            </nav>
            <button onClick={onLogout} className="text-teal-200 hover:text-white" title="Log Out">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;