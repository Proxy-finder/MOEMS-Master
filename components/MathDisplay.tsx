
import React, { useEffect, useRef } from 'react';

interface MathDisplayProps {
  latex: string;
  block?: boolean;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ latex, block = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMath = () => {
      if (containerRef.current && (window as any).katex) {
        try {
          (window as any).katex.render(latex, containerRef.current, {
            throwOnError: false,
            displayMode: block
          });
        } catch (err) {
          console.error("KaTeX rendering error:", err);
          if (containerRef.current) {
            containerRef.current.textContent = latex;
          }
        }
      }
    };

    // Small delay to ensure KaTeX is globally available if script loading is slightly delayed
    if (!(window as any).katex) {
      const interval = setInterval(() => {
        if ((window as any).katex) {
          renderMath();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      renderMath();
    }
  }, [latex, block]);

  return <div ref={containerRef} className={`${block ? 'my-4' : 'inline-block'}`} />;
};

export default MathDisplay;
