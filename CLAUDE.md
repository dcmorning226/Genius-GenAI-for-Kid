# Genius-GenAI-for-Kid

Multilingual Voice-Interactive GenAI Character Companion for Children (Ages 4-6)

## Project Structure

- `apps/backend/` - Python FastAPI backend
- `apps/kid-ui/` - React Native (Expo) kid interface
- `apps/parent-ui/` - Next.js parent dashboard

## Development

```bash
# Database
docker compose up -d

# Backend
cd apps/backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000

# Parent UI
cd apps/parent-ui && npm install && npm run dev

# Kid UI
cd apps/kid-ui && npm install && npm start
```
