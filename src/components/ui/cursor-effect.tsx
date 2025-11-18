"use client";

import { useEffect, useRef, useState } from "react";

const CursorEffect = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/touch devices and small screens
  useEffect(() => {
    const checkIsMobile = () => {
      const isCoarsePointer =
        typeof window !== "undefined" &&
        typeof window.matchMedia !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 1024; // hide on < lg
      setIsMobile(isCoarsePointer || isSmallScreen);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Do not enable on mobile

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      
      // Check if the target is within the navbar or interactive button - more comprehensive check
      const isNavbarElement = target?.closest('nav') !== null || 
                             target?.closest('[data-navbar]') !== null ||
                             target?.tagName === 'NAV' ||
                             target?.classList.contains('navbar') ||
                             target?.getAttribute('role') === 'navigation';
      
      // Check if the target is an interactive button
      const isInteractiveButton = target?.closest('button') !== null && 
                                 (target?.closest('button')?.classList.contains('group') ||
                                  target?.closest('button')?.classList.contains('cursor-pointer'));
      
      if (isNavbarElement || isInteractiveButton) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);

      const isTextElement =
        target &&
        ["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "A", "BUTTON", "LABEL", "LI"].includes(
          target.tagName
        );

      setIsHoveringText(isTextElement);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobile]);

  // Smooth animation loop
  useEffect(() => {
    if (isMobile) return; // Skip animation on mobile
    const animate = () => {
      const dx = mousePos.current.x - circlePos.current.x;
      const dy = mousePos.current.y - circlePos.current.y;
      const easing = 0.15;

      circlePos.current.x += dx * easing;
      circlePos.current.y += dy * easing;

      if (cursorRef.current) {
        const scale = isHoveringText ? 3 : 1; // 40px → 80px scaling
        cursorRef.current.style.transform = `translate3d(${circlePos.current.x - 20}px, ${
          circlePos.current.y - 20
        }px, 0) scale(${scale})`;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isHoveringText, isMobile]);

  return (
    <>
      {!isMobile && (
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] transition-transform duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: isHoveringText ? "none" : "3px solid rgba(6, 182, 212, 0.8)",
          boxShadow: isHoveringText
            ? "none"
            : "0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)",
          backdropFilter: isHoveringText ? "invert(1)" : "none",
          WebkitBackdropFilter: isHoveringText ? "invert(1)" : "none",
          mixBlendMode: isHoveringText ? "difference" : "normal",
          transformOrigin: "center center", // keep scale centered
        }}
      >
        {!isHoveringText && (
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "rgba(6, 182, 212, 0.9)",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
      )}
    </>
  );
};

export default CursorEffect;
