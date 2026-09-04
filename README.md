# 💰 Personal Finance Dashboard

A full-stack **AI-powered personal finance management platform** built with React + FastAPI. Features intelligent expense forecasting using a Master Stacking Ensemble (ARIMA + ETS + LSTM + GRU), a Gemini-powered financial chatbot, and a BYOK (Bring Your Own Key) architecture with AES-256 encryption.
> 📄 This project is the subject of an ongoing IEEE research paper on hybrid ensemble 
> forecasting for personal expense prediction.

[![Python](https://img.shields.io/badge/Python-3.12-blue)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100-green)]()
[![React](https://img.shields.io/badge/React-19-blue)]()
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL3.0-yellow)]()

---

## ✨ Features

### 📊 Dashboard & Analytics
- **Real-time financial overview** — net worth, total expenses, income tracking
- **AI Expense Forecast** — 6-month predictions with confidence intervals
- **Spending velocity** and category breakdown charts
- **Reward points** system (10 points per transaction logged)

### 🤖 AI-Powered Intelligence
- **Gemini Financial Chatbot** — context-aware Q&A about your spending, budgets, and predictions
- **3-Tier Prediction Engine:**
  - **Tier 1:** Master Stacking Ensemble (ARIMA + ETS + LSTM + GRU neural networks)
  - **Tier 2:** Augmented statistical fallback (weighted moving average)
  - **Tier 3:** Gemini AI adjustment with anomaly detection (±20% evidence-based correction)
- **IQR-based anomaly detection** on monthly expense history

### 💳 Transaction Management
- **Manual entry** with category, type (income/expense), and descriptions
- **CSV bulk upload** — supports multiple date formats and flexible column matching
- **Export to CSV** for backup

### 📋 Budget Tracking
- Create budget items with titles, amounts, and due dates
- Track paid/unpaid status

### 🔐 Security
- **JWT authentication** with bcrypt password hashing
- **BYOK (Bring Your Own Key)** — users configure their own Gemini API key
- **AES-256 encryption** (Fernet + PBKDF2-HMAC-SHA256, 480k iterations) for API key storage
- **Masked API responses** — keys never returned in full from the server

### ⚙️ Customization
- 🌙 Dark / Light mode toggle
- 💱 Multi-currency support (USD, EUR, INR, GBP, JPY)
- 📱 Fully responsive layout

---

## 🏗️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React 19, Vite 7, TailwindCSS 4, Recharts, Framer Motion, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn, SQLModel (SQLAlchemy + Pydantic) |
| **Database** | SQLite |
| **AI/ML** | TensorFlow/Keras (LSTM, GRU), ARIMA, ETS, scikit-learn |
| **LLM** | Google Gemini 1.5 Flash (via REST API) |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **Encryption** | Fernet AES-256 (cryptography library) |
| **Banking** | Plaid API integration (optional) |

---

## 📁 Project Structure

```
personal_finance/
├── backend/
│   ├── main.py                 # FastAPI app — all API endpoints
│   ├── models.py               # SQLModel database models (User, Transaction, Budget)
│   ├── database.py             # SQLite connection & session management
│   ├── auth.py                 # JWT authentication & password hashing
│   ├── langchain_engine.py     # Gemini AI layer — chat, predictions, anomaly detection
│   ├── crypto.py               # AES-256 encryption for BYOK API keys
│   ├── plaid_integration.py    # Plaid banking API integration
│   ├── assets/                 # Pre-trained ML models
│   │   ├── arima_hybrid_base.pkl
│   │   ├── ets_hybrid_base.pkl
│   │   ├── lstm_arima_residuals.h5
│   │   ├── gru_ets_residuals.h5
│   │   ├── scaler_arima.pkl
│   │   └── scaler_ets.pkl
│   ├── .env                    # Environment variables (API keys, secrets)
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile              # Container deployment
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Router & providers
│   │   ├── components/
│   │   │   ├── AIAdvisor.jsx   # Floating AI chatbot widget
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── layout/         # Sidebar, header, private routes
│   │   │   ├── transactions/   # Transaction table & forms
│   │   │   └── payments/       # Payment components
│   │   ├── pages/
│   │   │   ├── Analytics.jsx   # AI forecast charts & spending analysis
│   │   │   ├── Budget.jsx      # Budget tracking
│   │   │   ├── Login.jsx       # Authentication
│   │   │   ├── Register.jsx    # User registration
│   │   │   ├── Settings.jsx    # Profile, BYOK config, help guide
│   │   │   └── Payments.jsx    # Payment management
│   │   ├── services/api.js     # API client (fetch wrapper)
│   │   └── context/            # Auth, Theme, Currency, Notification providers
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── deploy_azure.ps1            # Azure deployment scripts
└── start.bat                   # Local startup script
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.12+**
- **Node.js 18+**

### 1. Clone the Repository
```bash
git clone https://github.com/jignyaz/perosnal_finance.git
cd personal_finance
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env and add your keys (or configure via Settings UI later):
#   GOOGLE_API_KEY=your_gemini_key    (optional — users can add their own via BYOK)
#   ENCRYPTION_SECRET=auto_generated  (auto-created on first run)

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 4. Open the App
Navigate to **http://localhost:5173** in your browser.

---

## 🔑 AI Setup (BYOK)

The app uses a **Bring Your Own Key** architecture. Each user configures their own Gemini API key:

1. Get a **free** API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Log in to the app → go to **Settings** → **AI Configuration**
3. Paste your key and click **Save Changes**
4. The key is encrypted with **AES-256** and stored securely in your account

> **No key?** The app works perfectly without one — you just won't have the AI chatbot and AI-enhanced predictions. All other features work normally.

---

## 🧠 Prediction Engine

```
┌─────────────────────────────────────────────────────┐
│              Master Stacking Ensemble               │
│                                                     │
│  ┌──────────┐  ┌──────────┐                         │
│  │  ARIMA   │  │   ETS    │  Statistical Base       │
│  │  (40%)   │  │  (30%)   │  Forecasts              │
│  └────┬─────┘  └────┬─────┘                         │
│       │              │                              │
│  ┌────▼─────┐  ┌────▼─────┐                         │
│  │  LSTM    │  │   GRU    │  Neural Residual        │
│  │  (15%)   │  │  (15%)   │  Correction             │
│  └────┬─────┘  └────┬─────┘                         │
│       └──────┬───────┘                              │
│              ▼                                      │
│     Weighted Ensemble Prediction                    │
│              │                                      │
│              ▼                                      │
│     Gemini AI Adjustment (±20%)                     │
│     + Anomaly Detection (IQR)                       │
│     + Category Insights                             │
└─────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/token` | Login (returns JWT) |
| `POST` | `/register` | Register new user |
| `GET` | `/users/me` | Get current user profile (API key masked) |
| `PUT` | `/users/me` | Update profile & BYOK key |
| `GET` | `/transactions` | List user transactions |
| `POST` | `/transactions` | Create transaction |
| `DELETE` | `/transactions` | Delete all transactions |
| `POST` | `/upload-transactions` | CSV bulk upload |
| `GET` | `/budgets` | List budgets |
| `POST` | `/budgets` | Create budget item |
| `GET` | `/stats` | Dashboard statistics |
| `GET` | `/predict-expenses` | Base ensemble prediction |
| `GET` | `/predict-expenses-v2` | Gemini-enhanced prediction |
| `POST` | `/chat` | AI financial chatbot |

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

The app will be available at **http://localhost:8000** with the frontend served as static files.

---

## 📄 License

This project is licensed under the GPL-3.0 License — see the [LICENSE](LICENSE) file for details.
