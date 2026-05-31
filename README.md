# 🔄 SwapSkill

> **Trade skills, not dollars.** A free skill-exchange marketplace where people swap expertise — no money needed.

SwapSkill connects people who want to exchange skills peer-to-peer. You build my website, I write your copy. Propose a swap, agree on scope, deliver, and rate each other. Built on the MERN stack, deployable for free.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | JWT-based register & login, 7-day tokens |
| 🗂️ **Skill categories** | Dev, Design, Writing, Marketing, Video, Data, Business, Other |
| 📋 **Listings** | Post what you offer + what you want, set skill level & time estimate |
| 🔍 **Browse & search** | Filter by category, keyword search, paginated results |
| 🤝 **Swap requests** | Propose a swap with an offer message and optional deadline |
| ✅ **Accept / Counter / Decline** | Full negotiation flow — counters ping the requester back |
| 🏁 **Mark done** | Both sides confirm completion independently |
| ⭐ **Reviews** | 1–5 star ratings + comments, reputation score on profiles |
| 👤 **Profiles** | Editable bio, active listings, all received reviews |
| ⏸️ **Pause listings** | Toggle listings active/inactive without deleting |

---

## 🖥️ Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4, React Router v6 |
| **Backend** | Node.js, Express 5, Mongoose |
| **Database** | MongoDB (Atlas free tier) |
| **Auth** | JWT + bcryptjs |
| **UI extras** | Lucide React icons, react-hot-toast |

---

## 📁 Project Structure

```
swapskill/
├── server/
│   ├── index.js              # Express app entry point
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── SwapRequest.js
│   │   └── Review.js
│   └── routes/
│       ├── auth.js           # /api/auth
│       ├── listings.js       # /api/listings
│       ├── swaps.js          # /api/swaps
│       └── users.js          # /api/users
├── client/
│   └── src/
│       ├── api/axios.js      # Axios instance + interceptors
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ListingCard.jsx
│       │   ├── SwapCard.jsx
│       │   ├── StarRating.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Register.jsx
│       │   ├── Login.jsx
│       │   ├── Browse.jsx
│       │   ├── ListingDetail.jsx
│       │   ├── CreateListing.jsx
│       │   ├── Dashboard.jsx
│       │   ├── MyListings.jsx
│       │   └── Profile.jsx
│       └── utils/constants.js
├── .env.example
├── render.yaml               # Render deployment config
└── package.json              # Root scripts (dev, build, start)
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 1. Clone the repo

```bash
git clone https://github.com/varshiniv1/SwapSkill.git
cd SwapSkill
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/swapskill
JWT_SECRET=any_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Install dependencies

```bash
# Server deps (root)
npm install

# Client deps
cd client && npm install && cd ..
```

### 4. Run in development

```bash
npm run dev
```

This starts both servers concurrently:
- **API** → `http://localhost:5000`
- **React app** → `http://localhost:5173`

---

## 🌐 Deployment (All Free)

### MongoDB Atlas — Database
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist `0.0.0.0/0`
3. Copy the connection string — you'll need it for Render

### Render — Backend API
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Render will auto-detect `render.yaml` and configure the service
4. Add these environment variables in the Render dashboard:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — any long random string
   - `CLIENT_URL` — your Vercel frontend URL (after deploying frontend)
5. Deploy — your API will be at `https://swapskill-api.onrender.com`

### Vercel — Frontend
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set **Root Directory** to `client`
3. Add environment variable:
   - `VITE_API_URL` — your Render API URL (e.g. `https://swapskill-api.onrender.com`)
4. Deploy — your app will be live at `https://swapskill.vercel.app`

> **Note:** Update `CLIENT_URL` in Render and `vite.config.js` proxy target once both are deployed.

---

## 🔌 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create account |
| POST | `/login` | — | Get JWT token |
| GET | `/me` | ✅ | Get current user |
| PUT | `/profile` | ✅ | Update name/bio/categories |

### Listings — `/api/listings`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Browse (filter, search, paginate) |
| GET | `/mine` | ✅ | Your own listings |
| GET | `/:id` | — | Single listing |
| POST | `/` | ✅ | Create listing |
| PUT | `/:id` | ✅ | Update listing |
| DELETE | `/:id` | ✅ | Delete listing |

### Swaps — `/api/swaps`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | All your swaps |
| POST | `/` | ✅ | Send swap request |
| PUT | `/:id/respond` | ✅ | Accept / counter / decline |
| PUT | `/:id/done` | ✅ | Mark your side done |
| PUT | `/:id/cancel` | ✅ | Cancel (requester only) |
| POST | `/:id/review` | ✅ | Submit review |
| GET | `/reviews/:userId` | — | User's reviews |

### Users — `/api/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:id` | — | User profile |
| GET | `/:id/listings` | — | User's active listings |
| GET | `/:id/reviews` | — | User's reviews |

---

## 🔄 Swap Lifecycle

```
[pending] ──► [accepted] ──► (both mark done) ──► [completed] ──► reviews
    │               ▲
    ▼               │
[countered] ────────┘
    │
    ▼
[declined]
    
[pending / countered] ──► [cancelled]  (requester only)
```

---

## 📜 License

MIT — free to use, modify, and deploy.
