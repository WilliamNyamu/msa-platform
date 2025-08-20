import { Linkedin, Twitter, ExternalLink, Mail } from 'lucide-react';

const LeaderCard = ({ leader }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card Content */}
      <div className="relative p-8">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-orange-200 transition-colors duration-300">
              <img
                src={leader.photo}
                alt={leader.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Leader Info */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
            {leader.name}
          </h3>
          <p className="text-lg font-medium text-orange-600 mb-2">
            {leader.position}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Bio/Description */}
        {leader.bio && (
          <p className="text-gray-600 text-center text-sm leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {leader.bio}
          </p>
        )}

        {/* Social Links */}
        <div className="flex justify-center space-x-4">
          {leader.linkedin && (
            <a
              href={leader.linkedin}
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
