import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    PlusCircle, Search, Filter, Eye, Calendar, User, Tag, FileText, Star, StarOff, Edit, Trash2,
    TrendingUp, Heart, Share2, MessageCircle, BarChart3, Users, Clock
} from "lucide-react";
import { database } from "../../../firebaseConfig";
import { collection, getDocs, doc, deleteDoc, orderBy, query } from "firebase/firestore";
import { toast } from "sonner";

export default function AdminBlogList() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        async function fetchBlogs() {
            try {
                const blogRef = collection(database, "blogs");
                const q = query(blogRef, orderBy("timestamp", "desc"));
                const snapshot = await getDocs(q);
                const blogData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setBlogs(blogData);
            } catch (error) {
                toast.error("Failed to fetch blogs: " + error.message, { 
                    style: { backgroundColor: "#fee2e2", color: "#dc2626" } 
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    async function handleDelete(blogId) {
        if (window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(database, "blogs", blogId));
                setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
                toast.success("Blog deleted successfully.", {
                    style: { backgroundColor: "#dcfce7", color: "#166534" }
                });
            } catch (error) {
                toast.error("Failed to delete blog: " + error.message, {
                    style: { backgroundColor: "#fee2e2", color: "#dc2626" }
                });
            }
        }
    }

    // Filter and search blogs
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterBy === "featured") return matchesSearch && blog.isFeatured;
        if (filterBy === "draft") return matchesSearch && blog.isDraft;
        return matchesSearch;
    });

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Calculate analytics summary
    const analyticsData = {
        totalBlogs: blogs.length,
        totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
        totalLikes: blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0),
        totalShares: blogs.reduce((sum, blog) => sum + (blog.shares || 0), 0),
        totalComments: blogs.reduce((sum, blog) => sum + (blog.comments || 0), 0),
        publishedBlogs: blogs.filter(blog => blog.isPublished).length,
        featuredBlogs: blogs.filter(blog => blog.isFeatured).length,
        avgEngagement: blogs.length > 0 ? Math.round(
            blogs.reduce((sum, blog) => sum + ((blog.likes || 0) + (blog.shares || 0) + (blog.comments || 0)), 0) / blogs.length
        ) : 0
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
                        <p className="text-blue-100">Create, edit, and manage your blog content</p>
                    </div>
                    <Link to="/admin/blogs/new">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-xl hover:bg-blue-50 focus:ring-4 focus:outline-none focus:ring-white/30 font-medium text-sm transition-all duration-200 shadow-lg">
                            <PlusCircle className="w-5 h-5" />
                            Create New Blog    
                        </button>
                    </Link>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Blogs</p>
                            <p className="text-3xl font-bold">{analyticsData.totalBlogs}</p>
                            <p className="text-blue-200 text-xs mt-1">
                                {analyticsData.publishedBlogs} published
                            </p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Views</p>
                            <p className="text-3xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
                            <p className="text-green-200 text-xs mt-1">
                                {analyticsData.totalBlogs > 0 ? Math.round(analyticsData.totalViews / analyticsData.totalBlogs) : 0} avg per blog
                            </p>
                        </div>
                        <Eye className="w-8 h-8 text-green-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Engagement</p>
                            <p className="text-3xl font-bold">{(analyticsData.totalLikes + analyticsData.totalShares + analyticsData.totalComments).toLocaleString()}</p>
                            <p className="text-purple-200 text-xs mt-1">
                                {analyticsData.avgEngagement} avg per blog
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Featured Posts</p>
                            <p className="text-3xl font-bold">{analyticsData.featuredBlogs}</p>
                            <p className="text-orange-200 text-xs mt-1">
                                {analyticsData.totalBlogs > 0 ? Math.round((analyticsData.featuredBlogs / analyticsData.totalBlogs) * 100) : 0}% of total
                            </p>
                        </div>
                        <Star className="w-8 h-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search blogs by title, author, or excerpt..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="all">All Blogs</option>
                            <option value="featured">Featured</option>
                            <option value="draft">Drafts</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredBlogs.length > 0 ? (
                <div className="space-y-4">
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex gap-6">
                                {/* Blog Image */}
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
                                    {blog.image ? (
                                        <img 
                                            src={blog.image} 
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FileText className="w-8 h-8 text-blue-500" />
                                    )}
                                </div>

                                {/* Blog Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-1">
                                                {blog.title || 'Untitled Blog'}
                                            </h3>
                                            <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                                                {blog.excerpt || 'No excerpt available...'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Blog Meta */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                                        {blog.author && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                <span>{blog.author}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(blog.timestamp)}</span>
                                        </div>
                                        {blog.tags && (
                                            <div className="flex items-center gap-1">
                                                <Tag className="w-4 h-4" />
                                                <span>{blog.tags}</span>
                                            </div>
                                        )}
                                        {blog.readTime > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{blog.readTime} min read</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Engagement Metrics */}
                                    <div className="flex items-center gap-6 mb-4 p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <Eye className="w-4 h-4" />
                                            <span className="text-sm font-medium">{blog.views || 0}</span>
                                            <span className="text-xs text-slate-500">views</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-red-600">
                                            <Heart className="w-4 h-4" />
                                            <span className="text-sm font-medium">{blog.likes || 0}</span>
                                            <span className="text-xs text-slate-500">likes</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Share2 className="w-4 h-4" />
                                            <span className="text-sm font-medium">{blog.shares || 0}</span>
                                            <span className="text-xs text-slate-500">shares</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-purple-600">
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">{blog.comments || 0}</span>
                                            <span className="text-xs text-slate-500">comments</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-orange-600 ml-auto">
                                            <BarChart3 className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                {((blog.likes || 0) + (blog.shares || 0) + (blog.comments || 0))}
                                            </span>
                                            <span className="text-xs text-slate-500">engagement</span>
                                        </div>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex items-center gap-2 mb-4">
                                        {blog.isPublished ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                                Draft
                                            </span>
                                        )}
                                        {blog.isFeatured && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                <Star className="w-3 h-3" />
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        <Link to={`/blog/${blog.slug || blog.id}`}>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </Link>
                                        <Link to={`/admin/blogs/edit/${blog.id}`}>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm">
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </Link>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm">
                                            <BarChart3 className="w-4 h-4" />
                                            Analytics
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/20 shadow-lg text-center">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-600 mb-2">No blogs found</h3>
                    <p className="text-slate-500 mb-6">
                        {searchTerm || filterBy !== "all" 
                            ? "Try adjusting your search or filter criteria"
                            : "Get started by creating your first blog post"
                        }
                    </p>
                    <Link to="/admin/blogs/new">
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm transition-all duration-200 mx-auto">
                            <PlusCircle className="w-5 h-5" />
                            Create Your First Blog
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}