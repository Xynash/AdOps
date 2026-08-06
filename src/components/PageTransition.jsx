import { COMPANY_NAME } from "../lib/constants";

export default function PageTransition({ visible }) {
  return (
    <div
      className={
        "fixed inset-0 z-[100] bg-ink flex items-center justify-center transition-opacity duration-300 " +
        (visible ? "opacity-100" : "opacity-0 pointer-events-none")
      }
    >
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-campaign-mint animate-pulse" />
        <span className="font-display font-semibold text-paper text-lg tracking-tight">
          {COMPANY_NAME}
        </span>
      </div>
    </div>
  );
}
