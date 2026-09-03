"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function DashboardClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return <div className="h-14 shrink-0 lg:h-20 lg:w-56" aria-hidden="true" />;
  }

  return (
    <time
      dateTime={now.toISOString()}
      className="shrink-0 text-left lg:text-right"
    >
      <p className="font-questrial text-xs font-bold tracking-wide text-gray-400 uppercase lg:text-sm">
        {format(now, "EEEE")}
      </p>
      <p className="font-lexend text-sm font-bold text-gray-800 lg:text-xl">
        {format(now, "MMMM d, yyyy")}
      </p>
      <p className="mt-0.5 font-questrial text-lg font-bold text-yellow-500 lg:mt-1 lg:text-2xl">
        {format(now, "h:mm:ss a")}
      </p>
    </time>
  );
}
