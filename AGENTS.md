# Cinema Seat Tracker - Agent Guidelines

## Commands
- **Build:** `npm run build`
- **Typecheck:** `npm run typecheck`
- **Dev Server:** `npm run dev`
- **Testing:** No test framework currently configured. When adding tests, prefer Vitest.

## Code Style & Conventions
- **Framework:** React Router 7. Use file-system routing in `app/routes`.
- **Imports:** Use `~` alias for `app/` (e.g., `~/db/schema`). Group imports: React/Router -> 3rd party -> local.
- **Components:** Functional components. Default exports for route files. Named exports for UI components.
- **Styling:** Tailwind CSS. Use `clsx` and `tailwind-merge` for class manipulation.
- **Database:** Drizzle ORM. Schema in `app/db/schema.ts`. Server-only code in `app/db`.
- **Types:** strict TypeScript. Use `Route.ComponentProps` and `Route.MetaArgs` from generated types.
- **UI:** Reusable components in `app/components/ui`. Follow shadcn/ui patterns.

## Architecture
- **Loaders/Actions:** Place data fetching (`loader`) and mutations (`action`) in the route file.
- **Error Handling:** Use React Router's error boundaries and `isRouteErrorResponse`.
