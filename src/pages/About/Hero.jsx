"use client";
import React from "react";
import { HeroParallax } from "./Hero-parallax";
import Breakfast from '/images/home/breakfast.jpg'
import Dinner from '/images/home/dinner.jpg'
import fun from '/images/home/fun.jpg'
import industry from '/images/home/industry.jpg'
import mentorship from '/images/home/mentorship.jpg'
import practice from '/images/home/practice.jpg'
import training from '/images/home/training.jpg'
import Bitcoin from '/images/vision/bitcoin.jpg'
import Eabl from '/images/mission/Eabl.jpg'

export function AboutHero() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "MSAwesome",
    link: "",
    thumbnail:
      Breakfast,
  },
  {
    title: "Pure Magic",
    link: "",
    thumbnail:
      Dinner,
  },
  {
    title: "Fun Moments",
    link: "",
    thumbnail:
      fun,
  },

  {
    title: "Mentorship",
    link: "",
    thumbnail:
      mentorship,
  },
  {
    title: "Industrial Visits",
    link: "",
    thumbnail:
      industry,
  },
  {
    title: "Practicality",
    link: "",
    thumbnail:
      practice,
  },

  {
    title: "Training",
    link: "",
    thumbnail:
      training,
  },
  {
    title: "Bitcoin Seminar",
    link: "",
    thumbnail:
      Bitcoin,
  },
  {
    title: "GodBlessBitcoin",
    link: "",
    thumbnail:
      fun,
  },
  {
    title: "Breakfast",
    link: "",
    thumbnail:
      Breakfast,
  },
  {
    title: "Eabl Partnership",
    link: "",
    thumbnail:
      Eabl,
  },

  {
    title: "Mentorship",
    link: "",
    thumbnail:
      mentorship,
  },
  {
    title: "MSAwesome",
    link: "",
    thumbnail:
      practice,
  },
  {
    title: "Its We",
    link: "",
    thumbnail:
      Dinner,
  },
  {
    title: "Industry Partnerships",
    link: "",
    thumbnail:
      industry,
  },
];
