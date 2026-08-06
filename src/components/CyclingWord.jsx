import { useState, useEffect } from "react";

export default function CyclingWord({ words, interval = 2000, color = "signal-green" }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const colorMap = {
    "signal-green": "bg-signal-green/15 text-signal-green",
    "campaign-blue": "bg-campaign-blue/15 text-campaign-blue",
    "campaign-pink": "bg-campaign-pink/15 text-campaign-pink",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setVisible(true);
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span
      className={
        "inline-block px-3 py-1 rounded-full transition-all duration-200 " +
        colorMap[color] +
        (visible ? " opacity-100 scale-100" : " opacity-0 scale-95")
      }
      style={{ minWidth: "220px" }}
    >
      {words[index]}
    </span>
  );
}
