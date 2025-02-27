# Next.js Expense Tracker

A **simple expense tracker** built with **Next.js 15.1.7** and **Supabase**. Users can sign up, log in, create groups, add expenses, and persist data locally – **no row-level security** is used.

[![View on GitHub](https://img.shields.io/badge/View%20On-GitHub-black.svg?logo=github)](https://github.com/AhmadAffan337/group-expense-tracker)

## AI-Assisted Development

During key moments – including **bug fixing**, **decision making**, and **conflict resolution** – **AI insights** were used to streamline the development process. This helped ensure rapid prototyping, improved attention to detail, and robust solutions.

## Getting Started

1. **Clone & Install**  
   ```bash
   git clone https://github.com/AhmadAffan337/group-expense-tracker.git
   cd group-expense-tracker
   npm install
npm run dev

---

### `.env.example`

Below is a sample `.env.example` file. Copy this to `.env.local` in your project root and insert your own Supabase credentials:

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=https://muxdesgknsaialwnxnad.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eGRlc2drbnNhaWFsd254bmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MDkwNjEsImV4cCI6MjA1NjE4NTA2MX0.O2OoNlUQPhE7gYQEyJOkbvMuP86XDI1J8MZkSLaWZL4
group-expense-tracker/
├─ app/
│   ├─ page.tsx                # Home page
│   ├─ login/
│   │   └─ page.tsx            # Login page
│   ├─ signup/
│   │   └─ page.tsx            # Sign-up page
│   ├─ manage-groups/
│   │   ├─ page.tsx            # Main ManageGroupsPage (listing, creating groups, etc.)
│   │   └─ [groupId]/
│   │       └─ page.tsx        # GroupDetailsPage (details/expenses for a single group)
│   ├─ profile/
│   │   └─ page.tsx            # Protected profile page
│   └─ middleware.ts           # Middleware for auth checks (e.g., /profile)
├─ hooks/
│   ├─ useGroups.ts            # CRUD hooks for groups
│   └─ useExpenses.ts          # CRUD hooks for expenses
├─ lib/
│   └─ supabaseClient.ts       # Supabase client setup
├─ .env.example                # Example environment variables
├─ .env.local                  # Your actual environment variables (ignored by Git)
├─ package.json
├─ README.md
└─ ... (other config files like tsconfig.json, tailwind.config.js, etc.)
 This project was partly shaped by AI-driven insights for bug fixing, conflict resolution, critical decision making, and grooming complex ideas. Human oversight and testing ensured final solutions remained robust and aligned with project goals.
