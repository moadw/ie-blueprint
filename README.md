# ie

Inner Explorer web app — React Router v7 (framework mode, SSR), Tailwind v4, `graphql-request` + `graphql-codegen` (client-preset), and a typed `fetch` REST helper.

## Setup

```bash
npm install
cp .env.example .env
```

## Commands

- `npm run dev` — start the dev server (HMR)
- `npm run build` — production build
- `npm run start` — serve the built app
- `npm run typecheck` — strict TypeScript check
- `npm run codegen` — generate GraphQL types into `app/gql/`

## Reference

See `thoughts/shared/research/2026-05-04-ie-scaffolding.md` for the scaffolding decisions behind this project.
