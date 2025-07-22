import { motion, useAnimationControls } from 'framer-motion';
import React, { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
}

const variants = {
  hidden: { opacity: 1, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 1, x: 0, y: -20 }
}

const AnimatedLayout = ({ children }: Props): React.JSX.Element => {
  const controls = useAnimationControls();
  
  useEffect(() => {
    document.body.classList.add('hide-scrollbar');
    
    controls.start("enter").then(() => {
      document.body.classList.remove('hide-scrollbar');
    });
    
    return () => {
      document.body.classList.remove('hide-scrollbar');
    };
  }, [controls]);
  
  return (
    <motion.div
      initial="hidden"
      animate={controls}
      exit="exit"
      variants={variants}
      transition={{duration: 0.2, type: "easeInOut"}}
      className="relative w-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedLayout;