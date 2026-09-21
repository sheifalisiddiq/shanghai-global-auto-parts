import { demoAuthProvider } from "./demo";
import type { AuthProvider } from "./types";

// Swap this export for the real provider when authentication is built.
export const authProvider: AuthProvider = demoAuthProvider;
