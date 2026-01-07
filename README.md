# 🧠 Creative Intelligence Hub (CIH)

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**An intelligent platform that automates brand compliance, localizes content instantly, and predicts performance before you launch.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

### 🎨 Smart Brand-Safe Creative Sandbox
An interactive design environment that empowers creatives to build stunning marketing assets while maintaining strict brand guidelines. Create brand-compliant visuals with real-time validation.

### 🔍 Auto Brand-Alignment Engine
Automatically analyzes your creative content against brand guidelines. Provides instant feedback on:
- Color compliance
- Typography adherence
- Logo usage validation
- Layout standards

### 🛒 Retail-Smart Dynamic Templates
Pre-built, responsive templates optimized for retail marketing campaigns. Dynamically adjust content based on product type, promotion, and target audience.

### 🌍 Multilingual Logo & Text Localizer
Seamlessly localize your marketing materials for global audiences:
- **Multi-language support**: English, French, Spanish (with extensibility for more)
- **RTL Support**: Built-in support for right-to-left languages (Arabic, Hebrew, Urdu)
- **Logo variants**: Automatically serve region-specific logos
- **Dynamic text translation**: Real-time translation of marketing copy

### 📊 Predictive Attention Heatmap Engine
AI-powered eye-tracking simulation that predicts where users will focus:
- Visual attention hotspots
- Engagement scoring
- Layout optimization recommendations
- Headline effectiveness analysis

---

## 🛠 Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/horcruxmelon/Creative-Intelligence-Hub-CIH.git
cd Creative-Intelligence-Hub-CIH
```

### Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start the backend server
node server.js
```
The backend API will be available at `http://localhost:3000`

---

## 🚀 Usage

### Running the Full Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   node server.js
   ```
   You should see: `Server is listening on http://localhost:3000`

2. **Start the Frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check - confirms backend is running |
| POST | `/api/generate-creative` | Generate localized creative content with AI analysis |

#### Example API Request
```json
POST /api/generate-creative
{
  "product": "Fresh Apples",
  "language": "fr"
}
```

#### Example Response
```json
{
  "status": "success",
  "creative_id": 123,
  "content": {
    "texts": { "headline": "...", "cta_button": "..." },
    "logoUrl": "/assets/logos/logo_fr.png",
    "direction": "ltr",
    "product_name": "Pommes Fraîches"
  },
  "intelligence": {
    "heatmap": [...],
    "heuristics": {...}
  }
}
```

---

## 🔧 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI Framework |
| Vite | 7.2 | Build Tool & Dev Server |
| TailwindCSS | 3.4 | Styling |
| Framer Motion | 12.23 | Animations |
| Lucide React | 0.561 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 5.2 | Web Server Framework |
| CORS | 2.8 | Cross-Origin Resource Sharing |
| Body Parser | 2.2 | Request Body Parsing |

---

## 📁 Project Structure

```
Creative-Intelligence-Hub-CIH/
├── 📂 backend/                    # Backend API Server
│   ├── 📂 api/
│   │   └── routes.js              # API route definitions
│   ├── server.js                  # Express server entry point
│   └── package.json               # Backend dependencies
│
├── 📂 intelligence/               # AI & Prediction Engine
│   ├── heatmap.cjs                # Attention heatmap generator
│   ├── heuristics.cjs             # Design heuristics analyzer
│   └── index.cjs                  # Intelligence module entry
│
├── 📂 localization/               # Multi-language Support
│   ├── 📂 translations/           # Language JSON files
│   │   ├── en.json                # English translations
│   │   ├── fr.json                # French translations
│   │   └── es.json                # Spanish translations
│   ├── 📂 logo_variants/          # Region-specific logos
│   └── config.cjs                 # Localization configuration
│
├── 📂 src/                        # Frontend Source
│   ├── 📂 components/             # React Components
│   │   ├── BrandAlignment.jsx     # Brand alignment checker
│   │   ├── CreativeSandbox.jsx    # Design sandbox
│   │   ├── HeatmapEngine.jsx      # Heatmap visualization
│   │   ├── Layout.jsx             # Page layout wrapper
│   │   ├── Localizer.jsx          # Localization interface
│   │   └── RetailTemplates.jsx    # Template gallery
│   ├── 📂 assets/                 # Static assets
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Global styles
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Base CSS
│
├── 📂 public/                     # Static public files
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint configuration
└── package.json                   # Frontend dependencies
```

---

## 📜 Available Scripts

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

---

## 🌐 Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Supported |
| French | `fr` | ✅ Supported |
| Spanish | `es` | ✅ Supported |
| German | `de` | 🔜 Coming Soon |
| Arabic | `ar` | 🔜 Coming Soon (RTL) |
| Hindi | `hi` | 🔜 Coming Soon |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


<div align="center">

**Made with ❤️ for Creative Intelligence**

</div>

