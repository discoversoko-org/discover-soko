import { useEffect, useState } from "react";

export function useCountdown(initialSeconds = 30) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const restart = () => {
    setSeconds(initialSeconds);
  };

  return {
    seconds,
    time: seconds,
    restart,
  };
}