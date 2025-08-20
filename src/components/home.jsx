
import React from "react";
import OurSnapshot from "../pages/Home/snapshot";
import Testimonials from "../pages/Home/testimonials";
import Mission from "../pages/Home/mission";
import Hero from "../pages/Home/Hero";
import Vision from "../pages/Home/vision";
import UpcomingEvent from "../pages/Home/upcoming-event";

const Home = React.memo(() => {
    return (
        <div>
            <Hero key="hero" />
            <OurSnapshot key="snapshot" />
            <Vision key="vision" />
            <UpcomingEvent key="upcoming-event" />
            <Testimonials key="testimonials" />
        </div>
    )
});

Home.displayName = 'Home';

export default Home;