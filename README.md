# Simple Todo

A minimal React + TypeScript todo app (add, toggle, delete) with educational comments.
State lives only in memory, so refreshing the page reloads `public/todos.json`.

```bash
npm install
npm run dev
```

| File | What to look at |
| --- | --- |
| `src/App.tsx` | `useState`, `useEffect` + `fetch`, immutable updates, controlled input, list keys |
| `src/TodoItem.tsx` | Props and callbacks ("data down, events up") |
| `src/types.ts` | The `Todo` interface |
