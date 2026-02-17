# Genius GenAI for Kid

為 4-6 歲兒童設計的 AI 語音互動角色陪伴平台。孩子與卡通角色（小熊/小兔/小貓）語音對話，家長透過網頁管理一切。

---

## 你需要先準備什麼

| 項目 | 去哪裡取得 |
|------|-----------|
| Docker Desktop | https://www.docker.com/products/docker-desktop/ |
| Python 3.11 以上 | https://www.python.org/downloads/ |
| Node.js 18 以上 | https://nodejs.org/ |
| OpenAI API Key | https://platform.openai.com/api-keys |

> OpenAI Key 是必要的（負責語音辨識 + AI 對話 + 語音合成）。Anthropic 和 WaveSpeed 為選配。

---

## 安裝與啟動（共 4 步）

### Step 1：下載專案 + 啟動資料庫

```bash
git clone https://github.com/dcmorning226/Genius-GenAI-for-Kid.git
cd Genius-GenAI-for-Kid
```

開啟 **Docker Desktop**（等左下角變綠色），然後：

```bash
docker compose up -d
```

> 這會在背景啟動 PostgreSQL 和 Redis。

---

### Step 2：啟動 Backend（Python 伺服器）

開一個終端機（命令提示字元 / Terminal），執行：

**Mac / Linux：**
```bash
cd apps/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../../.env.example .env
```

**Windows：**
```cmd
cd apps\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy ..\..\.env.example .env
```

#### 編輯 .env 檔（3 個必填項目）

用記事本或 VS Code 打開 `apps/backend/.env`，修改以下三項：

```
JWT_SECRET=隨便打一串亂碼當密鑰
ENCRYPTION_KEY=（用下面指令產生）
OPENAI_API_KEY=sk-你的OpenAI金鑰
```

產生 ENCRYPTION_KEY 的方法（在已啟動 venv 的終端機裡執行）：

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

把輸出的那串文字貼到 `.env` 的 `ENCRYPTION_KEY=` 後面。

#### 建立資料庫並啟動

```bash
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

看到 `Uvicorn running on http://0.0.0.0:8000` 就成功了。

**驗證方式：** 瀏覽器打開 http://localhost:8000/health ，看到 `{"status":"ok"}` 表示正常。

> 注意：瀏覽器要用 `localhost:8000`，不是 `0.0.0.0:8000`。

---

### Step 3：啟動 Parent UI（家長管理網頁）

**另開一個終端機**，執行：

```bash
cd apps/parent-ui
npm install
npm run dev
```

瀏覽器打開 http://localhost:3000

#### 家長操作流程

1. 點 **Sign Up** 註冊帳號
2. 進 **Children** 頁面 → 新增孩子（填名字、年齡、選角色、選語言）
3. 記下產生的 **6 位數登入碼**（孩子用這個登入）
4. 進 **AI Providers** 頁面 → 設定 API 金鑰（如果 .env 沒填的話）

---

### Step 4：啟動 Kid UI（兒童 App）

**再開一個終端機**，執行：

**Mac / Linux：**
```bash
cd apps/kid-ui
npm install
cp .env.example .env
npm start
```

**Windows：**
```cmd
cd apps\kid-ui
npm install
copy .env.example .env
npm start
```

#### 設定手機連線 IP

編輯 `apps/kid-ui/.env`，把 `EXPO_PUBLIC_API_HOST` 改成你電腦的 IP：

```
EXPO_PUBLIC_API_HOST=192.168.x.x
```

查 IP 的方法：
- **Windows：** 開命令提示字元，輸入 `ipconfig`，找 `IPv4 位址`
- **Mac：** 終端機輸入 `ifconfig | grep "inet " | grep -v 127`

#### 手機操作

1. 手機下載 **Expo Go** App（App Store / Google Play）
2. 手機和電腦連同一個 WiFi
3. 用 Expo Go 掃描終端機上的 QR Code
4. 輸入 Step 3 得到的 **6 位數登入碼**
5. 開始跟角色說話！

---

## 常見問題

| 問題 | 解決方法 |
|------|---------|
| Docker 報錯 `cannot find the file specified` | Docker Desktop 還沒開，開了之後等左下角變綠色再試 |
| `docker-compose` 找不到指令 | 用 `docker compose`（中間是空格，不是連字號） |
| `pip install` 時編譯失敗 | 已改用 psycopg，重新 `git pull` 再裝即可 |
| 瀏覽器打 `0.0.0.0:8000` 打不開 | 改用 `localhost:8000` |
| 手機 App 連不到 Backend | 1. 確認 .env 的 IP 正確 2. 同一個 WiFi 3. 防火牆開 8000 port |
| 手機沒有麥克風權限 | iOS：設定→隱私→麥克風→Expo Go。Android：設定→應用→Expo Go→權限 |

---

## 專案概覽

```
Genius-GenAI-for-Kid/
├── apps/
│   ├── backend/        ← Python FastAPI（AI 語音管線 + API）
│   ├── kid-ui/         ← React Native Expo（兒童 App）
│   └── parent-ui/      ← Next.js（家長管理網頁）
├── docker-compose.yml  ← 一鍵啟動 PostgreSQL + Redis
├── .env.example        ← 環境變數範本
└── README.md
```

### 角色

| 角色 | 名字 | 性格 |
|------|------|------|
| 小熊 | 貝貝 Bobby Bear | 溫暖耐心，愛說故事 |
| 小兔 | 跳跳 Hoppy Rabbit | 活潑好奇，愛冒險 |
| 小貓 | 咪咪 Mimi Cat | 聰明慵懶，愛音樂 |

### 安全機制

- 有害內容即時攔截（暴力、毒品、性等關鍵字）
- 個資保護（阻止引導孩子說出地址、電話）
- 敏感話題溫柔轉移（角色像幼兒老師般引導）
- 所有對話記錄在家長 Dashboard 可查

---

## 開發者文件

詳細的 API 端點、WebSocket 協議、技術架構等開發者資訊請參考 [INSTALL.md](INSTALL.md)。

---

## 授權

MIT License
