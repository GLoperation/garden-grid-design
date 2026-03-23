# 🌱 GardenGridDesign — Deployment Guide

A fully interactive garden planning app. This package is ready to deploy to **Vercel for free**.

---

## 🚀 Deploy to Vercel (5 minutes, free)

### What you need
- A **GitHub account** (free) → [github.com](https://github.com)
- A **Vercel account** (free) → [vercel.com](https://vercel.com) (sign in with GitHub)
- An **Anthropic API key** (optional, for the chat assistant) → [console.anthropic.com](https://console.anthropic.com)

### Step 1 — Push to GitHub

1. Go to [github.com/new](https://github.com/new) and create a new repository
   - Name it `garden-grid-design` (or whatever you like)
   - Set it to **Public** or **Private** (both work)
   - Do NOT initialize with README (you already have one)
   - Click **Create repository**

2. Open a terminal in this project folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/garden-grid-design.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your `garden-grid-design` repository
3. Vercel auto-detects it as a Vite project — leave defaults
4. Click **Deploy**
5. Wait ~60 seconds — your site is now live! 🎉

You'll get a URL like: `garden-grid-design.vercel.app`

### Step 3 — Add the Chat API Key (optional)

The garden planner works fully without this. The AI chat assistant needs an API key:

1. In your Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** your API key from [console.anthropic.com](https://console.anthropic.com)
   - **Environment:** Production, Preview, Development (check all)
4. Click **Save**
5. Go to **Deployments** → click the **⋮** menu on the latest → **Redeploy**

The chat assistant is now live and your API key is completely hidden from users.

### Step 4 — Custom Domain (optional)

1. In Vercel, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `gardengriddesign.com`)
3. Follow the DNS instructions Vercel gives you
4. SSL is automatic and free

---

## 📁 Project Structure

```
garden-deploy/
├── api/
│   └── chat.js          ← Vercel serverless function (hides API key)
├── src/
│   ├── App.jsx          ← Complete garden app
│   └── main.jsx         ← React entry point
├── public/              ← Static assets
├── index.html           ← Entry HTML
├── package.json         ← Dependencies
├── vite.config.js       ← Vite config
├── vercel.json          ← Vercel config
└── .gitignore
```

---

## 💰 Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel hosting** | **Free** | Hobby plan: unlimited sites, 100GB bandwidth/mo |
| **GitHub repo** | **Free** | Public or private |
| **Custom domain** | ~$10/yr | Optional. From Namecheap, Cloudflare, etc. |
| **Anthropic API** | ~$0-3/mo | Optional (chat only). Pay-per-use. Most hobby usage is pennies |
| **SSL certificate** | **Free** | Auto via Vercel |

**Total: $0/month** (or ~$10/year with a custom domain)

---

## 🔄 Updating the Site

After making changes locally:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel auto-deploys within ~30 seconds. Zero downtime.

---

## 🧪 Running Locally for Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

Note: The chat won't work locally unless you create a `.env` file:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
And run a small local API proxy (or just test without chat).

---

## 🔒 Security Notes

- Your Anthropic API key is stored as a **server-side environment variable** on Vercel
- It is **never sent to the browser** — the serverless function (`/api/chat.js`) makes the API call
- Users interact with `/api/chat` which proxies to Anthropic
- No user data is stored — everything stays in the browser
- Save files are downloaded as local `.json` files the user keeps

---

## Alternative Free Hosts

If you don't want Vercel, these also work:

| Host | Chat Support | Setup Difficulty |
|------|-------------|-----------------|
| **Vercel** ⭐ | ✅ serverless functions | Easy |
| **Netlify** | ✅ serverless functions | Easy |
| **Cloudflare Pages** | ✅ via Workers | Medium |
| **GitHub Pages** | ❌ no backend | Easy (no chat) |
| **Render** | ✅ free tier | Medium |

For Netlify: rename `api/chat.js` to `netlify/functions/chat.js` and adjust the fetch URL.
