"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { analyticsAllowed, CONSENT_EVENT } from "@/lib/consent";

// Renders Vercel's <Analytics /> only while the visitor's choice allows it,
// and drops any event if the choice changes after the script has loaded.
export default function AnalyticsGate() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const update = () => setOn(analyticsAllowed());
    update();
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);
  if (!on) return null;
  return <Analytics beforeSend={(event) => (analyticsAllowed() ? event : null)} />;
}
