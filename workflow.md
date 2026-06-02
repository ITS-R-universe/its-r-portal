# ITS-R Universe — Execution Workflow Journal
**Last Updated:** June 01, 2026 — Session 5 (Final)
**Founder:** Seengar Ali Sahab

## SESSION 5 — ITS-R Bank + ITSR Coin

### Execution (21.7 seconds — 1000X Parallel)

**Parallel threads:**
1. GitHub: its-r-bank — 15 files pushed ✅
2. GitHub: its-r-coin — 9 files pushed ✅
3. Vercel: its-r-bank project created + env vars + link ✅
4. Vercel: its-r-coin project created + env vars + link ✅
5. All 4 threads ran simultaneously

### Files Built

**its-r-bank (15 files):**
- package.json, tsconfig.json, next.config.js
- app/globals.css, app/layout.tsx
- app/page.tsx — Home: how to deposit, rules, nav
- app/wallet/page.tsx — Balance + transaction history
- app/deposit/page.tsx — Nayapay deposit form
- app/api/setup/route.ts — DB table creation
- app/api/wallet/route.ts — GET wallet
- app/api/transactions/route.ts — GET transactions
- app/api/deposit/route.ts — POST deposit request
- app/api/admin/route.ts — POST confirm deposit (admin only)
- lib/supabase.ts
- .github/workflows/deploy.yml

**its-r-coin (9 files):**
- package.json, tsconfig.json, next.config.js
- app/globals.css, app/layout.tsx
- app/page.tsx — Coin stats: supply, holders, transactions
- app/api/stats/route.ts — GET global coin stats
- lib/supabase.ts
- .github/workflows/deploy.yml

### New Supabase Tables
```sql
itsr_bank_wallets    — per-user wallet
itsr_coin_transactions — all coin movements
itsr_deposits        — Nayapay requests (pending→confirmed→credited)
itsr_coin_stats      — global: supply, holders, transactions, PKR
```

### Admin Flow (Deposit Confirmation)
1. User submits deposit at /deposit (Nayapay ref + PKR amount)
2. Record created in itsr_deposits with status='pending'
3. Founder checks pending deposits via GET /api/admin?admin_key=KEY
4. Founder confirms via POST /api/admin { deposit_id, admin_key }
5. Coins credited to user wallet automatically
6. Transaction recorded in itsr_coin_transactions

### Vercel Projects
| Project | ID | URL |
|---------|-----|-----|
| its-r-bank | prj_z56WesqkFjBlC0LLBdVqlCUxrG0k | https://its-r-bank.vercel.app |
| its-r-coin | prj_eI7LY6HBWgFsZxeZm8tx8cxBAl0t | https://its-r-coin.vercel.app |

## CUMULATIVE ERRORS LOG (All Sessions)
| Error | Cause | Fix | Session |
|-------|-------|-----|---------|
| Vercel git:none | No GitHub integration | GitHub Actions | 1 |
| 1000 limit | Supabase default | Pagination | 2 |
| Wrong Vercel link API | PATCH→POST | POST /v9/projects/{id}/link | 3 |
| Parallel SHA conflict | Same repo parallel | Per-repo sequential | 4 |
| @/lib/supabase missing | File not created | Created lib/supabase.ts | 4 |
| bcryptjs missing | Not in package.json | Added dependency | 4 |
| tsconfig no paths | @/* not configured | Added paths alias | 4 |

ITS-R Universe — In loving memory of Roshan Ali Sahab 🤲