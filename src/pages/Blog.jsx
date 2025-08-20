import { useState, useEffect } from "react";
import { Calendar, User, ArrowRight, Loader2, Tag, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const blogRef = collection(database, "blogs");
        const q = query(blogRef, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const blogData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        
        // Only show published posts
        const publishedPosts = blogData.filter(post => post.isPublished);
        setBlogPosts(publishedPosts);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Get all unique tags from posts
  const allTags = [...new Set(blogPosts.flatMap(post => 
    post.tags ? post.tags.split(',').map(tag => tag.trim()) : []
  ))];

  // Filter posts based on search and tags
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || (post.tags && post.tags.split(',').map(tag => tag.trim()).includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <section className="bg-gradient-to-r from-orange-500 via-blue-800 to-slate-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 py-5 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">Knowledge Hub</h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto font-inter">
              Stay updated with the latest insights, trends, and opportunities in marketing. 
              Written by students, for students.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <section className="bg-gradient-to-r from-orange-500 via-blue-800 to-slate-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 py-5 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">Knowledge Hub</h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto font-inter">
              Stay updated with the latest insights, trends, and opportunities in marketing.
            </p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 via-blue-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">Knowledge Hub</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto font-inter">
            Stay updated with the latest insights, trends, and opportunities in marketing. 
            Written by students, for students.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-3.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={() => setSelectedTag('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedTag === 'all'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            All Posts
                          </button>
                          {allTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSelectedTag(tag)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedTag === tag
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
                          <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
                            <div className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white rounded-lg">
                              <div className="lg:flex">
                                <div className="lg:w-1/3">
                                  <img 
                                    src={featuredPost.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"}
                                    alt={featuredPost.title}
                                    className="w-full h-40 lg:h-40 object-cover"
                                  />
                                </div>
                                <div className="lg:w-2/3 p-6 flex flex-col justify-between">
                                  <div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {featuredPost.tags && featuredPost.tags.split(',').slice(0, 2).map((tag, index) => (
                                        <span key={index} className="inline-block bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1 rounded-full text-xs font-medium">
                                          {tag.trim()}
                                        </span>
                                      ))}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                      {featuredPost.title}
                                    </h3>
                                    <p className="text-gray-600 mb-3 leading-relaxed line-clamp-2">
                                      {featuredPost.excerpt}
                                    </p>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-1">
                                          <User className="w-4 h-4" />
                                          <span>{featuredPost.author}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="w-4 h-4" />
                                          <span>{formatDate(featuredPost.timestamp)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Clock className="w-4 h-4" />
                                          <span>{featuredPost.readTime} min read</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Eye className="w-4 h-4" />
                                          <span>{(featuredPost.views || 0).toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <Link 
                                      to={`/blog/${featuredPost.slug || featuredPost.id}`}
                                      className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                                    >
                                      Read Full Article
                                      <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

            {/* Other Posts */}
            {otherPosts.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <div key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group bg-white rounded-lg">
                      <div className="relative overflow-hidden">
                        <img 
                          src={post.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                          {post.tags && post.tags.split(',').slice(0, 1).map((tag, index) => (
                            <span key={index} className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime} min read</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>{(post.views || 0).toLocaleString()}</span>
                          </div>
                        </div>
                        <Link 
                          to={`/blog/${post.slug || post.id}`}
                          className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-inter inline-block text-center"
                        >
                          Read Article
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-orange-50 to-indigo-50 border-0 rounded-lg">
            <div className="p-12 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Stay in the Loop
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and never miss the latest marketing insights, 
                career tips, and MSA updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg text-white font-medium transition-all duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
