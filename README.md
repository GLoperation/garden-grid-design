# 🌱 GardenGridDesign

A fully interactive garden planning application for designing food gardens with real plant spacing data, drag-and-drop placement, and an AI garden assistant.

## Features

- **130+ edible plants** with real spacing, sun, water, height, companion, and harvest data
- **Subspecies included** — 6 tomato types, 10 pepper varieties, 4 radish types, etc.
- **All bed types** — wood/metal raised beds, pots, grow bags, in-ground rows, keyhole beds, trellises
- **Custom resizable beds** — drag corner handles to resize any custom bed
- **True-to-scale grid** — 6-inch snap grid with feet/inches or metric toggle
- **Spacing conflict detection** — orange circles at 25% overlap, red beyond
- **Zoom & pan** — scroll to zoom, drag to pan, sticky rulers always visible
- **Drag-to-trash** — drag items to trash zone or press Backspace/Delete
- **AI Garden Assistant** — built-in chat for gardening questions (requires API key)
- **Notes section** — collapsible area for planting dates and reminders
- **Searchable plant library** — filter by category, search by name

## Quick Start

### Prerequisites

- **Node.js v18+** — Download from [nodejs.org](https://nodejs.org)

### Setup

**Mac / Linux:**
```bash
chmod +x setup.sh
./setup.sh
npm run dev
```

**Windows:**
```
setup.bat
npm run dev
```

**Manual setup:**
```bash
npm install
cp .env.example .env    # optional: add API key for chat
npm run dev
```

The app opens automatically at **http://localhost:3000**

### Enable AI Chat (Optional)

The garden planner works fully without this. To enable the chat assistant:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com/)
2. Edit `.env` and replace `your-api-key-here` with your key
3. Restart the dev server

## Project Structure

```
garden-app/
├── index.html          # Entry HTML
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
├── setup.sh            # Mac/Linux setup script
├── setup.bat           # Windows setup script
├── .env.example        # Environment template
├── .gitignore
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Complete application (single file)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

## How to Use

1. **Place beds** — Click the Beds tab, select a bed type, click the canvas
2. **Place plants** — Click a plant in the library, click inside a bed
3. **Move items** — Drag any placed plant or bed
4. **Resize custom beds** — Select a custom bed, drag the corner dots
5. **Delete** — Drag to trash zone (bottom-left) or select + press Backspace
6. **Zoom** — Scroll wheel on the canvas
7. **Pan** — Click and drag empty canvas area
8. **Search** — Type in the search bar to filter plants

## Tech Stack

- React 18
- Vite 5
- No additional UI libraries — pure React with inline styles
- Anthropic Claude API (optional, for chat)
