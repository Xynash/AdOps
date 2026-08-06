import { Globe, Mail, MessageCircle } from "lucide-react";
import { FOOTER_COLUMNS } from "../lib/footerLinks";
import { COMPANY_NAME } from "../lib/constants";

export default function Footer() {
  return (
    <footer className="bg-ink px-6 md:px-10 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display font-semibold text-paper text-lg mb-4">{COMPANY_NAME}</div>
            <p className="text-white/40 text-xs leading-relaxed">
              The QA and SLA console built for ad operations teams.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[11px] text-white/40 tracking-wider uppercase mb-4">{col.title}</div>
              <div className="space-y-2.5">
                {col.links.map((link) => (
                  <div key={link} className="text-sm text-white/70 hover:text-paper transition-colors cursor-pointer">
                    {link}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="flex gap-4">
            <Globe size={18} className="text-white/40 hover:text-paper transition-colors cursor-pointer" />
            <MessageCircle size={18} className="text-white/40 hover:text-paper transition-colors cursor-pointer" />
            <Mail size={18} className="text-white/40 hover:text-paper transition-colors cursor-pointer" />
          </div>
          <p className="text-white/30 text-xs">© {COMPANY_NAME} 2026</p>
        </div>
      </div>
    </footer>
  );
}