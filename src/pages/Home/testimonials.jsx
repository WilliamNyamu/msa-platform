"use client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Linda from '/images/testimonial/Linda Weke2.jpg';
import Benard from '/images/testimonial/Benard Mulei.jpg';
import Shalom from '/images/testimonial/shalom.jpg'

import { useEffect, useState } from "react";

const Testimonials = ({
  testimonials = [],
  autoplay = false
}) => {
  const [active, setActive] = useState(0);

  // Sample testimonials data if none provided
  const defaultTestimonials = [
    {
      src: Shalom,
      name: "Shalom Ndanu Mwaka",
      designation: "President, MSA 25/26",
      quote: "Saying that MSA is good is an understatement. It has truly transformed my leadership journey and my career path. I'd prefer to call it: MSAwesome."
    },
    {
      src: Benard,
      name: "Bernard Mulei",
      designation: "UNSA SG 24/25",
      quote: "As a Student Leader, I credit my leadership capacity to what MSA taught me. I'd highly recommend students to join MSA. It's magical"
    },
    {
      src: Linda,
      name: "Linda Weke",
      designation: "President, MSA 24/25",
      quote: "MSA is truly magical. It has changed my life and career path. I am so grateful to have been part of this community. I highly recommend it to all students."
    }
  ];

  // Use provided testimonials or default ones
  const testimonialsToShow = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonialsToShow.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonialsToShow.length) % testimonialsToShow.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay && testimonialsToShow.length > 0) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonialsToShow.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  return (
    <div
      className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Hear from our associates and current members and how MSA impacted them
        </p>
      </div>
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonialsToShow.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonialsToShow.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom">
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}>
            <h3 className="text-2xl font-bold text-black">
              {testimonialsToShow[active].name}
            </h3>
            <p className="text-sm text-black">
              {testimonialsToShow[active].designation}
            </p>
            <motion.p className="mt-8 text-lg text-gray-900">
              {testimonialsToShow[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
              <IconArrowLeft
                className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
              <IconArrowRight
                className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;