# Connecting a database later

Every admin screen talks to a `DataAdapter` (`../repository.ts`) through the hooks in `../hooks.ts`.
Nothing else knows where data lives.

Today `local.ts` keeps everything in the browser (localStorage) and is seeded from the real
website data (`../seed`). To connect a database:

1. Create `adapters/db.ts` exporting `createDbAdapter(): DataAdapter`.
   - `load()`: fetch initial data into an in-memory cache (or lazily per collection).
   - `collection()` / `singleton()`: return the cached snapshot (keep it referentially stable until data changes) and `emit()` to subscribers after each change.
   - Mutations (`create`, `update`, `trash`, ...): call a route handler / server action, verify permissions on the server with `can()` from `lib/admin/access`, write the audit row server-side, then update the cache.
2. In `../index.ts` swap `createLocalAdapter()` for `createDbAdapter()`.
3. Replace `lib/admin/auth/demo.ts` with a real provider (signed HTTP-only session cookie carrying the role) and keep calling `can()` / `canAccessPath()`.
4. Have the public site read the same data through a server content layer and call `revalidateTag` on publish (see the plan, section 11).

Screens, editors and dashboards do not change.
