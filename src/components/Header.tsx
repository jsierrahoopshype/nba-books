import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link href="/nba-books/" className="flex items-center gap-3">
          <span className="text-2xl">🏀</span>
          <h1 className="text-xl font-bold text-gray-900">NBA Books</h1>
        </Link>
      </div>
    </header>
  );
}