import React from "react";
import styles from "./Card2.module.css";
import Button from "../../atoms/Button/Button";

interface Card2Props {
  title?: string;
  description?: string;
  image?: string;
  callToAction?: string;
  object?: Record<string, any>;
  onClick?: (data: any) => void;
}

export default function Card2(props: Card2Props) {
  const obj: any = props.object ?? {};

  const title = props.title || obj.title;
  const description = props.description || obj.description;
  const image =
    props.image ||
    obj.image ||
    obj.metadata?.images?.[0] ||
    (obj.source_url?.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i) ? obj.source_url : undefined);
  const callToAction = props.callToAction || obj.callToAction || obj.metadata?.callToAction;

  const handleClick = () => {
    console.log("[Card2] Button clicked, dispatching gravity:action", obj.title);
    window.dispatchEvent(
      new CustomEvent("gravity:action", {
        detail: { type: "click", data: { object: obj }, componentId: "Card2" },
      })
    );
  };

  return (
    <div className={styles.card}>
      {/* Left side - Text and CTA */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {callToAction && <Button onClick={handleClick}>{callToAction}</Button>}
      </div>

      {/* Right side - Image */}
      {image && (
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
        </div>
      )}
    </div>
  );
}
