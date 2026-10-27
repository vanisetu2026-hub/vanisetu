# 🌿 VANISETU (वानिसेतु)

> **Learn • Preserve • Connect**  
> *A digital bridge for tribal languages. Because every language carries a culture.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFA611.svg)](https://firebase.google.com/)

---

## 📖 About VANISETU

**VANISETU** is a Duolingo-inspired indigenous language learning and cultural preservation platform. Designed with an earthy, culturally respectful visual identity, VANISETU enables learners to master foundational tribal languages from scratch while actively documenting and preserving sacred oral folklore, songs, and ancestral heritage.

### Supported Indigenous Languages (Initial Release)
- **Mundari** (*मुंडारी / Mundari*): Austroasiatic language of the Munda community, carrying sacred Karam and Sarhul traditions.
- **Santali** (*ᱥᱟᱱᱛᱟᱲᱤ*): Eighth Schedule language written in the indigenous **Ol Chiki** script created by Pandit Raghunath Murmu.
- **Ho** (*ᱦᱳ / Ho*): Austroasiatic language of the Kolhan region written in **Warang Citi** and Devanagari.
- **Kurukh** (*कुड़ुख़ / Oraon*): North Dravidian language of the Oraon people, known for vibrant riddles and Sarhul flower songs.

---

## 🎨 Color Palette & Design System

VANISETU adopts an earthy, nature-inspired palette avoiding excessive dark modes or neon gradients:

| Color | HEX | Role |
|---|---|---|
| **Forest Green** | `#214B32` | Primary brand color, navigation, button foundations |
| **Warm Cream** | `#F7F5EB` | Main soft page background |
| **Golden Orange** | `#E9A23B` | CTAs, active lesson nodes, progress highlights |
| **Deep Teal** | `#173E40` | Headings, high-contrast readable typography |
| **Sage Green** | `#668A70` | Secondary cards, community sections |
| **Muted Blue** | `#6894A0` | Dictionary and informational tags |
| **Tribal Purple** | `#806A91` | Gamification milestones and achievements |
| **Terracotta** | `#D97860` | Cultural heritage stories and folklore |

---

## ✨ Key Features & Flow

1. **Duolingo-Inspired Learning Path**: Curved interactive lesson road with locked, active, and mastered states.
2. **7 Interactive Exercise Formats**:
   - *Learn New Word* (with audio pronunciation & native script)
   - *Select the Meaning*
   - *Match Words with Translations*
   - *Multiple Choice*
   - *Fill in the Blanks*
   - *Listen & Identify* (with phonetic voice synthesis)
   - *Arrange Words into Sentences*
3. **Audio Pronunciation Engine**: Web Audio API tone synthesis for tactile chime feedback, and Web Speech API phonetic engine for native pronunciation.
4. **Vocabulary Flashcards**: Big tactile flashcard with tap-to-reveal meaning, native script, transliteration, audio, and example sentences.
5. **Digital Dictionary**: Searchable multi-language dictionary with category filters (Greetings, Nature, Family, Festival, Everyday) and favorite word bookmarks.
6. **Gamification System**: XP rewards, streak tracking flames, daily learning goals, and achievement badges (*First Steps, Campfire Flame, Sarhul Devotee, Heritage Champion*).
7. **Oral Traditions & Cultural Preservation**: Community sanctuary to submit and explore traditional folk tales, harvest songs (*Sereng*), and proverbs with elder attribution.
8. **Daily Reminders**: Configurable reminder times, active study days, and browser notification permission integration.
9. **Resilient Offline / Demo Mode**: Full functionality available immediately out of the box with persistent local storage, seamlessly connecting to live Firebase Auth & Firestore when configured.

---

## 🏗️ Project Architecture

```
vanisetu/
├── client/                     # Frontend (React, Vite, TypeScript, Tailwind)
│   ├── src/
│   │   ├── components/         # Reusable UI & Layout Components
│   │   │   ├── cards/          # LanguageCard, LessonCard, VocabularyCard, etc.
│   │   │   ├── common/         # Button, Input, Logo, AudioPlayer, Modal, etc.
│   │   │   ├── layout/         # Navbar, Sidebar, MobileBottomNav, Footer
│   │   │   └── lesson/         # ExerciseRenderer & exercise types
│   │   ├── contexts/           # AuthContext, LearningContext, NotificationContext
│   │   ├── data/               # Curated tribal curriculum & dictionary data
│   │   ├── pages/              # All 13 application views
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Sound & audio synthesis engine
│   └── package.json
│
├── server/                     # Backend (Node.js, Express, TypeScript)
│   ├── src/
│   │   ├── config/             # Firebase Admin configuration
│   │   ├── controllers/        # REST controllers (languages, lessons, progress, etc.)
│   │   ├── data/               # In-memory mock/fallback seed data
│   │   ├── middleware/         # Auth token verification & error handler
│   │   ├── routes/             # Modular Express router (/api/*)
│   │   └── app.ts              # Express application setup
│   └── package.json
│
├── firestore.rules             # Cloud Firestore security rules
├── .env.example                # Sample environment variables
├── README.md                   # Project documentation
└── package.json                # Monorepo root scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** or **pnpm**

### 2. Installation
From the root directory:
```bash
# Install root, client, and server dependencies
npm run install:all
```

### 3. Running in Development Mode
To start both the client and server concurrently:
```bash
npm run dev
```
- **Client Web App**: [http://localhost:5173](http://localhost:5173)
- **Backend Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

You can also run them independently:
```bash
# Run client only
npm run dev:client

# Run server only
npm run dev:server
```

---

## 🔒 Firebase Configuration

1. Copy `.env.example` to `client/.env`:
   ```bash
   cp .env.example client/.env
   ```
2. Enter your Firebase project credentials in `client/.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-app
   ```
3. Deploy Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

*Note: If no Firebase keys are set, VANISETU automatically runs in **Guest / Local Mode**, enabling all features, lessons, quizzes, and streaks without crashing.*

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health and status check |
| `GET` | `/api/auth/me` | Current authenticated user verification |
| `GET` | `/api/languages` | List all supported tribal languages |
| `GET` | `/api/languages/:id` | Get single language details |
| `GET` | `/api/courses` | List courses (supports `?languageId=...`) |
| `GET` | `/api/courses/:id` | Get course details |
| `GET` | `/api/lessons/:id` | Get lesson metadata |
| `GET` | `/api/lessons/:id/exercises` | Get interactive exercises for a lesson |
| `GET` | `/api/progress` | Get current user's progress & streak |
| `POST`| `/api/progress/complete-lesson`| Record completed lesson & award XP |
| `GET` | `/api/dictionary` | Search dictionary (`?q=...&languageId=...`) |
| `GET` | `/api/community` | Get approved oral traditions & folklore |
| `POST`| `/api/community/contributions`| Submit community knowledge for review |
| `GET` | `/api/profile` | Get user profile and goals |
| `PATCH`| `/api/profile` | Update profile settings and preferences |

---

## 📜 Cultural Integrity & Verification Note

> "Sample Content — Pending Native Speaker Verification"  
All initial language models are created using verified academic and folk resources. VANISETU works closely with indigenous cultural custodians, tribal research institutes, and native elders to maintain linguistic authenticity.

---

## ⚖️ License

Distributed under the **MIT License**. Created with reverence for indigenous cultural preservation.
