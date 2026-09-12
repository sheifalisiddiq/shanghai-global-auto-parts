"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";
import { primaryNav } from "@/lib/data/nav";
import { cn } from "@/lib/utils/cn";

export function Header() {
  // Must start false on both server and first client render — reading window
  // synchronously here would diverge from the server's markup and break hydration.
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [trackedPathname, setTrackedPathname] = useState<string | null>(null);
  const pathname = usePathname();

  if (pathname !== trackedPathname) {
    setTrackedPathname(pathname);
    if (trackedPathname !== null) setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "border-steel-light/60 sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-[padding,box-shadow] duration-300",
          compact ? "py-2 shadow-sm" : "py-4",
        )}
      >
        <Container className="flex items-center justify-between">
          <Link href="/" aria-label="Shanghai Global Auto Parts — Home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-ui text-sm tracking-wide uppercase transition-colors",
                  pathname === link.href ? "text-brand-red" : "text-ink hover:text-brand-red",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="/products#enquire" className="px-5 py-3 text-xs">
              Enquire Now
            </Button>
          </div>

          <button
            type="button"
            className="p-2 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </Container>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
