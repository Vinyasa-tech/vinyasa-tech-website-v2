import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Handle hash navigation
    if (hash) {
      let attempts = 0;
      let timer: number;

      const scrollToSection = () => {
        const id = hash.substring(1);
        const element = document.getElementById(id);

        if (element) {
          const headerOffset = 80;

          const elementTop =
            element.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: Math.max(0, elementTop - headerOffset),
            left: 0,
            behavior: "smooth",
          });

          return;
        }

        // Wait for the destination section to render
        attempts += 1;

        if (attempts < 30) {
          timer = window.setTimeout(scrollToSection, 100);
        }
      };

      timer = window.setTimeout(scrollToSection, 100);

      return () => {
        window.clearTimeout(timer);
      };
    }

    // Normal page navigation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;