import { ShieldCheck, CheckCircle2, Truck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

const features = [
  {
    icon: ShieldCheck,
    title: "100% VIN Fitment Guarantee",
    subtitle: "Precision matched by chassis number",
    color: "text-brand-red",
  },
  {
    icon: CheckCircle2,
    title: "Genuine • OEM • Aftermarket",
    subtitle: "Direct tier-1 factory sourcing",
    color: "text-emerald-400",
  },
  {
    icon: Truck,
    title: "Express UAE & Qatar Dispatch",
    subtitle: "Sharjah, Abu Dhabi & Doha hubs",
    color: "text-brand-red",
  },
  {
    icon: Sparkles,
    title: "5,000+ Parts Catalogued",
    subtitle: "For Jetour, Changan, Geely & more",
    color: "text-brand-red",
  },
];

export function TrustFeaturesBar() {
  return (
    <section className="border-y border-white/10 bg-slate-950 py-4 sm:py-5 text-white select-none">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 items-center">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-white/[0.03] sm:bg-transparent border border-white/5 sm:border-0"
              >
                <div className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Icon className={`size-4 sm:size-4.5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs font-bold text-white truncate sm:text-clip leading-tight">
                    {item.title}
                  </div>
                  <div className="hidden sm:block text-[10px] text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
