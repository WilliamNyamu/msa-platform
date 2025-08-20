"use client";
import React from "react";
import { StickyScroll } from "../../components/ui/sticky-scroll-reveal";
import Breakfast from "/images/home/breakfast.jpg"
import Skills from '/images/home/skill development.jpg';
import Industry from '/images/home/industry.jpg'
import Practice from '/images/home/practice.jpg';

const content = [
  {
    title: "Bridging Theory and Practice",
    description:
      "At MSA, we transform academic insights into real-world solutions. Our mission is to empower innovators by seamlessly connecting theoretical knowledge with practical application, ensuring every idea has the tools and support to thrive in today’s dynamic landscape.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src={Practice}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
  {
    title: "Industry Partnerships",
    description:
      "We believe in the power of collaboration. By partnering with industry leaders, we create opportunities for students to gain real-world experience and insights, bridging the gap between academia and the professional world.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src={Industry}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
  {
    title: "Networking and Growth",
    description:
      "Network with industry professionals and peers to expand your horizons. Our platform facilitates meaningful connections that can lead to collaborations, mentorships, and new opportunities.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src= {Breakfast}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
  {
    title: "Skills Development",
    description:
      "Workshops, seminars, and hands-on projects to develop practical marketing skills and industry expertise. All these at MSA",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src= {Skills}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
];
export default function Vision() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={content} />
    </div>
  );
}
