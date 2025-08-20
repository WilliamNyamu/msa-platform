
import React from "react";
import OurSnapshot from "../pages/Home/snapshot";
import Testimonials from "../pages/Home/testimonials";
import Mission from "../pages/Home/mission";
import Hero from "../pages/Home/Hero";
import Vision from "../pages/Home/vision";
import UpcomingEvent from "../pages/Home/upcoming-event";

export default function Home(){
    return (
        <div>
            <Hero />
            <OurSnapshot />
            <Vision />
            <UpcomingEvent />
            <Testimonials />
        </div>
    )
}