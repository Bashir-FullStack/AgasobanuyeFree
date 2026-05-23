# Hiromart - E-Commerce Platform

Full e-commerce platform with client storefront and admin dashboard.

## Architecture

```
hiromarrt/
├── client/          → Storefront (React 19 + Vite 8 + Tailwind v4)
│   ├── Deployed: hiromart-client.netlify.app
│   └── Features: Products, Cart, Checkout, Auth, Orders, etc.
├── admin/           → Admin Dashboard (React 18 + Vite 5 + Tailwind v3)
│   ├── Deployed: classyshop-admin.vercel.app
│   └── Features: Products CRUD, Orders, Analytics, Customers, etc.
└── .env             → Shared API config
```

**Backend API**: `https://hiromart-backend.onrender.com/api`

## Setup

```bash
# Install dependencies
cd client && npm install
cd ../admin && npm install

# Run client
cd client && npm run dev

# Run admin
cd admin && npm run dev
```

## Environment Variables

Copy `.env` to both `client/.env` and `admin/.env`:
- `VITE_API_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_STRIPE_KEY` - Stripe publishable key (client only)
