# GitHub Copilot Instructions
> File ini otomatis dibaca oleh GitHub Copilot sebagai context untuk semua suggestion.  
> Letakkan file ini di `.github/copilot-instructions.md`

---

## Project Context

Ini adalah project **Product Listing web app** dengan stack:
- **Backend:** Java Spring Boot (REST API, port 8080)
- **Frontend:** Next.js dengan App Router + TypeScript + Tailwind CSS (port 3000)
- **Database:** H2 in-memory (dev only)

---

## Aturan Wajib untuk Semua Suggestion

### Backend
- Selalu gunakan package structure: `controller` → `service` → `repository` → `domain`
- Selalu buat DTO terpisah untuk request dan response — jangan pernah return entity langsung
- Selalu wrap response dalam format: `{ "data": ..., "pagination": ... }` untuk list, `{ "data": ... }` untuk single
- Selalu gunakan `@ControllerAdvice` untuk error handling — jangan handle exception di controller
- Selalu tambahkan pagination untuk semua endpoint list menggunakan Spring Data `Pageable`
- Gunakan `record` untuk DTO yang immutable
- Nama test: `methodName_condition_expectedResult`

### Frontend
- Selalu gunakan TypeScript — tidak ada `any` type kecuali benar-benar tidak bisa dihindari
- Filter dan pagination state selalu di URL search params, bukan `useState`
- Semua API call melalui fungsi di `src/lib/api/` — tidak ada `fetch` langsung di komponen
- Gunakan Tailwind CSS untuk styling — tidak ada inline style kecuali nilai dinamis
- Gunakan Next.js App Router — tidak ada Pages Router pattern
- Handle loading state dan error state di setiap komponen yang fetch data

### General
- Jangan tambahkan dependency baru tanpa komentar `// TODO: approve with team`
- Jangan hardcode URL, port, atau credential — selalu gunakan environment variable
- Commit message format: `type(scope): description`

---

## Contoh Pattern yang Benar

### Controller (Backend)
```java
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<PagedResponseDto<ProductResponseDto>> getProducts(
            ProductFilterRequestDto filter, Pageable pageable) {
        return ResponseEntity.ok(productService.findAll(filter, pageable));
    }
}
```

### API Function (Frontend)
```typescript
// src/lib/api/products.ts
export async function getProducts(filter: ProductFilter): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams(buildQueryParams(filter));
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}
```

### Filter State (Frontend)
```typescript
// Gunakan URL search params, bukan useState
const searchParams = useSearchParams();
const router = useRouter();

const handleCategoryChange = (category: string) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set('category', category);
  params.set('page', '0'); // reset ke page 1 saat filter berubah
  router.push(`/products?${params.toString()}`);
};
```

---

## Execution Policy

**WAJIB:** Sebelum mengubah file, kirim proposal dulu:
1. Jelaskan masalah / requirement
2. List file yang akan diubah
3. Tampilkan proposed patch ringkas
4. Tunggu approval: `EXECUTE`, `EXECUTE <path>`, atau `REVISE`
5. Baru kemudian apply perubahan

**Tujuan:** Mencegah breaking changes dan memastikan code quality.

---

## Specification & Filtering Pattern (Backend)

### ProductSpecification.java
```java
// ✅ BENAR: Gunakan Predicate chain, bukan conjunction()
Predicate predicate = null;
if (StringUtils.hasText(filter.keyword())) {
    Predicate keywordPredicate = criteriaBuilder.like(
        criteriaBuilder.lower(root.get("name")),
        "%" + filter.keyword().trim().toLowerCase() + "%"
    );
    predicate = predicate == null ? keywordPredicate : criteriaBuilder.and(predicate, keywordPredicate);
}
return predicate;

// ❌ SALAH: conjunction() menghasilkan "where 1=1" yang redundant
var predicates = criteriaBuilder.conjunction();
predicates.getExpressions().add(...); // Tidak masuk ke WHERE clause
return predicates;
```

### Service Layer Logging
```java
log.info("Service findAll | filter: category={}, keyword={}, minPrice={}, maxPrice={} | result count: {} of {} total",
    filter.category(), filter.keyword(), filter.minPrice(), filter.maxPrice(),
    productPage.getContent().size(), productPage.getTotalElements());
```

---

## Response Format (Exact)

### List Response (Pagination)
```json
{
  "data": [
    { "id": 1, "name": "Product A", "price": 19.99, "category": "Electronics" },
    { "id": 2, "name": "Product B", "price": 29.99, "category": "Furniture" }
  ],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 24,
    "totalPages": 3
  }
}
```

### Single Response
```json
{
  "data": {
    "id": 1,
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse...",
    "price": 19.99,
    "category": "Electronics"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with id 999 not found"
  }
}
```

---

## Filter Flow (Frontend)

### Keyword Search — Auto-apply dengan Debounce
```typescript
// ✅ Ketik bebas, auto-apply setelah 500ms
const useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    onApply({ keyword: form.keyword.trim(), ... });
  }, 500);
  return () => window.clearTimeout(timeoutId);
}, [form.keyword]);
```

### Category / Price — Explicit Apply Button
```typescript
// ✅ Ubah nilai, tapi tidak langsung apply sampai user klik tombol
function handleApply() {
  onApply({
    category: form.category,
    minPrice: form.minPrice,
    maxPrice: form.maxPrice,
    keyword: form.keyword,
  });
}
```

### URL State Management
```typescript
// ✅ Pagination: hanya ubah page param
function changePage(page: number) {
  const params = new URLSearchParams(searchParams.toString());
  params.set('page', String(page));
  router.push(`/products?${params.toString()}`);
}

// ✅ Filter: ubah filter + reset page ke 0
function applyFilters(nextFilter: ProductFilter) {
  const params = new URLSearchParams(searchParams.toString());
  // Set filter params
  params.set('page', '0'); // WAJIB reset page saat filter berubah
  router.push(`/products?${params.toString()}`);
}
```

---

## Back Navigation Pattern (Frontend)

### ProductCard — Kirim current listing URL
```typescript
// ✅ Simpan URL listing saat klik detail
const currentQuery = searchParams.toString();
const from = currentQuery ? `/products?${currentQuery}` : '/products';

<Link href={{ pathname: `/products/${product.id}`, query: { from } }}>
```

### Detail Page — Restore listing state
```typescript
// ✅ Baca "from" param, fallback ke /products
function resolveBackHref(from?: string): string {
  if (!from) return '/products';
  return from.startsWith('/products') ? from : '/products';
}

<Link href={backHref}>← Back to listing</Link>
```

---

## Common Pitfalls

### ❌ Predicate di Specification tidak masuk ke WHERE
**Problem:** `where 1=1` muncul di SQL, filter tidak bekerja
**Solution:** Gunakan `criteriaBuilder.and()` chain, jangan `.getExpressions().add()`

### ❌ Frontend fetch manual di client saat filter berubah
**Problem:** Race condition, data stale, CORS error
**Solution:** Gunakan URL-driven state, biarkan server component fetch

### ❌ Filter state di useState, bukan URL search params
**Problem:** Back/forward browser tidak bekerja, URL tidak shareable
**Solution:** Selalu update URL via `router.push()`, read filter dari `searchParams`

### ❌ Keyword search langsung apply pada setiap keystroke
**Problem:** Terlalu banyak request ke backend
**Solution:** Gunakan debounce 500ms, atau explicit Apply button

### ❌ Pagination tetap di halaman lama saat filter berubah
**Problem:** User bingung, data tidak sesuai halaman
**Solution:** Reset `page=0` saat filter criteria berubah

### ❌ Detail page back button kembali ke listing default
**Problem:** Filter + page state hilang
**Solution:** Pass `from=/products?...` param, preserve di URL

---

## Logging Best Practices

### Controller Entry Point
```java
log.info("GET /api/v1/products | params: category={}, minPrice={}, maxPrice={}, keyword={}, page={}, size={}",
    category, minPrice, maxPrice, keyword, page, size);
```

### Service Layer (Filter Result)
```java
log.info("Service findAll | filter: category={}, keyword={}, minPrice={}, maxPrice={} | result count: {} of {} total",
    filter.category(), filter.keyword(), filter.minPrice(), filter.maxPrice(),
    productPage.getContent().size(), productPage.getTotalElements());
```

### Specification Layer (Predicate Building)
```java
if (StringUtils.hasText(filter.keyword())) {
    log.debug("ProductSpecification: adding keyword filter: {}", filter.keyword());
    // ... add predicate
}
```

### Configuration
```yaml
logging:
  level:
    com.harvanir.productlisting: DEBUG
    com.harvanir.productlisting.repository: DEBUG
    org.hibernate.SQL: DEBUG
```

---

## Git Commit Message Format

```
feat(backend): add keyword search filter to ProductSpecification
fix(frontend): preserve filter state in back navigation
refactor(core): simplify predicate chain in Specification
docs(readme): update quick start guide
test(service): add test for keyword filter with multiple products
```

Pattern: `type(scope): description`

**Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `perf`, `chore`
**Scope:** `backend`, `frontend`, `core`, `db`, `config`, etc.

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Backend (application.yml)
```yaml
app:
  cors:
    allowed-origin: ${APP_CORS_ALLOWED_ORIGIN:http://localhost:3000}
```

**Rule:** Jangan hardcode, selalu gunakan env var untuk URL/port/credential

---

## Testing Checklist

Sebelum dianggap "selesai", test ini WAJIB passing:

- [ ] Backend compile tanpa error: `.\mvnw clean compile`
- [ ] Backend startup: `.\mvnw spring-boot:run`
- [ ] Frontend install: `npm install` di `frontend/`
- [ ] Frontend dev: `npm run dev`
- [ ] API call `/api/v1/products` return 200 dengan data
- [ ] Keyword filter: search "mouse" hanya return 1 product
- [ ] Pagination: klik next page, data berubah
- [ ] Detail page: buka product, klik back, filter/page preserved
- [ ] CORS: fetch dari frontend ke backend tidak error
- [ ] URL shareable: copy URL dengan filter, paste di tab baru, hasil sama

---

## Stack Versions (Current)

- **Java:** 21 (LTS)
- **Spring Boot:** 4.0.3
- **Next.js:** 15.2.3
- **React:** 19
- **TypeScript:** 5
- **Tailwind:** 4.2.2
- **Maven:** 3.9.9
- **H2:** in-memory
