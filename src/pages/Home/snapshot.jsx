"use client";

import React from "react";
import { Carousel, Card } from "../../components/ui/cards-carousel";
import Training from '/images/home/training.jpg'
import Mentorship from '/images/home/mentorship.jpg'
import Community from '/images/home/fun.jpg'
import Dinner from '/images/home/dinner.jpg'
import KFC from '/images/home/kfc.jpg'
import Wealth from '/images/home/wealth.jpg'

export default function OurSnapshot() {
  // Remove any potential duplicates and ensure unique keys
  const uniqueData = data.filter((item, index, self) => 
    index === self.findIndex(t => t.src === item.src && t.title === item.title)
  );

  const cards = uniqueData.map((card, index) => (
    <Card key={`${card.src}-${index}`} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2
        className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 font-sans">
        Just a snapshot of us...
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    category: "Industrial Events",
    title: "Students get hands-on training",
    src: Training,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700">
            Artificial Intelligence is revolutionizing the way we work and learn.
          </span>{" "}
          Discover how AI tools can help you automate tasks, analyze data, and make 
          better decisions. From machine learning to natural language processing, 
          explore the cutting-edge technologies shaping our future.
        </p>
        <img
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
          alt="AI technology illustration"
          height="300"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg mt-4" />
      </div>
    ),
  },
  {
    category: "Mentorship",
    title: "Insights from Industry Leaders.",
    src: Mentorship,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700">
            Maximize your efficiency with proven productivity strategies.
          </span>{" "}
          Learn time management techniques, discover powerful tools, and create 
          workflows that help you accomplish more in less time. Transform how you 
          approach your daily tasks and long-term goals.
        </p>
        <img
          src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop"
          alt="Productivity workspace"
          height="300"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg mt-4" />
      </div>
    ),
  },
  {
    category: "Vibrant Community",
    title: "Shared experiences that uplifts all of us",
    src: Community,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700">
            The future of mixed reality is here with Apple Vision Pro.
          </span>{" "}
          Experience groundbreaking spatial computing that seamlessly blends 
          digital content with your physical space. Discover new ways to work, 
          play, and connect in an immersive digital environment.
        </p>
        <img
          src="https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=500&h=300&fit=crop"
          alt="VR headset technology"
          height="300"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg mt-4" />
      </div>
    ),
  },
  {
    category: "Unforgettable Dinners",
    title: "Magical Moments at MSA",
    src: Dinner,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700">
            Navigate the world with precision using advanced iPhone Maps.
          </span>{" "}
          Experience enhanced GPS accuracy, real-time traffic updates, and 
          detailed 3D mapping. Whether you're exploring a new city or finding 
          the fastest route home, Maps makes every journey effortless.
        </p>
        <img
          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop"
          alt="iPhone with maps application"
          height="300"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg mt-4" />
      </div>
    ),
  },
  {
    category: "Sweet moments",
    title: "Free KFCs to members in a sponsored event",
    src: KFC,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700">
            Capture life's moments with professional-quality mobile photography.
          </span>{" "}
          Explore advanced camera features, learn composition techniques, and 
          discover editing tools that turn your smartphone into a powerful 
          photography studio. Every shot tells a story.
        </p>
        <img
          src="https://images.unsplash.com/photo-1606983340828-0e4609d8293d?w=500&h=300&fit=crop"
          alt="iPhone camera and photography"
          height="300"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg mt-4" />
      </div>
    ),
  },
  {
    category: "Money Moves",
    title: "Serious Financial Insights, exclusively at MSA",
    src: Wealth,
    content: (
      <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700">
            Join our team as a Staff Software Engineer and shape the future.
          </span>{" "}
          We're looking for experienced engineers who are passionate about 
          building scalable systems, mentoring teams, and driving technical 
          excellence. Be part of an innovative company that values growth and creativity.
        </p>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop"
          alt="Software engineering team collaboration"
          height="300"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg mt-4" />
      </div>
    ),
  },
];
