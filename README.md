# Product Listing Web App

Mini project untuk validasi speed engineer dengan GitHub Copilot assistance.

**Stack:** Java 25 + Spring Boot (Backend) + Next.js (Frontend) + H2 Database

---

## Quick Start

### Backend (Java Spring Boot)

```powershell
# Terminal 1: Navigate ke root project
cd vibe-code-demo1

# Run backend (port 8080)
.\mvnw spring-boot:run
```

Akses H2 Console: http://localhost:8080/h2-console

### Frontend (Next.js)

```powershell
# Terminal 2: Navigate ke frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Run dev server (port 3000)
npm run dev
```

Akses aplikasi: http://localhost:3000

---

## Features

✅ **Product Listing**
- Grid layout dengan 4 kolom (responsive)
- Pagination dengan halaman navigation
- Default 10 items per page

✅ **Filtering**
- **Search keyword**: auto-apply saat user berhenti mengetik (~500ms debounce)
  - Pencarian saat ini berdasarkan **nama product**
- **Category**: tombol Apply eksplisit
- **Price range**: tombol Apply eksplisit (min/max)
- **Clear filters**: reset semua filter

✅ **Product Detail**
- Nama, deskripsi, harga, kategori
- Tombol "Back to listing" mempertahankan filter state + halaman sebelumnya

✅ **Navigation**
- Pagination tetap sinkron dengan URL
- Back/forward browser aman (state preserved di URL params)
- Filter state selalu di URL search params (URL yang bisa dibagikan)

---

## Architecture

### Backend: Spring Boot (port 8080)

```
Controller → Service → Repository → H2 Database
```

- `ProductController`: REST endpoints
- `ProductServiceImpl`: Business logic
- `ProductRepository` + `ProductSpecification`: JPA filtering
- `ProductFilterRequestDto`: DTO untuk filter params
- `PagedResponseDto`: Consistent response format

**API Endpoints:**
- `GET /api/v1/products?keyword=...&category=...&minPrice=...&maxPrice=...&page=0&size=10`
- `GET /api/v1/products/{id}`

### Frontend: Next.js (port 3000)

```
Server Component (page.tsx) → fetch awal
     ↓
Client Component (ProductListClient.tsx) → interaktivitas
     ↓
Components (FilterBar, Pagination, ProductCard)
     ↓
API Layer (src/lib/api/products.ts)
     ↓
Spring Boot API
```

- **App Router** (bukan Pages Router)
- **URL-driven state**: filter state di search params
- **Debounced search**: keyword auto-apply 500ms
- **Explicit apply**: category + price filter dengan tombol

---

## Database

**H2 in-memory** (development only)
- Schema: auto-create via Hibernate `ddl-auto: create`
- Seed data: 24 products di `src/main/resources/data.sql`
- Categories: Electronics, Furniture, Sports, Groceries, Stationery

---

## Known Constraints

- Keyword search backend saat ini memfilter pada field `name`.
- Jika perlu pencarian juga di `description`, perlu update `ProductSpecification`.

---

## Development Notes

### Mode Approval Driven
Perubahan kode dilakukan dengan workflow:
1. Propose patch (analisis + rencana)
2. Review (user baca proposal)
3. Execute (setelah approval)
4. Verify (test hasil)

---

## Next Steps (Optional)

- [ ] Validasi filter input (minPrice > maxPrice show error)
- [ ] Expand keyword search ke `description` field
- [ ] Add unit tests untuk filter flow
- [ ] Performance: index pada `products.name`
- [ ] Docker setup untuk production

---

## Files Structure

```
project-root/
├── frontend/                         (Next.js app)
│   ├── src/
│   │   ├── app/                     (pages, layout, routes)
│   │   ├── components/              (FilterBar, ProductCard, Pagination)
│   │   ├── lib/api/                 (API functions)
│   │   └── types/                   (TypeScript types)
│   ├── package.json
│   └── .env.local
├── src/                             (Spring Boot source, root pom.xml)
│   ├── main/java/
│   │   └── com/harvanir/productlisting/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── domain/
│   │       │   ├── dto/
│   │       │   └── entity/
│   │       └── exception/
│   └── main/resources/
│       ├── application.yml
│       ├── data.sql                 (seed products)
│       └── schema.sql               (DDL)
├── pom.xml                          (Maven root)
└── .github/copilot-instructions.md  (AI context)
```

---

**Last updated:** 19 March 2026