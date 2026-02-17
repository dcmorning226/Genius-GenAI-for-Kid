# 安裝指南 Installation Guide

## 環境需求 Prerequisites

| 軟體 | 版本 | 用途 |
|------|------|------|
| Python | 3.11+ | Backend 伺服器 |
| Node.js | 18+ | Parent UI + Kid UI |
| Docker Desktop | 最新版 | PostgreSQL + Redis |
| Git | 最新版 | 版本控制 |
| 現代瀏覽器 | Chrome / Edge / Safari | 操作 Kid UI 及 Parent UI |

### AI API 金鑰（至少需要一組）

| Provider | 用途 | 申請網址 |
|----------|------|----------|
| OpenAI | LLM + STT + TTS | https://platform.openai.com/api-keys |
| Anthropic | LLM（可選替代） | https://console.anthropic.com/ |
| WaveSpeed AI | 圖像生成（可選） | https://wavespeed.ai/ |

---

## 安裝步驟

### Step 1: 下載專案

```bash
git clone https://github.com/dcmorning226/Genius-GenAI-for-Kid.git
cd Genius-GenAI-for-Kid
```

或者解壓縮 release 檔案：

```bash
unzip companion-v0.1.0.zip
cd companion
```

---

### Step 2: 啟動資料庫服務

**重要：請先確認 Docker Desktop 已安裝並正在執行。**

```bash
docker compose up -d
```

驗證服務是否啟動：
```bash
docker compose ps
# 應該看到 postgres 和 redis 都是 Up 狀態
```

> **Windows 使用者注意事項：**
> - 必須先啟動 **Docker Desktop** 應用程式
> - 如果出現 `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified` 錯誤，表示 Docker Desktop 尚未啟動
> - 開啟 Docker Desktop → 等待左下角顯示 "Engine running" → 再執行 `docker compose up -d`
> - 新版 Docker 請使用 `docker compose`（無連字號），不要使用 `docker-compose`

---

### Step 3: 設定並啟動 Backend

```bash
cd apps/backend

# 1. 建立 Python 虛擬環境
python -m venv venv

# 2. 啟動虛擬環境
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 3. 安裝 Python 依賴
pip install -r requirements.txt

# 4. 建立環境設定檔
# macOS / Linux:
cp ../../.env.example .env
# Windows:
copy ..\..\.env.example .env
```

#### 編輯 `.env` 檔案

打開 `apps/backend/.env`，設定以下必要項目：

```env
# 資料庫（使用預設值即可）
DATABASE_URL=postgresql+psycopg://companion:companion_dev@localhost:5432/companion
REDIS_URL=redis://localhost:6379/0

# JWT 密鑰（請更換為隨機字串）
JWT_SECRET=your-random-secret-string-here

# API 金鑰加密密鑰（執行以下指令產生）
# python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
ENCRYPTION_KEY=your-generated-fernet-key-here

# AI API 金鑰（至少填一個）
OPENAI_API_KEY=sk-your-openai-key
# ANTHROPIC_API_KEY=sk-ant-your-key

# 可選：指定模型（預設值如下）
# OPENAI_LLM_MODEL=gpt-4o-mini
# OPENAI_TTS_MODEL=tts-1
# OPENAI_STT_MODEL=whisper-1
# ANTHROPIC_LLM_MODEL=claude-haiku-4-5-20251001
# WAVESPEED_MODEL=wavespeed-ai/z-image/turbo-lora
```

#### 產生加密密鑰

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

將輸出的字串貼到 `.env` 的 `ENCRYPTION_KEY`。

#### 執行資料庫遷移並啟動

```bash
# 建立資料庫表格
alembic upgrade head

# 啟動 Backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 驗證 Backend

- 瀏覽器開啟 http://localhost:8000/health → 應回傳 `{"status":"ok"}`
- API 文件: http://localhost:8000/docs

---

### Step 4: 設定並啟動 Parent UI

```bash
cd apps/parent-ui

# 安裝依賴
npm install

# 設定 Backend URL（可選，預設為 http://localhost:8000）
# 如需修改，複製範例檔：
# macOS / Linux:
cp .env.example .env.local
# Windows:
copy .env.example .env.local
# 然後編輯 .env.local 中的 NEXT_PUBLIC_API_URL

# 啟動開發伺服器
npm run dev
```

開啟 http://localhost:3000

#### 家長設定流程

1. 點擊 **Sign Up** 註冊帳號
2. 進入 **Children** 頁面，新增孩子（填寫名字、年齡、選角色、選語言）
3. 記下產生的 **6 位數登入碼**
4. 進入 **AI Providers** 頁面，設定 API 金鑰（如果未在 .env 中設定）
5. Dashboard 會顯示使用統計

---

### Step 5: 設定並啟動 Kid UI（兒童互動網頁）

```bash
cd apps/kid-ui

# 安裝依賴
npm install

# 啟動開發伺服器
npm start
```

啟動後，用瀏覽器打開 Kid UI 頁面（預設 http://localhost:8081）。

#### 使用方式

1. 在瀏覽器打開 Kid UI 網頁
2. 輸入家長給的 **6 位數登入碼**
3. 允許瀏覽器使用麥克風權限
4. 開始與角色對話！

---

## 常見問題 Troubleshooting

### Docker Desktop 問題

**錯誤：`open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`**

這表示 Docker Desktop 未執行：
1. 開啟 Docker Desktop 應用程式
2. 等待引擎啟動完成（左下角顯示綠色 "Engine running"）
3. 重新執行 `docker compose up -d`

**錯誤：`docker-compose: command not found`**

新版 Docker 已整合 compose 插件，請使用：
```bash
docker compose up -d    # 注意：沒有連字號
```

### 資料庫連線失敗

```bash
# 確認 Docker 服務正在執行：
docker compose ps
docker compose up -d
```

### Alembic 遷移失敗

```bash
# 確認在 apps/backend 目錄下
# 確認 .env 中的 DATABASE_URL 正確
# 確認 PostgreSQL 正在執行

alembic upgrade head
```

### Kid UI 網頁無法連線 Backend

1. 確認 Backend 已啟動（瀏覽器開 http://localhost:8000/health 測試）
2. 確認 Backend 用 `--host 0.0.0.0` 啟動（接受外部連線）
3. 若透過區域網路存取，確認防火牆沒有擋住 port 8000

### 瀏覽器麥克風權限

- 點網址列左邊的鎖頭（或資訊）圖示 → 允許麥克風權限
- Chrome: 設定 → 隱私權與安全性 → 網站設定 → 麥克風
- 注意：麥克風功能需透過 HTTPS 或 localhost 才能使用

### API 金鑰相關

- OpenAI 金鑰以 `sk-` 開頭
- Anthropic 金鑰以 `sk-ant-` 開頭
- 金鑰會加密儲存在資料庫中，不會明文顯示
- 可在 Parent Dashboard 的 Providers 頁面隨時更換

---

## 生產環境部署提示

| 項目 | 建議 |
|------|------|
| Backend | 使用 gunicorn + uvicorn workers |
| Database | 使用雲端 PostgreSQL（如 Supabase、RDS） |
| Redis | 使用雲端 Redis（如 Upstash、ElastiCache） |
| Parent UI | 部署至 Vercel |
| Kid UI | 部署為靜態網頁或 Node.js 伺服器 |
| HTTPS | 必須使用 HTTPS（尤其 WebSocket 需要 wss://） |
| .env | 使用環境變數管理服務（不要 commit .env） |
