"use client";
import { useState, useRef, useEffect } from "react";

interface ImageSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ImageSlider({
  before,
  after,
  beforeLabel = "Antes",
  afterLabel = "Depois",
}: ImageSliderProps) {
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="image-slider-container"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "ew-resize",
        userSelect: "none",
        border: "1px solid var(--border)",
        background: "var(--bg-muted)",
      }}
    >
      {/* After Image (Background) */}
      <img
        src={after}
        alt="After"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* Before Image (Clip) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${position}%`,
          height: "100%",
          overflow: "hidden",
          borderRight: "2px solid var(--accent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <img
          src={before}
          alt="Before"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${containerWidth}px`,
            height: "100%",
            objectFit: "cover",
            maxWidth: "none",
          }}
        />
      </div>

      {/* Slider Handle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          width: "2px",
          background: "var(--accent)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "40px",
          backgroundColor: "var(--accent)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          color: "#000",
          fontSize: "18px",
          fontWeight: "bold",
        }}>
          ↔
        </div>
      </div>

      {/* Labels */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        zIndex: 30,
        background: "rgba(0,0,0,0.6)",
        padding: "4px 12px",
        borderRadius: "100px",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#fff",
        pointerEvents: "none",
        opacity: position < 10 ? 0 : 1,
        transition: "opacity 0.2s",
      }}>
        {beforeLabel}
      </div>
      <div style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        zIndex: 30,
        background: "var(--accent)",
        padding: "4px 12px",
        borderRadius: "100px",
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "#000",
        pointerEvents: "none",
        opacity: position > 90 ? 0 : 1,
        transition: "opacity 0.2s",
      }}>
        {afterLabel}
      </div>
    </div>
  );
}
