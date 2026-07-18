# El Boutique – Master Development Roadmap

---

# Project Progress

| Metric | Value |
|---|---|
| **Overall Progress** | 42 % |
| **Completed Phases** | 11 / 26 |
| **Remaining Phases** | 15 |
| **Current Phase** | Phase 12 |

---

# Phase Legend

| Badge | Meaning |
|---|---|
| 🟢 | Foundation – infrastructure, setup, core plumbing |
| 🟡 | Core Feature – essential product functionality |
| 🟠 | Enhancement – polish, UX, performance |
| 🔴 | Finalization – testing, deployment, launch prep |

---

# Coding Rules (all phases)

* Mobile First
* Clean Architecture
* SOLID Principles
* Reusable Components
* Feature-based folder organization
* Simple APIs — no unnecessary abstractions
* No over-engineering
* Production-ready folder structure from Phase 1

---

<!-- ──────────────────────────────────────────── -->

# Phase 1 – Project Initialisation & Monorepo Setup 🟢

## Goal

Create the monorepo folder structure, initialise the frontend (Vite + React) and backend (Node / Express) projects, configure linting, formatting, environment variables, and Git.

---

## Why this phase exists

Every subsequent phase depends on a working, runnable project skeleton. Setting up tooling first prevents configuration drift later.

---

## Features

* Monorepo root with shared scripts (`dev`, `install`, `lint`)
* Frontend project: Vite + React + Tailwind CSS
* Backend project: Express + nodemon
* `.env.example` files for both projects
* `.gitignore`, `README.md`
* ESLint + Prettier configs (shared rules)

---

## Backend Tasks

1. `npm init` inside `backend/`.
2. Install: `express`, `cors`, `dotenv`, `helmet`, `morgan`.
3. Install dev: `nodemon`, `eslint`, `prettier`.
4. Create `backend/src/server.js` — basic Express app listening on `PORT`.
5. Create `backend/src/app.js` — Express config (cors, helmet, json parser, morgan).
6. Add health-check route `GET /api/health`.
7. Create `.env.example` with `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`.
8. Add `npm run dev` script using nodemon.

---

## Frontend Tasks

1. `npm create vite@latest ./` inside `frontend/` (React template).
2. Install: `tailwindcss`, `postcss`, `autoprefixer`, `axios`.
3. Configure Tailwind (`tailwind.config.js`, `postcss.config.js`).
4. Create base `index.css` with Tailwind directives and CSS reset.
5. Set up path alias `@/` → `src/`.
6. Create `.env.example` with `VITE_API_URL`.
7. Verify `npm run dev` serves default page.

---

## Database Tasks

None — database connection is Phase 2.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Returns `{ status: "ok" }` |

---

## Files / Folders

```
EL-Boutique/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   └── routes/
│   │       └── health.route.js
│   ├── .env.example
│   ├── package.json
│   └── nodemon.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
├── README.md
├── product.md
└── TASK.md
```

---

## Acceptance Criteria

- [ ] `npm run dev` in `backend/` starts Express on configured port.
- [ ] `GET /api/health` returns `{ status: "ok" }`.
- [ ] `npm run dev` in `frontend/` serves the React app.
- [ ] Tailwind utility classes render correctly.
- [ ] Both projects have clean linting output.

---

## Depends On

None

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* Do NOT add TypeScript — spec says it is optional; keep it JavaScript for speed.
* Tailwind CSS is explicitly requested in the spec.
* Use feature-based folder layout from the start (e.g., `src/features/`).

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 2 – Database Connection & Base Models 🟢

## Goal

Connect to MongoDB Atlas via Mongoose, create the base model utilities, and set up the database seeding script for the single Admin user.

---

## Why this phase exists

All data-driven features (products, categories, orders) require a live database connection. The Admin seed is needed before authentication can be tested.

---

## Features

* Mongoose connection with retry logic
* Connection event logging (connected / error / disconnected)
* Admin user seed script (`npm run seed`)
* Base model timestamps config (Mongoose `timestamps: true`)

---

## Backend Tasks

1. Install: `mongoose`, `bcryptjs`.
2. Create `backend/src/config/db.js` — connect to `MONGODB_URI`.
3. Import and call `connectDB()` in `server.js` before `app.listen`.
4. Create `backend/src/models/Admin.model.js` — `{ email, password (hashed), name }`.
5. Create `backend/src/scripts/seed.js` — creates Admin if not exists.
6. Add `npm run seed` script.

---

## Frontend Tasks

None.

---

## Database Tasks

* Define `admins` collection schema.
* Create index on `email` (unique).

---

## API Endpoints

None (seed is a CLI script).

---

## Files / Folders

```
backend/src/
├── config/
│   └── db.js
├── models/
│   └── Admin.model.js
└── scripts/
    └── seed.js
```

---

## Acceptance Criteria

- [ ] `npm run dev` connects to MongoDB Atlas without error.
- [ ] `npm run seed` creates an Admin document with a hashed password.
- [ ] Running seed twice does not duplicate the Admin.
- [ ] Connection failures are logged and do not crash the process.

---

## Depends On

Phase 1

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* Use `bcryptjs` (pure JS) instead of `bcrypt` (native bindings) for simpler cross-platform installs.
* Store only ONE Admin — the spec explicitly states "يوجد Admin واحد فقط".

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 3 – Admin Authentication (Backend) 🟢

## Goal

Implement JWT-based login for the single Admin user. Create authentication middleware to protect all admin routes.

---

## Why this phase exists

The admin panel, product management, and order management all require protected routes. Authentication must exist before any admin feature.

---

## Features

* Admin login endpoint
* JWT access token generation
* Auth middleware for protected routes
* Error handling middleware (global)
* Standardised API response format

---

## Backend Tasks

1. Install: `jsonwebtoken`.
2. Create `backend/src/features/auth/auth.controller.js` — login handler.
3. Create `backend/src/features/auth/auth.route.js` — `POST /api/auth/login`.
4. Create `backend/src/middleware/auth.middleware.js` — verifies JWT from `Authorization: Bearer <token>`.
5. Create `backend/src/middleware/error.middleware.js` — global error handler.
6. Create `backend/src/utils/apiResponse.js` — standard `{ success, data, message }` helper.
7. Create `backend/src/utils/apiError.js` — custom AppError class.
8. Register auth routes in `app.js`.

---

## Frontend Tasks

None.

---

## Database Tasks

None (Admin model already exists).

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Login with email + password, returns JWT |
| GET | `/api/auth/me` | ✅ | Returns current admin profile |

---

## Files / Folders

```
backend/src/
├── features/
│   └── auth/
│       ├── auth.controller.js
│       └── auth.route.js
├── middleware/
│   ├── auth.middleware.js
│   └── error.middleware.js
└── utils/
    ├── apiResponse.js
    └── apiError.js
```

---

## Acceptance Criteria

- [ ] `POST /api/auth/login` with correct credentials returns a JWT.
- [ ] `POST /api/auth/login` with wrong credentials returns 401.
- [ ] `GET /api/auth/me` with valid token returns admin data (no password).
- [ ] `GET /api/auth/me` without token returns 401.
- [ ] Global error handler catches thrown errors and returns JSON.

---

## Depends On

Phase 2

---

## Estimated Difficulty

Medium

---

## Estimated Time

2–4 hours

---

## Notes

* Token expiration: 7 days (reasonable for single admin).
* Never return the password hash in any response.

---

## Status

- [x] Completed

---

<!-- ──────────────────────────────────────────── -->

# Phase 4 – Cloudinary Integration & Image Upload 🟢

## Goal

Create a reusable image upload service using Cloudinary. This will be used by products, categories, brands, and store settings.

---

## Why this phase exists

Products, categories, brands, and the store logo all require image uploads. Building the upload utility once avoids duplication.

---

## Features

* Cloudinary SDK configuration
* Single image upload endpoint
* Multiple images upload endpoint
* Image deletion utility
* File validation (type, size)

---

## Backend Tasks

1. Install: `cloudinary`, `multer`.
2. Create `backend/src/config/cloudinary.js` — configure with env vars.
3. Create `backend/src/middleware/upload.middleware.js` — Multer memory storage with file filter (jpeg, png, webp) and size limit (5 MB).
4. Create `backend/src/utils/cloudinary.js` — `uploadImage(buffer, folder)`, `deleteImage(publicId)`.
5. Create `backend/src/features/upload/upload.controller.js` — handles single & multiple uploads.
6. Create `backend/src/features/upload/upload.route.js` — protected routes.

---

## Frontend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/upload/single` | ✅ | Upload one image, returns `{ url, publicId }` |
| POST | `/api/upload/multiple` | ✅ | Upload up to 5 images |
| DELETE | `/api/upload/:publicId` | ✅ | Delete an image from Cloudinary |

---

## Files / Folders

```
backend/src/
├── config/
│   └── cloudinary.js
├── middleware/
│   └── upload.middleware.js
├── features/
│   └── upload/
│       ├── upload.controller.js
│       └── upload.route.js
└── utils/
    └── cloudinary.js
```

---

## Acceptance Criteria

- [ ] Uploading a valid image returns a Cloudinary URL and publicId.
- [ ] Uploading an invalid file type returns 400.
- [ ] Uploading a file > 5 MB returns 400.
- [ ] Deleting an image by publicId removes it from Cloudinary.
- [ ] All upload routes require authentication.

---

## Depends On

Phase 3

---

## Estimated Difficulty

Medium

---

## Estimated Time

2–4 hours

---

## Notes

* Store images in Cloudinary folders: `el-boutique/products`, `el-boutique/categories`, `el-boutique/brands`, `el-boutique/settings`.
* Use `buffer` upload (memory storage) to avoid writing temp files to disk.

---

## Status

- [x] Completed

---

<!-- ──────────────────────────────────────────── -->

# Phase 5 – Categories CRUD (Backend) 🟡

## Goal

Create the full CRUD API for product categories, including bilingual support (Arabic + French).

---

## Why this phase exists

Products belong to categories. Categories must exist before products can be created.

---

## Features

* Category model with bilingual fields
* Create / Read / Update / Delete endpoints
* Optional category image
* Validation

---

## Backend Tasks

1. Create `backend/src/models/Category.model.js` — `{ nameAr, nameFr, image: { url, publicId }, isActive }`.
2. Create `backend/src/features/categories/category.controller.js`.
3. Create `backend/src/features/categories/category.route.js`.
4. Create `backend/src/features/categories/category.validation.js` — input validation (e.g., with a simple middleware or Joi/Zod lite).

---

## Frontend Tasks

None.

---

## Database Tasks

* `categories` collection, index on `nameAr` (unique), `nameFr` (unique).

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/categories` | ✅ | Create category |
| GET | `/api/categories` | ❌ | List all active categories |
| GET | `/api/categories/:id` | ❌ | Get single category |
| PUT | `/api/categories/:id` | ✅ | Update category |
| DELETE | `/api/categories/:id` | ✅ | Delete category |

---

## Files / Folders

```
backend/src/
├── models/
│   └── Category.model.js
└── features/
    └── categories/
        ├── category.controller.js
        ├── category.route.js
        └── category.validation.js
```

---

## Acceptance Criteria

- [ ] Admin can create a category with Arabic and French names.
- [ ] Public GET returns only active categories.
- [ ] Admin can update / delete categories.
- [ ] Deleting a category that has products returns an appropriate error or warning.
- [ ] Duplicate names are rejected.

---

## Depends On

Phase 3, Phase 4 (for category images)

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* Keep validation lightweight — simple middleware or a small Zod schema.
* When deleting a category image, also delete from Cloudinary.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 6 – Brands CRUD (Backend) 🟡

## Goal

Create the full CRUD API for product brands, mirroring the category pattern.

---

## Why this phase exists

Products reference a brand. Brands must exist before products can be created.

---

## Features

* Brand model with bilingual fields
* Create / Read / Update / Delete endpoints
* Optional brand logo/image

---

## Backend Tasks

1. Create `backend/src/models/Brand.model.js` — `{ nameAr, nameFr, image: { url, publicId }, isActive }`.
2. Create `backend/src/features/brands/brand.controller.js`.
3. Create `backend/src/features/brands/brand.route.js`.
4. Create `backend/src/features/brands/brand.validation.js`.

---

## Frontend Tasks

None.

---

## Database Tasks

* `brands` collection, index on `nameAr` (unique), `nameFr` (unique).

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/brands` | ✅ | Create brand |
| GET | `/api/brands` | ❌ | List all active brands |
| GET | `/api/brands/:id` | ❌ | Get single brand |
| PUT | `/api/brands/:id` | ✅ | Update brand |
| DELETE | `/api/brands/:id` | ✅ | Delete brand |

---

## Files / Folders

```
backend/src/
├── models/
│   └── Brand.model.js
└── features/
    └── brands/
        ├── brand.controller.js
        ├── brand.route.js
        └── brand.validation.js
```

---

## Acceptance Criteria

- [ ] Admin can create a brand with bilingual names.
- [ ] Public GET returns only active brands.
- [ ] Admin can update / delete brands.
- [ ] Duplicate names are rejected.

---

## Depends On

Phase 3, Phase 4

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* This is structurally identical to categories. Reuse patterns.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 7 – Products CRUD (Backend) 🟡

## Goal

Build the complete product API — create, read, update, delete, with bilingual content, multiple images, category/brand references, pricing, discount, stock, featured flag, and view count.

---

## Why this phase exists

Products are the core entity. Every customer-facing feature (browsing, searching, cart, orders) depends on products existing.

---

## Features

* Product model with all fields from the spec
* CRUD endpoints
* Multiple image upload (up to 5)
* Featured product flag
* Stock tracking (`quantity`)
* View count increment
* Products hidden when `quantity === 0` or `isActive === false`

---

## Backend Tasks

1. Create `backend/src/models/Product.model.js`:
   ```
   {
     nameAr, nameFr,
     descriptionAr, descriptionFr,
     images: [{ url, publicId }],
     price, discountPrice,
     color,
     quantity,
     category (ref),
     brand (ref),
     isFeatured,
     isActive,
     viewCount
   }
   ```
2. Create `backend/src/features/products/product.controller.js`.
3. Create `backend/src/features/products/product.route.js`.
4. Create `backend/src/features/products/product.validation.js`.
5. Implement `GET /api/products` with filtering: `category`, `brand`, `color`, `priceMin`, `priceMax`, `search` (name), `featured`, pagination (`page`, `limit`).
6. Implement `PATCH /api/products/:id/view` — increment `viewCount` by 1.

---

## Frontend Tasks

None.

---

## Database Tasks

* `products` collection.
* Index on `category`, `brand`, `isFeatured`.
* Text index on `nameAr`, `nameFr` for search.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/products` | ✅ | Create product |
| GET | `/api/products` | ❌ | List products (filtered, paginated) |
| GET | `/api/products/:id` | ❌ | Get single product (populate category, brand) |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product + Cloudinary images |
| PATCH | `/api/products/:id/view` | ❌ | Increment view count |

---

## Files / Folders

```
backend/src/
├── models/
│   └── Product.model.js
└── features/
    └── products/
        ├── product.controller.js
        ├── product.route.js
        └── product.validation.js
```

---

## Acceptance Criteria

- [ ] Admin can create a product with all fields + multiple images.
- [ ] Public GET hides products with `quantity === 0` or `isActive === false`.
- [ ] Filtering by category, brand, color, price range works.
- [ ] Search by name (Arabic or French) returns matching products.
- [ ] Pagination returns correct `page`, `limit`, `totalPages`, `totalItems`.
- [ ] View count increments on each call to the view endpoint.
- [ ] Deleting a product removes its images from Cloudinary.

---

## Depends On

Phase 5, Phase 6

---

## Estimated Difficulty

Medium

---

## Estimated Time

4–6 hours

---

## Notes

* `discountPrice` should be less than `price` — validate this.
* When `quantity` reaches 0, set `isActive = false` automatically or filter out in queries.
* Populate `category` and `brand` in the single-product GET.
* Return similar products (same category) in the single-product response.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 8 – Store Settings API 🟡

## Goal

Create an API for the store settings (name, logo, WhatsApp number, phone, social links). These settings are global and only one record exists.

---

## Why this phase exists

The frontend header, footer, WhatsApp button, and hero section all depend on store settings. The admin settings page also needs this API.

---

## Features

* Single settings document (singleton pattern)
* Get settings (public)
* Update settings (admin only)
* Logo upload

---

## Backend Tasks

1. Create `backend/src/models/Settings.model.js`:
   ```
   {
     storeName,
     logo: { url, publicId },
     whatsappNumber,
     phoneNumber,
     socialLinks: { facebook, instagram, tiktok }
   }
   ```
2. Create `backend/src/features/settings/settings.controller.js`.
3. Create `backend/src/features/settings/settings.route.js`.
4. Seed default settings in `seed.js`.

---

## Frontend Tasks

None.

---

## Database Tasks

* `settings` collection — always exactly one document.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/settings` | ❌ | Get store settings |
| PUT | `/api/settings` | ✅ | Update store settings |

---

## Files / Folders

```
backend/src/
├── models/
│   └── Settings.model.js
└── features/
    └── settings/
        ├── settings.controller.js
        └── settings.route.js
```

---

## Acceptance Criteria

- [ ] `GET /api/settings` returns store settings.
- [ ] Admin can update all fields including logo.
- [ ] Updating logo deletes the old image from Cloudinary.
- [ ] Settings are seeded with defaults on first run.

---

## Depends On

Phase 3, Phase 4

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* Use `findOneAndUpdate` with `upsert: true` for the singleton pattern.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 9 – Orders API (Backend) 🟡

## Goal

Create the order submission and management API. Visitors create orders (no auth), admin manages them (with auth).

---

## Why this phase exists

Orders are the ultimate conversion event. The cart and WhatsApp flow both depend on orders being saveable.

---

## Features

* Order model with all fields
* Submit order (public — no auth required)
* Auto-generate unique order number
* List orders (admin)
* View order details (admin)
* Update order status (admin)
* Delete order (admin)

---

## Backend Tasks

1. Create `backend/src/models/Order.model.js`:
   ```
   {
     orderNumber (auto-generated, unique),
     customerName,
     customerPhone,
     note,
     items: [{
       product (ref),
       productName,
       productImage,
       color,
       price,
       quantity,
       subtotal
     }],
     totalItems,
     totalPrice,
     status (enum: "pending", "confirmed", "completed", "cancelled"),
     createdAt
   }
   ```
2. Create `backend/src/features/orders/order.controller.js`.
3. Create `backend/src/features/orders/order.route.js`.
4. Create `backend/src/features/orders/order.validation.js`.
5. Implement order number generation (e.g., `ORD-YYYYMMDD-XXXX`).
6. On order creation, decrement product stock (`quantity`).

---

## Frontend Tasks

None.

---

## Database Tasks

* `orders` collection.
* Index on `orderNumber` (unique), `status`, `createdAt`.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | ❌ | Submit a new order |
| GET | `/api/orders` | ✅ | List all orders (admin, paginated, filterable by status) |
| GET | `/api/orders/:id` | ✅ | Get order details (admin) |
| PATCH | `/api/orders/:id/status` | ✅ | Update order status |
| DELETE | `/api/orders/:id` | ✅ | Delete order |

---

## Files / Folders

```
backend/src/
├── models/
│   └── Order.model.js
└── features/
    └── orders/
        ├── order.controller.js
        ├── order.route.js
        └── order.validation.js
```

---

## Acceptance Criteria

- [ ] Visitor can submit an order with customer info and items.
- [ ] Order number is auto-generated and unique.
- [ ] Product stock is decremented on order creation.
- [ ] If any product has insufficient stock, the order is rejected with an error.
- [ ] Admin can list, view, filter, and paginate orders.
- [ ] Admin can update order status.
- [ ] Admin can delete orders.

---

## Depends On

Phase 7

---

## Estimated Difficulty

Medium

---

## Estimated Time

4–6 hours

---

## Notes

* Snapshot product data (name, price, image) into the order so that it remains correct even if the product is later edited or deleted.
* Consider using a simple counter or date-based scheme for order numbers.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 10 – Dashboard Stats API 🟡

## Goal

Create an API endpoint that returns aggregate statistics for the admin dashboard.

---

## Why this phase exists

The admin dashboard displays counts and top-viewed products. This endpoint aggregates data for the dashboard UI.

---

## Features

* Total products count
* Total categories count
* Total brands count
* Total orders count
* Orders by status breakdown
* Top 5 most viewed products

---

## Backend Tasks

1. Create `backend/src/features/dashboard/dashboard.controller.js`.
2. Create `backend/src/features/dashboard/dashboard.route.js`.
3. Use Mongoose `countDocuments()` and `aggregate()`.

---

## Frontend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/stats` | ✅ | Returns all dashboard statistics |

---

## Files / Folders

```
backend/src/features/dashboard/
├── dashboard.controller.js
└── dashboard.route.js
```

---

## Acceptance Criteria

- [ ] Returns correct counts for products, categories, brands, orders.
- [ ] Returns top 5 most viewed products with name, image, and viewCount.
- [ ] Only accessible to authenticated admin.

---

## Depends On

Phase 5, Phase 6, Phase 7, Phase 9

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* This is read-only. No charts or graphs on the backend — the frontend can render simple stat cards.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 11 – Frontend Foundation: Routing, Layout, i18n 🟢

## Goal

Set up React Router, create the main layout components (Header, Footer), implement Arabic/French internationalisation (i18n), and configure the API client (Axios).

---

## Why this phase exists

All frontend pages need routing, layout, and language support. Building these once avoids rework.

---

## Features

* React Router with public routes and admin routes
* Shared layout: Header, Footer
* i18n setup (Arabic + French) with language switcher
* RTL support for Arabic
* Axios instance with base URL and interceptors
* Auth context / state for admin

---

## Frontend Tasks

1. Install: `react-router-dom`, `i18next`, `react-i18next`.
2. Create `frontend/src/config/i18n.js` — initialise i18next with `ar` and `fr`.
3. Create `frontend/src/locales/ar.json` and `frontend/src/locales/fr.json` — initial keys (header, footer).
4. Create `frontend/src/config/axios.js` — Axios instance with `VITE_API_URL`, token interceptor.
5. Create `frontend/src/layouts/PublicLayout.jsx` — Header + `<Outlet />` + Footer.
6. Create `frontend/src/layouts/AdminLayout.jsx` — Sidebar + `<Outlet />`.
7. Create `frontend/src/components/common/Header.jsx` — logo, nav links, language switcher, favourites, cart icon, WhatsApp.
8. Create `frontend/src/components/common/Footer.jsx`.
9. Create `frontend/src/router/index.jsx` — define route tree.
10. Create `frontend/src/context/AuthContext.jsx` — store JWT + admin info.
11. Create `frontend/src/router/ProtectedRoute.jsx` — redirect to login if not authenticated.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

None (consuming existing endpoints).

---

## Files / Folders

```
frontend/src/
├── config/
│   ├── i18n.js
│   └── axios.js
├── locales/
│   ├── ar.json
│   └── fr.json
├── layouts/
│   ├── PublicLayout.jsx
│   └── AdminLayout.jsx
├── components/
│   └── common/
│       ├── Header.jsx
│       └── Footer.jsx
├── context/
│   └── AuthContext.jsx
└── router/
    ├── index.jsx
    └── ProtectedRoute.jsx
```

---

## Acceptance Criteria

- [ ] Navigating between routes works without full page reload.
- [ ] Language switcher toggles between Arabic and French.
- [ ] Arabic layout is RTL; French layout is LTR.
- [ ] Header displays logo, navigation, favourites, cart, WhatsApp button.
- [ ] Admin routes redirect to login if no token.
- [ ] Axios instance attaches token to admin requests.

---

## Depends On

Phase 1

---

## Estimated Difficulty

Medium

---

## Estimated Time

4–6 hours

---

## Notes

* Use `dir="rtl"` on `<html>` when language is Arabic.
* Store selected language in `localStorage`.
* Keep translation keys organised by feature (e.g., `header.*`, `products.*`).

---

## Status

- [x] Completed

---

<!-- ──────────────────────────────────────────── -->

# Phase 12 – Admin Login Page 🟡

## Goal

Build the admin login page UI and connect it to the backend authentication API.

---

## Why this phase exists

Admin must log in before accessing any admin panel feature. This is the first admin-facing UI.

---

## Features

* Login form (email + password)
* Form validation
* Error messages
* Loading state
* Redirect to dashboard on success
* Store token in context + localStorage

---

## Frontend Tasks

1. Create `frontend/src/pages/admin/LoginPage.jsx`.
2. Build a clean, centred login form with email and password fields.
3. Connect to `POST /api/auth/login`.
4. On success: store token in AuthContext and localStorage, redirect to `/admin/dashboard`.
5. On error: display error message.
6. Add bilingual labels.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: `POST /api/auth/login`.

---

## Files / Folders

```
frontend/src/pages/admin/
└── LoginPage.jsx
```

---

## Acceptance Criteria

- [ ] Login form renders with email and password fields.
- [ ] Successful login redirects to admin dashboard.
- [ ] Invalid credentials show error message.
- [ ] Token is stored and persists on page refresh.
- [ ] Login page is bilingual (Arabic / French).

---

## Depends On

Phase 3, Phase 11

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* Redirect already-authenticated admin away from the login page.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 13 – Admin Dashboard Page 🟡

## Goal

Build the admin dashboard UI displaying aggregate stats (product count, category count, brand count, order count, most viewed products).

---

## Why this phase exists

The dashboard is the first thing an admin sees after login. It provides a quick overview of the store's state.

---

## Features

* Stat cards: products, categories, brands, orders
* Top 5 most viewed products list
* Loading skeleton
* Refresh button

---

## Frontend Tasks

1. Create `frontend/src/pages/admin/DashboardPage.jsx`.
2. Create `frontend/src/components/admin/StatCard.jsx` — reusable stat card component.
3. Fetch data from `GET /api/dashboard/stats`.
4. Display stat cards in a responsive grid.
5. Display most viewed products in a simple list/table.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: `GET /api/dashboard/stats`.

---

## Files / Folders

```
frontend/src/
├── pages/admin/
│   └── DashboardPage.jsx
└── components/admin/
    └── StatCard.jsx
```

---

## Acceptance Criteria

- [ ] Dashboard shows correct counts for products, categories, brands, orders.
- [ ] Top 5 most viewed products display name, image, and view count.
- [ ] Page is responsive (mobile first).
- [ ] Loading state shows while fetching.

---

## Depends On

Phase 10, Phase 12

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* Keep it simple — no charts or graphs as per the spec: "بدون رسوم بيانية / تقارير معقدة".

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 14 – Admin Categories Management (Frontend) 🟡

## Goal

Build the admin UI for managing categories: list, create, edit, delete.

---

## Why this phase exists

Categories must be manageable from the admin panel before products can be created via the UI.

---

## Features

* Categories list page with table/cards
* Create category modal/form
* Edit category modal/form
* Delete with confirmation
* Image upload for category
* Bilingual inputs (Arabic + French name)

---

## Frontend Tasks

1. Create `frontend/src/pages/admin/CategoriesPage.jsx`.
2. Create `frontend/src/components/admin/CategoryForm.jsx` — reusable form for create/edit.
3. Create `frontend/src/components/common/ConfirmDialog.jsx` — reusable delete confirmation.
4. Create `frontend/src/components/common/ImageUpload.jsx` — reusable image upload component.
5. Connect to category CRUD API endpoints.
6. Add bilingual labels.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: Category CRUD endpoints (Phase 5).

---

## Files / Folders

```
frontend/src/
├── pages/admin/
│   └── CategoriesPage.jsx
└── components/
    ├── admin/
    │   └── CategoryForm.jsx
    └── common/
        ├── ConfirmDialog.jsx
        └── ImageUpload.jsx
```

---

## Acceptance Criteria

- [ ] Admin can view all categories in a list.
- [ ] Admin can create a category with Arabic name, French name, and image.
- [ ] Admin can edit an existing category.
- [ ] Admin can delete a category with confirmation dialog.
- [ ] Success/error toast notifications.

---

## Depends On

Phase 5, Phase 12

---

## Estimated Difficulty

Medium

---

## Estimated Time

3–4 hours

---

## Notes

* The `ImageUpload` and `ConfirmDialog` components will be reused across brands, products, and settings.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 15 – Admin Brands Management (Frontend) 🟡

## Goal

Build the admin UI for managing brands: list, create, edit, delete. Mirrors the categories UI.

---

## Why this phase exists

Brands must be manageable before products can be created via the UI.

---

## Features

* Brands list page
* Create / edit brand form
* Delete with confirmation
* Brand image upload

---

## Frontend Tasks

1. Create `frontend/src/pages/admin/BrandsPage.jsx`.
2. Create `frontend/src/components/admin/BrandForm.jsx`.
3. Reuse `ConfirmDialog` and `ImageUpload` from Phase 14.
4. Connect to brand CRUD API endpoints.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: Brand CRUD endpoints (Phase 6).

---

## Files / Folders

```
frontend/src/pages/admin/
└── BrandsPage.jsx
frontend/src/components/admin/
└── BrandForm.jsx
```

---

## Acceptance Criteria

- [ ] Admin can view, create, edit, and delete brands.
- [ ] Bilingual name inputs work.
- [ ] Image upload works.
- [ ] Delete shows confirmation dialog.

---

## Depends On

Phase 6, Phase 14 (for shared components)

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* This is nearly identical to the categories page. Reuse as much as possible.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 16 – Admin Products Management (Frontend) 🟡

## Goal

Build the admin UI for managing products: list (with search/filter), create, edit, delete. This is the most complex admin page.

---

## Why this phase exists

Products are the core of the platform. Admin needs a rich interface to manage them.

---

## Features

* Products list with search and pagination
* Create product form with all fields
* Multiple image upload (up to 5)
* Category and brand dropdowns (fetched from API)
* Edit product (pre-filled form)
* Delete product with confirmation
* Toggle featured flag

---

## Frontend Tasks

1. Create `frontend/src/pages/admin/ProductsPage.jsx` — list + search + pagination.
2. Create `frontend/src/pages/admin/ProductFormPage.jsx` — create/edit form.
3. Create `frontend/src/components/admin/MultiImageUpload.jsx` — upload and reorder multiple images.
4. Build form with: bilingual names, bilingual descriptions, price, discount price, color, quantity, category select, brand select, featured toggle.
5. Connect to products CRUD API.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: Product CRUD endpoints (Phase 7), Category list (Phase 5), Brand list (Phase 6).

---

## Files / Folders

```
frontend/src/
├── pages/admin/
│   ├── ProductsPage.jsx
│   └── ProductFormPage.jsx
└── components/admin/
    └── MultiImageUpload.jsx
```

---

## Acceptance Criteria

- [ ] Admin can view a paginated list of products with search.
- [ ] Admin can create a product with all fields and multiple images.
- [ ] Admin can edit a product (form pre-filled with current data).
- [ ] Admin can delete a product with confirmation.
- [ ] Category and brand dropdowns are populated from the API.
- [ ] Discount price validation: must be less than price.
- [ ] Form is responsive (mobile first).

---

## Depends On

Phase 7, Phase 14, Phase 15

---

## Estimated Difficulty

Hard

---

## Estimated Time

5–6 hours

---

## Notes

* This is the most complex admin form. Take care with image management (add, remove, reorder).
* Pre-validate `discountPrice < price` on the frontend before submission.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 17 – Admin Orders Management (Frontend) 🟡

## Goal

Build the admin UI for viewing and managing customer orders.

---

## Why this phase exists

Admin needs to see incoming orders, update their status, and contact customers via WhatsApp.

---

## Features

* Orders list with status filter and pagination
* Order detail modal/page
* Status update dropdown (pending → confirmed → completed / cancelled)
* WhatsApp link to contact customer
* Delete order

---

## Frontend Tasks

1. Create `frontend/src/pages/admin/OrdersPage.jsx` — list + filters.
2. Create `frontend/src/pages/admin/OrderDetailPage.jsx` or modal — full order details.
3. Create `frontend/src/components/admin/OrderStatusBadge.jsx` — colour-coded status.
4. Add WhatsApp link: `https://wa.me/{phone}`.
5. Connect to orders API endpoints.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: Order endpoints (Phase 9).

---

## Files / Folders

```
frontend/src/
├── pages/admin/
│   ├── OrdersPage.jsx
│   └── OrderDetailPage.jsx
└── components/admin/
    └── OrderStatusBadge.jsx
```

---

## Acceptance Criteria

- [ ] Admin can view a paginated, filterable list of orders.
- [ ] Admin can view full details of an order (items, customer info, total).
- [ ] Admin can update order status.
- [ ] WhatsApp link opens a conversation with the customer's phone number.
- [ ] Admin can delete an order with confirmation.

---

## Depends On

Phase 9, Phase 12

---

## Estimated Difficulty

Medium

---

## Estimated Time

3–5 hours

---

## Notes

* Status flow: pending → confirmed → completed OR pending → cancelled.
* Display order date in a readable local format.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 18 – Admin Settings Page (Frontend) 🟡

## Goal

Build the admin settings page to manage store info (name, logo, WhatsApp number, phone, social links).

---

## Why this phase exists

The store settings power the public header, footer, and WhatsApp links. Admin must be able to configure them.

---

## Features

* Settings form with all fields
* Logo upload with preview
* Save with success feedback

---

## Frontend Tasks

1. Create `frontend/src/pages/admin/SettingsPage.jsx`.
2. Pre-fill form with `GET /api/settings`.
3. Submit changes with `PUT /api/settings`.
4. Reuse `ImageUpload` component for logo.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: Settings endpoints (Phase 8).

---

## Files / Folders

```
frontend/src/pages/admin/
└── SettingsPage.jsx
```

---

## Acceptance Criteria

- [ ] Form loads with current settings.
- [ ] Admin can update store name, WhatsApp number, phone, social links.
- [ ] Admin can upload/change the logo.
- [ ] Success toast on save.

---

## Depends On

Phase 8, Phase 12

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* Validate WhatsApp number format (international format with country code).

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 19 – Public Home Page 🟡

## Goal

Build the customer-facing home page with hero section, categories showcase, featured products, and latest products.

---

## Why this phase exists

The home page is the first impression for visitors. It showcases the store identity and drives product discovery.

---

## Features

* Hero section with marketing message and CTA
* Categories grid
* Featured products carousel/grid
* Latest products grid
* Responsive, mobile-first design
* Bilingual content

---

## Frontend Tasks

1. Create `frontend/src/pages/public/HomePage.jsx`.
2. Create `frontend/src/components/public/HeroSection.jsx`.
3. Create `frontend/src/components/public/CategoryCard.jsx`.
4. Create `frontend/src/components/public/ProductCard.jsx` — reusable, shows image, name, price, discount, favourite, add-to-cart.
5. Fetch categories from `GET /api/categories`.
6. Fetch featured products from `GET /api/products?featured=true`.
7. Fetch latest products from `GET /api/products?sort=-createdAt&limit=8`.
8. Add loading skeletons for each section.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: Categories, Products (existing).

---

## Files / Folders

```
frontend/src/
├── pages/public/
│   └── HomePage.jsx
└── components/public/
    ├── HeroSection.jsx
    ├── CategoryCard.jsx
    └── ProductCard.jsx
```

---

## Acceptance Criteria

- [ ] Hero section renders with marketing message and "Browse Products" CTA.
- [ ] Categories display in a grid with names and images.
- [ ] Featured products display in a grid/carousel.
- [ ] Latest products display in a grid.
- [ ] All content renders in the selected language.
- [ ] Page is fully responsive (mobile first).
- [ ] Loading skeletons show while fetching.

---

## Depends On

Phase 11

---

## Estimated Difficulty

Medium

---

## Estimated Time

4–6 hours

---

## Notes

* `ProductCard` is one of the most reused components — make it polished.
* Use placeholder hero image; admin can customise later via settings.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 20 – Products Listing Page (Public) 🟡

## Goal

Build the public products page with search, filters (price, colour, brand), and paginated product grid.

---

## Why this phase exists

Visitors need to browse, search, and filter the full product catalogue.

---

## Features

* Product grid (reuse `ProductCard`)
* Search bar (search by name)
* Filter sidebar/drawer: category, brand, colour, price range
* Pagination (load more or page numbers)
* URL query params sync (shareable filtered URLs)
* Empty state when no results

---

## Frontend Tasks

1. Create `frontend/src/pages/public/ProductsPage.jsx`.
2. Create `frontend/src/components/public/ProductFilters.jsx` — sidebar/drawer with filters.
3. Create `frontend/src/components/common/SearchBar.jsx`.
4. Create `frontend/src/components/common/Pagination.jsx`.
5. Fetch products with filters from `GET /api/products?...`.
6. Sync filters with URL search params.
7. Category link from home page pre-selects the category filter.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: `GET /api/products`, `GET /api/categories`, `GET /api/brands`.

---

## Files / Folders

```
frontend/src/
├── pages/public/
│   └── ProductsPage.jsx
└── components/
    ├── public/
    │   └── ProductFilters.jsx
    └── common/
        ├── SearchBar.jsx
        └── Pagination.jsx
```

---

## Acceptance Criteria

- [ ] Products display in a responsive grid.
- [ ] Search filters products by name (Arabic or French).
- [ ] Category, brand, colour, and price filters work.
- [ ] Filters are reflected in the URL (shareable links).
- [ ] Pagination works correctly.
- [ ] Empty state message when no products match filters.

---

## Depends On

Phase 19 (for ProductCard)

---

## Estimated Difficulty

Medium

---

## Estimated Time

4–6 hours

---

## Notes

* On mobile, filters should be in a slide-out drawer.
* Debounce the search input to avoid excessive API calls.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 21 – Product Detail Page (Public) 🟡

## Goal

Build the single product detail page with image gallery, full info, add-to-cart, add-to-favourites, and similar products.

---

## Why this phase exists

This is the most important conversion page. Visitors decide here whether to add a product to their cart.

---

## Features

* Image gallery (multiple product images)
* Product name, description, price, discount price
* Colour, brand, category display
* Add to cart with quantity selector
* Add to favourites
* Similar products section (same category)
* View count increment

---

## Frontend Tasks

1. Create `frontend/src/pages/public/ProductDetailPage.jsx`.
2. Create `frontend/src/components/public/ImageGallery.jsx` — main image + thumbnails.
3. Create `frontend/src/components/public/QuantitySelector.jsx`.
4. Fetch product from `GET /api/products/:id`.
5. Call `PATCH /api/products/:id/view` on page load.
6. Fetch similar products (same category, exclude current).
7. Integrate with cart (Phase 22) and favourites (Phase 23).

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

Consuming: `GET /api/products/:id`, `PATCH /api/products/:id/view`, `GET /api/products?category=...`.

---

## Files / Folders

```
frontend/src/
├── pages/public/
│   └── ProductDetailPage.jsx
└── components/public/
    ├── ImageGallery.jsx
    └── QuantitySelector.jsx
```

---

## Acceptance Criteria

- [ ] Product detail page shows all product info.
- [ ] Image gallery allows browsing multiple images.
- [ ] Discount price shows original price struck through.
- [ ] Quantity selector works (min 1, max = available stock).
- [ ] Add to cart and add to favourites buttons work (wired in Phase 22/23).
- [ ] Similar products section shows products from the same category.
- [ ] View count is incremented once per page visit.
- [ ] Page is fully responsive.

---

## Depends On

Phase 20

---

## Estimated Difficulty

Medium

---

## Estimated Time

4–5 hours

---

## Notes

* Debounce or guard the view count increment to avoid counting on every re-render.
* Show "Out of Stock" badge if quantity is 0.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 22 – Shopping Cart (Frontend) 🟡

## Goal

Implement the shopping cart using localStorage. Includes cart page, add/remove/update items, totals, and the cart icon badge in the header.

---

## Why this phase exists

The cart is the bridge between browsing and ordering. It must work before the order submission flow.

---

## Features

* Cart context/store (localStorage backed)
* Add item to cart
* Remove item from cart
* Update item quantity
* Clear cart
* Cart icon with item count badge in Header
* Cart page with full item list and totals

---

## Frontend Tasks

1. Create `frontend/src/context/CartContext.jsx` — or a custom hook `useCart()`.
   * State: `items: [{ productId, name, image, color, price, discountPrice, quantity }]`.
   * Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
   * Persist to `localStorage`.
2. Create `frontend/src/pages/public/CartPage.jsx`.
3. Display each item: image, name, colour, price, quantity controls, subtotal, remove button.
4. Display totals: total items, total price.
5. Add "Clear Cart" button.
6. Add "Continue Shopping" link.
7. Update Header cart icon to show item count badge.
8. Wire "Add to Cart" buttons on `ProductCard` and `ProductDetailPage`.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

None (client-side only).

---

## Files / Folders

```
frontend/src/
├── context/
│   └── CartContext.jsx
└── pages/public/
    └── CartPage.jsx
```

---

## Acceptance Criteria

- [ ] Adding a product from ProductCard or ProductDetailPage adds it to cart.
- [ ] Cart icon in header shows the correct item count.
- [ ] Cart page displays all items with correct prices and subtotals.
- [ ] Quantity can be increased and decreased (min 1).
- [ ] Items can be removed individually.
- [ ] Cart can be cleared entirely.
- [ ] Cart persists across page refreshes (localStorage).
- [ ] Total price calculation is correct (use discountPrice if available).

---

## Depends On

Phase 11, Phase 21

---

## Estimated Difficulty

Medium

---

## Estimated Time

4–5 hours

---

## Notes

* Use `discountPrice` if it exists and is > 0; otherwise use `price`.
* Don't allow adding more than available stock (though stock check happens again on the server at order time).

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 23 – Favourites (Frontend) 🟡

## Goal

Implement the favourites / wishlist feature using localStorage.

---

## Why this phase exists

Spec explicitly requires favourites. It's a client-side-only feature (no account needed) and enhances the browsing experience.

---

## Features

* Favourites context/store (localStorage backed)
* Toggle favourite on ProductCard and ProductDetailPage
* Favourites page listing saved products
* Heart icon state (filled/empty)

---

## Frontend Tasks

1. Create `frontend/src/context/FavouritesContext.jsx` — or hook `useFavourites()`.
   * State: `favourites: [productId, ...]`.
   * Actions: `toggleFavourite`, `isFavourite`, `clearFavourites`.
2. Create `frontend/src/pages/public/FavouritesPage.jsx`.
3. On this page, fetch product details for each favourited productId.
4. Wire heart icon toggle on `ProductCard` and `ProductDetailPage`.
5. Add favourites link in Header (heart icon with count badge).

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

None (client-side only).

---

## Files / Folders

```
frontend/src/
├── context/
│   └── FavouritesContext.jsx
└── pages/public/
    └── FavouritesPage.jsx
```

---

## Acceptance Criteria

- [ ] Heart icon on ProductCard and ProductDetailPage toggles favourite state.
- [ ] Favourites page lists all saved products.
- [ ] Favourites persist across page refreshes (localStorage).
- [ ] Removing a favourite updates the icon and the favourites page.
- [ ] Header shows favourites icon with count.

---

## Depends On

Phase 19 (ProductCard), Phase 21 (ProductDetailPage)

---

## Estimated Difficulty

Easy

---

## Estimated Time

2–3 hours

---

## Notes

* Only store `productId` in localStorage. Fetch full product data from the API on the favourites page.
* Handle gracefully if a saved productId no longer exists (product was deleted).

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 24 – Order Submission & WhatsApp Flow 🟡

## Goal

Build the order submission form on the cart page and the WhatsApp message generation. This completes the core user journey.

---

## Why this phase exists

This is the final step of the user flow: cart → customer info → submit order → WhatsApp message opens. It's the most critical conversion feature.

---

## Features

* Customer info form (name, phone, optional note) at bottom of cart page
* Form validation
* Submit order to `POST /api/orders`
* On success: clear cart, open WhatsApp with formatted order summary
* Order confirmation message/page
* WhatsApp message template with order number, items, and total

---

## Frontend Tasks

1. Add customer form section to `CartPage.jsx` (or a `CheckoutSection` component).
2. Create `frontend/src/utils/whatsapp.js` — function to generate WhatsApp URL:
   ```
   https://wa.me/{storeWhatsappNumber}?text={encodedMessage}
   ```
3. Message format:
   ```
   🛒 طلب جديد #{orderNumber}
   👤 الاسم: {name}
   📱 الهاتف: {phone}

   المنتجات:
   - {productName} × {qty} = {subtotal} DA
   ...

   💰 المجموع: {total} DA
   📝 ملاحظة: {note}
   ```
4. On successful order submission:
   a. Show success confirmation.
   b. Clear the cart.
   c. Open WhatsApp in new tab/window.
5. Fetch store WhatsApp number from `GET /api/settings`.

---

## Backend Tasks

None (order API already built in Phase 9).

---

## Database Tasks

None.

---

## API Endpoints

Consuming: `POST /api/orders`, `GET /api/settings`.

---

## Files / Folders

```
frontend/src/
├── utils/
│   └── whatsapp.js
└── components/public/
    └── CheckoutSection.jsx
```

---

## Acceptance Criteria

- [ ] Customer must enter name and phone before submitting.
- [ ] Order is saved to the database via API.
- [ ] Order appears in admin orders panel.
- [ ] WhatsApp opens with a correctly formatted message.
- [ ] Cart is cleared after successful submission.
- [ ] Success message/page is shown.
- [ ] Error is shown if order submission fails (e.g., insufficient stock).

---

## Depends On

Phase 9, Phase 22

---

## Estimated Difficulty

Medium

---

## Estimated Time

3–5 hours

---

## Notes

* The WhatsApp message should be bilingual or in the currently selected language.
* Use `window.open()` for the WhatsApp URL — it works on both mobile (opens WhatsApp app) and desktop (opens WhatsApp Web).
* Store WhatsApp number comes from settings — fetch once and cache.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Phase 25 – UI Polish, Responsive Refinement & 404 Page 🟠

## Goal

Polish all existing pages, ensure pixel-perfect responsive design (mobile first), add a 404 page, toast notifications system, loading states, and micro-interactions.

---

## Why this phase exists

The spec emphasises the app must be beautiful on mobile and easy to use. This phase ensures quality before launch.

---

## Features

* 404 Not Found page
* Toast notification system (success, error, info)
* Loading skeletons for all pages
* Smooth transitions and animations
* Empty states (no products, no orders, empty cart)
* Scroll to top on route change
* Consistent spacing and typography
* Final responsive pass on all pages

---

## Frontend Tasks

1. Create `frontend/src/pages/NotFoundPage.jsx` — friendly 404 with link to home.
2. Add toast notification library or create a custom toast component.
3. Review and refine every page for mobile breakpoints.
4. Add loading skeletons where missing.
5. Add empty state components where needed.
6. Add scroll-to-top behaviour on route changes.
7. Add hover effects and subtle transitions to cards and buttons.
8. Ensure all text is properly wrapped and truncated.

---

## Backend Tasks

None.

---

## Database Tasks

None.

---

## API Endpoints

None.

---

## Files / Folders

```
frontend/src/
├── pages/
│   └── NotFoundPage.jsx
└── components/common/
    ├── Toast.jsx
    ├── LoadingSkeleton.jsx
    └── EmptyState.jsx
```

---

## Acceptance Criteria

- [ ] 404 page renders for unknown routes.
- [ ] Toast notifications appear for all CRUD actions (create, update, delete, error).
- [ ] All pages have loading states.
- [ ] All pages look correct on 320px, 375px, 768px, and 1024px+ widths.
- [ ] Empty states are displayed when no data.
- [ ] Page scrolls to top on navigation.
- [ ] Animations are smooth and not jarring.

---

## Depends On

All previous frontend phases (12–24)

---

## Estimated Difficulty

Medium

---

## Estimated Time

4–6 hours

---

## Notes

* This is the "fit and finish" phase. Take time to get it right.
* Test on real mobile devices or browser DevTools mobile emulation.

---

## Status

- [x] Completed

---

<!-- ──────────────────────────────────────────── -->

# Phase 26 – PWA, SEO, Performance & Deployment Prep 🔴

## Goal

Add Progressive Web App (PWA) capabilities, basic SEO meta tags, image optimisation, lazy loading, and prepare for production deployment.

---

## Why this phase exists

The spec explicitly requires PWA, SEO, lazy loading, and image optimisation. This phase finalises the app for production.

---

## Features

* PWA manifest + service worker
* Add to Home Screen capability
* Meta tags (title, description, Open Graph)
* Lazy loading for images and route components
* Image optimisation (Cloudinary transforms)
* Production build verification
* Environment variable documentation
* Deployment checklist

---

## Frontend Tasks

1. Install: `vite-plugin-pwa` (or manually create manifest + service worker).
2. Create `frontend/public/manifest.json` — app name, icons, theme colour, start URL.
3. Add PWA icons (192×192, 512×512).
4. Configure service worker for caching strategy.
5. Add `<meta>` tags to `index.html` for SEO (title, description, viewport, OG tags).
6. Add `React.lazy()` and `Suspense` for route-level code splitting.
7. Add `loading="lazy"` to all `<img>` elements.
8. Use Cloudinary URL transforms for responsive images (auto format, quality, width).
9. Verify `npm run build` produces a clean production bundle.
10. Create deployment README section.

---

## Backend Tasks

1. Add `helmet` security headers (if not already).
2. Add rate limiting (`express-rate-limit`) to `POST /api/orders` and `POST /api/auth/login`.
3. Add CORS configuration for production domain.
4. Verify `NODE_ENV=production` mode works correctly.
5. Create `backend/Dockerfile` (optional, for containerised deployment).

---

## Database Tasks

* Review all indexes for performance.
* Ensure all models have appropriate indexes.

---

## API Endpoints

None (no new endpoints).

---

## Files / Folders

```
frontend/
├── public/
│   ├── manifest.json
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
└── vite.config.js (PWA plugin)

backend/
└── src/middleware/
    └── rateLimiter.middleware.js
```

---

## Acceptance Criteria

- [ ] App installs as PWA on mobile (Add to Home Screen).
- [ ] Lighthouse PWA audit passes.
- [ ] Meta tags are present and correct for SEO.
- [ ] Images lazy load (visible in Network tab).
- [ ] Route-level code splitting works (multiple JS chunks).
- [ ] Cloudinary images use responsive transforms.
- [ ] Production build is clean (no warnings, no errors).
- [ ] Rate limiting is active on login and order endpoints.
- [ ] CORS is configured for the production domain.

---

## Depends On

All previous phases

---

## Estimated Difficulty

Hard

---

## Estimated Time

5–6 hours

---

## Notes

* PWA requires HTTPS in production.
* Test PWA installation on Android Chrome and iOS Safari.
* Lighthouse audit should score > 90 for Performance, Accessibility, Best Practices, SEO.

---

## Status

- [ ] Not Started

---

<!-- ──────────────────────────────────────────── -->

# Dependency Graph

```
Phase 1 (Setup)
  └── Phase 2 (Database)
        └── Phase 3 (Auth)
              ├── Phase 4 (Cloudinary)
              │     ├── Phase 5 (Categories API)
              │     ├── Phase 6 (Brands API)
              │     └── Phase 8 (Settings API)
              │
              ├── Phase 5 ─┐
              ├── Phase 6 ─┤
              │             └── Phase 7 (Products API)
              │                   └── Phase 9 (Orders API)
              │
              └── Phase 5 + 6 + 7 + 9 → Phase 10 (Dashboard Stats)

Phase 1 (Setup)
  └── Phase 11 (Frontend Foundation)
        ├── Phase 12 (Admin Login)
        │     ├── Phase 13 (Admin Dashboard) ← Phase 10
        │     ├── Phase 14 (Admin Categories) ← Phase 5
        │     │     └── Phase 15 (Admin Brands) ← Phase 6
        │     │           └── Phase 16 (Admin Products) ← Phase 7
        │     ├── Phase 17 (Admin Orders) ← Phase 9
        │     └── Phase 18 (Admin Settings) ← Phase 8
        │
        └── Phase 19 (Home Page)
              └── Phase 20 (Products Listing)
                    └── Phase 21 (Product Detail)
                          ├── Phase 22 (Cart)
                          │     └── Phase 24 (Order + WhatsApp) ← Phase 9
                          └── Phase 23 (Favourites)

Phase 12–24 → Phase 25 (UI Polish)
All Phases → Phase 26 (PWA + SEO + Deployment)
```

---

<!-- ──────────────────────────────────────────── -->

# Future Improvements

These features are **not** part of the current roadmap but are documented for future consideration:

| Feature | Description |
|---|---|
| 📧 Email notifications | Send order confirmation emails to admin |
| 🌍 Multi-language expansion | Add English, Spanish, or other languages |
| 🌙 Dark mode | Theme toggle for visitors |
| 📊 Analytics dashboard | Sales trends, conversion rates, popular products |
| 💱 Multiple currencies | Support DZD, EUR, USD |
| 📴 Offline mode | Full offline browsing via PWA cache |
| 🤖 WhatsApp Business API | Automated order confirmation via API (not just link) |
| 💳 Payment gateway | Integrate CIB, Dahabia, or Stripe for online payments |
| 🌐 Customer portal | Account creation, order history, saved addresses |
| ⭐ Product reviews | Customer ratings and reviews |
| 🏷️ Coupons & promotions | Discount codes and promotional campaigns |
| 📦 Shipping integration | Yalidine, ZR Express, or other Algerian delivery services |
| 📱 Native mobile app | React Native or Flutter mobile application |
| 🔔 Push notifications | New product alerts for subscribed visitors |
| 📈 Inventory alerts | Low stock notifications for admin |

---

*End of Roadmap*
