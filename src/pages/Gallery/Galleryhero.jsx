"use client";
import { ThreeDMarquee } from "../../components/ui/3d-marquee";
import { Link } from "react-router-dom";

export function GalleryHero() {
  const images = [
    "/images/vision/bitcoin.jpg",
    "/images/gallery/optiven.jpg",
    "/images/gallery/all.jpg",
    "/images/gallery/comm.jpg",
    "/images/gallery/eabl.jpg",
    "/images/gallery/team.jpg",
    "/images/gallery/benny.jpg",
    "/images/gallery/comm.jpg",
    "/images/gallery/event.jpg",
    "/images/gallery/hall.jpg",
    "/images/gallery/madam.jpg",
    "/images/gallery/money.jpg",
    "/images/gallery/more.jpg",
    "/images/gallery/oliver.jpg",
    "/images/gallery/onama.jpg",
    "/images/gallery/optiven.jpg",
    "/images/gallery/people.jpg",
    "/images/gallery/smile.jpg",
    "/images/gallery/team.jpg",
    "/images/gallery/wengi.jpg",
    "/images/gallery/wengine.jpg",
    "/images/gallery/wisdom.jpg",
    "/images/gallery/smile.jpg",
    "/images/vision/bitcoin.jpg",
    "/images/mission/connections.jpg",
    "/images/home/fun.jpg",
    "/images/home/wealth.jpg",
    "/images/home/training.jpg"
  ];
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full width container with no margins or max-width constraints */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Text content with enhanced mobile styling */}
        <div className="relative z-30 text-center max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
            Experience the moments that make us{" "}
            <span className="relative inline-block rounded-xl bg-blue-500/50 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 text-white underline decoration-sky-400 decoration-4 sm:decoration-6 underline-offset-8 sm:underline-offset-16 shadow-lg">
              tick
            </span>{" "}
            at a time.
          </h2>
          
          {/* Optional description text */}
          <p className="relative text-base sm:text-lg md:text-xl text-neutral-200/90 max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow-lg">
            Discover the vibrant moments, connections, and experiences that define our marketing community. 
            Every photo tells a story of growth, innovation, and shared success.
          </p>
          
          {/* CTA Button with enhanced mobile styling */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto">
            <Link to='/register' className="w-full lg:flex-1">
                <button className="w-full rounded bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:ring-4 focus:ring-orange-500/50 focus:outline-none backdrop-blur-sm">
                    Join Our Community
                </button>
            </Link>
            <a 
              href="#gallery-main"
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => {
                  const gallerySection = document.getElementById('gallery-main');
                  console.log('Gallery section found:', gallerySection); // Debug log
                  if (gallerySection) {
                    gallerySection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  } else {
                    // Fallback: scroll to bottom if element not found
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: 'smooth'
                    });
                  }
                }, 100);
              }}
              className="w-full lg:flex-1 rounded bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:ring-4 focus:ring-white/50 focus:outline-none inline-block text-center cursor-pointer">
              View Gallery
            </a>
          </div>
        </div>
      </div>
      
      {/* Enhanced overlay with gradient for better text readability */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      
      {/* Additional overlay for mobile to ensure text readability */}
      <div className="absolute inset-0 z-10 bg-black/20 sm:bg-black/10" />
      
      {/* 3D Marquee component spanning full width */}
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images} 
      />
    </div>
  );
}
