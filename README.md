# 🐻 Companion — 多語言語音互動 GenAI 角色陪伴式教材平台

> Multilingual Voice-Interactive GenAI Character Companion for Children (Ages 4–6)
> Parent-in-the-loop educational platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 概覽 Overview

Companion 是一個為 4–6 歲兒童設計的 AI 角色陪伴式語音互動學習平台。孩子可以與可愛的卡通動物角色（小熊、小兔、小貓）進行語音對話，角色會即時回應並搭配嘴巴動畫與情緒表達。家長透過獨立的管理介面掌控所有設定、審核內容、追蹤使用狀況與費用。

### 核心特色

- 🎤 **語音互動** — 孩子按住說話，角色即時語音回覆（STT → LLM → TTS 全流程）
- 🐻 **角色動畫** — SVG 手繪風格卡通動物，音量驅動嘴巴開合（Lip-sync），情緒表情切換
- 🌍 **多語言** — 支援中文、英文、西班牙文，一鍵切換語言
- 👨‍👩‍👧 **家長控制** — 獨立 Parent Dashboard，設定教學目標、API 金鑰、每日額度
- 🔒 **兒童安全** — 年齡分級、有害內容過濾、個資保護、敏感話題溫柔轉向
- 🤖 **可插拔 AI** — 支援 OpenAI / Anthropic / Ollama (LLM)、Whisper (STT)、OpenAI TTS、WaveSpeed AI (圖像)
- 💰 **費用追蹤** — 每次對話追蹤 token 用量與費用，日報表匯總

---

## 系統架構

```
┌─────────────────┐     ┌─────────────────┐
│   Kid UI         │     │   Parent UI      │
│   React Native   │     │   Next.js 14     │
│   (Expo)         │     │   (Web)          │
└────────┬────────┘     └────────┬────────┘
         │ WebSocket              │ REST API
         │                        │
         └────────┬───────────────┘
                  │
         ┌────────▼────────┐
         │    Backend       │
         │    FastAPI        │
         │    (Python)       │
         ├──────────────────┤
         │  Providers       │
         │  ┌─────┐ ┌─────┐│
         │  │ LLM │ │ STT ││
         │  └─────┘ └─────┘│
         │  ┌─────┐ ┌─────┐│
         │  │ TTS │ │Image││
         │  └─────┘ └─────┘│
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  PostgreSQL      │
         │  Redis           │
         └─────────────────┘
```

---

## 技術棧

| 層級 | 技術 | 說明 |
|------|------|------|
| Kid UI | React Native (Expo) | 手機端兒童互動介面 |
| Parent UI | Next.js 14 + Tailwind CSS | 網頁端家長管理面板 |
| Backend | Python FastAPI | 非同步 API + WebSocket 語音串流 |
| Database | PostgreSQL 16 | 使用者、對話、設定 |
| Cache | Redis 7 | Session 狀態、Rate Limiting |
| LLM | OpenAI / Anthropic | GPT-4o-mini、Claude Haiku 等 |
| STT | OpenAI Whisper | 語音轉文字 |
| TTS | OpenAI TTS | 文字轉語音（語速 0.9 適合兒童） |
| Image | WaveSpeed AI | turbo-lora 角色一致性圖像生成 |

---

## 快速開始

### 前置需求

- **Python** 3.11+
- **Node.js** 18+
- **Docker & Docker Compose**（用於 PostgreSQL + Redis）
- 至少一組 AI API 金鑰（OpenAI 或 Anthropic）

### 1. 複製專案

```bash
git clone https://github.com/dcmorning226/Genius-GenAI-for-Kid.git
cd Genius-GenAI-for-Kid
```

### 2. 啟動資料庫

```bash
docker compose up -d
```

這會啟動：
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### 3. 設定 Backend

```bash
cd apps/backend

# 建立虛擬環境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安裝依賴
pip install -r requirements.txt

# 建立 .env 檔（從範例複製）
# macOS / Linux:
cp ../../.env.example .env
# Windows:
copy ..\..\.env.example .env

# 編輯 .env，設定必要項目：
# - JWT_SECRET（隨機字串）
# - ENCRYPTION_KEY（執行以下指令產生）：
#   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
# - OPENAI_API_KEY 或 ANTHROPIC_API_KEY（至少填一個）

# 執行資料庫遷移
alembic upgrade head

# 啟動 Backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend 啟動後可訪問：
- API 文件: http://localhost:8000/docs
- Health: http://localhost:8000/health

### 4. 啟動 Parent UI

```bash
cd apps/parent-ui

npm install
npm run dev
```

開啟 http://localhost:3000，註冊家長帳號，新增孩子。

### 5. 啟動 Kid UI

```bash
cd apps/kid-ui

npm install

# 建立環境設定檔並設定你的區域網路 IP
# macOS / Linux: cp .env.example .env
# Windows: copy .env.example .env
# 編輯 .env，將 EXPO_PUBLIC_API_HOST 設為你的電腦 IP

npm start
```

- 使用 Expo Go App 掃描 QR Code
- 輸入家長在 Dashboard 取得的 6 位數登入碼
- **重要**: 編輯 `apps/kid-ui/.env` 中的 `EXPO_PUBLIC_API_HOST` 為你的電腦區域網路 IP

---

## 專案結構

```
companion/
├── apps/
│   ├── backend/                 # Python FastAPI 後端
│   │   ├── app/
│   │   │   ├── api/             # REST + WebSocket 端點
│   │   │   │   ├── parent/      # 家長 API（auth, children, providers, usage, conversations）
│   │   │   │   ├── kid/         # 兒童 API（auth, character）
│   │   │   │   └── ws/          # WebSocket 語音串流
│   │   │   ├── auth/            # JWT 驗證 + API 金鑰加密
│   │   │   ├── models/          # SQLAlchemy 資料模型
│   │   │   ├── providers/       # 可插拔 AI Provider
│   │   │   │   ├── base.py      # 抽象介面
│   │   │   │   ├── llm/         # OpenAI / Anthropic
│   │   │   │   ├── stt/         # Whisper
│   │   │   │   ├── tts/         # OpenAI TTS
│   │   │   │   └── image/       # WaveSpeed AI
│   │   │   ├── services/        # 核心業務邏輯
│   │   │   │   ├── conversation.py  # 語音對話管線
│   │   │   │   ├── safety.py    # 兒童安全過濾
│   │   │   │   ├── emotion.py   # 情緒偵測
│   │   │   │   └── cost.py      # 費用追蹤
│   │   │   └── prompts/         # 角色人格 System Prompt
│   │   ├── alembic/             # 資料庫遷移
│   │   └── requirements.txt
│   │
│   ├── kid-ui/                  # React Native (Expo) 兒童 App
│   │   ├── app/                 # 畫面（登入、對話）
│   │   ├── components/          # Character（SVG 動畫）、MicButton、RoundControls
│   │   ├── hooks/               # useVoiceSession（WebSocket + 錄音 + 播放）
│   │   └── services/            # API 客戶端、音訊管理
│   │
│   └── parent-ui/               # Next.js 家長管理面板
│       └── src/
│           ├── app/             # 頁面（auth, dashboard, children, providers, conversations, settings）
│           ├── components/      # Sidebar
│           └── lib/             # API 客戶端、Auth Context
│
├── docker-compose.yml           # PostgreSQL + Redis
├── .env.example                 # 環境變數範本
└── README.md
```

---

## API 端點

### Parent API (`/api/parent/`)

| Method | Path | 說明 |
|--------|------|------|
| POST | `/auth/register` | 家長註冊 |
| POST | `/auth/login` | 家長登入 |
| GET | `/auth/me` | 取得個人資料 |
| POST | `/children` | 新增孩子 |
| GET | `/children` | 列出孩子 |
| PUT | `/children/{id}` | 更新孩子資料 |
| GET | `/providers` | 列出 Provider 設定 |
| POST | `/providers` | 新增/更新 Provider |
| GET | `/usage/daily` | 每日使用統計 |
| GET | `/usage/summary` | 使用摘要 |
| GET | `/conversations` | 對話列表 |
| GET | `/conversations/{id}` | 對話詳情（含逐字稿） |

### Kid API (`/api/kid/`)

| Method | Path | 說明 |
|--------|------|------|
| POST | `/auth/login` | 孩子用 6 位碼登入 |
| GET | `/character/{child_id}` | 取得角色設定 |
| WebSocket | `/ws/voice/{child_id}` | 即時語音互動 |

---

## WebSocket 語音協議

```
客戶端 → 伺服器:
  { "type": "audio_start" }
  { "type": "audio_chunk", "data": "<base64>" }
  { "type": "audio_end" }
  { "type": "command", "action": "repeat|slower|switch_language", "value": "en" }

伺服器 → 客戶端:
  { "type": "session_started", "conversation_id": "..." }
  { "type": "processing", "stage": "listening|thinking|speaking" }
  { "type": "response_start", "emotion": "happy", "child_emotion": "curious" }
  { "type": "audio_chunk", "data": "<base64>", "format": "mp3" }
  { "type": "audio_end", "transcript": "..." }
```

---

## 兒童安全機制

| 機制 | 說明 |
|------|------|
| 詞彙過濾 | 暴力、毒品、性、自殘、仇恨等關鍵字即時攔截 |
| 個資保護 | 偵測並阻止引導孩子說出地址、電話、學校等個資 |
| 溫柔轉向 | 觸發安全話題時，角色像幼兒老師般溫柔轉移話題 |
| System Prompt | 角色人格內建不可違反的安全規則 |
| 輸出過濾 | LLM 回覆再經一層關鍵字清洗後才發送給孩子 |
| 家長通知 | 敏感話題記錄於對話紀錄，家長可在 Dashboard 審閱 |

---

## 角色

| 角色 | ID | 中文名 | 英文名 | 性格 |
|------|----|--------|--------|------|
| 🐻 | bear | 小熊貝貝 | Bobby Bear | 溫暖、溫柔、耐心、有點傻、愛蜂蜜和故事 |
| 🐰 | rabbit | 小兔跳跳 | Hoppy Rabbit | 活力、好奇、勇敢、愛胡蘿蔔和冒險 |
| 🐱 | cat | 小貓咪咪 | Mimi Cat | 聰明、愛玩、有點懶、愛睡覺和音樂 |

---

## 開發

```bash
# Backend（含 hot reload）
cd apps/backend
uvicorn app.main:app --reload --port 8000

# Parent UI
cd apps/parent-ui
npm run dev

# Kid UI
cd apps/kid-ui
npm start
```

---

## 授權

MIT License
