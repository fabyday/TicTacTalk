import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface SlidePanelProps {
  isOpen: boolean;
  upperChildren?: React.ReactNode;
  lowerChildren?: React.ReactNode;
  style?: style;
  onOpen?: () => void;
  onClose?: () => void;
}
export interface style {
  duration?: number;
  damping?: number;
  stiffness?: number;
  upperBgColor?: string;
  lowerBgColor?: string;
}

const defaultDamping = 10;
const defaultStiffness = 30;

export function SlidePanel({
  isOpen = true,
  upperChildren,
  lowerChildren,
  style = {
    duration: 1,
    damping: defaultDamping,
    stiffness: defaultStiffness,
    upperBgColor: "bg-transparent",
    lowerBgColor: "bg-transparent",
  },
  onOpen,
  onClose,
}: SlidePanelProps) {
  // this is for testing remove this lines
  // const
  //
  // useEffect(() => {
  //   console.log("is open ", isOpen);
  //   if (isOpen === true) {
  //     onOpen?.();
  //   } else {
  //     onClose?.();
  //   }
  // }, [isOpen]);

  const [padding, setPadding] = useState(0);
  const paddingRef = useRef(0);
  const anchorRef = useRef(null);
  const variants: Variants = {
    onscreen: {
      y: "0%",
      transition: {
        duration: style.duration,
        type: "spring",
        damping: style.damping ?? defaultDamping,
        stiffness: style.stiffness ?? defaultStiffness,
      },
    },
    offscreen: {
      y: "100%",
      transition: {
        duration: 1,
        type: "spring",
        damping: style.damping ?? defaultDamping,
        stiffness: style.stiffness ?? defaultStiffness,
      },
    },
  };

  return (
    <div className={`relative overflow-hidden `} style={{ paddingTop: padding }}>
      <AnimatePresence
        onExitComplete={async () => {
          onClose?.();
        }}
      >
        {isOpen && (
          <motion.div
            // initial="offscreen" whileInView={"onscreen"}

            // viewport={{ amount: 1 }}
            variants={variants}
            initial={"offscreen"}
            animate={"onscreen"}
            className={`relative  w-full ${style.upperBgColor ?? "bg-transparent"}`}
            onAnimationStart={async () => {
              setPadding(50);
              onOpen?.();
            }}
            onAnimationComplete={async () => {
              setPadding(0);
              onOpen?.();
            }}
            exit="offscreen"
          >
            {upperChildren}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        ref={anchorRef}
        className={`relative z-10  w-full  ${style.lowerBgColor ?? "bg-transparent"}`}
      >
        {lowerChildren}
      </div>
    </div>
  );
}
