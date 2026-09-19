"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { blogPosts } from "@/lib/data/blogs";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// blogPosts is ordered newest first.
const latestPosts = blogPosts.slice(0, 3);

export function BlogHighlights() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper py-20 lg:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t("home.blog.eyebrow", "Insights")}
            title={t("home.blog.title", "Latest From Our Blog")}
            description={t(
              "home.blog.copy",
              "Practical guides on fitment, sourcing and maintenance for Chinese vehicles.",
            )}
          />
          <Button href="/blogs" variant="outline" className="shrink-0">
            {t("home.blog.viewAll", "View All Articles")}
          </Button>
        </div>

        <RevealGroup
          className="mt-12 grid gap-8 md:grid-cols-3"
          itemSelector=":scope > article"
        >
          {latestPosts.map((post) => (
            <article key={post.slug} className="group flex flex-col bg-white">
              <Link
                href={`/blogs/${post.slug}`}
                className="flex h-full flex-col"
              >
                <div className="bg-steel-light relative aspect-16/10 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-ui text-brand-red text-xs tracking-[0.2em] uppercase">
                    {post.category}
                  </span>
                  <h3 className="font-display text-ink mt-3 text-xl leading-tight font-bold">
                    {post.title}
                  </h3>
                  <p className="text-steel-dark mt-3 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="text-steel-dark mt-auto flex items-center justify-between pt-6 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" aria-hidden />
                      {post.readTime}
                    </span>
                    <ArrowRight
                      className="text-ink size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      aria-hidden
                    />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
