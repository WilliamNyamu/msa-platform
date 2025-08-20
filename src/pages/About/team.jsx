import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/use-mobile';
import Treasurer from '/images/team/Treasurer.jpg';
import President from "/images/team/President.jpg";
import PublicityD from "/images/testimonial/William Nyamu.jpg";
import Secretary from '/images/home/dinner.jpg'


const TeamSection = () => {
  const isMobile = useIsMobile();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  const teamMembers = [
    {
      src: President,
      alt: 'Shalom Ndanu',
      caption: " President"
    },
    {
      src: Secretary,
      alt: "Fridah Chepng'eno",
      caption: 'Vice Chairperson'
    },
    {
      src: Secretary,
      alt: 'Benard Mulei',
      caption: 'Secretary General'
    },
    {
      src: Treasurer,
      alt: "Rosalia Saru",
      caption: "Treasurer"
    },
    {
      src: PublicityD,
      alt: "Mosi Rodgers",
      caption: "Sports & Welfare"
    },
    {
      src: Secretary,
      alt: 'Appolinary Kilimba',
      caption: 'International Representative' 
    }
  ];

  return (
    <section id="team" className="py-20 bg-sky-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white text-red-800 text-sm font-medium mb-4">
            <span>UNSA 25/26</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-red-800">Team Infinite</span>
          </h2>
          <p className="text-lg text-gray-700">
            Meet the dedicated individuals for Team Infinite of the Faculty of Business & Management Science
          </p>
        </motion.div>
        
        <div className="relative">
          {!isMobile && (
            <>
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200 focus:outline-none hidden md:block"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200 focus:outline-none hidden md:block"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>
            </>
          )}
          
          <div 
            ref={scrollContainerRef}
            className={cn(
              "flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4",
              "scrollbar-thin scrollbar-thumb-red-800 scrollbar-track-transparent"
            )}
            style={{ 
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 snap-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="glass-card overflow-hidden w-[280px] md:w-[350px] bg-white shadow-lg">
                  <div className="h-[200px] md:h-[250px] overflow-hidden">
                    <img 
                      src={member.src} 
                      alt={member.alt} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-1 flex-grow rounded-full bg-gradient-to-r from-red-700 to-red-900"></div>
                      <Star className="h-5 w-5 text-red-800" fill="currentColor" />
                      <div className="h-1 flex-grow rounded-full bg-gradient-to-r from-red-900 to-red-700"></div>
                    </div>
                    <h3 className="text-xl font-bold text-center">{member.alt}</h3>
                    <p className="text-lg font-semibold text-gray-700 text-center pb-2">{member.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {isMobile && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Swipe left to see more
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;