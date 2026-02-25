# Ketryx Sales Rapidfyre

Quick talking points for sales: **Hotkeys** (AI?, Agent?, Docs) and **Ask Claude** for freeform questions. The backend keeps your Claude API key off the client.

## Setup

1. **Install dependencies** (from project root)
   ```bash
   npm install
   ```

2. **Configure API key**
   - Copy the example env file: `cp .env.example .env`
   - Edit `.env` and set your Anthropic API key: `CLAUDE_API_KEY=your_key_here`  
   - Do not commit `.env`.

## Run

- **Frontend + backend together (recommended)**  
  ```bash
  npm run dev:all
  ```
  - Vite: http://localhost:5173  
  - API: http://localhost:8787  

- **Frontend only**  
  ```bash
  npm run dev
  ```
  (Ask Claude will fail without the backend.)

- **Backend only**  
  ```bash
  npm run dev:server
  ```

## Build

```bash
npm run build
npm run preview
```
