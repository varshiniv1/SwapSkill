# SwapSkill

**A peer-to-peer skill exchange marketplace.** Trade expertise directly — no money, no middlemen.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-swap--skill--psi.vercel.app-7c3aed?style=flat-square&logo=vercel)](https://swap-skill-psi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-varshiniv1%2FSwapSkill-181717?style=flat-square&logo=github)](https://github.com/varshiniv1/SwapSkill)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)

---

## Overview

SwapSkill lets professionals exchange skills on their own terms. A developer needs a logo; a designer needs a landing page — they propose a swap, agree on scope, deliver, and rate each other. No payment infrastructure, no fees, no subscriptions.

**Production:** [swap-skill-psi.vercel.app](https://swap-skill-psi.vercel.app)  
**Repository:** [github.com/varshiniv1/SwapSkill](https://github.com/varshiniv1/SwapSkill)

---

## Features

| Feature | Description |
|---|---|
| **Authentication** | JWT-based register & login with bcrypt password hashing, 7-day token expiry |
| **Skill categories** | Development, Design, Writing, Marketing, Video & Audio, Data & AI, Business, Other |
| **Listings** | Post what you offer and what you want, set skill level (beginner / mid / expert) and time estimate |
| **Browse & search** | Keyword search, category filter, paginated results |
| **Swap requests** | Propose a swap with an offer description, message, and optional deadline |
| **Negotiation flow** | Listing owner can accept, counter-propose, or decline any incoming request |
| **Completion** | Both parties independently mark their side done before a swap is closed |
| **Reviews** | 1–5 star rating with written feedback; reputation score updates in real time on profiles |
| **Profile management** | Editable bio and skill categories, active listings, full review history |
| **Listing controls** | Pause or reactivate listings without deleting them |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4, React Router v6 |
| **Backend** | Node.js, Express 5, Mongoose 9 |
| **Database** | MongoDB Atlas (free tier) |
| **Authentication** | JSON Web Tokens, bcryptjs |
| **UI** | Lucide React, react-hot-toast |
| **Deployment** | Vercel (client), Render (server), MongoDB Atlas (database) |

---

## Project Structure

```
SwapSkill/
├── server/
│   ├── index.js                  # Express entry point, DB connection
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema, password hashing
│   │   ├── Listing.js            # Skill listing schema
│   │   ├── SwapRequest.js        # Swap state machine schema
│   │   └── Review.js             # Review schema with unique index
│   └── routes/
│       ├── auth.js               # POST /register, POST /login, GET /me
│       ├── listings.js           # CRUD + search/filter/pagination
│       ├── swaps.js              # Swap lifecycle + reviews
│       └── users.js              # Public profiles
├── client/
│   └── src/
│       ├── api/
│       │   └── axios.js          # Axios instance with JWT interceptor
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ListingCard.jsx
│       │   ├── SwapCard.jsx
│       │   ├── StarRating.jsx
│       │   ├── CategoryIcon.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Browse.jsx
│       │   ├── ListingDetail.jsx
│       │   ├── CreateListing.jsx
│       │   ├── Dashboard.jsx
│       │   ├── MyListings.jsx
│       │   └── Profile.jsx
│       └── utils/
│           └── constants.js      # Categories, levels, status colours
├── .env.example
├── render.yaml                   # Render deployment config
└── package.json                  # Root scripts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 1. Clone

```bash
git clone https://github.com/varshiniv1/SwapSkill.git
cd SwapSkill
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/swapskill
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Install dependencies

```bash
# Server
npm install

# Client
cd client && npm install && cd ..
```

### 4. Start development servers

```bash
npm run dev
```

| Service | URL |
|---|---|
| API | http://localhost:5000 |
| React app | http://localhost:5173 |
| Health check | http://localhost:5000/api/health |

---

## Deployment

All three services have free tiers sufficient for this project.

### MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add a database user with read/write access
3. Under **Network Access**, add `0.0.0.0/0` to allow connections from any IP
4. Copy the connection string

### Render — API server

1. New Web Service → connect this repo
2. Set **Branch** to `main`, **Start Command** to `node server/index.js`
3. Add environment variables:

| Key | Value |
|---|---|
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | A long random string |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your Vercel URL (add after frontend deploy) |

### Vercel — Frontend

1. New Project → import this repo
2. Set **Root Directory** to `client`
3. Add environment variable:

| Key | Value |
|---|---|
| `VITE_API_URL` | Your Render service URL |

After both are live, update `CLIENT_URL` in Render with the Vercel URL and redeploy.

---

## API Reference

### Auth  `/api/auth`

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `POST` | `/register` | No | Create account |
| `POST` | `/login` | No | Authenticate, receive JWT |
| `GET` | `/me` | Yes | Get current user |
| `PUT` | `/profile` | Yes | Update bio, name, categories |

### Listings  `/api/listings`

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/` | No | Browse with search, category filter, pagination |
| `GET` | `/mine` | Yes | Current user's listings |
| `GET` | `/:id` | No | Single listing detail |
| `POST` | `/` | Yes | Create listing |
| `PUT` | `/:id` | Yes | Update listing (owner only) |
| `DELETE` | `/:id` | Yes | Delete listing (owner only) |

### Swaps  `/api/swaps`

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/` | Yes | All swaps involving current user |
| `POST` | `/` | Yes | Send a swap proposal |
| `PUT` | `/:id/respond` | Yes | Accept, counter, or decline |
| `PUT` | `/:id/done` | Yes | Mark your side complete |
| `PUT` | `/:id/cancel` | Yes | Cancel request (requester only) |
| `POST` | `/:id/review` | Yes | Submit review after completion |
| `GET` | `/reviews/:userId` | No | All reviews for a user |

### Users  `/api/users`

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/:id` | No | Public profile |
| `GET` | `/:id/listings` | No | User's active listings |
| `GET` | `/:id/reviews` | No | User's received reviews |

---

## Swap Lifecycle

```
                    ┌─────────────┐
         propose    │   pending   │
        ──────────► │             │
                    └──────┬──────┘
                           │  owner responds
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         declined      countered     accepted
                           │            │
                    requester      both sides
                    can accept     mark done
                           │            │
                           ▼            ▼
                        accepted    completed
                                        │
                                    reviews
```

Requester can cancel any `pending` or `countered` request at any time.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |
| `PORT` | No | Server port (default: `5000`) |
| `CLIENT_URL` | Yes | Frontend origin for CORS (e.g. `https://yourapp.vercel.app`) |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start server + client concurrently (development) |
| `npm run server` | Start server only with nodemon |
| `npm run client` | Start React dev server only |
| `npm run build` | Build React client for production |
| `npm start` | Start production server |

---

## License

MIT — see [LICENSE](LICENSE) for details.
