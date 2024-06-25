import { useEffect } from "react"
import { useMediaMaxWidthQuery } from "./media-query.hook";

export const useMobileInputAndTextareaFocus = () => {
  const isMobile = useMediaMaxWidthQuery();
  useEffect(() => {
    if (!isMobile) {
      return;
    }
    const resizeCb = function () {
      if (!document.activeElement) {
        return;
      }
      if (document.activeElement?.tagName ===
        'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        window.setTimeout(function () {
          document.activeElement && document.activeElement.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    };
    window.addEventListener('resize', resizeCb);
    return () => {
      window.removeEventListener('resize', resizeCb);
    };
  }, [isMobile]);
}