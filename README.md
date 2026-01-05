# NBA Books Directory

A production-ready, SEO-friendly directory of 600+ NBA books with affiliate monetization. Built with Next.js 14, TypeScript, and Tailwind CSS.

![NBA Books Directory](https://via.placeholder.com/800x400?text=NBA+Books+Directory)

## Features

- 🔍 **Fast fuzzy search** - Typo-tolerant search across titles, authors, players, teams, topics
- 🏷️ **Smart filtering** - Filter by category, topics, rating, players, teams, publication year
- 📊 **Multiple sort options** - Sort by relevance, rating, reviews, date, or title
- 📱 **Mobile-first design** - Responsive with drawer-based filters on mobile
- 🔗 **SEO-optimized** - Static generation for all book detail pages
- 💰 **Affiliate ready** - Automatic Amazon affiliate link conversion
- 📈 **Analytics hooks** - Vendor-agnostic click tracking abstraction
- ⚡ **Instant performance** - Precomputed JSON + client-side search index

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/nba-books-directory.git
cd nba-books-directory

# Install dependencies
npm install

# Copy env file and configure
cp .env.example .env.local

# Build the book data from CSV
npm run ingest

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Required: Your Amazon Associates affiliate tag
NEXT_PUBLIC_AMAZON_ASSOC_TAG=hoopshype-20

# Optional: Analytics endpoint
NEXT_PUBLIC_ANALYTICS_ENDPOINT=
```

### Updating Book Data

1. Place your updated CSV at `data/books.csv`
2. Run the ingestion script:

```bash
npm run ingest
```

3. Rebuild the app:

```bash
npm run build
```

### CSV Format

The CSV should have these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Title | Book title | "The Jordan Rules" |
| Author | Author name(s) | "Sam Smith" |
| Rating | Numeric rating (0-5) | 4.3 |
| Number of Reviews | Review count string | "2800+" |
| Publication Date | Date string | "March 1 1992" |
| Format | Slash-separated formats | "Paperback/Kindle" |
| Amazon Link | Product URL | "https://amazon.com/dp/..." |
| Category | Book category | "Bulls/Jordan" |
| Description | Book description | "Behind-the-scenes..." |
| Players Mentioned | Semicolon-separated | "Michael Jordan; Scottie Pippen" |
| Teams Mentioned | Semicolon-separated | "Bulls; Lakers" |
| Topics | Semicolon-separated | "Biography; History" |

## Normalized Data Shape

After ingestion, each book has this structure:

```json
{
  "id": "a1b2c3d4e5f6",
  "slug": "the-jordan-rules-sam-smith-a1b2c3",
  "title": "The Jordan Rules",
  "author": "Sam Smith",
  "rating": 4.3,
  "reviewCount": 2800,
  "reviewCountDisplay": "2800+",
  "publicationDate": "March 1 1992",
  "publicationYear": 1992,
  "formats": ["Paperback", "Kindle"],
  "amazonUrl": "https://amazon.com/dp/0671796100",
  "category": "Bulls/Jordan",
  "description": "Behind-the-scenes look at Michael Jordan...",
  "playersMentioned": ["Michael Jordan"],
  "teamsMentioned": ["Bulls", "Chicago"],
  "topics": ["Biography", "History", "Championship"],
  "asin": "0671796100"
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

The app uses `output: 'export'` for static generation, making it compatible with any static hosting.

### Netlify

```bash
# Build command
npm run build

# Publish directory
out
```

### GitHub Pages

1. Update `next.config.js`:
```js
const nextConfig = {
  output: 'export',
  basePath: '/nba-books-directory',
  // ...
};
```

2. Build and deploy:
```bash
npm run build
# Deploy the `out` directory
```

## Embedding on HoopsHype

### Option 1: Iframe Embed

```html
<iframe 
  src="https://your-deployment-url.com"
  width="100%"
  height="800"
  frameborder="0"
  title="NBA Books Directory"
></iframe>
```

### Option 2: Full Page Embed

Host under a subpath like `hoopshype.com/nba-books/` by:

1. Configure reverse proxy to your deployment
2. Or build with appropriate `basePath` in next.config.js

## Analytics Integration

Wire up your analytics provider:

```typescript
// In your app initialization
import { initAnalytics } from '@/lib/analytics';

// Google Analytics 4
initAnalytics((event) => {
  gtag('event', event.type, event.payload);
});

// Plausible
initAnalytics((event) => {
  plausible(event.type, { props: event.payload });
});
```

Tracked events:
- `affiliate_click` - Book purchase clicks
- `search` - Search queries
- `filter_change` - Filter interactions
- `page_view` - Page navigation

## Development

### Project Structure

```
nba-books-directory/
├── data/
│   └── books.csv              # Source data
├── scripts/
│   └── ingest-csv.ts          # CSV → JSON converter
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Listing page
│   │   └── books/[slug]/      # Detail pages
│   ├── components/            # React components
│   ├── lib/
│   │   ├── affiliate.ts       # Affiliate link utility
│   │   ├── analytics.ts       # Analytics abstraction
│   │   ├── books.ts           # Data loading
│   │   ├── normalize.ts       # Data parsing
│   │   ├── search.ts          # Fuse.js search
│   │   └── types.ts           # TypeScript types
│   └── data/
│       └── books.json         # Generated data
└── public/
```

### Running Tests

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

### Building

```bash
# Full build (ingest + Next.js)
npm run build

# Just ingest data
npm run ingest

# Just build Next.js
npx next build
```

## Affiliate Disclosure

The app includes required FTC affiliate disclosure. Customize in:
- `src/components/AffiliateDisclosure.tsx`

## License

MIT - See LICENSE file

## Credits

Built for [HoopsHype](https://hoopshype.com) by Jorge.
