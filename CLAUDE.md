# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Red Door Blue Door is a narrative-driven web game built with Next.js 14 (App Router). Players traverse a "Pure White Corridor" making choices between red and blue doors across 10 rounds. Each door leads to either a Shelter (positive HP) or Asura (negative HP) room. The Gemini API generates story narratives based on player choices.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and set `GEMINI_API_KEY`. Optional: `GEMINI_API_BASE`, `GEMINI_MODEL`.

## Architecture

### Game State Management

Game state is managed via `useReducer` with two actions:
- `ASSIGN_ROUND`: Randomly assigns a Shelter/Asura door to red/blue (50/50 chance for either configuration)
- `PLAYER_CHOICE`: Records player's door choice and updates HP

The reusable `useGameState` hook (`src/app/hooks/useGameState.ts`) encapsulates this logic with configurable options.

### Core Types (`src/app/types/index.ts`)

- `Door`: Room data (type: Shelter/Asura, name, hp_change, env_features, etc.)
- `Round`: A pair of doors (redDoor, blueDoor)
- `GameState`: heart (HP), playerChoice array, round array

### Room Data

Room definitions are in `src/room.json` - an array of `Door` objects with Shelter and Asura types. The `draw.ts` utility randomly selects and removes rooms from the pool (mutates the array).

### Image Map System

`useImageMapDoors` hook handles clickable door regions on the background image. It calculates coordinates accounting for `object-fit: cover` scaling and cropping. Default door coordinates are calibrated for `/public/PureWhiteCorridor.png`.

### API Route

`/api/gemini` (POST) - Proxies requests to Gemini API for story generation. Expects `{ prompt: string }` body.

### Page Flow

1. Main game page (`src/app/page.tsx`): Intro animation → door selection rounds → game over
2. Results page (`src/app/results/page.tsx`): Displays final stats from sessionStorage (`rdbd:result`)

## Key Patterns

- UI components use MUI (Material-UI) with Emotion for styling
- GSAP handles intro typewriter animation
- State persistence uses sessionStorage for passing results between pages
