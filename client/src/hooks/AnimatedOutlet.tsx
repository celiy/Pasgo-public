import { AnimatePresence } from "framer-motion";
import React from "react";
import { useLocation, useOutlet } from "react-router-dom";

const AnimatedOutlet = (): React.JSX.Element => {
  const location = useLocation();
  const element = useOutlet();

  const uniqueKey = location.pathname + location.search;

  return (
    <AnimatePresence mode="wait" initial={true}>
      {element && React.cloneElement(element, { key: uniqueKey })}
    </AnimatePresence>
  );
};

export default AnimatedOutlet;