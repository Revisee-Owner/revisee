# StudyCmd — AI Student Command Center

An all-in-one student productivity app: tasks, notes, and AI study tools in one clean interface.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js (credentials)
- **AI**: Anthropic Claude API
- **Payments**: Stripe (placeholder ready)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your database

You need PostgreSQL running locally. Update `.env.local`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/student_command_center"
```

Then push the schema:

```bash
npm run db:push
```

### 3. Configure environment variables

Copy `.env.local` and fill in your keys:

- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` to generate
- `ANTHROPIC_API_KEY` — from console.anthropic.com (needed for AI features)
- Stripe keys — optional, needed only for billing

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login + Signup pages
│   ├── (dashboard)/     # Main app pages (tasks, notes, courses, AI tools)
│   └── api/             # API routes (tasks, notes, courses, AI, auth, billing)
├── components/
│   ├── ui/              # Button, Modal, EmptyState
│   ├── tasks/           # TaskCard, TaskForm
│   ├── notes/           # NoteCard
│   ├── dashboard/       # StatsCard
│   └── layout/          # Sidebar, Topbar
├── lib/                 # DB client, auth config, AI wrapper, utilities
├── hooks/               # useDebounce
└── styles/              # Global CSS + Tailwind
```

## Features

### MVP (Built)
- Task manager with priorities, due dates, status tracking
- Notes system with course organization
- Dashboard with stats, upcoming deadlines, quick actions
- Course management with colors and emojis
- AI study tools (summarize, quiz generator, study guide)
- Auth (signup + login)
- Freemium gating (5 AI credits/month free, unlimited on Pro)

### Post-MVP (Planned)
- TipTap rich text editor integration
- Stripe billing for Pro upgrade
- Push notifications for deadline reminders
- Email receipt import
- Family/partner sharing
- CSV/PDF export

## API Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/[...nextauth]` | Login/session |
| GET/POST | `/api/tasks` | List/create tasks |
| PATCH/DELETE | `/api/tasks/[id]` | Update/delete task |
| GET/POST | `/api/notes` | List/create notes |
| GET/PATCH/DELETE | `/api/notes/[id]` | Read/update/delete note |
| GET/POST | `/api/courses` | List/create courses |
| POST | `/api/ai/summarize` | AI summarize |
| POST | `/api/ai/quiz` | AI quiz generator |
| POST | `/api/ai/study-guide` | AI study guide |
| POST | `/api/billing` | Stripe checkout (placeholder) |

## Monetization

- **Free**: Up to 10 subscriptions, 5 AI credits/month
- **Pro ($4–8/mo)**: Unlimited tasks, notes, AI credits, export, analytics

## Deploy

Works out of the box on Vercel:

```bash
npx vercel
```

Set environment variables in Vercel dashboard, then deploy.

## License

MIT
