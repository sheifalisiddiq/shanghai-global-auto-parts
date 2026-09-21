import { notFound } from "next/navigation";

// Unknown /admin/* URLs render the admin 404 inside the dashboard shell.
export default function AdminCatchAll() {
  notFound();
}
