import React, { useState, useEffect } from "react";
import styles from "./KenBurnsImage.module.css";

interface KenBurnsImageProps {
  src: string;
  alt?: string;
  direction?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center";
  scale?: number;
  overlay?: boolean;
  grain?: boolean;
  particles?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

// Particle effect configuration
const PARTICLE_CONFIG = {
  count: 4, // Number of particles
  size: 300, // Size in pixels (width/height)
  blur: 6, // Blur radius in pixels
  speed: 20, // Base animation duration in seconds
  maxOpacity: 0.12, // Maximum opacity (0-1)
};

export default function KenBurnsImage(props: KenBurnsImageProps) {
  const {
    src,
    alt = "",
    direction = "center",
    scale = 1.3,
    overlay = true,
    grain = false,
    particles = false,
    className = "",
    onLoad,
    onError,
  } = props;

  const duration = 120;
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset loaded state when src changes
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = (e: any) => {
    if (onError) onError(e);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.imageWrapper}>
        <img
          src={src}
          alt={alt}
          className={styles.image}
          style={
            {
              "--kb-scale": scale,
            } as any
          }
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      {overlay && (
        <>
          <div className={styles.overlayGradient} />
          <div className={styles.overlayVignette} />
        </>
      )}

      {grain && <div className={styles.grain} />}

      {particles && (
        <div className={styles.particlesContainer}>
          {[...Array(PARTICLE_CONFIG.count)].map((_, i) => {
            const duration = PARTICLE_CONFIG.speed + Math.random() * 8;
            const delay = Math.random() * 10;
            const leftPos = Math.random() * 90;
            const bottomStart = -20 + Math.random() * 30;
            
            return (
              <div
                key={i}
                className={styles.particle}
                style={{
                  left: `${leftPos}%`,
                  bottom: `${bottomStart}%`,
                  "--particle-duration": `${duration}s`,
                  "--particle-delay": `${delay}s`,
                } as any}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
