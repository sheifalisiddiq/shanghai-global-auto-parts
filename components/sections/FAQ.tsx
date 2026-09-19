"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { faqs } from "@/lib/data/faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const arabicFaqs: Record<string, { question: string; answer: string; category?: string }> = {
  "vin-guarantee": {
    category: "المطابقة والجودة",
    question: "كيف تضمنون مطابقة قطع الغيار بنسبة 100%؟",
    answer:
      "نقوم بالتحقق من كل طلب باستخدام رقم الشاسيه المكون من 17 خانة (VIN) عبر برامج الكتالوج الإلكتروني الرسمية (EPC) المعتمدة من شركات السيارات الصينية. تمنع هذه العملية أي تخمين وتضمن مطابقة رقم القطعة وإصدارها لسيارتك بدقة متناهية قبل الشحن.",
  },
  "original-vs-oem": {
    category: "المطابقة والجودة",
    question: "ما الفرق بين القطع الأصلية، قطع المصنّع الأصلي (OEM)، والبدائل المعتمدة؟",
    answer:
      "القطع الأصلية تأتي بتغليف علامة السيارة الأصلية (مثل جيتور، جيلي، شانجان). قطع OEM تنتجها نفس مصانع الفئة الأولى التي تورد لشركات السيارات ولكن دون تكلفة التغليف الحصري. أما البدائل التجارية المعتمدة فهي قطع مصنّعة وفق أعلى معايير الأداء والسلامة ومعتمدة بضمان.",
  },
  "brands-covered": {
    category: "الماركات والتوريد",
    question: "ما هي علامات السيارات الصينية التي تدعمونها؟",
    answer:
      "نوفر ونورد قطع غيار لكافة مصنعي السيارات الصينية في الخليج: جيتور، شانجان، جيلي، شيري، هافال، جريت وول (تانك 300 / 500 وباور)، بي واي دي، إم جي (MG)، بايك، جاك، ماكسوس، أومودا، وجايكو.",
  },
  "delivery-times": {
    category: "الطلبات والشحن",
    question: "ما هي مدة التوصيل والشحن داخل الإمارات ودول الخليج؟",
    answer:
      "القطع المتوفرة في مستودعات الشارقة وأبوظبي تشحن بنفس اليوم وتصل خلال 24 ساعة داخل كافة إمارات الدولة. بالنسبة لقطر، نوفر شحناً جوياً سريعاً خلال 24–48 ساعة أو شحناً برياً سريعاً. كما نشحن للسعودية وعمان والكويت وباقي دول العالم عبر الشحن الجوي السريع.",
  },
  "quote-inquiry": {
    category: "الطلبات والشحن",
    question: "كيف يمكنني طلب عرض سعر أو فحص توفر القطعة؟",
    answer:
      "أسرع طريقة هي عبر مكتب واتساب (+971 6 533 5866). أرسل رقم الهيكل (VIN) مع صورة أو اسم القطعة المطلوبة، وسيقوم فريقنا التقني بالرد خلال 15–30 دقيقة بخيارات القطع والأسعار.",
  },
  "warranty-policy": {
    category: "الضمان والدعم",
    question: "هل تشمل قطع الغيار ضماناً معتمداً؟",
    answer:
      "نعم. كافة القطع الأصلية وقطع OEM مدعومة بضمان ضد عيوب التصنيع. وفي حال وجود أي خلل مصنعي، فإن إجراءات الاستبدال سهلة وفورية ومرنة للغاية.",
  },
  "rare-parts-sourcing": {
    category: "الماركات والتوريد",
    question: "هل يمكنكم طلب قطع نادرة أو غير متوفرة مباشرة من المصانع في الصين؟",
    answer:
      "نعم. بفضل شبكتنا المباشرة مع المصانع ومراكز التوزيع في شانغهاي وغوانزو، يمكننا توريد المحركات، نواقل الحركة، والوحدات الإلكترونية والقطع النادرة وشحنها جواً خلال 5–7 أيام عمل.",
  },
};

export function FAQ() {
  const { t, isRTL } = useLanguage();
  const [openId, setOpenId] = useState<string | null>("vin-guarantee");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: t("faq.allQuestions", "All Questions") },
    { id: "Fitment & Quality", label: t("faq.catFitment", "Fitment & Quality") },
    { id: "Orders & Shipping", label: t("faq.catShipping", "Orders & Shipping") },
    { id: "Brands & Sourcing", label: t("faq.catBrands", "Brands & Sourcing") },
    { id: "Warranty & Support", label: t("faq.catWarranty", "Warranty & Support") },
  ];

  const displayFaqs = faqs.map((f) => {
    if (isRTL && arabicFaqs[f.id]) {
      return {
        ...f,
        question: arabicFaqs[f.id].question,
        answer: arabicFaqs[f.id].answer,
        category: arabicFaqs[f.id].category || f.category,
      };
    }
    return f;
  });

  const filteredFaqs = displayFaqs.filter(
    (item) => activeCategory === "all" || item.category === activeCategory,
  );

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: displayFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <section id="faq" className="border-t border-slate-200/80 bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Section Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 shadow-2xs mb-3">
                <HelpCircle className="size-3.5 text-brand-red" />
                <span className="font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                  {t("faq.eyebrow", "Frequently Asked Questions")}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-slate-900 tracking-tight">
                {t("faq.title", "Everything You Need to Know")}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                {t(
                  "faq.subtitle",
                  "Got questions about parts authenticity, VIN fitment verification, delivery schedules, or warranties? Find quick answers below.",
                )}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* FAQ Accordion List */}
            <div className="mt-8 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id} className="transition-colors hover:bg-slate-50/60">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left rtl:text-right cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs font-bold text-brand-red pt-0.5">
                          Q:
                        </span>
                        <div>
                          <span className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {faq.question}
                          </span>
                          {faq.category && (
                            <span className="ml-2 rtl:ml-0 rtl:mr-2 hidden rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500 sm:inline-block">
                              {faq.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-200 transition-all ${
                          isOpen ? "bg-brand-red text-white border-brand-red rotate-180" : "text-slate-500 bg-white"
                        }`}
                      >
                        <ChevronDown className="size-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 animate-in fade-in duration-200">
                        <div className="flex gap-3 pl-6 rtl:pl-0 rtl:pr-6 border-l-2 rtl:border-l-0 rtl:border-r-2 border-brand-red/30">
                          <p className="text-sm sm:text-[15px] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Assistance Box */}
            <div className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {t("faq.ctaHelp", "Have a different question?")}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t("faq.ctaSpeak", "Speak directly with a parts specialist")}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-300">
                  {t(
                    "faq.ctaDesc",
                    "Our technical desk in Sharjah & Abu Dhabi is on standby to check part numbers, verify VIN compatibility, or check live stock.",
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20have%20a%20question%20about%20your%20spare%20parts%20and%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:bg-emerald-500 hover:scale-[1.02]"
                >
                  <MessageCircle className="size-4 fill-white text-emerald-600" />
                  <span>{t("faq.ctaWhatsapp", "WhatsApp Inquiry")}</span>
                </a>

                <a
                  href="tel:+97165335866"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <Phone className="size-3.5 text-brand-red" />
                  <span>{t("faq.ctaCall", "Call +971 6 533 5866")}</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
