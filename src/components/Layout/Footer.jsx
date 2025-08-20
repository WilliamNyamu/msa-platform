import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  Send
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Blog", path: "/blog" },
    { name: "Join Now", path: "/register" }
  ];

  const resourceLinks = [
    { name: "Industry Insights", path: "/insights" },
    { name: "Career Resources", path: "/careers" },
    { name: "Member Benefits", path: "/benefits" },
    { name: "Networking Hub", path: "/networking" },
    { name: "Business Case Studies", path: "/case-studies" }
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com", gradient: "from-blue-600 to-blue-700" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com", gradient: "from-purple-600 to-pink-600" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com", gradient: "from-blue-400 to-blue-500" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com", gradient: "from-blue-600 to-blue-800" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com", gradient: "from-red-600 to-red-700" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-orange-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section - Brand & Newsletter */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Brand Section */}
            <div>
              <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <span className="text-white font-bold text-2xl">MSA</span>
                  <p className="text-gray-400 text-sm">Marketing Excellence</p>
                </div>
              </Link>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Empowering the next generation of marketing leaders through innovation, 
                networking, and industry expertise. Join our community of ambitious marketers.
              </p>
            </div>

            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl">Stay Ahead</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Get exclusive marketing insights, event updates, and career opportunities delivered to your inbox.
              </p>
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-slate-900/70 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2">
                  <span>Subscribe</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <ArrowRight className="h-3 w-3 text-orange-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <span>Resources</span>
            </h3>
            <ul className="space-y-4">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <ArrowRight className="h-3 w-3 text-orange-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              <span>Get in Touch</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-orange-500 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-gray-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Email Us</p>
                  <p className="text-white text-sm">marketing@msa-platform.org</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-orange-500 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-gray-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Call Us</p>
                  <p className="text-white text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-orange-500 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-gray-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Visit Us</p>
                  <p className="text-white text-sm">Business School, Room 245</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Recognition */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
              <Award className="h-5 w-5 text-orange-500" />
              <span>Connect & Follow</span>
            </h3>
            
            {/* Social Links */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-gradient-to-br ${social.gradient} text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                    title={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Recognition Badge */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-400 font-semibold text-sm">Excellence Award</span>
              </div>
              <p className="text-gray-400 text-xs">
                Recognized as the #1 Marketing Student Organization 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Marketing Students Association. Crafted with passion for marketing excellence.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-300 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-300 hover:underline"
              >
                Terms of Service
              </Link>
              <Link 
                to="/code-of-conduct" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-300 hover:underline"
              >
                Code of Conduct
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}