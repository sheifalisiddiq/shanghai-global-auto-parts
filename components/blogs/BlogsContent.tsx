"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { blogPosts, type BlogPost } from "@/lib/data/blogs";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const categories = [
  "All",
  "Fitment & VIN",
  "Sourcing & Original",
  "Maintenance",
  "Operations & QC",
  "Logistics & Trade",
];

export function BlogsContent() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  return (
    <>
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-brand-red/20 via-transparent to-transparent opacity-60 pointer-events-none" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="font-ui mb-4 inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3.5 py-1 text-xs tracking-widest text-brand-red uppercase">
              <BookOpen className="size-3.5 text-brand-red" />
              <span>Technical Knowledge & Guides</span>
            </span>
            <h1 className="font-display text-4xl leading-[0.95] font-black uppercase sm:text-6xl lg:text-7xl">
              {t("blogs.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {t("blogs.subtitle")}
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex max-w-xl items-center rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-md focus-within:border-brand-red transition-colors">
              <Search className="ml-3 size-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("blogs.searchPlaceholder")}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Featured Article Banner */}
      {!searchQuery && selectedCategory === "All" && featuredPost && (
        <section className="bg-paper border-b border-slate-200 py-12 lg:py-16">
          <Container>
            <div className="mb-6">
              <span className="font-ui text-xs font-bold uppercase tracking-widest text-brand-red">
                {t("blogs.featuredGuide")}
              </span>
            </div>

            <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl lg:grid lg:grid-cols-12">
              <div className="relative aspect-[16/9] lg:aspect-auto lg:col-span-7 bg-slate-100 overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-lg bg-brand-red px-3 py-1 font-ui text-xs font-bold text-white uppercase tracking-wider">
                  {featuredPost.category}
                </div>
              </div>

              <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-5">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span>{featuredPost.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-slate-400" />
                      <span>{featuredPost.readTime}</span>
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-black uppercase text-ink leading-tight sm:text-3xl lg:text-4xl group-hover:text-brand-red transition-colors">
                    <Link href={`/blogs/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-steel-dark">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {featuredPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-brand-red/10 text-brand-red font-bold text-xs">
                      {featuredPost.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">{featuredPost.author.name}</div>
                      <div className="text-[10px] text-slate-500">{featuredPost.author.role}</div>
                    </div>
                  </div>

                  <Link
                    href={`/blogs/${featuredPost.slug}`}
                    className="font-ui inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:text-ink transition-colors"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 3. Filterable Article Grid */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="All Articles"
              title="Browse Auto Parts Guides"
              description="Filtered insights covering fitment protocols, sourcing original stock, and GCC supply chain operations."
            />

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-brand-red text-white shadow-md shadow-brand-red/20"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <Search className="mx-auto size-10 text-slate-400" />
              <h3 className="font-display mt-4 text-xl font-bold text-ink uppercase">No matching guides found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search terms or selecting another category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="font-ui mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-xs font-bold text-white uppercase"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
                      {post.category}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{post.date}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-black uppercase text-ink leading-snug group-hover:text-brand-red transition-colors">
                        <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="mt-3 text-xs leading-relaxed text-steel-dark line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2">
                        <User className="size-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-600">{post.author.name}</span>
                      </div>

                      <Link
                        href={`/blogs/${post.slug}`}
                        className="font-ui inline-flex items-center gap-1 text-xs font-bold text-brand-red group-hover:text-ink transition-colors"
                      >
                        <span>Read</span>
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 4. Technical Newsletter / Parts Updates Subscription */}
      <section className="bg-slate-950 py-16 text-white lg:py-20 border-t border-white/10">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-950 p-8 sm:p-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7">
              <span className="font-ui text-xs font-bold uppercase tracking-widest text-brand-red">
                Stay Informed
              </span>
              <h2 className="font-display mt-2 text-3xl font-black uppercase sm:text-4xl">
                Get Wholesale Parts Market Updates
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 max-w-xl">
                Subscribe for monthly technical bulletins covering Chinese vehicle catalog supersessions, new model parts releases, and GCC logistics tips.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-brand-red" />
                  <span>No Spam, Only Trade Info</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-brand-red" />
                  <span>Monthly Technical Dispatch</span>
                </span>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-5">
              {subscribed ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-6 text-center animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="mx-auto size-10 text-emerald-400" />
                  <h3 className="font-display mt-3 text-lg font-bold text-white uppercase">Subscription Confirmed!</h3>
                  <p className="mt-1 text-xs text-slate-300">
                    We'll send our next parts bulletin to <strong className="text-white">{newsletterEmail}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter workshop / corporate email..."
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none focus:border-brand-red transition-colors"
                  />
                  <button
                    type="submit"
                    className="font-ui inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red py-3.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-white hover:text-ink transition-colors cursor-pointer"
                  >
                    <span>Subscribe to Bulletins</span>
                    <ArrowRight className="size-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Bottom Help CTA */}
      <section className="bg-ink py-14 text-white">
        <Container className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="font-ui text-xs tracking-[0.25em] text-brand-red uppercase font-bold">
              Need Direct Assistance?
            </span>
            <h2 className="font-display mt-3 text-3xl font-black uppercase sm:text-4xl">
              Ask our parts specialists about your vehicle.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Send your VIN number or part photo directly for instantaneous stock check & pricing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20have%20a%20part%20inquiry%20from%20your%20blog."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white uppercase transition-colors hover:bg-emerald-500"
            >
              <MessageCircle className="size-4 fill-white text-emerald-600" />
              <span>WhatsApp Instant Quote</span>
            </a>
            <Button href="/products" variant="outline" className="border-white text-white hover:bg-white hover:text-ink">
              Browse Products
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
