const variantStyles = {
  solid: "bg-signal-green text-paper hover:bg-[#166339] border border-signal-green",
  outline: "bg-transparent text-white border border-white/30 hover:border-white",
  outlineDark: "bg-transparent text-ink border border-ink/30 hover:border-ink",
  dark: "bg-ink text-paper border border-ink hover:bg-[#1a2129]",
};

export default function Button({ children, variant = "solid", onClick, href, type = "submit" }) {
  const classes = "inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-medium tracking-wide transition-colors duration-150 " + variantStyles[variant];

  if (href) {
    return (
      <div onClick={onClick} className={classes} style={{ cursor: "pointer" }}>
        {children}
      </div>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
