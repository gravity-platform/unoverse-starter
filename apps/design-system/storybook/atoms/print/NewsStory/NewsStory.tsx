import React from "react";
import styles from "./NewsStory.module.css";

export interface NewsStoryProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "standard" | "featured";
  columns?: 1 | 2 | 3;
  theme?: "dark" | "light";
  label?: string;
  headline: string;
  subheadline?: string;
  byline?: string;
  body: string;
  hasPhoto?: boolean;
  photoUrl?: string;
  photoCaption?: string;
  photoAspect?: "landscape" | "portrait" | "square";
  layoutHint?: "hero" | "sidebar" | "bottom" | "image-left";
}

export default function NewsStory({
  className,
  style,
  variant = "standard",
  columns = 1,
  theme = "light",
  label,
  headline,
  subheadline,
  byline,
  body,
  hasPhoto,
  photoUrl,
  photoCaption,
  photoAspect = "landscape",
  layoutHint,
}: NewsStoryProps) {
  const paragraphs = body.split(/\n+/).filter(Boolean);
  const isFeatured = variant === "featured";
  const isHero = layoutHint === "hero";
  const isImageLeft = layoutHint === "image-left";
  const bodyColumns = isFeatured ? 1 : columns;

  // deterministic "random" page from headline
  const continuePage =
    !isFeatured && body.length > 300 ? (headline.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 13) + 1 : 0;

  const rootClass = [styles.root, isFeatured ? (theme === "dark" ? styles.dark : styles.light) : "", className]
    .filter(Boolean)
    .join(" ");

  if (isImageLeft && hasPhoto) {
    return (
      <div className={`${styles.imageLeftRoot} ${className || ""}`} style={style}>
        <div className={styles.imageLeftPhoto}>
          {photoUrl ? (
            <img src={photoUrl} alt={photoCaption || headline} className={styles.imageLeftImg} />
          ) : (
            <div className={styles.imageLeftPlaceholder} />
          )}
          {photoCaption && <p className={styles.photoCaption}>{photoCaption}</p>}
        </div>
        <div className={styles.imageLeftContent}>
          <h2 className={`${styles.headline} ${styles.headlineStd}`}>{headline}</h2>
          {subheadline && <p className={styles.subheadline}>{subheadline}</p>}
          {byline && <p className={styles.byline}>{byline}</p>}
          <div className={styles.body} style={bodyColumns > 1 ? { columnCount: bodyColumns } : undefined}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {continuePage > 0 && <p className={styles.continues}>Continues on page {continuePage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass} style={style}>
      {label && <div className={styles.label}>{label}</div>}

      {hasPhoto && !isFeatured && (
        <div className={styles.photo}>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={photoCaption || headline}
              className={styles.photoImage}
              style={{
                aspectRatio: photoAspect === "portrait" ? "3/4" : photoAspect === "square" ? "1/1" : "16/9",
              }}
            />
          ) : (
            <div
              className={styles.photoPlaceholder}
              style={{
                aspectRatio: photoAspect === "portrait" ? "3/4" : photoAspect === "square" ? "1/1" : "16/9",
              }}
            />
          )}
          {photoCaption && <p className={styles.photoCaption}>{photoCaption}</p>}
        </div>
      )}

      <h2 className={`${styles.headline} ${isHero ? styles.headlineHero : styles.headlineStd}`}>{headline}</h2>

      {subheadline && <p className={styles.subheadline}>{subheadline}</p>}

      {byline && !isFeatured && <p className={styles.byline}>{byline}</p>}

      <div className={styles.body} style={bodyColumns > 1 ? { columnCount: bodyColumns } : undefined}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {continuePage > 0 && <p className={styles.continues}>Continues on page {continuePage}</p>}
    </div>
  );
}
