import { notFound } from "next/navigation";

// With multiple root layouts there is no top-level layout to render a global 404,
// so unmatched URLs are routed here and render the public site's not-found page.
export default function CatchAll() {
  notFound();
}
