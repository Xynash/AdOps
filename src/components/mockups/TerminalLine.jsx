export default function TerminalLine({ text, color = "text-white/50", delay = 0, visible }) {
  return (
    <div
      className={
        "transition-all duration-300 " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")
      }
      style={{ transitionDelay: delay + "ms" }}
    >
      <span className={color}>{text}</span>
    </div>
  );
}
