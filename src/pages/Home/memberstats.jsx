"use client";
import React from "react";
import { AnimatedTooltip } from "../../components/ui/animated-tooltip";
import img200 from '/images/home/200.png';
import Linda from '/images/testimonial/Linda Weke2.jpg'
import Benard from '/images/testimonial/Benard Mulei.jpg'
import William from '/images/testimonial/William Nyamu.jpg'
import Mbogi from '/images/testimonial/mbogi.jpg'
import Shalom from '/images/testimonial/shalom.jpg'

const people = [
  {
    id: 1,
    name: "Linda Weke",
    designation: "President MSA 24/25",
    image: Linda,
  },
  {
    id: 2,
    name: "Benard Mulei",
    designation: "UNSA SG 25/26",
    image: Benard,
  },
  {
    id: 3,
    name: "William Nyamu",
    designation: "Software Engineer",
    image: William,
  },
  {
    id: 4,
    name: "Mbogi",
    designation: "Community Manager",
    image: Mbogi,
  },
  {
    id: 5,
    name: "Shalom Ndanu",
    designation: "President MSA 25/26",
    image: Shalom,
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
  {
    id: 7,
    name: "Plus you",
    designation: "Join us today",
    image: img200
  }
];

export function MemberStats() {
  return (
    <div className="flex flex-row items-center justify-start mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
