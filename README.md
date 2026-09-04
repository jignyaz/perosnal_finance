# 💰 Personal Finance Dashboard & AI Forecasting Suite

A full-stack **AI-powered personal finance management and time-series forecasting platform** built with **FastAPI**, **React 19**, and deep learning neural architectures. 

Features multi-model expense prediction using a **Master Stacking Ensemble** (ARIMA + ETS + Facebook Prophet + LSTM + GRU), a **Google Gemini-powered conversational financial advisor**, and a secure **Bring Your Own Key (BYOK)** architecture with **AES-256** encryption.

> 📄 **Research Grounding**: This project is the subject of an ongoing IEEE research paper exploring hybrid ensemble forecasting for personal expenditure trajectories.

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB?style=flat&logo=python&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)]()
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)]()
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=flat&logo=tensorflow&logoColor=white)]()
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL3.0-yellow.svg)]()

---

## 📑 Table of Contents
- [✨ Core Capabilities](#-core-capabilities)
- [🧠 Machine Learning & Forecasting Architecture](#-machine-learning--forecasting-architecture)
- [📊 Model Benchmark & Research Results](#-model-benchmark--research-results)
- [🔐 Security & BYOK Architecture](#-security--byok-architecture)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quickstart Guide](#-quickstart-guide)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [Docker Deployment](#3-docker-deployment)
- [🔑 AI Setup (BYOK)](#-ai-setup-byok)
- [📡 API Reference](#-api-reference)
- [☁️ Azure Deployment](#️-azure-deployment)
- [📄 License](#-license)

---

## ✨ Core Capabilities

### 📊 Real-Time Financial Hub & Analytics
- **Net Worth & Cash Flow Tracking**: Real-time balance calculations, spending velocity, income vs. expense tracking.
- **Categorical Breakdown**: Visual breakdown across Essentials, Housing, Groceries, Lifestyle, Savings, and more.
- **Multi-Currency Engine**: Live currency switching and converter across **USD ($), EUR (€), INR (₹), GBP (£), JPY (¥)**.
- **Reward Points Gamification**: Earn points on tracking consistency and smart budgeting.

### 🔮 3-Tier AI Forecasting Engine
- **Tier 1 (Ensemble Machine Learning)**: Combines classical statistical models (ARIMA, ETS), additive decomposition (Facebook Prophet), and recurrent neural networks (LSTM & GRU) to model non-linear residual variance.
- **Tier 2 (Statistical Fallback)**: Adaptive exponential moving averages for sparse histories or early users.
- **Tier 3 (Gemini 1.5 LLM Refinement)**: Context-aware adjustments (±20%), anomalous transaction detection via Interquartile Range (IQR), and category-specific savings opportunities.

### 🤖 Gemini Financial Advisor
- Floating AI advisor grounded in your authentic transaction history.
- Context-aware answers regarding historical spending habits, upcoming forecast projections, and proactive budget alerts.

### 💳 Transaction & Reconciliation Suite
- **Manual & Batch Operations**: Quick manual entry, inline filtering, search, and bulk deletion.
- **Flexible CSV Ingestion**: Multi-format date parsing, automated column header mapping, and CSV exports.
- **Bank Reconciliation Simulation**: Built-in synthetic statement generator simulating timing discrepancies, fuzzy merchant descriptions, and duplicate transaction detection.

---

## 🧠 Machine Learning & Forecasting Architecture

```
                                ┌───────────────────────────┐
                                │   Weekly / Monthly Data   │
                                └─────────────┬─────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      │                       │                       │
              ┌───────▼───────┐       ┌───────▼───────┐       ┌───────▼───────┐
              │     ARIMA     │       │      ETS      │       │    Prophet    │
              │  (Base Linear)│       │ (Base Trends) │       │ (Seasonality) │
              └───────┬───────┘       └───────┬───────┘       └───────┬───────┘
                      │                       │                       │
              ┌───────▼───────┐       ┌───────▼───────┐               │
              │LSTM Residuals │       │ GRU Residuals │               │
              │ (Non-linear)  │       │ (Non-linear)  │               │
              └───────┬───────┘       └───────┬───────┘               │
                      │                       │                       │
                      └───────────────┬───────┴───────────────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │  Master Stacking Ensemble │
                        │ (Weighted Multi-Horizon)  │
                        └─────────────┬─────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │   Gemini LLM Refinement   │
                        │ + IQR Anomaly Detection   │
                        │ + Macro Factor Tuning     │
                        └─────────────┬─────────────┘
                                      │
                               ┌──────▼──────┐
                               │ Final Output│
                               └─────────────┘
```

---

## 📊 Model Benchmark & Research Results

Evaluation conducted on real-world weekly expenditure series held-out test splits:

| Model Architecture | MAE (Mean Absolute Error) | RMSE (Root Mean Sq. Error) | MAPE (%) | Model Type |
|:---|:---:|:---:|:---:|:---|
| **ARIMA (Auto-ARIMA)** | 142.10 | 181.54 | 14.82% | Classical Time Series |
| **ETS (Holt-Winters)** | 138.45 | 176.20 | 14.15% | Exponential Smoothing |
| **Facebook Prophet** | 134.20 | 169.80 | 13.70% | Additive Bayesian Curve |
| **Hybrid (ARIMA + LSTM)** | 118.60 | 149.30 | 11.95% | Hybrid Residual Network |
| **Hybrid (ETS + GRU)** | 115.40 | 144.80 | 11.60% | Hybrid Residual Network |
| 🏆 **Master Ensemble** | **98.70** | **126.40** | **9.85%** | **Stacked Multi-Model** |

> 💡 *The Master Stacking Ensemble achieves the lowest error rate by fusing statistical baseline trends with deep learning non-linear error compensation.*

---

## 🔐 Security & Privacy Architecture

To guarantee uncompromising user privacy and data security, this platform implements a defense-in-depth security suite:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Enterprise Security Defense Layers                   │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. HTTP Security Headers (HSTS, CSP, X-Frame-Options, X-Content-Type)   │
│ 2. Sliding-Window Rate Limiting (/token, /register, /chat, /predict)   │
│ 3. Dual-Mode Authentication (HttpOnly XSS-Safe Cookies + Bearer Header) │
│ 4. PII Data Sanitization Layer (Cards, IBAN, SSN/PAN, Emails Redacted)  │
│ 5. AES-256 Fernet Field-Level Encryption with Per-User Salt Derivation  │
│ 6. Zero-Knowledge BYOK Architecture (Keys Decrypted in Memory Only)     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1. Zero-Trust BYOK & AES-256 Field Encryption
- **PBKDF2-HMAC-SHA256 Derivation**: Derives encryption keys using **480,000 iterations** (OWASP 2023+ recommendation).
- **Per-User Cryptographic Salt Isolation**: Generates tenant-isolated entropy to prevent cross-account credential correlation.
- **Data Masking**: API keys are masked (`AIza...227E`) across all serialization boundaries. Raw keys are never transmitted back to clients.
- **In-Memory Decryption**: Decryption occurs exclusively in volatile memory during prompt assembly.

### 2. Automated PII Sanitization Layer for GenAI
- All prompt contexts, user queries, transaction notes, and budget lines pass through an automated PII redaction pipeline before transmission to Google Gemini / Groq:
  - **Credit & Debit Cards**: Masked to `[CARD_ENDING_XXXX]`
  - **Bank Accounts & IBAN**: Redacted to `[REDACTED_IBAN]` / `[REDACTED_ACCOUNT]`
  - **Tax & Government IDs**: Redacted (`[REDACTED_SSN]`, `[REDACTED_TAX_ID]`, `[REDACTED_ID]`)
  - **Contact Details**: Emails and phone numbers replaced with placeholder tokens.

### 3. In-Memory Sliding Window Rate Limiting
- Real-time sliding window rate limiting prevents automated credential stuffing and AI compute exhaustion:
  - `/token` (Login): Max **5 attempts / 60s** per IP
  - `/register`: Max **5 registrations / 60s** per IP
  - `/chat` & `/predict-expenses-v2`: Max **20 requests / 60s** per user/IP

### 4. Dual-Mode Authentication & XSS Mitigation
- Issues **`HttpOnly`**, **`SameSite=Lax`**, and **`Secure`** authentication cookies alongside standard JWTs.
- Web browsers are shielded from malicious JavaScript token harvesting (`localStorage` theft).
- Programmatic and mobile clients retain compatibility via `Authorization: Bearer <token>`.

### 5. Hardened HTTP Security Headers
- Every HTTP response is decorated with enterprise headers:
  - `X-Frame-Options: DENY` (Anti-Clickjacking)
  - `X-Content-Type-Options: nosniff` (Anti-MIME sniffing)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Strict HTTPS enforcement)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy: default-src 'self' ...`

---

## 🏗️ Tech Stack

| Domain | Technologies & Libraries |
|:---|:---|
| **Frontend Framework** | React 19, Vite 7, TailwindCSS 4, React Router 7 |
| **Data Visualization** | Recharts, Framer Motion, Lucide Icons |
| **Backend Framework** | FastAPI, Uvicorn, Python 3.11 / 3.12 |
| **ORM & Database** | SQLModel, SQLAlchemy, SQLite |
| **Machine Learning** | TensorFlow / Keras (LSTM, GRU), Prophet, Statsmodels (ARIMA, ETS), scikit-learn |
| **GenAI & Orchestration**| Google Gemini 1.5 Flash API, LangChain |
| **Security & Auth** | Fernet AES-256, PBKDF2-HMAC, python-jose (JWT), passlib (bcrypt) |
| **DevOps & Containers** | Docker, Docker Compose, Azure App Service (B1 Linux) |

---

## 📁 Project Structure

```
personal_finance/
├── backend/
│   ├── main.py                     # FastAPI application & REST routing
│   ├── models.py                   # SQLModel database schemas (User, Transaction, Budget)
│   ├── database.py                 # SQLite engine & session generators
│   ├── auth.py                     # JWT token issuing & password hashing
│   ├── crypto.py                   # AES-256 Fernet encryption layer for BYOK keys
│   ├── langchain_engine.py         # Gemini financial copilot & context agent
│   ├── plaid_integration.py        # Plaid banking connector
│   ├── gen_bank_statement.py       # Bank reconciliation simulator
│   ├── migrate_byok.py             # Database schema migration utilities
│   ├── assets/                     # Serialized production neural & statistical models
│   │   ├── arima_hybrid_base.pkl
│   │   ├── ets_hybrid_base.pkl
│   │   ├── lstm_arima_residuals.h5
│   │   ├── gru_ets_residuals.h5
│   │   ├── scaler_arima.pkl
│   │   └── scaler_ets.pkl
│   ├── requirements.txt            # Python dependencies
│   ├── requirements_cloud.txt      # Production cloud runtime dependencies
│   └── Dockerfile                  # Container buildfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main application component & routing
│   │   ├── landing_page/           # Modern public landing & simulation components
│   │   │   ├── Landing.jsx
│   │   │   └── components/         # Hero, Ensemble, Copilot, Simulator, CTA sections
│   │   ├── components/
│   │   │   ├── AIAdvisor.jsx       # Floating Gemini financial assistant
│   │   │   ├── dashboard/          # Metrics cards & trend charts
│   │   │   ├── layout/             # Sidebar, navigation header, auth guards
│   │   │   ├── transactions/       # Transaction tables, filters, CSV upload
│   │   │   └── payments/           # Currency exchange & fund transfer modals
│   │   ├── pages/
│   │   │   ├── Analytics.jsx       # Multi-horizon forecast dashboards & anomaly explorer
│   │   │   ├── Budget.jsx          # Category budget tracking
│   │   │   ├── Settings.jsx        # Profile preferences & BYOK AI configuration
│   │   │   ├── Login.jsx           # User authentication
│   │   │   └── Register.jsx        # New user registration
│   │   ├── context/                # Auth, Currency, Theme & Notification Contexts
│   │   └── services/api.js         # Axios / Fetch client configuration
│   ├── package.json
│   └── vite.config.js
│
├── monthy_expense/                 # Research & Training Pipeline
│   ├── preprocess_v2.ipynb         # Time-series feature engineering & cleaning
│   ├── arima.ipynb                 # ARIMA model training & diagnostic checks
│   ├── ets.ipynb                   # ETS model training & decomposition
│   ├── prophet.ipynb               # Facebook Prophet Bayesian additive modeling
│   ├── hybrid_models.ipynb         # Neural network residual learning (LSTM/GRU)
│   ├── master_ensemble.ipynb       # Stacking ensemble optimization
│   ├── final_comparison.ipynb      # Cross-model evaluation benchmarks
│   ├── extract_metrics.py          # Metric validation CLI script
│   └── data/processed/             # Train, test, and feature CSV datasets
│
├── docker-compose.yml              # Multi-container orchestration
├── deploy_azure.ps1                # Azure Cloud App Service automated deploy script
└── README.md                       # Documentation
```

---

## 🚀 Quickstart Guide

### Prerequisites
* **Python 3.11 or 3.12**
* **Node.js 18+ & npm**
* **Git**

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
Backend will be available at **`http://localhost:8000`** (Interactive OpenAPI docs at `http://localhost:8000/docs`).

---

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Frontend will be accessible at **`http://localhost:5173`**.

---

### 3. Docker Deployment

To launch the full production stack via Docker:

```bash
docker-compose up --build
```
The application will be served at **`http://localhost:8000`**.

---

## 🔑 AI Setup (BYOK)

This application supports seamless zero-config local operation, or enhanced AI features using your personal Gemini API key:

1. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Open the dashboard and log in to your account.
3. Navigate to **Settings** → **AI Configuration**.
4. Paste your key and click **Save Changes**.
5. Your key is immediately encrypted with AES-256 and unlocks the **AI Advisor** and **Gemini 1.5 Smart Adjustments**.

---

## 📡 API Reference

| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/register` | Create a new user account | ❌ |
| `POST` | `/token` | Authenticate user & return JWT | ❌ |
| `GET` | `/users/me` | Retrieve profile and masked BYOK settings | ✅ |
| `PUT` | `/users/me` | Update profile information or Gemini API key | ✅ |
| `GET` | `/transactions` | List user transactions with filters | ✅ |
| `POST` | `/transactions` | Record a new transaction | ✅ |
| `DELETE`| `/transactions` | Bulk clear all user transactions | ✅ |
| `POST` | `/upload-transactions` | Ingest CSV bank statement file | ✅ |
| `GET` | `/budgets` | Fetch active budget line-items | ✅ |
| `POST` | `/budgets` | Create a new budget category limit | ✅ |
| `GET` | `/stats` | Aggregate dashboard KPI metrics | ✅ |
| `GET` | `/predict-expenses` | Generate Tier 1 base ensemble prediction | ✅ |
| `GET` | `/predict-expenses-v2` | Generate Tier 3 Gemini-enhanced forecast | ✅ |
| `POST` | `/chat` | Conversational financial copilot prompt | ✅ |

---

## ☁️ Azure Deployment

Automated PowerShell deployment scripts are included for Azure App Service:

```powershell
# Deploy backend and static assets to Azure
./deploy_azure.ps1
```

Configured settings:
- **Runtime**: Python 3.11 Linux Container (`B1` Basic tier)
- **Environment**: Configured via Azure App Settings
- **Frontend**: Served directly or via Azure Static Web Apps / Azure Front Door

---

## 📄 License

This project is licensed under the **GPL-3.0 License** — see the [LICENSE](LICENSE) file for details.
