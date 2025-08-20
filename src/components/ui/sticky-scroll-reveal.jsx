"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export const StickyScroll = ({
  content,
  contentClassName
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // More precise breakpoint calculation
    const progress = Math.max(0, Math.min(1, latest));
    const cardIndex = Math.floor(progress * cardLength);
    const clampedIndex = Math.min(cardIndex, cardLength - 1);
    setActiveCard(clampedIndex);
  });

  const backgroundColors = [
    "#0f172a", // slate-900
    "#000000", // black
    "#171717", // neutral-900
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(linearGradients[0]);

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <div
      className="relative"
      ref={ref}>
      {/* Create scroll area with proper height */}
      <div style={{ height: `${content.length * 80}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            animate={{
              backgroundColor: backgroundColors[activeCard % backgroundColors.length],
            }}
            className="flex h-full items-center justify-center space-x-10 p-10">
            
            {/* Left content area */}
            <div className="relative flex-1 max-w-2xl">
              {content.map((item, index) => (
                <motion.div 
                  key={item.title + index} 
                  className="absolute inset-0 flex flex-col justify-center"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ 
                    opacity: activeCard === index ? 1 : 0,
                    x: activeCard === index ? 0 : -50
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}>
                  <motion.h2 className="text-4xl font-bold text-slate-100 mb-6">
                    {item.title}
                  </motion.h2>
                  <motion.p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                    {item.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>

            {/* Right content display */}
            <div className="hidden lg:block flex-1 max-w-md">
              <motion.div
                style={{ background: backgroundGradient }}
                className={cn(
                  "h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl",
                  contentClassName
                )}
                key={activeCard}
                initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotateY: 0
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}>
                <div className="h-full w-full flex items-center justify-center">
                  {content[activeCard].content ?? null}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
