# Satellite Fleet Operations Dashboard

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.10-22c55e)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-06B6D4?logo=tailwindcss&logoColor=white)

A professional operational fleet dashboard tracking 50 satellite assets across orbit classes, mission purposes, and operational states. The data model mirrors schemas used in genuine fleet management systems, covering mission purpose, orbital classification, lifecycle parameters, and real-time status, making this a practical reference for operational data modeling, space situational awareness tooling, and executive-level fleet reporting. Multi-dimensional filtering, a stacked mission-purpose distribution chart, and a fully sortable inventory table give analysts an immediate read on fleet health without leaving the browser.

## Screenshot

> *(Add screenshot after first run)*

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy to GitHub Pages

```bash
npm run deploy
```

Runs a production build and pushes `dist/` to the `gh-pages` branch. In your GitHub repository settings, set Pages source to the `gh-pages` branch. Your dashboard will be live at:

```
https://<your-username>.github.io/satellite-fleet-dashboard/
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Charts | Recharts 2 |
| Styling | Tailwind CSS (CDN) |
| Deploy | gh-pages |

## Project Structure

```
src/
├── types/satellite.ts          # Satellite and Filters type definitions
├── data/satellites.ts          # 50-record typed fleet dataset
├── components/
│   ├── KpiCard.tsx             # Fleet-wide metric summary cards
│   ├── FilterBar.tsx           # Country / purpose / orbit / status filters
│   ├── FleetChart.tsx          # Stacked bar chart by mission purpose
│   └── SatelliteTable.tsx      # Sortable full-fleet inventory table
└── App.tsx                     # Filter state, derived KPIs, layout
```
