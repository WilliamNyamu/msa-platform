import { Calendar, User, ArrowRight, Clock, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    
    // Handle Firebase timestamp
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content, readTime) => {
    // Use the calculated readTime if available, otherwise calculate it
    if (readTime) return readTime;
    
    const wordsPerMinute = 200;
    const words = content?.split(' ').length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  // Generate blog URL using slug or fallback to ID
  const getBlogUrl = () => {
    return `/blog/${post.slug || post.id}`;
  };

  return (
    <article className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-100/25 transition-all duration-500 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 rounded-full border border-white/20 shadow-sm">
              {post.category}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {post.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt || post.timestamp)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{getReadingTime(post.content, post.readTime)} min read</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {post.excerpt || post.content?.substring(0, 150) + '...'}
        </p>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.split(',').slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full"
              >
                {tag.trim().replace('#', '')}
              </span>
            ))}
          </div>
        )}

        {/* Footer with Stats and Read More */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {post.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
            )}
            {post.likes !== undefined && (
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
            )}
          </div>

          {/* Read More Link */}
          <Link
            to={getBlogUrl()}
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 group/link"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
}