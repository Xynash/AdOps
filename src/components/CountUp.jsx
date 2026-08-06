import { useEffect, useState } from "react";

export default function CountUp({ end, duration = 1500, decimals = 0, suffix = "" }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let frameId;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(progress * end);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  return (
    <span>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}