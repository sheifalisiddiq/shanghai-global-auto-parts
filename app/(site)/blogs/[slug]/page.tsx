import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { blogPosts, type BlogPost } from "@/lib/data/blogs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | Shanghai Global Auto Parts",
    };
  }

  return {
    title: `${post.title} | Shanghai Global Auto Parts Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      {/* 1. Article Hero Header */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-brand-red/20 via-transparent to-transparent opacity-60 pointer-events-none" />
        <Container className="relative z-10">
          <Link
            href="/blogs"
            className="font-ui inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="size-4 text-brand-red" />
            <span>Back to All Blogs</span>
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-ui rounded-md bg-brand-red px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-300">
                <Calendar className="size-3.5 text-slate-400" />
                <span>{post.date}</span>
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1.5 text-xs text-slate-300">
                <Clock className="size-3.5 text-slate-400" />
                <span>{post.readTime}</span>
              </span>
            </div>

            <h1 className="font-display text-3xl font-black uppercase text-white sm:text-5xl lg:text-6xl leading-[1.05]">
              {post.title}
            </h1>

            <p className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg">
              {post.excerpt}
            </p>

            {/* Author Profile */}
            <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
              <div className="flex size-11 items-center justify-center rounded-full bg-brand-red text-white font-bold text-sm shadow-md">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.author.role}</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Main Article Body */}
      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-100 mb-12">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 1000px, 100vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Key Takeaways Box */}
            <div className="mb-12 rounded-3xl border border-brand-red/20 bg-brand-red/5 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-brand-red font-ui text-xs font-bold uppercase tracking-wider mb-3">
                <BookOpen className="size-4" />
                <span>Key Takeaways for Buyers & Garages</span>
              </div>
              <ul className="space-y-2.5">
                {post.content.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink font-medium">
                    <CheckCircle2 className="size-4 shrink-0 text-brand-red mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Intro */}
            <div className="prose prose-lg prose-slate max-w-none">
              <p className="text-lg leading-relaxed text-steel-dark font-medium border-l-4 border-brand-red pl-4 py-1 italic">
                {post.content.intro}
              </p>

              {/* Sections */}
              <div className="mt-10 space-y-10">
                {post.content.sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h2 className="font-display text-2xl font-black uppercase text-ink sm:text-3xl">
                      {section.heading}
                    </h2>
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-base leading-relaxed text-steel-dark">
                        {p}
                      </p>
                    ))}
                    {section.bulletPoints && (
                      <ul className="my-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                        {section.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx} className="flex items-start gap-2.5 text-sm text-ink">
                            <span className="size-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Conclusion */}
              <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-white">
                <h3 className="font-display text-xl font-bold uppercase text-brand-red mb-2">
                  Conclusion & Support
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  {post.content.conclusion}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20read%20your%20article%20and%20need%20a%20part%20quote."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-500"
                  >
                    <MessageCircle className="size-4 fill-white text-emerald-600" />
                    <span>Ask Technical Parts Desk</span>
                  </a>
                  <Button href="/products#enquire" variant="outline" className="border-white text-white hover:bg-white hover:text-ink">
                    Submit VIN Enquiry
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags & Share */}
            <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-ink uppercase">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=Check out this article: https://shanghaiglobalauto.com/blogs/${post.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-red transition-colors"
              >
                <Share2 className="size-4" />
                <span>Share Article</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Related Articles */}
      <section className="bg-paper py-16 lg:py-24 border-t border-slate-200">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="font-ui text-xs font-bold uppercase tracking-widest text-brand-red">
                More Reading
              </span>
              <h2 className="font-display mt-2 text-3xl font-black uppercase text-ink">
                Related Technical Guides
              </h2>
            </div>
            <Link
              href="/blogs"
              className="font-ui inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:text-ink transition-colors"
            >
              <span>View All Blogs</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rel) => (
              <article
                key={rel.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={rel.image}
                    alt={rel.title}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <span className="font-ui text-[10px] font-bold text-brand-red uppercase tracking-wider">
                      {rel.category}
                    </span>
                    <h3 className="font-display mt-2 text-lg font-black uppercase text-ink group-hover:text-brand-red transition-colors leading-snug">
                      <Link href={`/blogs/${rel.slug}`}>{rel.title}</Link>
                    </h3>
                  </div>
                  <Link
                    href={`/blogs/${rel.slug}`}
                    className="font-ui mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-red"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
