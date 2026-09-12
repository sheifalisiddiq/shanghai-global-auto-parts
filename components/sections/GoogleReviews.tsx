"use client";

import { useRef } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { googleRating, reviews } from "@/lib/data/company";

function Stars({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="fill-brand-red text-brand-red size-4" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <div className="border-steel-light bg-white flex w-[320px] shrink-0 flex-col gap-4 border p-6 sm:w-[380px]">
      <Stars className="flex gap-0.5" />
      <p className="text-ink text-sm leading-relaxed">{review.quote}</p>
      <div className="font-ui text-steel-dark mt-auto text-xs tracking-wide uppercase">
        {review.author}
        {review.meta ? ` · ${review.meta}` : ""}
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
      duration: 40,
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
    <section className="bg-paper py-16 lg:py-24">
      <Container>
        <Reveal className="flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-ui text-brand-red mb-4 block text-xs tracking-[0.3em] uppercase">
              Customer Reviews
            </span>
            <h2 className="font-display text-ink text-4xl leading-[0.95] font-black uppercase sm:text-5xl lg:text-6xl">
              Trusted by our customers
            </h2>
          </div>

          <Link
            href={googleRating.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-ink flex items-center gap-3"
          >
            <Stars className="flex gap-0.5" />
            <span className="text-sm">
              <span className="font-bold">{googleRating.score}</span> on Google
            </span>
          </Link>
        </Reveal>

        <div className="mt-14 -mx-6 overflow-hidden px-6 sm:mx-0 sm:px-0">
          <div
            ref={trackRef}
            className={
              reducedMotion
                ? "flex flex-wrap gap-6"
                : "flex w-max gap-6"
            }
          >
            {(reducedMotion ? reviews : [...reviews, ...reviews]).map((review, i) => (
              <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <Button href={googleRating.profileUrl} variant="outline">
            Read All Reviews on Google
          </Button>
        </div>
      </Container>
    </section>
  );
}
