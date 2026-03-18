# Product Listing — Frontend

Next.js 15 + TypeScript + Tailwind CSS

## Setup

```bash
cd frontend
npm install
npm run dev
```

App berjalan di http://localhost:3000

## Environment Variables

Salin `.env.local` dan sesuaikan jika backend berjalan di port berbeda:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Struktur

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # redirect → /products
│   ├── products/
│   │   ├── page.tsx              # Server Component, fetch awal
│   │   ├── loading.tsx           # Loading skeleton
│   │   ├── ProductListClient.tsx # Client Component, filter + pagination
│   │   └── [id]/
│   │       ├── page.tsx          # Detail product
│   │       ├── loading.tsx
│   │       └── not-found.tsx
├── components/
│   ├── ProductCard.tsx
│   ├── FilterBar.tsx
│   └── Pagination.tsx
├── lib/
│   └── api/
│       └── products.ts           # Semua API calls
└── types/
    └── product.ts                # TypeScript types
```
