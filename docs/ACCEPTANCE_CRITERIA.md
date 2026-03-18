# Acceptance Criteria — Mini Project
## Product Listing + Filter + Detail Page
**Stack:** Java Spring Boot (Backend) + Next.js (Frontend)  
**Tujuan:** Validasi speed engineer dengan AI assistance (GitHub Copilot)  
**Target durasi:** 3–5 hari kerja per engineer

---

## Scope

### Backend (Spring Boot)
- [ ] `GET /api/products` — mengembalikan list product dengan pagination
- [ ] `GET /api/products/{id}` — mengembalikan detail satu product
- [ ] Filter yang didukung via query params:
    - `category` (string)
    - `minPrice` & `maxPrice` (number)
    - `keyword` (search by name)
- [ ] Pagination via query params: `page` (default: 0) & `size` (default: 10)
- [ ] Response menggunakan format standar:
  ```json
  {
    "data": [...],
    "pagination": {
      "page": 0,
      "size": 10,
      "totalElements": 50,
      "totalPages": 5
    }
  }
  ```
- [ ] Data menggunakan H2 in-memory database (tidak perlu koneksi DB eksternal)
- [ ] Minimal 20 dummy product data dengan variasi category & price
- [ ] Unit test untuk service layer (minimal happy path per endpoint)

### Frontend (Next.js)
- [ ] Halaman `/products` — menampilkan list product
    - [ ] Grid card dengan: nama, harga, kategori, thumbnail placeholder
    - [ ] Filter sidebar/bar: dropdown category, range price, search input
    - [ ] Pagination controls (prev/next + nomor halaman)
    - [ ] Loading state saat fetch data
    - [ ] Empty state jika tidak ada hasil filter
- [ ] Halaman `/products/[id]` — menampilkan detail product
    - [ ] Nama, harga, kategori, deskripsi
    - [ ] Tombol "Back to listing" yang kembali ke halaman sebelumnya
    - [ ] Loading state
    - [ ] Error state jika product tidak ditemukan (404)
- [ ] Filter state tersimpan di URL query params (shareable URL)

---

## Definition of Done

Sebuah task dianggap **selesai** jika:
1. Semua checklist di atas terpenuhi
2. Tidak ada error di console (frontend) dan log (backend)
3. Berjalan di local environment tanpa setup tambahan selain `mvn spring-boot:run` dan `npm run dev`
4. Code telah di-review oleh manager/lead (bukan peer sesama engineer untuk menjaga objektivitas pengukuran)

---

## Yang Sengaja Tidak Masuk Scope
- Authentication / login
- Database eksternal (pakai H2 saja)
- Image upload / storage
- Cart / checkout
- Responsive mobile (desktop-first saja)
- Deployment

---

## Metric yang Diukur

| Metric | Cara Ukur |
|---|---|
| **Time to completion** | Waktu mulai (task assigned) sampai Definition of Done terpenuhi |
| **Jumlah AI correction** | Berapa kali engineer harus fix/reject suggestion dari Copilot |
| **Kesesuaian convention** | Dinilai saat code review, skala 1–5 |
| **Engineer fatigue** | Self-report setelah selesai, skala 1–5 |

---

## Catatan untuk Manager

- Assign task yang **identik** ke dua engineer dengan kondisi berbeda
- Engineer A: workflow biasa (Copilot aktif tapi tanpa AI context layer)
- Engineer B: Copilot aktif **dengan** CONVENTIONS.md + ARCHITECTURE.md + Copilot Instructions
- Catat waktu mulai dan selesai per engineer
- Lakukan code review dengan rubrik yang sama untuk keduanya