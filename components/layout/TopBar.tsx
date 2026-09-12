import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { contact } from "@/lib/data/company";
import { Container } from "@/components/ui/Container";

export function TopBar() {
  const telSharjah = `tel:${contact.primaryPhone.replace(/\s+/g, "")}`;
  const telAbuDhabi = "tel:+97126225133";

  return (
    <div className="bg-black/95 text-slate-300 border-b border-white/10 text-[11px] select-none">
      <Container className="flex h-9 items-center justify-between">
        {/* Left: GCC Hubs & Direct Phones */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold text-white uppercase tracking-wider hidden sm:inline-block">
              UAE &bull; Qatar Parts Hub
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={telSharjah}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <MapPin className="size-3 text-brand-red shrink-0" />
              <span>Sharjah HQ:</span>
              <span className="font-bold text-white">{contact.primaryPhone}</span>
            </a>

            <span className="text-white/20 hidden md:inline">|</span>

            <a
              href={telAbuDhabi}
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="size-3 text-brand-red shrink-0" />
              <span>Abu Dhabi:</span>
              <span className="font-bold text-white">+971 2 622 5133</span>
            </a>
          </div>
        </div>

        {/* Right: Hours & Fast WhatsApp Contact */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
            <Clock className="size-3 text-brand-red" />
            <span>Sat &ndash; Thu: 8:00 AM &ndash; 8:30 PM</span>
          </div>

          <a
            href="https://wa.me/97165335866?text=Hi%20Shanghai%20Global,%20I%20need%20a%20spare%20part%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="size-3.5 fill-emerald-500 text-black" />
            <span>WhatsApp Desk</span>
          </a>
        </div>
      </Container>
    </div>
  );
}
