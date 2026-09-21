import { createLocalAdapter } from "./adapters/local";
import type { DataAdapter } from "./repository";

/** Single swap point: replace with `createDbAdapter()` when the database exists. */
export const db: DataAdapter = createLocalAdapter();
