import React, { useRef, useState, useEffect } from "react";
import styles from "./PrintPage.module.css";

export type PageSize = "letter" | "tabloid" | "a4";

export interface PrintPageProps {
  size?: PageSize;
  orientation?: "portrait" | "landscape";
  background?: string;
  className?: string;
  children: React.ReactNode;
}

// Reference dimensions at 96 DPI (px)
const REF_SIZES: Record<string, { width: number; height: number }> = {
  letter: { width: 816, height: 1056 },
  letterLandscape: { width: 1056, height: 816 },
  tabloid: { width: 1056, height: 1632 },
  tabloidLandscape: { width: 1632, height: 1056 },
  a4: { width: 794, height: 1123 },
  a4Landscape: { width: 1123, height: 794 },
};

export default function PrintPage({
  size = "letter",
  orientation = "portrait",
  background,
  className = "",
  children,
}: PrintPageProps) {
  const sizeClass = `${size}${orientation === "landscape" ? "Landscape" : ""}`;
  const ref = REF_SIZES[sizeClass] || REF_SIZES.letter;

  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) {
        setScale(width / ref.width);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref.width]);

  return (
    <div ref={pageRef} className={`${styles.page} ${styles[sizeClass] || styles.letter} ${className}`}>
      <div
        className={styles.scaleWrapper}
        style={{
          width: ref.width,
          height: ref.height,
          transform: `scale(${scale})`,
          ...(background
            ? {
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined),
        }}
      >
        {children}
      </div>
    </div>
  );
}
