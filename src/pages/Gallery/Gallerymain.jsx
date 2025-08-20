import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "../../components/ui/draggable-card";

export function GalleryMain() {
  const items = [
    {
      title: "Free KFCs",
      image:
        "/images/home/kfc.jpg",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: "Industrial Events",
      image:
        "/images/home/industry.jpg",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      title: "Connections",
      image:
        "/images/mission/connections.jpg",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: "Community",
      image:
        "/images/gallery/hall.jpg",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: "Events",
      image:
        "/images/gallery/event.jpg",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: "Togetherness",
      image:
        "/images/gallery/people.jpg",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: "Insightful moments",
      image:
        "/images/gallery/money.jpg",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
    {
      title: "Celebrations",
      image:
        "/images/gallery/benny.jpg",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
  ];
  return (
    <DraggableCardContainer
      id="gallery-main"
      className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      <p
        className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl">
        We want to make more moments with you. Join us today
      </p>
      {items.map((item) => (
        <DraggableCardBody className={item.className}>
          <img
            src={item.image}
            alt={item.title}
            className="pointer-events-none relative z-10 h-80 w-80 object-cover" />
          <h3
            className="mt-4 text-center text-2xl font-bold text-neutral-700 ">
            {item.title}
          </h3>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
