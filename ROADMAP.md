# 🗺 CraftYourSole: Production Roadmap & Functional Verification Tracker

This document tracks the architecture, implementation status, and **verifiable functional requirements** for evolving **CraftYourSole** (`https://craftyoursole.in`) from a pre-launch GCP Cloud Run preview into a full production D2C footwear platform.

---

## 📊 Roadmap Overview & Phase Status

| Phase | Focus Area | Completion | Target Milestone | Status |
|---|---|:---:|---|:---:|
| **Phase 1** | **Storefront, Rebrand, Routes & SEO Foundation** | **100%** | Pre-Launch | 🟢 Complete |
| **Phase 2** | **Backend Persistence, Auth Security & Shiprocket Checkout (Address & Payments)** | **85%** | Launch Blocker | 🟡 In Progress |
| **Phase 3** | **Admin Dashboard & Inventory/Order Security** | **95%** | Launch Blocker | 🟢 Launch Ready |
| **Phase 4** | **Shiprocket Logistics API, Fulfillment & Customer Notifications** | **15%** | Post-Launch M1 | ⚪ Planned |
| **Phase 5** | **Scale, Automated Testing, CI/CD & Performance** | **70%** | Ongoing | 🟡 In Progress |

---

## 🏗 Current & Target Architecture

```mermaid
graph TD
    subgraph Client Applications
        C1["CraftYourSole Web App (React 19 + Vite SPA)"]
        C2["Admin Portal (/admin - Credential Protected)"]
    end

    subgraph Edge & Hosting Layer
        CF["Cloudflare DNS (craftyoursole.in)"]
        CR["Google Cloud Run (us-central1: desi-kicks)"]
        NG["Nginx Alpine (nginx.conf.template)"]
    end

    subgraph Auth, Data & Shiprocket Services
        FA["Firebase Auth (Customer Google OAuth)"]
        SB["Supabase PostgreSQL (Products, Variants, Orders, Coupons)"]
        ST["Supabase Storage (product-images bucket)"]
        REC["Best Seller & Merchandising Engine (bestSellerAlgorithm.ts)"]
        SR["Shiprocket Unified Suite (Checkout, Address Intel, Payments & Logistics API)"]
    end

    C1 --> CF --> CR --> NG
    C2 --> CF
    C1 --> FA
    C1 --> SB
    C1 --> REC
    C1 --> SR
    C2 --> SB
    C2 --> ST
    C2 --> REC
    C2 --> SR
```

---

## ✅ Functional Requirements & Verification Matrix

Work through each `FR-*` item below in order before switching off `PreLaunchBanner` and opening public checkout. An item is **Pass** only when its verification steps succeed on the deployed `https://craftyoursole.in` environment.

### A. Storefront, Discovery & Content (`FR-01` – `FR-05`)

| ID | Requirement | Current State | Gaps / Work Required | How to Verify |
|---|---|---|---|---|
| **FR-01** | **Brand Identity & Visual Assets** | 🟢 Implemented | ✅ Official SVG logo (`craftyoursole_logo.svg`) wired across `Navbar`, `Footer`, `LoginPage`, and `AdminPage` (both expanded sidebar & collapsed icon mode + login screen). Favicon active. Zero residual "DESIKICKS" in customer UI. | Load `/` and `/admin` on desktop & mobile; confirm CraftYourSole logo and favicon appear crisp and clear. |
| **FR-02** | **Navigation & All Storefront Routes** | 🟢 Implemented | All 7 collection slugs (`/collections/*`), `/products/:slug`, `/about`, `/size-guide`, `/authenticity`, `/shipping-policy`, `/returns-exchange`, `/contact`, `/privacy-policy`, `/terms`, `/track-order`, and `*` 404 exist | Click every header nav item, category card, and footer link; verify zero dead links and unknown URLs render `NotFoundPage` |
| **FR-03** | **Search Bar & Collection Filtering** | 🟢 Implemented | ✅ `Navbar` and `MobileSearch` filter live catalog (`useProductCatalog().activeProducts`). `CollectionsPage.tsx` features a full multi-filter engine: taxonomy categories, dynamic subcategory chips, UK size buttons (`UK 6`–`UK 11`), price range bands, gender selector, and sort dropdown. | Add a product in `/admin`, search for it in header search and filter by size/price on `/collections`. Confirm live match and filtering. |
| **FR-04** | **Product Detail, Size Selection & Reviews** | 🟡 Partial | Deep links, tabs, size guide, and reviews work via `localStorage`; pincode checker (`ProductDetailPage.tsx`) uses mock date math instead of Shiprocket live courier serviceability API | Open `/products/royal-velvet-embroidered-mojari`, switch images, select UK size, check pincode via Shiprocket SLA, submit review, reload and verify persistence |
| **FR-05** | **Persistent Wishlist Across Views** | 🟢 Implemented | ✅ Implemented global `WishlistContext.tsx` persisted to `craftyoursole_wishlist`. Wired to all heart icons in `ProductCard`, `ProductDetailPage`, and `ProductDetailModal`. Badged in `Navbar` and `BottomNav` with direct navigation to `/profile?tab=wishlist`. `ProfilePage.tsx` renders real wishlisted items with "Move to Bag" and removal. | Click heart on any product card, verify red counter on header and bottom nav, click badge to navigate to `/profile?tab=wishlist`, reload page, and verify persistence. |

### B. Authentication, Security & Access Control (`FR-06` – `FR-08`)

| ID | Requirement | Current State | Gaps / Work Required | How to Verify |
|---|---|---|---|---|
| **FR-06** | **Firebase Google Sign-In for Customers** | 🟢 Implemented | ✅ Dedicated `/login` and `/signin` route (`LoginPage.tsx`) with Google Sign-In; wired header button in `Navbar.tsx`; 1-click Google Sign-In banner in checkout `CartPage.tsx`; linked to `craftyoursole.in` authorized domain in Firebase. | Visit `/login` or click "Sign In" in header or cart. Complete Google OAuth popup: verify automatic redirect and profile pre-fill. |
| **FR-07** | **Admin Portal Authentication & RBAC** | 🟢 Implemented | ✅ Dedicated Administrator Credentials authentication for `/admin` (`AdminPage.tsx`). Completely decoupled from Google Sign-In; requires configured admin username/email (`VITE_ADMIN_USER`) and password (`VITE_ADMIN_PASSWORD`). Session persistence, password visibility toggle, session lock & sign out button. | Open `/admin` in Incognito: verify full-screen login wall prompts for admin credentials with zero Google Sign-In buttons. Valid credentials unlock portal immediately. |
| **FR-08** | **Shiprocket 1-Click Checkout & Phone OTP Login** | ⚪ Planned | Only Google Sign-In exists in `firebase.ts`; Shiprocket Checkout handles mobile OTP login with pre-filled address intelligence across 200M+ Indian shoppers, reducing COD fraud | Sign in with Indian mobile `+91` OTP in checkout, confirm pre-filled address and session creation |

### C. Cart, Checkout & Payments (`FR-09` – `FR-12`)

| ID | Requirement | Current State | Gaps / Work Required | How to Verify |
|---|---|---|---|---|
| **FR-09** | **Cart Operations & Coupon Validation** | 🟢 Implemented | ✅ Add/remove items, update quantity/size, and `CartContext` sync work. Supabase coupon validation helper wired in `src/lib/supabase.ts` (`validateCouponInSupabase`). | Add product, change size/qty in `/cart`, apply coupon, reload page, verify totals match |
| **FR-10** | **Customer Address Management (Shiprocket Intel + Fallback)** | 🟢 Implemented / Upgrading to Shiprocket | ✅ Replaced hardcoded demo addresses in `CartPage.tsx` with interactive, validated customer shipping address form (Full Name, 10-digit Phone, Email, Street, City, State, 6-digit PIN). Upgrading to Shiprocket Checkout pre-filled address intelligence. | Proceed to checkout in `/cart`: verify Shiprocket address auto-fill for mobile numbers and manual address validation on fallback. |
| **FR-11** | **Live Payment Gateway & Webhook Verification (Shiprocket Payments)** | 🔴 **Launch Blocker** | Checkout currently operates in simulated mode; integrate Shiprocket Payments (UPI Intent, QR, Cards, NetBanking, and verified COD) with webhook signature verification. | Complete a Shiprocket test transaction (`UPI` / `Card` / `COD`) and verify order transitions to `PAID` only after verified callback |
| **FR-12** | **Stock Validation & Variant Deduction** | 🟢 Implemented | ✅ Added `checkStockAvailability` and `deductVariantStock` in `ProductContext.tsx`. Order placement validates stock availability before placing and decrements variant stock automatically. In `ProductDetailPage.tsx`, disabled Add to Bag & Buy Now on out-of-stock sizes. `ProductCard.tsx` disables quick-add when sold out. | Set a size stock to `0` in `/admin` → Verify size button shows "Out", Add to Bag shows "Out of Stock" and is disabled on PDP. Order in-stock footwear → Verify stock decrements. |

### D. Backend Persistence & Operational Workflows (`FR-13` – `FR-15`)

| ID | Requirement | Current State | Gaps / Work Required | How to Verify |
|---|---|---|---|---|
| **FR-13** | **Real Database Persistence (Supabase Integration)** | 🟢 Implemented | ✅ Integrated `@supabase/supabase-js` in `src/lib/supabase.ts`. Comprehensive schema created (`supabase-schema.sql`) covering `products`, `product_variants`, `orders`, and `coupons` with RLS policies and `product-images` storage bucket. `OrderContext` saves orders to Supabase. `ProductContext` syncs from Supabase if configured. | Check Supabase dashboard table editor for `orders` and `products`. Place an order and confirm record appears in Supabase. |
| **FR-14** | **Contact & Newsletter Form Delivery** | 🔴 Gap | `Footer.tsx` newsletter form and `ContactPage` form show local UI confirmation without saving to DB or sending email. | Submit inquiry on `/contact` and email in footer; confirm record lands in Supabase or sends email to `support@craftyoursole.in`. |
| **FR-15** | **Order Tracking & Shiprocket Fulfillment Updates** | 🟡 Partial | `/admin` updates order status with status buttons (Pending → Packing → Shipped → Delivered); `/track-order` and `/profile` lookup need wiring to Shiprocket Courier Tracking API & Supabase `orders` table by Order ID + Phone/Email. | Update order status to `Shipped` in `/admin`, generate Shiprocket AWB, then look up order ID on `/track-order` and `/profile` to verify live courier dispatch milestones. |

### E. SEO, Search Console & Cloud Deployment (`FR-16` – `FR-19`)

| ID | Requirement | Current State | Gaps / Work Required | How to Verify |
|---|---|---|---|---|
| **FR-16** | **Sitemap, Robots & Per-Route Metadata** | 🟢 Live Verified | `sitemap.xml` (17 canonical URLs), `robots.txt`, `SeoHead.tsx` canonicals/JSON-LD, and `noindex` on `/cart`, `/profile`, `/admin`, `/track-order`, `*` are live | Check `https://craftyoursole.in/sitemap.xml` (`200 text/xml`), `robots.txt`, and run Google Search Console URL Inspection |
| **FR-17** | **Rich Results & Social Previews** | 🟡 Needs Check | `Organization`, `WebSite`, `Product`, `CollectionPage`, and `BreadcrumbList` JSON-LD are injected | Validate live product URL in Google Rich Results Test and confirm `Product`, `Offer` (`INR`), and `BreadcrumbList` parse with zero errors |
| **FR-18** | **Cloud Build & Cloud Run Region Parity** | 🟢 Implemented | ✅ `cloudbuild.yaml` `--region` aligned to `us-central1` matching Cloud Run `desi-kicks`. | Run Cloud Build pipeline and confirm container deploys directly to `us-central1`. |
| **FR-19** | **Code Quality, Lint & Pre-Launch Removal** | 🟢 Lint Passing | ✅ `npm run lint` and `npm run build` both exit `0` cleanly. Launch-day action remaining: toggle `PreLaunchBanner` (`src/App.tsx`) off when going live. | `npm run build` and `npm run lint` both exit `0` with zero warnings or errors |

### F. Landing Page, Merchandising & Recommendations (`FR-20` – `FR-22`, `FR-31` – `FR-34`)

| ID | Requirement | Current State | Gaps / Work Required | How to Verify |
|---|---|---|---|---|
| **FR-20** | **Landing Page Empty-State & Teaser ("Good Things Come")** | 🟢 Implemented | ✅ When catalog is empty: `Recommendations.tsx` renders a warm "SOMETHING SPECIAL IS BEING CRAFTED" showcase with teaser locked cards & "Get Notified" CTA; `NewArrivals.tsx` renders a dark "NEW SEASON DROPS INCOMING" preview with teaser cards; `LandingPage.tsx` displays launch banner. When products exist: dynamic live scroll & grids render seamlessly. | Clear catalog in `/admin` → view `/` to see teaser state. Add a product → verify normal product showcase immediately renders. |
| **FR-21** | **Trust Badges & Promo Marquee Ticker** | 🟢 Implemented | ✅ Upgraded `TrustBadges.tsx` into a modern 4-card colored grid. Added animated live marquee ticker to `PromoBanner.tsx` ("HANDCRAFTED • PAN-INDIA DELIVERY • 7-DAY EXCHANGE • ARTISAN MADE • FREE SHIPPING • COD AVAILABLE •"). | Open `/`: verify animated ticker strip and distinct colored trust cards. |
| **FR-22** | **Recommendation Telemetry & Smart Cross-Sell** | ⚪ Planned | Co-purchase weights ("Customers also bought") and PDP similar styles scoring based on category and style tags. | Open PDP and verify complementary shoes rank higher than distant categories. |
| **FR-31** | **Responsive Dual-Orientation Hero Banner & Art Direction** | 🟢 Implemented | ✅ Responsive `<picture>` art direction: 16:9 widescreen landscape on desktop (`retro-timeless-landscape.webp`) and 9:16 vertical portrait on mobile (`retro-timeless-portrait.webp`). Zero cropping with dynamic `aspect-[9/16] sm:aspect-[16/9]`. Google script typography (`Alex Brush`, `Dancing Script`, `Anton`). Touch-swipe gestures on mobile. | Open `/` on desktop (1920px) and mobile viewport (390px); confirm landscape banner serves on desktop, vertical banner serves on mobile with zero text or subject clipping, and swiping works on touch screens. |
| **FR-32** | **Gender Selection 3-Card Category Posters (`GenderSelection.tsx`)** | 🟢 Implemented | ✅ 3-column category poster grid directly below hero banner. Custom 4:5 aspect ratio artwork for Men (`category-men.webp`), Women (`category-women.webp`), and Kids (`category-kids.webp`). Interactive hover zoom (`scale-105`), subtle card elevation, and active routing to `/collections/men`, `/collections/women`, and `/collections/kids`. | Click Men, Women, or Kids cards on `/`; confirm navigation to corresponding collections page and that 4:5 images load crisply with zero distortion. |
| **FR-33** | **Best Seller Scoring Engine & Shelf (`BestSellers.tsx`, `bestSellerAlgorithm.ts`)** | 🟢 Implemented | ✅ Dynamic 4-pillar scoring algorithm: Sales Volume (45%), Bayesian Review Confidence with logarithmic dampening (25%), Inventory Availability Penalty (15%), and Merchant Tag Boost (15%). Horizontal snap carousel with desktop circular navigation buttons `(<) (>)` and touch scrolling on mobile. Curated signature fallback items for zero-data state. | View `/` directly below Gender Selection: confirm "Best Sellers" carousel renders top-scored products, test desktop scroll buttons `(<) (>)`, quick view modal, and quick add to cart. |
| **FR-34** | **Best Seller Database Order Aggregation (Phase 2/3 Roadmap)** | ⚪ Planned | Supabase SQL RPC view on `order_items` table calculating trailing 30-day velocity and CTR conversion rate (`Orders ÷ Product Page Views`) to feed the scoring algorithm automatically. | Execute Supabase SQL migration and verify `getBestSellerProducts()` pulls live purchase counts from `order_items`. |
| **FR-35** | **"Nature in Every Step" Women's Collection Feature Banner & Shelf (`WomensCollection.tsx`)** | 🟢 Implemented | ✅ Responsive editorial feature banner with dual-orientation art direction: 3:1 landscape ribbon for desktop (`women-nature-landscape.webp`) and 3:4 portrait poster for mobile (`women-nature-portrait.webp`). Dedicated Women's Collection product shelf with clean studio placeholders, pricing in INR, quick view modal, and horizontal snap carousel. | Open `/` below Best Sellers: confirm desktop loads 3:1 ribbon and mobile loads 3:4 poster with zero distortion; test product shelf carousel buttons and Quick View. |

### G. Admin Catalog CRUD, Inventory & Analytics (`FR-23` – `FR-26`)

| ID | Requirement | Current State | Gaps / Work Required | How to Verify |
|---|---|---|---|---|
| **FR-23** | **Full Product CRUD & White UI Redesign (`AdminPage.tsx`)** | 🟢 Implemented | ✅ Complete redesign: clean white theme, collapsible left sidebar navigation (Dashboard, Products, Orders), quick "+ Add Product" button, official logo, and interactive Add & Edit Product Modals supporting title, price, MRP, category, subcategory, gender (Men, Women, Kids, Unisex), tag, 5 image angles, artisan origin, materials, story, and dynamic UK 1–12 size matrix with gender-aware presets. | Open `/admin`, test adding a new product with 5 images and subcategory, edit an existing footwear, toggle storefront visibility, and delete. |
| **FR-24** | **Per-Size Inventory Management & Stock Alerts (`AdminPage.tsx`)** | 🟢 Implemented | ✅ Real-time low-stock detection engine (flags variants `<= 5` pairs). Dynamic Size Matrix (`SizeInventoryManager`) supporting UK 1 through UK 12 with quick presets (Women UK 3–8, Men UK 6–12, Kids UK 1–5). Catalog table displays color-coded per-size stock pills and quick gender filter. Order checkout decrements stock automatically. | Set `UK 8` stock to `<= 5` in Edit modal; verify low-stock alert highlights `UK 8` with remaining pair count; place an order and verify stock decrements. |
| **FR-25** | **Shoe Model-Wise Analysis (`AdminPage.tsx`)** | 🟢 Implemented | ✅ Trailing 7-day GMV bar chart connected to live customer order telemetry. Dynamic footwear category breakdown % based on sales & SKUs. Inventory Buffer KPI card. Top-selling footwear table wired to live order data. | Open `/admin` → Dashboard; verify 7-day revenue trajectory, category share bars, inventory buffer status, and top-selling model rankings reflect live store operations. |
| **FR-26** | **Storefront Maintenance Mode (`App.tsx` & `AdminPage.tsx`)** | 🔴 Gap | Add maintenance mode toggle in `/admin` Settings; when ON, renders an elegant Maintenance page on public storefront while keeping `/admin` accessible with `noindex`. | Toggle Maintenance Mode ON in `/admin`; open `/` in Incognito and verify maintenance screen renders, while `/admin` remains accessible. |

### H. Media Storage, Order Lifecycle & Tax Invoicing (`FR-27` – `FR-30`)

| ID | Requirement | Current State | Gaps / Work Required | How to Verify |
|---|---|---|---|---|
| **FR-27** | **Direct Product Media Upload to Supabase Storage (`AdminPage.tsx`)** | 🟢 Implemented | ✅ Added reusable `ImageUploadField.tsx` with drag-and-drop, Supabase Storage (`product-images` bucket) upload helper (`uploadImageToSupabase`), local FileReader preview fallback, and live URL override across `ProductFormModal.tsx` (primary + 4 angles) and `BannerFormModal.tsx` (desktop + mobile). | Open `/admin` → Products or Hero Banners → Add/Edit modal. Select an image file or drag-and-drop; verify automatic upload/preview and save. |
| **FR-28** | **Order Cancellation, Returns & GST Tax Invoicing (`ProfilePage.tsx`)** | 🟢 Implemented | ✅ `ProfilePage.tsx` features 7-day doorstep Size Exchange & Return modal, printable GST Tax Invoice modal, live delivery tracking modal, and `CYS-` order numbering. | Open `/profile`, click "Size Exchange", "Print Invoice", and verify modal functionality. |
| **FR-29** | **Coupon CMS in Admin (`AdminPage.tsx`)** | 🟡 Partial | Coupons table and initial seeds (`FESTIVE20`, `DIWALI500`, `WELCOME10`) created in Supabase schema. Admin UI for creating/deleting coupons from the admin panel can be added to sidebar. | Create a coupon in `/admin` and verify customer can apply it in `/cart`. |
| **FR-30** | **Secrets Hygiene & Production Config** | 🟢 Implemented | ✅ `.env.example` rebranded to CraftYourSole. Production Dockerfile clean. Supabase keys and Admin credentials configured. | Verify zero hardcoded secrets in source files. |

---

## 🎯 Phase Breakdown Checklist

### Phase 1: Customer Web App — Storefront, Routes & SEO
- [x] **Responsive Layout & Navigation**: Sticky header with `craftyoursole_logo.svg`, bottom mobile tab bar (`BottomNav`), and mobile search bar.
- [x] **Pre-Launch Preview Banner**: `PreLaunchBanner` in `src/App.tsx` communicating active pre-launch status.
- [x] **Responsive Dual-Orientation Hero Banner (`FR-31`)**: 16:9 widescreen landscape for desktop + 9:16 vertical portrait for mobile via `<picture>` tag with WebP assets, Google script typography (`Alex Brush`, `Dancing Script`), and mobile touch-swipe gesture handling.
- [x] **Men, Women & Kids Category Poster Cards (`FR-32`)**: 3-column curated poster grid in 4:5 aspect ratio with studio photography, hover zoom, and `/collections/men`, `/collections/women`, `/collections/kids` routing.
- [x] **Best Sellers Shelf with 4-Pillar Scoring Engine (`FR-33`)**: Objective mathematical scoring model (`bestSellerAlgorithm.ts`) weighing sales volume (45%), Bayesian review confidence (25%), stock availability penalty (15%), and merchant boost (15%), coupled with a smooth horizontal snap carousel and desktop scroll buttons.
- [x] **"Nature in Every Step" Women's Feature Banner & Product Shelf (`FR-35`)**: Responsive 3:1 desktop / 3:4 mobile editorial banner and curated Women's Collection product shelf with studio placeholders.
- [x] **Hero Carousel, Categories, Recommendations & New Arrivals**: Wired to live catalog with "Good Things Come" empty-state fallbacks.
- [x] **Modern Trust Badges & Scrolling Marquee**: Colored card grid & infinite animated ticker on landing page.
- [x] **Dedicated Storefront & Policy Routes**: `/collections`, `/collections/:slug`, `/products/:slug`, `/about`, `/size-guide`, `/authenticity`, `/shipping-policy`, `/returns-exchange`, `/contact`, `/track-order`, `/privacy-policy`, `/terms`, and `*` 404.
- [x] **SEO Metadata & Sitemap Pipeline**: `SeoHead.tsx`, `scripts/generate-sitemap.mjs` (`prebuild`), `public/sitemap.xml`, and `public/robots.txt`.
- [x] **Unified Live Search & Collection Filters (`FR-03`, `FR-35`)**: Multi-filter engine on `CollectionsPage`: subcategories, UK sizes, price range, gender, in-stock toggle, and sorting.
- [x] **Persistent Wishlist Context (`FR-05`)**: Global `WishlistContext` synced with header/bottom badges and `/profile`.

### Phase 2: Backend Services, Auth Security & Shiprocket Checkout (Address & Payments)
- [x] **Firebase SDK & Google Sign-In (`src/lib/firebase.ts`, `LoginPage.tsx`)**: Google OAuth popup and auth listener implemented.
- [x] **Supabase Client & Relational Schema (`supabase.ts`, `supabase-schema.sql`)**: PostgreSQL database with products, variants, orders, coupons, and storage bucket.
- [x] **Order & Product DB Sync**: `OrderContext` persists orders to Supabase; `ProductContext` syncs from DB.
- [x] **Customer Address Form & Fallback (`FR-10`)**: Full Indian address form with phone and PIN validation.
- [ ] **Shiprocket Checkout & Payments Integration (`FR-11`, `FR-10`)**: 1-click checkout with pre-filled address intelligence, UPI Intent, Cards, NetBanking, COD, and webhook verification.
- [ ] **Contact & Newsletter Form Delivery (`FR-14`)**: Save inquiries to DB or email `support@craftyoursole.in`.
- [ ] **Shiprocket Pincode Serviceability & Delivery SLA API (`FR-04`)**: Real-time courier delivery SLA query replacing mock date math.

### Phase 3: Admin Dashboard (Sales Monitoring & Operations)
- [x] **Clean White Redesign & Sidebar Navigation**: Dashboard, Products, and Orders sections with collapsible sidebar and official logo.
- [x] **Dedicated Administrator Credentials Authentication (`FR-07`)**: Decoupled from Google Sign-In with username/password guard.
- [x] **KPI Metric Cards & Visual Analytics**: GMV, orders, AOV, pipeline counts, trailing 7-day revenue bar chart, category breakdown, and top sellers.
- [x] **Product Catalog Table & CRUD (`FR-23`)**: Add, Edit, and Delete modals with 5-angle image inputs, subcategories, gender, and per-size stock matrix.
- [x] **Per-Size Inventory Management & Stock Alerts (`FR-24`)**: Live variant low-stock detection engine (`stock <= 5`) and color-coded size pills.
- [x] **Order Fulfillment Hub**: Advance states (`Pending` → `Packing` → `Shipped` → `Delivered`), demo order loading, and order clearing.
- [x] **Direct Image Upload to Supabase Storage (`FR-27`)**: Drag-and-drop file upload with Supabase bucket + local preview fallback.
- [ ] **Storefront Maintenance Mode (`FR-26`)**: Admin toggle to put customer storefront into maintenance mode.
- [ ] **Coupons Management Section (`FR-29`)**: Manage promo codes directly from the admin sidebar.

### Phase 4: Shiprocket Logistics, Fulfillment & Customer Notifications
- [x] **Self-Serve Size Exchange & Invoice Modals**: Live in `ProfilePage.tsx`.
- [ ] **Shiprocket Shipping & Logistics API (`FR-15`)**: Automated AWB generation, multi-courier allocation (Bluedart, Delhivery, DTDC), pickup scheduling, and live tracking webhooks from Admin.
- [ ] **Live `/track-order` Lookup via Shiprocket**: Query Shiprocket AWB tracking & Supabase `orders` table directly by Order ID + Phone/Email.
- [ ] **WhatsApp & SMS Delivery Alerts**: Automated dispatch notifications via Shiprocket Engage / WhatsApp.

### Phase 5: Scale, Verification, CI/CD & Testing
- [x] **Docker + Nginx Cloud Run Container**: Deployed on GCP Cloud Run.
- [x] **Fix `cloudbuild.yaml` Region & Automated CI**: Aligned to `us-central1`.
- [x] **Resolve Existing Lint Errors**: Clean `0` errors with ESLint and TypeScript.
- [x] **Core Web Vitals & Bundle Splitting (`FR-38`)**: Split vendor chunks and lazy-loaded `/admin` (main bundle ~498 kB).
- [ ] **Automated Test Suite**: Vitest unit tests & Playwright E2E smoke tests.

---

## 🚀 Immediate Launch Blockers (What's Left Before Public Go-Live)

1. **Shiprocket Checkout, Address & Payment Integration (`FR-11`, `FR-10`)** [BLOCKER]:
   - Replace simulated checkout in `CartPage.tsx` with Shiprocket Checkout (pre-filled Indian address intelligence across 200M+ shoppers, mobile OTP, UPI, Cards, NetBanking, and verified COD).
   - Configure webhook verification for payment confirmation before order placement in Supabase.
2. **Contact & Newsletter Form Persistence (`FR-14`)**:
   - Wire `/contact` and footer newsletter inputs to save to Supabase or send notification emails.
3. **Direct Image Upload in Admin (`FR-27`)** [COMPLETED]:
   - File drag-and-drop & Supabase Storage upload helper (`ImageUploadField.tsx`) active in Product and Hero Banner modals.
4. **Maintenance Mode Toggle (`FR-26`)**:
   - Provide an on/off switch in `/admin` to lock storefront for updates when needed.
5. **Coupons CMS in Admin (`FR-29`)**:
   - Add a Coupons tab in `/admin` to easily create/manage discount codes.
6. **Live Track Order & Shiprocket Courier Sync (`FR-15`)**:
   - Connect `/track-order` and `/profile` to Shiprocket Courier Tracking API and Supabase `orders` table by Order Number + Email/Phone.
7. **Switch Off Pre-Launch Banner (`FR-19`)**:
   - Remove/hide `PreLaunchBanner` in `src/App.tsx` on official launch day.
