"use client";

import { useState } from "react";

interface WorkflowMarqueeProps {
  items: string[][];
}

export default function WorkflowMarquee({ items }: WorkflowMarqueeProps) {
  const [interactionPaused, setInteractionPaused] = useState(false);

  return (
    <div className="proposal-workflow__marquee-shell">
      <div className="proposal-workflow__controls">
        <span>AUTO FLOW / 05 PHASES</span>
      </div>
      <div
        className="proposal-workflow__viewport"
        role="region"
        aria-label="智小申五步工作流，自动横向流转"
        onPointerEnter={() => setInteractionPaused(true)}
        onPointerLeave={() => setInteractionPaused(false)}
        onFocusCapture={() => setInteractionPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPaused(false);
        }}
      >
        <div className={`proposal-workflow__track${interactionPaused ? " is-paused" : ""}`}>
          {[0, 1].map((groupIndex) => (
            <ol key={groupIndex} className="proposal-workflow__group" aria-hidden={groupIndex === 1}>
              {items.map(([num, title, desc], index) => (
                <li key={`${groupIndex}-${num}`} className="proposal-workflow__step">
                  <div className={`proposal-workflow__visual proposal-workflow__visual--${index + 1}`} aria-hidden="true"><span /><i /><b /></div>
                  <div className="proposal-workflow__meta"><span className="proposal-workflow__number">{num}</span><span className="proposal-workflow__phase">PHASE {num}</span></div>
                  <h3>{title}</h3><p>{desc}</p>
                </li>
              ))}
            </ol>
          ))}
        </div>
      </div>
    </div>
  );
}
