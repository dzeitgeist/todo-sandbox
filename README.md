# todo-sandbox

A deliberately small Next.js todo app used as a test repo for testing. Todos live in `localStorage`; there is no backend.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm test                          # unit tests (vitest)
python scripts/seed_todos.py 10   # prints a console snippet that loads 10 sample todos
```

## Priorities

Each todo is low, normal or high priority. The list shows high-priority todos first, and the **High** filter shows only unfinished high-priority ones. Todos saved before priorities existed load as normal.

## Layout

- `src/lib/todos.ts` — `Todo` and `Priority` types, storage, filter and sort helpers
- `src/lib/TodoStore.ts` — add, toggle, remove and clear, without mutating
- `src/lib/todos.test.ts` — tests for the helpers and the store
- `scripts/seed_todos.py` — sample data for the browser
- `src/components/TodoApp.tsx` — state and the main UI
- `src/components/TodoItem.tsx` — a single row
- `src/app/page.tsx` — the page
