# ARCHITECTURE.md
> Dokumen ini menjelaskan keputusan arsitektur yang sudah disepakati tim.  
> AI tools harus **mengikuti** keputusan ini dan **tidak membuat keputusan arsitektur sendiri**.  
> Jika ada kebutuhan yang tidak tercakup, diskusikan dengan tim sebelum implementasi.

---

## Overview Sistem

```
[Browser]
   │
   ▼
[Next.js Frontend]  ──── fetch ────▶  [Spring Boot API]
   (port 3000)                              (port 8080)
                                               │
                                               ▼
                                        [H2 In-Memory DB]
                                        (dev/test only)
```

---

## Backend Architecture

### Layer yang Digunakan
```
Controller → Service → Repository → Database
```

**Aturan yang tidak boleh dilanggar:**
- Controller **tidak boleh** berisi business logic
- Repository **tidak boleh** dipanggil langsung dari Controller
- Entity **tidak boleh** dikembalikan langsung sebagai HTTP response — selalu konversi ke DTO

### Database
- Development & mini project: **H2 in-memory**
- Schema dikelola oleh **Hibernate auto-ddl** (`create-drop` untuk dev)
- Seed data via `data.sql` di `src/main/resources/`

### Dependency yang Disetujui
```xml
<!-- Wajib ada -->
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-validation
h2 (scope: runtime)
lombok

<!-- Opsional jika dibutuhkan -->
mapstruct (untuk DTO mapping)
```
**Jangan tambahkan dependency baru tanpa persetujuan tim.**

### Pagination
- Semua endpoint list **wajib** menggunakan pagination
- Default: `page=0`, `size=10`, maksimum `size=50`
- Gunakan `Pageable` dari Spring Data JPA

---

## Frontend Architecture

### Routing
- Gunakan **Next.js App Router** (bukan Pages Router)
- Dynamic routes menggunakan folder `[param]`
- Semua halaman ada di `src/app/`

### Data Flow
```
URL Search Params
      │
      ▼
Server Component (initial fetch)
      │
      ▼
Client Component (interactivity: filter change, pagination click)
      │
      ▼
API Layer (src/lib/api/)
      │
      ▼
Spring Boot API
```

### API Communication
- Base URL dikonfigurasi via environment variable: `NEXT_PUBLIC_API_BASE_URL`
- Semua fetch function ada di `src/lib/api/`
- Gunakan native `fetch` — **tidak perlu axios untuk project ini**
- Error handling wajib di setiap API call

### Dependency yang Disetujui
```json
{
  "next": "latest",
  "react": "latest",
  "tailwindcss": "latest",
  "typescript": "latest"
}
```
**Jangan tambahkan UI library (MUI, Ant Design, dll) tanpa persetujuan.**  
Komponen UI dibuat sendiri di `src/components/ui/`.

---

## Keputusan yang Sudah Final (Jangan Diubah)

| Keputusan | Alasan |
|---|---|
| H2 untuk dev | Tidak perlu setup DB lokal, onboarding cepat |
| App Router (bukan Pages Router) | Standard Next.js modern, lebih baik untuk Server Components |
| URL search params untuk filter state | URL shareable, tidak perlu state management tambahan |
| Native fetch (bukan axios) | Mengurangi dependency, fetch sudah cukup untuk kebutuhan ini |
| DTO wajib (tidak expose entity) | Keamanan dan fleksibilitas API contract |
| Tailwind CSS | Konsistensi styling, tidak perlu CSS files terpisah |

---

## Hal yang TIDAK Boleh Dilakukan AI

- ❌ Membuat endpoint tanpa pagination
- ❌ Mengembalikan JPA entity langsung dari controller
- ❌ Menaruh business logic di controller
- ❌ Membuat `useState` untuk menyimpan filter (gunakan URL params)
- ❌ Menambahkan library baru yang tidak ada di daftar approved
- ❌ Membuat custom CSS file (gunakan Tailwind)
- ❌ Hardcode base URL API di komponen
- ❌ Membuat lebih dari satu cara fetch data (semua melalui `src/lib/api/`)