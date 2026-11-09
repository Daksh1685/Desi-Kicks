# 🥿 Desi-Kicks | Heritage Craft Meets Modern Footwear

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active_Development-orange.svg)]()

**Desi-Kicks** is a direct-to-consumer (D2C) e-commerce storefront celebrating authentic Indian craftsmanship paired with ergonomic foot mechanics. From hand-embroidered royal velvet mojaris to everyday ultra-breathable AirKnit slip-on loafers and festive block heels, Desi-Kicks delivers heritage design with cloud-like comfort.

---

## 📑 Table of Contents

- [Features](#-features)
  - [Storefront & Discovery](#storefront--discovery)
  - [Product Experience & Modal](#product-experience--modal)
  - [Cart & Checkout](#cart--checkout)
  - [Customer Account & Orders](#customer-account--orders)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Production Roadmap](#-production-roadmap)
- [Contributing & Code Style](#-contributing--code-style)
- [License](#-license)

---

## ✨ Features

### Storefront & Discovery
- **Dynamic Hero Banner**: Interactive hero showcase featuring promotional highlights, quick CTAs, and slide pagination.
- **Categorized Browsing**: Instant navigation across Festive Mojaris, Daily Slip-ons, Women's Heels, Heritage Sneakers, and Traditional Kolhapuris.
- **Recommendation Carousel**: Algorithmic & curated product shelves with tag badges (*Festive Edit*, *Daily Comfort*, *Women's Pick*).
- **Instant Search with Autocomplete**: Mobile and desktop search bars equipped with trending searches, popular tags, and quick keyword suggestions.
- **Trust & Assurance Badges**: Transparent badges for Free Delivery over ₹1,999, 7-Day Easy Returns, 100% Genuine Handcrafted Leather, and 24/7 Support.

### Product Experience & Modal
- **Quick-View & Deep-Dive Modal**: Inspect any shoe without leaving your browsing position.
- **Multi-Angle Gallery**: High-resolution image preview with thumbnail switching.
- **Artisan Stories & Specs**: Details on upper fabrics, sole materials (buff-tanned leather, EVA flex), insole ergonomics (ortho-cushion memory foam), and occasion suitability.
- **Interactive Size Selector**: UK 6 to UK 11 sizing with instant stock validation.

### Cart & Checkout
- **Persistent Cart State**: Cart automatically syncs to `localStorage` through `CartContext`.
- **Dynamic Price Breakdown**: Real-time computation of MRP, discount savings, delivery fee threshold (Free over ₹1,999), and final payable amount.
- **Promotional Coupons**: Coupon code validation engine supporting seasonal promos (e.g., `FESTIVE20`, `DIWALI500`, `WELCOME10`).
- **Inline Item Modifications**: Modify quantities, update shoe sizes, or remove items directly within the cart overview.

### Customer Account & Orders
- **Profile Hub**: Manage customer profiles, contact info, and delivery preferences.
- **Order History & Tracking**: Simulated order tracking stages (*Processing*, *Shipped*, *Out for Delivery*, *Delivered*).
- **Saved Addresses & Payment Options**: Manage multiple shipping addresses and saved payment methods.

---

## 🛠 Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 | Fast functional components with modern Hooks |
| **Language** | TypeScript 6.0 | Strict type safety across components, models, and contexts |
| **Build Tool & Bundler** | Vite 5.4 | Ultra-fast HMR and optimized asset bundling |
| **Styling** | Tailwind CSS v4 | Utility-first styling with `@tailwindcss/vite` |
| **Routing** | React Router v7 | Client-side routing with hash-redirection and scroll restoration |
| **State Management** | React Context API | Clean, modular state (`CartContext`, `ProductModalContext`) |
| **Icons** | Custom SVG Engine | Built-in zero-dependency `<Icon />` component |
| **Deployment** | Netlify | SPA redirect rules configured in `netlify.toml` |

---

## 🏛 Project Architecture

```
Desi-Kicks Web Application
│
├── App.tsx (Root Provider & Router Configuration)
│   ├── CartProvider (Global Cart State & Persistence)
│   └── ProductModalProvider (Global Quick-View Modal State)
│
├── Components
│   ├── Navigation (Navbar, BottomNav, MobileSearch)
│   ├── Discovery (Hero, Categories, Recommendations, NewArrivals)
│   ├── Commerce (ProductCard, ProductDetailModal, PromoBanner, TrustBadges)
│   └── Layout (Footer, Layout Container)
│
├── Routes
│   ├── LandingPage ("/") ── Storefront discovery
│   ├── CartPage ("/cart") ── Bag management, discounts, checkout breakdown
│   └── ProfilePage ("/profile") ── Customer orders, addresses, preferences
│
└── Data Layer
    ├── productCatalog.ts ── Rich catalog specifications, stories & images
    ├── search.ts ── Search indices & trending terms
    └── images.ts ── Curated image sources & fallbacks
```

---

## 📁 Directory Structure

```
Desi-Kicks/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Brand logos, banners, and SVGs
│   ├── components/         # Reusable UI components
│   │   ├── ui/
│   │   │   └── Icon.tsx    # Centralized icon library
│   │   ├── BottomNav.tsx   # Mobile-first app-style navigation bar
│   │   ├── Categories.tsx  # Product category browser
│   │   ├── Footer.tsx      # Multi-column footer & newsletter signup
│   │   ├── Hero.tsx        # Carousel hero section
│   │   ├── MobileSearch.tsx# Mobile overlay search with trending chips
│   │   ├── Navbar.tsx      # Responsive desktop/tablet navbar
│   │   ├── NewArrivals.tsx # New product showcase grid
│   │   ├── ProductCard.tsx # Reusable card with quick-add & badge logic
│   │   ├── ProductDetailModal.tsx # Full product specification modal
│   │   ├── PromoBanner.tsx # Festive discount & announcement banner
│   │   ├── Recommendations.tsx # Curated recommendation shelf
│   │   └── TrustBadges.tsx # Value proposition badges
│   ├── constants/          # Static catalogs, image maps, search terms
│   │   ├── images.ts
│   │   ├── productCatalog.ts
│   │   └── search.ts
│   ├── context/            # Global React Context providers
│   │   ├── CartContext.tsx
│   │   └── ProductModalContext.tsx
│   ├── hooks/              # Custom React hooks (e.g. useTypingEffect)
│   ├── routes/             # Primary page views
│   │   ├── CartPage.tsx
│   │   ├── LandingPage.tsx
│   │   └── ProfilePage.tsx
│   ├── App.css
│   ├── App.tsx             # Root router & layout wrapper
│   ├── index.css           # Global Tailwind imports
│   └── main.tsx            # Vite DOM entrypoint
├── index.html              # HTML shell
├── netlify.toml            # Netlify hosting configuration & SPA rewrites
├── package.json            # Scripts & dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build & plugin settings
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9+) or `pnpm` (v8+)

### Installation
Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/Desi-Kicks.git

# Enter project directory
cd Desi-Kicks

# Install packages
npm install
```

### Development Server
Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build
To create a type-checked, minified production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint and inspect code quality:

```bash
npm run lint
```

---

## 🗺 Production Roadmap

We have detailed the complete journey towards scaling Desi-Kicks into a production-grade enterprise platform (including authentication, payment gateways, backend database, and an **Admin Dashboard** for sales analytics, inventory management, and product catalog administration).

👉 **[View the Complete Production Roadmap (ROADMAP.md)](./ROADMAP.md)**

---

## 🤝 Contributing & Code Style

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'feat: Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

Please ensure code passes linting (`npm run lint`) and type checks (`npm run build`) before submitting.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
