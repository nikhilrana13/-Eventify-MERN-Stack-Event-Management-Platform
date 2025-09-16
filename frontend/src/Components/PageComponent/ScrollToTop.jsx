import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({lenis}) => {
  const { pathname } = useLocation();

  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // }, [pathname]);
  useEffect(() => {
    if (lenis) {
         lenis.scrollTo(0, { duration:0});
    } else {
      // window.scrollTo(0, 0); 
       window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
