import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/use-mobile';

const TeamSection = () => {
  const isMobile = useIsMobile();
  const scrollContainerRef = React.useRef(null);
  
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
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      alt: 'Moses Otieno',
      caption: 'MSA Chairperson',
      linkedin: 'https://linkedin.com/in/moses-otieno',
      twitter: 'https://x.com/moses_otieno',
      instagram: 'https://instagram.com/moses_otieno',
      email: 'moses.otieno@msa.ac.ke'
    },
    {
      src: "https://images.unsplash.com/photo-1494790108755-2616b5b3e3ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      alt: "Fridah Chepng'eno",
      caption: 'Vice Chairperson',
      linkedin: 'https://linkedin.com/in/fridah-chepngeno',
      twitter: 'https://x.com/fridah_chepngeno',
      email: 'fridah.chepngeno@msa.ac.ke'
    },
    {
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      alt: 'Benard Mulei',
      caption: 'Secretary General',
      linkedin: 'https://linkedin.com/in/benard-mulei',
      twitter: 'https://x.com/benard_mulei',
      email: 'benard.mulei@msa.ac.ke'
    },
    {
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      alt: "Nellius Nyambura",
      caption: "Treasurer",
      linkedin: 'https://linkedin.com/in/nellius-nyambura',
      email: 'nellius.nyambura@msa.ac.ke'
    },
    {
      src: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      alt: "Mosi Rodgers",
      caption: "Sports & Welfare",
      linkedin: 'https://linkedin.com/in/mosi-rodgers',
      twitter: 'https://x.com/mosi_rodgers',
      email: 'mosi.rodgers@msa.ac.ke'
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      alt: 'Appolinary Kilimba',
      caption: 'International Representative',
      linkedin: 'https://linkedin.com/in/appolinary-kilimba',
      twitter: 'https://x.com/appolinary_kilimba',
      email: 'appolinary.kilimba@msa.ac.ke'
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
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white text-blue-800 text-sm font-medium mb-4">
            <span>MSA 2024/25</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-blue-800">Leadership Team</span>
          </h2>
          <p className="text-lg text-gray-700">
            Meet the dedicated individuals leading the Marketing Students Association towards excellence and innovation
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
              "scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-transparent"
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
                <div className="glass-card overflow-hidden w-[280px] md:w-[350px] bg-white shadow-lg rounded-2xl">
                  <div className="h-[200px] md:h-[250px] overflow-hidden">
                    <img 
                      src={member.src} 
                      alt={member.alt} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-1 flex-grow rounded-full bg-gradient-to-r from-blue-700 to-blue-900"></div>
                      <Star className="h-5 w-5 text-blue-800" fill="currentColor" />
                      <div className="h-1 flex-grow rounded-full bg-gradient-to-r from-blue-900 to-blue-700"></div>
                    </div>
                    <h3 className="text-xl font-bold text-center">{member.alt}</h3>
                    <p className="text-lg font-semibold text-gray-700 text-center pb-2">{member.caption}</p>
                    
                    {/* Social Links */}
                    <div className="flex justify-center space-x-3 pt-2">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/social w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                          aria-label={`${member.alt}'s LinkedIn profile`}
                        >
                          <Linkedin className="h-4 w-4 group-hover/social:scale-110 transition-transform duration-200" />
                        </a>
                      )}
                      
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/social w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-white hover:from-gray-900 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                          aria-label={`${member.alt}'s X (Twitter) profile`}
                        >
                          <Twitter className="h-4 w-4 group-hover/social:scale-110 transition-transform duration-200" />
                        </a>
                      )}

                      {member.instagram && (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/social w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                          aria-label={`${member.alt}'s Instagram profile`}
                        >
                          <Instagram className="h-4 w-4 group-hover/social:scale-110 transition-transform duration-200" />
                        </a>
                      )}

                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="group/social w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                          aria-label={`Email ${member.alt}`}
                        >
                          <Mail className="h-4 w-4 group-hover/social:scale-110 transition-transform duration-200" />
                        </a>
                      )}
                    </div>
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
              target="_blank"
              rel="noopener noreferrer"
              className="group/social w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label={`${leader.name}'s LinkedIn profile`}
            >
              <Linkedin className="h-5 w-5 group-hover/social:scale-110 transition-transform duration-200" />
            </a>
          )}
          
          {leader.twitter && (
            <a
              href={leader.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group/social w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-white hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label={`${leader.name}'s X (Twitter) profile`}
            >
              <Twitter className="h-5 w-5 group-hover/social:scale-110 transition-transform duration-200" />
            </a>
          )}

          {leader.email && (
            <a
              href={`mailto:${leader.email}`}
              className="group/social w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label={`Email ${leader.name}`}
            >
              <Mail className="h-5 w-5 group-hover/social:scale-110 transition-transform duration-200" />
            </a>
          )}
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

// Example usage component
export default function Leadership() {
  // Sample leader data - replace with your actual data
  const leaders = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "President",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b5b3e3ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      bio: "Leading our organization with vision and passion for marketing excellence. Dedicated to fostering innovation and growth.",
      linkedin: "https://linkedin.com/in/sarah-johnson",
      twitter: "https://x.com/sarah_johnson",
      email: "sarah.johnson@msa-platform.org"
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Vice President",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      bio: "Strategic thinker focused on building meaningful partnerships and driving member engagement across all initiatives.",
      linkedin: "https://linkedin.com/in/michael-chen",
      twitter: "https://x.com/michael_chen",
      email: "michael.chen@msa-platform.org"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Marketing Director",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      bio: "Creative marketing professional with expertise in digital campaigns and brand storytelling for student organizations.",
      linkedin: "https://linkedin.com/in/emily-rodriguez",
      twitter: "https://x.com/emily_rodriguez",
      email: "emily.rodriguez@msa-platform.org"
    },
    {
      id: 4,
      name: "David Park",
      position: "Events Coordinator",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      bio: "Passionate about creating memorable experiences and bringing the marketing community together through innovative events.",
      linkedin: "https://linkedin.com/in/david-park",
      twitter: "https://x.com/david_park"
    },
    {
      id: 5,
      name: "Aisha Patel",
      position: "Treasury Manager",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      bio: "Detail-oriented finance professional ensuring sustainable growth and transparent financial management for our organization.",
      linkedin: "https://linkedin.com/in/aisha-patel",
      email: "aisha.patel@msa-platform.org"
    },
    {
      id: 6,
      name: "James Wilson",
      position: "Technology Lead",
      photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      bio: "Tech enthusiast bridging marketing and technology to create innovative solutions for modern marketing challenges.",
      linkedin: "https://linkedin.com/in/james-wilson",
      twitter: "https://x.com/james_wilson",
      email: "james.wilson@msa-platform.org"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full mb-6">
            <ExternalLink className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-orange-800 font-medium text-sm">Meet Our Team</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Leadership Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the dedicated individuals driving our mission forward. Our leadership team brings 
            diverse expertise and passion to create exceptional experiences for our marketing community.
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>

        {/* Join Leadership CTA */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Lead?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              We're always looking for passionate individuals to join our leadership team. 
              If you're ready to make a difference in the marketing community, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:leadership@msa-platform.org"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Mail className="mr-2 h-5 w-5" />
                <span>Apply for Leadership</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all duration-300"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                <span>Learn More</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
