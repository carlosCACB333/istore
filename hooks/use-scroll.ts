import { useEffect, useRef, useState } from "react";

export const useScroll = () => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const visibilityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAtBottom && !isVisible) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }, [isAtBottom, isVisible]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (visibilityRef.current) {
      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          });
        },
        {
          rootMargin: "0px 0px 0px 0px",
        }
      );

      observer.observe(visibilityRef.current);

      return () => {
        observer.disconnect();
      };
    }
  });

  return {
    visibilityRef,
  };
};
