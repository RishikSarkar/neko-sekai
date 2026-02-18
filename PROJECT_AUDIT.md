# Project Audit: Neko Sekai

Pre-feature audit covering architecture, data storage, modularity, and deployment.

---

## 1. Data Storage

### Current State
- **Game state is stored only in `localStorage`** (key: `gameState`)
- Saved on `visibilitychange` (tab close/switch) and reset
- Data: coins, level, tasks, food, locations, cosmetics, pet name, etc.
- **Firebase (Auth + Firestore) is installed but never used** – `useFirestore` and `useFirebaseAuth` exist only in tests

### Implications of localStorage
- Device/browser specific (no cross-device sync)
- Lost if user clears site data or uses incognito
- ~5–10MB limit per origin (enough for this use case)
- No backup or recovery

### Free Deployment Storage Options

| Option | Pros | Cons | Free tier |
|--------|------|------|-----------|
| **localStorage (current)** | No backend, works anywhere | Device-only, no sync | Always free |
| **Firebase Firestore** | Cross-device sync, already in project | Needs auth, some setup | 50K reads, 20K writes/day |
| **Supabase** | Postgres, REST API | New service to add | 500MB DB, 2 projects |
| **Vercel KV** | Simple key-value | Requires Vercel Pro | Limited on free |
| **IndexedDB** | Larger than localStorage | Still device-only | Always free |

### Recommendation
- **Short term:** Keep localStorage; it’s appropriate for a single-device virtual pet.
- **If you want sync:** Use Firebase. Add a sign-in flow, and on login: load from Firestore, merge with localStorage, and sync changes. Fallback to localStorage when offline or not signed in.

---

## 2. Unused Code & Dependencies

### Unused Firebase Integration
- `useFirestore`, `useFirebaseAuth` – not used in the app
- `lib/firebase.ts` – only used by the unused hooks
- `.env.example` – Firebase vars present but not used

**Options:** Either wire Firebase into the app (sync game state) or remove Firebase and its env vars to shrink the bundle.

### Unused npm Packages
- `google-fonts` – not imported
- `js-cookie` – not imported  
- `undici` – often a transitive dep; confirm with `npm ls undici`

**Action:** Run `npm ls` and remove unused deps.

---

## 3. Component Modularity

### Pet.tsx (~825 lines)
Pet is a single large component with many responsibilities:
- Currency (coins, animations, rewards)
- Pet name editing
- Leveling and XP
- Tasks
- Locations
- Food and feeding
- Cosmetics
- Animations (frames, sequences)
- Day rollover and time
- Storage (save/load/reset)
- Layout and modals (Shop, Customize)

**Recommendation:** Split into:

1. **`useGameState`** – State + save/load/reset
2. **`useTasks`** – Tasks, completion, daily reset
3. **`useFood`** – Food selection, feeding, level rewards
4. **`useAnimations`** – Frame index, sequences, preload
5. **`constants/defaults.ts`** – DEFAULT_FOOD_ITEMS, DEFAULT_TASKS, etc.
6. **`PetHeader.tsx`** – Top bar (reset, notification, time, coins)
7. **`PetMain.tsx`** – Pet display + animation
8. **`PetSidebar.tsx`** – Pet info + tasks
9. **`PetFooter.tsx`** – Shop, feed, food carousel

Pet would mainly compose these and manage modal visibility.

---

## 4. Constants & Configuration

### Current
- Defaults live in `Pet.tsx` (DEFAULT_FOOD_ITEMS, DEFAULT_TASKS, etc.)
- Reward maps (`levelRewards`, `taskRewards`, `earnRewards`) are inline
- `generateSequence` is defined in Pet

**Recommendation:**
- Move defaults to `constants/defaults.ts`
- Move reward maps to `constants/rewards.ts`
- Move `generateSequence` to `lib/animations.ts` or `utils/`

---

## 5. Storage Abstraction

Save/load logic is embedded in Pet with direct `localStorage` access.

**Recommendation:** Add a storage abstraction:

```ts
// lib/gameStorage.ts
export type GameState = { ... };

export const gameStorage = {
  load(): GameState | null { ... },
  save(state: GameState): void { ... },
  clear(): void { ... },
};
```

Later you can add a Firebase implementation and switch based on auth.

---

## 6. Cheat Code

`cheatCode` is wired to the username display and gives 999999 coins + food.

**Recommendation:** Guard with `process.env.NODE_ENV === 'development'` or remove before release.

---

## 7. Font Duplication

- Layout: `next/font` for Nova_Mono, Nova_Square (optimized)
- `globals.css`: `@import` for Nova Mono, Nova Square, Anta, Kode Mono

**Recommendation:** Rely on `next/font` for Nova Mono and Nova Square, and only `@import` Anta and Kode Mono if they’re actually used. Check Tailwind (e.g. `font-anta`) before keeping.

---

## 8. Types

`types/index.ts` is good. Add:

- `GameState` for the persisted shape
- Stricter typing for reward objects to avoid `null`/`undefined` confusion

---

## 9. Testing

- 39 tests; snapshots exist
- Storage logic is untested (save/load, migration)

**Recommendation:** Extract storage and test it with a mock `localStorage`.

---

## 10. Free Deployment

**Hosting:** Vercel, Netlify, Cloudflare Pages – all have free tiers suitable for this app.

**Backend:** None required if you stay on localStorage.

**Firebase (optional sync):**
- Firestore: 50K reads, 20K writes/day on free tier
- Auth: free
- Hosting: optional; you can host on Vercel and use Firebase only for DB + auth

---

## Priority Summary

| Priority | Item | Effort |
|----------|------|--------|
| High | Remove or use Firebase | Medium |
| High | Remove unused deps (google-fonts, js-cookie) | Low |
| High | Remove or gate cheat code | Low |
| Medium | Extract storage into `lib/gameStorage.ts` | Low |
| Medium | Move constants to `constants/` | Low |
| Medium | Simplify fonts (no duplicate Nova) | Low |
| Low | Split Pet into hooks + components | High |
| Low | Add optional Firebase sync | High |
