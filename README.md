# ✧ QuotaVerse — AI Quota & Subscription Hub

A modern, SaaS-grade web application built to track subscription renewals, message limit resets, and quotas across multiple Gmail accounts for **Antigravity**, **Claude (Anthropic)**, **OpenAI / Codex**, **Google Gemini**, **Cursor**, **GitHub Copilot**, and custom AI services.

![QuotaVerse Preview](./public/shonen-background-anime-v2.png)

---

## 🚀 Features

- 📧 **Multi-Account Gmail Management**: Organize and filter AI subscriptions by Gmail account (Work, Personal, Research, etc.) with custom color tags and quick copy actions.
- ⚡ **Dual Tracking Engine**:
  - **Live Rate-Limit Cooldown Timers**: Real-time second-by-second countdown for rolling message limits (e.g. Claude 5h limit or Antigravity resets).
  - **Billing & Renewal Cycles**: Progress bars, renewal dates, and status indicators (Active, Expiring Soon, Expired).
- ⏱️ **1-Click "Hit Limit" Cooldown**: Instantly starts a cooldown timer (1h, 3h, 5h, 24h) when you hit rate limits on any model.
- 🎨 **Shonen Anime Aesthetics**: Interactive canvas starfield, glowing moon, chakra orbs, manga speed lines, energy rings, and drifting sakura petals.
- 📊 **4 Specialized Views**:
  - **Subscription Cards**: Rich interactive cards with real-time status and timers.
  - **Grouped by Gmail**: Collapsible account views with aggregated monthly costs.
  - **30-Day Timeline**: Day-by-day calendar schedule of upcoming renewals.
  - **Spend & Analytics**: Visual charts showing cost distribution by model and account.
- 💾 **Data Portability**: Browser LocalStorage auto-save, full JSON backup/restore, and CSV export for spreadsheets.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS + Custom CSS Variables & Animations
- **Icons**: Lucide React + Custom SVG Glyphs
- **Typography**: Space Grotesk & DM Sans

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Legend-1s-here/Leftovers.git
cd Leftovers
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📄 License

MIT
