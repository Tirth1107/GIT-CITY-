# Contributing to Git City

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/srizzon/git-city.git
cd git-city
npm install
cp .env.example .env.local
# Fill in your keys (see .env.example for details)
npm run dev
```

The app runs on [http://localhost:3001](http://localhost:3001).

## Requirements

- Node.js 18+
- A Supabase project (free tier works)
- A GitHub personal access token (for API calls)
- Stripe test keys (only if working on payments)

## Code Style

- TypeScript everywhere
- Tailwind CSS v4 for styling
- Pixel font (Silkscreen) for UI text
- React Three Fiber (R3F) + drei for 3D
- App Router (Next.js 16)

Run `npm run lint` before submitting.

## Making Changes

1. Fork the repo
2. Create a branch from `main` (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run `npm run lint` and fix any issues
5. Commit with a clear message (e.g. `feat: add rain weather effect`)
6. Open a Pull Request against `main`

## Commit Messages

Start with an emoji + type. Single line, present tense, concise.

| Emoji | Type | When |
|-------|------|------|
| ✨ | `feat` | New features |
| 🐛 | `fix` | Bug fixes |
| 📦 | `refactor` | Code restructuring |
| ✏️ | `docs` | Documentation |
| 💄 | `style` | Formatting, renaming |
| 🚀 | `perf` | Performance |
| 🚧 | `chore` | Maintenance |
| 🧪 | `test` | Tests |
| 🌐 | `i18n` | Internationalization |
| 📈 | `analytics` | Analytics |
| 🗃️ | `database` | Database changes |
| 🔧 | `ci` | CI/CD |
| 🏗️ | `build` | Build changes |
| ⏪️ | `revert` | Reverting commits |

**Examples:**

```
✨ feat(popover): add popover component
🐛 fix(command): resolve input focus issue
📦 refactor(command): improve component structure
🚧 chore: update dependencies
```

## Good First Issues

Look for issues labeled [`good first issue`](https://github.com/srizzon/git-city/labels/good%20first%20issue). These are scoped tasks that don't require deep knowledge of the codebase.

## Project Structure

```
src/
  app/          # Next.js App Router pages and API routes
  components/   # React components (UI + 3D)
  lib/          # Utilities, Supabase clients, helpers
  types/        # TypeScript types
public/         # Static assets (audio, images)
supabase/       # Database migrations
```

## 3D / Three.js

The city is rendered with React Three Fiber. Key files:

- `src/components/CityScene.tsx` - Main 3D scene
- `src/components/Building.tsx` - Individual building rendering
- `src/lib/zones.ts` - Item definitions for building customization

If you're adding a new building effect or item, start with `zones.ts`.

## Questions?

Open an issue or reach out on [X/Twitter](https://x.com/samuelrizzondev).
