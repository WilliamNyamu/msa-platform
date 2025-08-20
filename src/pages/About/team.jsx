import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Linkedin, Twitter, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/use-mobile';


const TeamSection = () => {
  const isMobile = useIsMobile();
  const scrollContainerRef = React.useRef(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };
  
  const teamMembers = [
    {
      src: "/images/team/shalom.jpg",
      alt: 'Shalom Ndanu',
      caption: "President",
      bio: "Leading MSA with vision and dedication to student excellence.",
      linkedin: "https://linkedin.com/in/shalom-ndanu",
      twitter: "https://twitter.com/shalomndanu",
      email: "shalom@msa.ac.ke"
    },
    {
      src: "/images/team/rick.jpg",
      alt: "Rick",
      caption: 'Vice President',
      bio: "Passionate about student welfare and community building.",
      linkedin: "https://linkedin.com/in/rick",
      twitter: "https://twitter.com/rick",
      email: "rick@msa.ac.ke"
    },
    {
      src: "images/team/celestine.jpg",
      alt: 'Celestine Nyarobila',
      caption: 'Secretary General',
      bio: "Ensuring smooth operations and effective communication.",
      linkedin: "https://linkedin.com/in/celestine-nyarobila",
      twitter: "https://twitter.com/celestinen",
      email: "celestine@msa.ac.ke"
    },
    {
      src: "/images/team/saru.jpg",
      alt: "Rosalia Saru",
      caption: "Treasurer",
      bio: "Managing finances with transparency and accountability.",
      linkedin: "https://linkedin.com/in/rosalia-saru",
      twitter: "https://twitter.com/rosaliasaru",
      email: "rosalia@msa.ac.ke"
    },
    {
      src: "/images/team/William.jpg",
      alt: "William Nyamu",
      caption: "Publicity Director",
      bio: "Crafting compelling narratives and managing digital presence.",
      linkedin: "https://linkedin.com/in/william-nyamu",
      twitter: "https://twitter.com/williamnyamu",
      email: "william@msa.ac.ke"
    },
    {
      src: "/images/team/madigo.jpg",
      alt: "Juliet Madigo",
      caption: "Organizing Secretary",
      bio: "Crafting compelling narratives and managing digital presence.",
      linkedin: "https://linkedin.com/in/madigo",
      twitter: "https://twitter.com/madigo",
      email: "madigo@msa.ac.ke"
    },
    {
      src: "/images/team/eva.jpg",
      alt: "Eva Kisongochi",
      caption: "Publicity Assitant Coordinator",
      bio: "Crafting compelling narratives and managing digital presence.",
      linkedin: "https://linkedin.com/in/william-nyamu",
      twitter: "https://twitter.com/williamnyamu",
      email: "william@msa.ac.ke"
    },
    {
      src: "/images/team/lestone.jpg",
      alt: 'Lestone Asakhulu',
      caption: 'Second Year Representative',
      bio: "Building connections and partnerships for MSA among second years.",
      linkedin: "https://linkedin.com/in/appolinary-kilimba",
      twitter: "https://twitter.com/apollinaryK",
      email: "appolinary@msa.ac.ke"
    }
  ];

  return (
    <section id="team" className="py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-600/5 rounded-full transform -translate-x-16 translate-y-16"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200/50 text-orange-700 text-sm font-medium mb-6 shadow-sm">
            <Star className="w-4 h-4 mr-2 text-orange-600" />
            <span>MSA Exec 25/26</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 leading-tight">
            Meet Our
            <span className="block font-semibold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Leadership Team
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-slate-600 font-light leading-relaxed">
            Dedicated individuals committed to advancing marketing education and fostering 
            professional growth within our student community.
          </p>
        </motion.div>
        
        <div className="relative">
          {!isMobile && (
            <>
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 hidden md:flex items-center justify-center group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
              </button>
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 hidden md:flex items-center justify-center group"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
              </button>
            </>
          )}
          
          <div 
            ref={scrollContainerRef}
            className={cn(
              "flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 md:px-12",
              "scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent hover:scrollbar-thumb-blue-400"
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -8 }}
              >
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden w-[320px] md:w-[380px] border border-white/50">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Image Section */}
                  <div className="relative h-[280px] md:h-[320px] overflow-hidden">
                    <img 
                      src={member.src} 
                      alt={member.alt} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Social Links Overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 shadow-lg text-gray-600 hover:text-gray-100"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-400 transition-all duration-300 shadow-lg text-gray-600 hover:text-gray-100"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-slate-600 transition-all duration-300 shadow-lg text-gray-600 hover:text-gray-100"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="relative p-6 space-y-4">
                    {/* Decorative Element */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
                      <Star className="h-4 w-4 text-orange-600" fill="currentColor" />
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                        {member.alt}
                      </h3>
                      <p className="text-lg font-medium text-orange-600 mb-3">
                        {member.caption}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {isMobile && (
            <motion.p 
              className="text-center text-sm text-slate-500 mt-6 flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>Swipe to explore more leaders</span>
              <ChevronRight className="w-4 h-4" />
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;