"use client";
import React from "react";

import { twMerge } from "tailwind-merge";
import { TracingBeam } from "../../components/ui/tracing-beam";

export default function Mission() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        <div className="flex flex-col  items-center justify-center p-6 gap-3">
            <h1 className="font-semibold text-5xl text-center">Here's what we do</h1>
            <p className="text-lg font-medium ">Learn what we do, and why we do it. </p>
        </div>
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-10 mt-4">
            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
              {item.badge}
            </h2>

            <p className={twMerge("text-xl mb-4")}>
              {item.title}
            </p>

            <div className="text-sm  prose prose-sm dark:prose-invert">
              {item?.image && (
                <img
                  src={item.image}
                  alt="blog thumbnail"
                  height="1000"
                  width="1000"
                  className="rounded-lg mb-10 object-cover" />
              )}
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}

const dummyContent = [
    {
        title: "Bridging Theory with Practice",
        description: (
            <>
                <p>
                    At MSA, we <strong>transform academic insights into real-world solutions</strong>. Our mission is to empower innovators by seamlessly connecting theoretical knowledge with practical application, ensuring every idea has the tools and support to thrive in today’s dynamic landscape.
                </p>
                <br />
                <p>
                    Experience a platform where <strong>learning meets doing</strong>. We provide resources, mentorship, and a collaborative environment to turn your concepts into impactful outcomes, accelerating your journey from inspiration to implementation.
                </p>
                <p>
                    Join a community dedicated to progress, where <strong>your vision is nurtured and your goals are within reach</strong>. Together, we’re building the future—one breakthrough at a time.
                </p>
            </>
        ),
        badge: "Practicality",
        image:
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Catalyst for Student Growth through Industry Partnerships",
        description: (
            <>
                <p>
                    We believe in the power of collaboration. By partnering with industry leaders, we create opportunities for students to gain real-world experience and insights, bridging the gap between academia and the professional world.
                </p>
            
            </>
        ),
        badge: "Industry Partnerships",
        image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Create lifelong networks",
        description: (
            <>
                <p>
                     At MSA, you'll get the chance to connect with like-minded peers, industry leaders, 
                and mentors who will be part of your journey long after the program ends.
                </p>
                <p>
                    Forge lifelong connections that will propel you in your career path, even after campus.
                </p>
            </>
        ),
        badge: "Networking",
        image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=3506&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];
