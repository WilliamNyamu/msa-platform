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

export function AboutHero() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      Breakfast,
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      Dinner,
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      fun,
  },

  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      mentorship,
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      industry,
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      practice,
  },

  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      training,
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      training,
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      fun,
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      Breakfast,
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      Dinner,
  },

  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail:
      mentorship,
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
      practice,
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      Dinner,
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      industry,
  },
];
