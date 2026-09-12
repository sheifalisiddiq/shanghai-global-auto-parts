"use client";

import { useRef } from "react";
import Link from "next/link";
import { Star, CheckCircle2, ArrowUpRight, Quote } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { googleRating, reviews } from "@/lib/data/company";

function GoogleIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function GoogleStars({ className = "flex gap-1" }: { className?: string }) {
  return (
    <div className={className} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-4 fill-[#FBBC05] text-[#FBBC05]"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  const initials = getInitials(review.author);

  return (
    <div className="group relative flex w-[320px] sm:w-[380px] shrink-0 flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md shadow-slate-100/80 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-xl hover:shadow-brand-red/5">
      {/* Top Subtle Red Accent Line */}
      <div className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-transparent transition-colors group-hover:bg-brand-red" />

      {/* Background Decorative Quote Mark */}
      <div className="pointer-events-none absolute right-5 top-5 text-slate-100 transition-colors group-hover:text-red-50/70">
        <Quote className="size-12 stroke-[1.5]" />
      </div>

      <div>
        {/* Review Card Header: Author Info + Google G */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar Circle with Initials */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-950 font-bold text-white text-xs shadow-inner">
              {initials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="truncate font-bold text-ink text-sm sm:text-base">
                  {review.author}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                {review.meta ? (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
                    {review.meta}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    Verified Customer
                  </span>
                )}
                <span>&bull;</span>
                <span>UAE Review</span>
              </div>
            </div>
          </div>

          <GoogleIcon className="size-5 shrink-0" />
        </div>

        {/* Stars */}
        <div className="relative z-10 mt-4 flex items-center gap-2">
          <GoogleStars />
          <span className="text-xs font-bold text-slate-700">5.0</span>
        </div>

        {/* Quote Content */}
        <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-600 group-hover:text-ink transition-colors">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>

      {/* Card Footer: Verified on Google Maps */}
      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1 font-medium">
          <span>Posted on Google Maps</span>
        </span>
        <span className="font-semibold text-brand-red opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
          Verified <ArrowUpRight className="size-3" />
        </span>
      </div>
    </div>
  );
}

export function GoogleReviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !trackRef.current) return;

    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 38,
      ease: "none",
      repeat: -1,
    });

    const node = trackRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.play();
    node.addEventListener("mouseenter", pause);
    node.addEventListener("mouseleave", resume);

    return () => {
      node.removeEventListener("mouseenter", pause);
      node.removeEventListener("mouseleave", resume);
      tween.kill();
    };
  }, [reducedMotion]);

  return (
    <section className="bg-paper pt-2 sm:pt-4 pb-12 sm:pb-16 border-b border-slate-200/60 overflow-hidden">
      <Container>
        {/* Section Header: Google Credibility Banner */}
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
              <GoogleIcon className="size-3.5" />
              <span>Google Verified Reviews</span>
            </div>

            <h2 className="font-display text-ink text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Trusted by Automotive Professionals
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
              See what workshops, parts dealers, and vehicle owners across the UAE &amp; Qatar say about our genuine Chinese parts and fast fulfillment.
            </p>
          </div>

          {/* Rating Badge */}
          <Link
            href={googleRating.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-brand-red/30 hover:shadow-md shrink-0"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
              <GoogleIcon className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-ink text-lg leading-none">
                  {googleRating.score}
                </span>
                <GoogleStars className="flex gap-0.5" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider group-hover:text-brand-red transition-colors flex items-center gap-1 mt-0.5">
                <span>View Google Profile</span>
                <ArrowUpRight className="size-3 text-brand-red" />
              </p>
            </div>
          </Link>
        </Reveal>

        {/* Reviews Carousel Track */}
        <div className="mt-8 -mx-6 overflow-hidden px-6 sm:mx-0 sm:px-0">
          <div
            ref={trackRef}
            className={
              reducedMotion
                ? "flex flex-wrap gap-6"
                : "flex w-max gap-6 py-2"
            }
          >
            {(reducedMotion ? reviews : [...reviews, ...reviews]).map((review, i) => (
              <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>Over 4.8-star average rating from workshops, mechanics &amp; car owners across the GCC</span>
          </div>

          <Link
            href={googleRating.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-red hover:underline"
          >
            <span>Read all reviews on Google Maps</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
