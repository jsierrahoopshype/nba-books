import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';

export const metadata: Metadata = {
  title: 'NBA Books Directory | HoopsHype',
  description: 'Discover 600+ books about the NBA, basketball legends, team histories, coaching strategies, and more. Find your next great basketball read.',
  keywords: 'NBA books, basketball books, Michael Jordan books, LeBron James books, basketball history, NBA biographies',
  openGraph: {
    title: 'NBA Books Directory | HoopsHype',
    description: 'Discover 600+ books about the NBA, basketball legends, and more.',
    type: 'website',
    siteName: 'HoopsHype',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NBA Books Directory | HoopsHype',
    description: 'Discover 600+ books about the NBA, basketball legends, and more.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 text-gray-900 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AffiliateDisclosure />
            <p className="text-center text-sm text-gray-500 mt-4">
              © {new Date().getFullYear()} HoopsHype. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
