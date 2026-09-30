export default function BillingToggle({ annual, setAnnual }) {
  return (
    <div className="inline-flex items-center gap-3 bg-ink/5 rounded-full p-1.5">
      <button
        onClick={() => setAnnual(false)}
        className={
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 " +
          (!annual ? "bg-ink text-paper" : "text-slate")
        }
      >
        Monthly
      </button>
      <button
        onClick={() => setAnnual(true)}
        className={
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 " +
          (annual ? "bg-ink text-paper" : "text-slate")
        }
      >
        Annual
        <span className="bg-signal-green/20 text-signal-green text-[10px] px-2 py-0.5 rounded-full">Save 20%</span>
      </button>
    </div>
  );
}
