
import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

const SmoothScrollWrapper = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,      // scroll speed
      easing: (t) => 1 - Math.pow(1 - t, 3),  // easing function
      smooth: true,
      smoothTouch: true
    });

    function animate(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);
    
  if (typeof children === "function") {
    return children(lenisRef.current);
  }
  return <>{children}</>;

};

export default SmoothScrollWrapper;
