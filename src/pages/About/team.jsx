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
      name: 'Shalom Ndanu',
      position: "President",
      description: "Leading MSA with vision, enthusiasm and dedication to student excellence.",
      linkedin: "https://linkedin.com/in/shalom-ndanu",
      twitter: "https://twitter.com/shalomndanu",
      email: "shalom@msa.ac.ke"
    },
    {
      src: "/images/team/rick.jpg",
      name: "Rick",
      position: 'Vice President',
      description: "Passionate about student welfare and community building.",
      linkedin: "https://linkedin.com/in/rick",
      twitter: "https://twitter.com/rick",
      email: "rick@msa.ac.ke"
    },
    {
      src: "/images/team/saru.jpg",
      name: "Rosalia Saru",
      position: "Treasurer",
      description: "Managing finances with transparency and accountability.",
      linkedin: "https://linkedin.com/in/rosalia-saru",
      twitter: "https://twitter.com/rosaliasaru",
      email: "rosalia@msa.ac.ke"
    },
    {
      src: "/images/team/madigo.jpg",
      name: "Juliet Madigo",
      position: "Secretary General",
      description: "Ensuring smooth operations within the organization",
      linkedin: "https://linkedin.com/in/rosalia-saru",
      twitter: "https://twitter.com/rosaliasaru",
      email: "rosalia@msa.ac.ke"
    },
    {
      src: "/images/team/celestine.jpg",
      name: 'Celestine Nyarobila',
      position: 'Organizing Secretary',
      description: "Ensuring smooth operations and effective communication.",
      linkedin: "https://linkedin.com/in/celestine-nyarobila",
      twitter: "https://twitter.com/celestinen",
      email: "celestine@msa.ac.ke"
    },
    {
      src: "/images/team/William.jpg",
      name: "William Nyamu",
      position: "Publicity Director",
      description: "Managing digital presence and hacking growth within MSA",
      linkedin: "https://linkedin.com/in/william-nyamu",
      twitter: "https://twitter.com/williamnyamu",
      email: "william@msa.ac.ke"
    },
    {
      src: "/images/team/shiren.jpg",
      name: "Shiren Joel",
      position: "Publicity Coordinator",
      description: "Crafting compelling narratives and managing digital presence.",
      linkedin: "https://linkedin.com/in/shiren-joel",
      twitter: "https://x.com/shirenjoel",
      email: "shiren@msa.ac.ke"
    },
    {
      src: "/images/team/eva.jpg",
      name: 'Eva Kisongochi',
      position: 'Publicity Assistant Director',
      description: "Building global connections and partnerships for MSA.",
      linkedin: "https://linkedin.com/in/eva-kisongochi",
      twitter: "https://twitter.com/evaK",
      email: "eva@msa.ac.ke"
    },
    {
      src: "/images/team/lestone.jpg",
      name: 'Lestone Asakhulu',
      position: 'Second Year Representative',
      description: "Building connections and partnerships for MSA among sophomores",
      linkedin: "https://linkedin.com/in/eva-kisongochi",
      twitter: "https://twitter.com/evaK",
      email: "eva@msa.ac.ke"
    },
    {
      src: "/images/team/rep3.jpg",
      name: 'Margaret Mutenyo',
      position: 'Mentorship Affairs Coordinator',
      description: "Creating connections that spark growth, confidence, and bold career moves.",
      linkedin: "https://linkedin.com/in/margaretmutenyo",
      twitter: "",
      email: ""
    }
  ];

  return (
    <section id="team" className="py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 relative overflow-hidden">
      {/* Background Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-600/5 rounded-full transform -translate-x-16 translate-y-16"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-orange-400/3 rounded-full transform -translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200/50 text-orange-700 text-sm font-medium mb-8 shadow-sm">
            <Star className="w-4 h-4 mr-2 text-orange-600" fill="currentColor" />
            <span>MSA Executive 25/26</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-light text-slate-900 mb-8 leading-tight">
            Meet Our
            <span className="block font-semibold bg-gradient-to-r from-orange-600 via-orange-700 to-slate-700 bg-clip-text text-transparent">
              Leadership Team
            </span>
          </h2>
          
          {/* <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-grow max-w-24"></div>
            <div className="mx-4 w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-grow max-w-24"></div>
          </div> */}
          
          <p className="text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
            Dedicated individuals committed to advancing marketing education and fostering 
            professional growth within our vibrant student community.
          </p>
        </motion.div>
        
        <div className="relative">
          {!isMobile && (
            <>
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-200 hidden md:flex items-center justify-center group"
                aria-label="Scroll left to see previous team members"
              >
                <ChevronLeft className="h-6 w-6 text-slate-700 group-hover:text-orange-600 transition-colors duration-200" />
              </button>
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-200 hidden md:flex items-center justify-center group"
                aria-label="Scroll right to see more team members"
              >
                <ChevronRight className="h-6 w-6 text-slate-700 group-hover:text-orange-600 transition-colors duration-200" />
              </button>
            </>
          )}
          
          <div 
            ref={scrollContainerRef}
            className={cn(
              "flex gap-8 overflow-x-auto snap-x snap-mandatory pb-10 -mx-6 px-6 md:px-16",
              "scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent hover:scrollbar-thumb-orange-400",
              "scroll-smooth"
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
                whileHover={{ 
                  y: -12, 
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden w-[340px] md:w-[400px] border border-white/50 hover:border-orange-200/50">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Image Section */}
                  <div className="relative h-[300px] md:h-[340px] overflow-hidden rounded-t-3xl">
                    <img 
                      src={member.src} 
                      alt={`${member.name} - ${member.position}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Social Links Overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 shadow-lg text-slate-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-200"
                        aria-label={`Visit ${member.name}'s LinkedIn profile`}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-400 transition-all duration-300 shadow-lg text-slate-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-200"
                        aria-label={`Visit ${member.name}'s Twitter profile`}
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-slate-600 transition-all duration-300 shadow-lg text-slate-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-slate-200"
                        aria-label={`Send email to ${member.name}`}
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="relative p-8 space-y-4">
                    {/* Decorative Element */}
                    <div className="flex items-center justify-center space-x-2 mb-6">
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
                      <Star className="h-5 w-5 text-orange-600" fill="currentColor" />
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-lg font-medium text-orange-600 mb-4 tracking-wide">
                        {member.position}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {isMobile && (
            <motion.div 
              className="text-center mt-8 flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent to-slate-300 flex-grow max-w-16"></div>
              <span className="text-sm text-slate-500 font-medium px-3">Swipe to explore more leaders</span>
              <div className="h-px bg-gradient-to-l from-transparent to-slate-300 flex-grow max-w-16"></div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
