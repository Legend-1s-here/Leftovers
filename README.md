# 🌌 QuotaVerse — Multi-Account AI Quota & Subscription Tracker

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-quotaverse--beta.vercel.app-00f2fe?style=for-the-badge&logo=vercel)](https://quotaverse-beta.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React%2018-TypeScript-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite%205-Fast-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud%20Sync-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

### 🚀 **[Launch Live Web App → https://quotaverse-beta.vercel.app](https://quotaverse-beta.vercel.app)**

*Never get blindsided by an AI rate-limit again. Track rolling cooldowns, quotas, and renewals across multiple Gmail accounts for Antigravity, Claude, Codex, Gemini, Cursor, Copilot, and more.*

</div>

---

## 🌐 Live Web Application

The live production application is hosted on Vercel:
👉 **[https://quotaverse-beta.vercel.app](https://quotaverse-beta.vercel.app)**

---

## ✨ Key Features

### ⚡ Smart Quota & Cooldown Engine
- **Live Cooldown Countdowns**: Second-by-second timers for rolling message quotas (e.g., Claude 5-hour limit, Antigravity rate resets).
- **Limit Ending Priority Sorting**: Sorts subscriptions intelligently—cards with quota left (`⚡ Limit Left`) stay at the top, followed by rate-limited cards in ascending order of reset time (`⏱ Resets Soon`).
- **1-Click Quick Reset Modal**: Set cooldowns via intuitive presets (+1h, +3h, +5h, +24h, custom days) or paste exact timestamps directly (e.g. `9/11/2026, 2:01:07 AM`).
- **Timeline & Renewal Tracker**: 2-week maximum cooldown cap and 30-day billing renewal schedules.

### 🔔 Desktop Push & Anime Audio Notifications
- **"Quota Ready" Anime SFX & Chime**: Automatically plays an energetic anime chime / custom audio alert the moment any model countdown hits `00:00:00`.
- **Native OS Desktop Push**: Sends persistent desktop notifications via Service Workers even when the browser tab is minimized or running in the background.

### 🎨 4 Dynamic Anime & Productivity Visual Themes
Switch themes dynamically from the header with custom particle physics and tailored color palettes:
1. 🌌 **Neon Shonen Cyberpunk** — Canvas starfield, glowing chakra orbs, manga speed lines, and falling sakura blossoms.
2. ⛩️ **Torii Gate Sunset** — Crimson twilight horizon, glowing sunset sun, floating autumn leaves, and fire ember particles.
3. 🌑 **Minimalist Dark Mode** — Clean OLED black & deep celestial navy for distraction-free coding, featuring cyber diagonal light beams.
4. 🎧 **Lo-Fi Study / Coding Room** — Cozy purple desk ambient lighting with animated window rain streaks.

### 🔐 Fast Authentication & Cloud Snapshots
- **1-Click "Remember Me" PIN Lock**: Set a 4-digit PIN for instant anime glass numpad unlock on trusted devices without re-typing passwords.
- **Auto Cloud Backup Snapshots**: Automatic versioned backup captured on every add, edit, or delete with 1-click snapshot restore.
- **Supabase Cloud Sync**: Instant synchronization across devices with email/password authentication and secure local fallback storage.

### 📊 Analytics & Multi-Account Organization
- **Gmail Account Tagging**: Organize cards by Work, Personal, Research, or custom emails with distinct color tags.
- **Spend & Cost Breakdown**: Real-time monthly spend aggregation and cost distribution charts across models and accounts.
- **Export & Import**: Full JSON backup/restore and CSV export for spreadsheet analysis.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Bundler & Tooling**: Vite 5, PostCSS, Autoprefixer
- **Backend / Database**: Supabase (PostgreSQL, Auth, RLS)
- **Audio & Push**: Web Audio API & Service Worker Notification API
- **Icons & UI Components**: Lucide React, Canvas 2D Particle Engine

---

## 📦 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/Legend-1s-here/Leftovers.git
cd Leftovers
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License

MIT © [Legend-1s-here](https://github.com/Legend-1s-here)
