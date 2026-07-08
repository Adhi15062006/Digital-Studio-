import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface ImageItem {
  src: string;
  alt: string;
}

interface CylinderCarouselProps {
  images: ImageItem[];
}

export function CylinderCarousel({ images }: CylinderCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [containerWidth, setContainerWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Angle step between images
  const total = images.length;
  const angleStep = 360 / total;

  // Track the current rotation angle
  const [rotation, setRotation] = useState(0);

  // Touch and mouse drag logic
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  // Auto-rotation effect
  useEffect(() => {
    if (!isPlaying || isDragging.current) return;

    const interval = setInterval(() => {
      setRotation((prev) => prev - angleStep);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, angleStep, total]);

  // Adjust cylinder radius based on container width
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate radius of the cylinder
  // We want the face size to be about 160px-240px wide.
  const faceWidth = containerWidth < 450 ? 150 : 220;
  // radius = (width / 2) / tan(pi / total)
  const radius = Math.max(120, (faceWidth / 2) / Math.tan(Math.PI / total));

  const handleNext = () => {
    setRotation((prev) => prev - angleStep);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setRotation((prev) => prev + angleStep);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startRotation.current = rotation;
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    // Map pixels to degrees (e.g. 1px = 0.5 degrees)
    const factor = 0.5;
    const newRotation = startRotation.current + deltaX * factor;
    setRotation(newRotation);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }

    // Snap to nearest item
    const snappedIndex = Math.round(-rotation / angleStep) % total;
    const normalizedIndex = snappedIndex < 0 ? (snappedIndex + total) % total : snappedIndex;
    
    // Smoothly snap to the clean angle
    const targetRotation = -snappedIndex * angleStep;
    setRotation(targetRotation);
    setCurrentIndex(normalizedIndex);
  };

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto py-12 px-4 flex flex-col items-center justify-center overflow-hidden select-none"
      id="cylinder-carousel-root"
    >
      {/* Perspective Container */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        style={{ perspective: "1500px" }}
        id="cylinder-carousel-perspective"
      >
        {/* Rotating Cylinder Track */}
        <motion.div
          animate={{ rotateY: rotation }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative w-0 h-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
          id="cylinder-carousel-track"
        >
          {images.map((img, i) => {
            const itemAngle = i * angleStep;
            
            // Calculate active state or position for visual styling
            const relativeAngle = ((itemAngle + rotation) % 360 + 360) % 360;
            const isFront = relativeAngle < 45 || relativeAngle > 315;
            
            return (
              <div
                key={i}
                className="absolute origin-center transition-all duration-500 rounded-2xl overflow-hidden bg-white p-2 sm:p-3 border border-[#E5DCCF] shadow-xl hover:shadow-2xl flex flex-col justify-between"
                style={{
                  width: `${faceWidth}px`,
                  height: `${faceWidth * 1.35}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "visible",
                  opacity: isFront ? 1 : 0.65,
                  scale: isFront ? 1.05 : 0.95,
                  zIndex: isFront ? 10 : 1,
                  pointerEvents: isFront ? "auto" : "none",
                }}
              >
                <div className="w-full h-[85%] overflow-hidden rounded-xl bg-[#F7F1E8]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center py-1.5 border-t border-[#F7F1E8] bg-white">
                  <p className="font-serif-elegant text-[10px] sm:text-xs font-bold text-[#3C352E] uppercase tracking-wider truncate">
                    {img.alt}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
