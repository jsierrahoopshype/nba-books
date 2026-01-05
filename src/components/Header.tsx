'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Home link */}
          <Link 
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary-600 hover:text-primary-700"
          >
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M12 2 C12 2 12 22 12 22" stroke="currentColor" strokeWidth="2" />
              <path d="M2 12 C2 12 22 12 22 12" stroke="currentColor" strokeWidth="2" />
              <path d="M4 6 Q12 12 4 18" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M20 6 Q12 12 20 18" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>NBA Books</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary-600 font-medium"
            >
              Browse All
            </Link>
            <a
              href="https://hoopshype.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 font-medium"
            >
              HoopsHype →
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 text-gray-600 hover:text-primary-600"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
