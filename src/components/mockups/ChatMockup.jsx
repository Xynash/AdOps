export default function ChatMockup() {
  const messages = [
    { author: "sara", text: "banner is 404ing??" },
    { author: "ravi", text: "which campaign" },
    { author: "sara", text: "the diwali one, urgent" },
  ];

  return (
    <div className="bg-black/30 rounded-lg p-3 space-y-2">
      {messages.map((msg, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-campaign-pink/40 shrink-0 mt-0.5" />
          <div className="bg-white/5 rounded-lg px-2.5 py-1.5 text-[11px] text-white/60 font-mono">
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}