# CONVENTIONS.md
> Dokumen ini adalah **source of truth** untuk coding conventions tim.  
> Selalu update dokumen ini ketika ada keputusan baru yang disepakati.  
> AI tools (GitHub Copilot, dll) harus mengikuti conventions ini.

---

## Backend — Java Spring Boot

### Struktur Package
```
com.company.appname
├── controller        # REST controllers (@RestController)
├── service           # Business logic (@Service)
├── repository        # Data access (@Repository)
├── domain
│   ├── entity        # JPA entities
│   └── dto           # Request/Response DTOs
├── exception         # Custom exceptions & global handler
└── config            # Configuration classes
```

### Naming Convention
- **Class:** PascalCase → `ProductService`, `ProductController`
- **Method & variable:** camelCase → `findAllProducts()`, `productId`
- **Constant:** UPPER_SNAKE_CASE → `MAX_PAGE_SIZE`
- **Table/column (JPA):** snake_case → `product_name`, `created_at`
- **DTO suffix:** selalu eksplisit → `ProductResponseDto`, `ProductFilterRequestDto`

### REST API
- Base path: `/api/v1/...`
- Gunakan noun, bukan verb → `/api/v1/products` bukan `/api/v1/getProducts`
- HTTP method sesuai semantik: `GET` list/detail, `POST` create, `PUT` full update, `PATCH` partial update, `DELETE` hapus
- Response selalu wrapped:
  ```java
  // Success
  { "data": ..., "pagination": ... }

  // Error
  { "error": { "code": "PRODUCT_NOT_FOUND", "message": "..." } }
  ```

### Exception Handling
- Gunakan `@ControllerAdvice` untuk global exception handler
- Buat custom exception per domain: `ProductNotFoundException`, `InvalidFilterException`
- Jangan expose stack trace ke response

### Service Layer
- Business logic **hanya** ada di service, tidak di controller
- Controller hanya: terima request → panggil service → return response
- Service method harus idempotent jika memungkinkan

### DTO
- Gunakan DTO untuk semua request dan response — **jangan expose entity langsung**
- Gunakan `record` untuk immutable DTO (Java 16+):
  ```java
  public record ProductResponseDto(Long id, String name, BigDecimal price, String category) {}
  ```

### Testing
- Unit test untuk semua service method (minimal happy path + satu error path)
- Gunakan `@ExtendWith(MockitoExtension.class)` untuk mocking
- Nama test: `methodName_condition_expectedResult`
  ```java
  void findById_productExists_returnsProductDto()
  void findById_productNotFound_throwsException()
  ```

---

## Frontend — Next.js

### Struktur Folder
```
src/
├── app/                  # Next.js App Router
│   ├── products/
│   │   ├── page.tsx      # /products
│   │   └── [id]/
│   │       └── page.tsx  # /products/:id
│   └── layout.tsx
├── components/
│   ├── ui/               # Reusable UI components (Button, Input, dll)
│   └── features/         # Feature-specific components (ProductCard, FilterBar)
├── hooks/                # Custom hooks
├── lib/
│   ├── api/              # API client & fetch functions
│   └── utils/            # Helper functions
└── types/                # TypeScript type definitions
```

### Naming Convention
- **Component file:** PascalCase → `ProductCard.tsx`, `FilterBar.tsx`
- **Hook file:** camelCase dengan prefix `use` → `useProducts.ts`, `useFilter.ts`
- **Util/helper file:** camelCase → `formatPrice.ts`, `buildQueryParams.ts`
- **Type/interface:** PascalCase → `Product`, `ProductFilter`, `PaginatedResponse`

### Komponen
- Selalu gunakan **functional component** dengan TypeScript
- Props harus selalu di-type eksplisit:
  ```typescript
  interface ProductCardProps {
    product: Product;
    onClick?: (id: number) => void;
  }
  ```
- Hindari prop drilling lebih dari 2 level — gunakan context atau state management

### Data Fetching
- Gunakan **Server Components** untuk initial data fetch di Next.js App Router
- Gunakan `useEffect` + `useState` hanya untuk client-side interactivity (filter, pagination)
- Semua API call melalui fungsi di `src/lib/api/` — tidak ada `fetch` langsung di komponen
- Handle loading dan error state di setiap fetch:
  ```typescript
  // src/lib/api/products.ts
  export async function getProducts(filter: ProductFilter): Promise<PaginatedResponse<Product>> { ... }
  ```

### State Management
- Filter & pagination state disimpan di URL search params (bukan useState)
  ```typescript
  // Gunakan useSearchParams() dari next/navigation
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? '';
  ```
- UI state lokal (modal open/close, hover) boleh pakai `useState`

### Styling
- Gunakan **Tailwind CSS**
- Hindari inline style kecuali untuk nilai dinamis yang tidak bisa dicapai dengan Tailwind
- Komponen UI reusable wajib ada di `src/components/ui/`

---

## General

### Git Commit
Format: `type(scope): short description`
- `feat(product): add filter by price range`
- `fix(api): handle empty keyword param`
- `chore(deps): update spring boot to 3.x`

Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`

### Environment Variables
- Backend: gunakan `application.yml` dengan profile (`dev`, `prod`)
- Frontend: prefix `NEXT_PUBLIC_` hanya untuk variabel yang aman di-expose ke browser
- **Jangan pernah commit credential atau secret key**