import { useState, useEffect, useCallback } from "react";

function getBreakPoint(windowWidth: number) {
  if (windowWidth < 480) {
    return "sm";
  }
  if (windowWidth < 1024) {
    return "md";
  }
  if (windowWidth < 1200) {
    return "lg";
  }
  return "xlg";
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<string>("sm");

  const handleResize = useCallback(() => {
    setWindowSize(getBreakPoint(window.innerWidth));
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return windowSize;
}

export default useWindowSize;
