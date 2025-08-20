import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { database } from '../firebaseConfig';
import { doc, getDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';
import { ArrowLeft, Clock, User, Tag, Share2, BookOpen, Calendar, Heart, Eye, CircleCheck, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Layout/Navbar';

export default function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [viewTracked, setViewTracked] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    // Enhanced function to render markdown as HTML with better styling and features
    const renderMarkdown = (text) => {
        if (!text) return '';
        
        return text
            // Enhanced headers with better styling
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4 leading-tight border-l-4 border-blue-500 pl-4 hover:text-blue-700 transition-colors">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-6 leading-tight border-b border-gray-200 pb-2 hover:text-blue-700 transition-colors">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-8 leading-tight border-b-2 border-gray-300 pb-3 hover:text-blue-700 transition-colors">$1</h1>')
            
            // Enhanced text formatting with better visual hierarchy
            .replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500 opacity-75">$1</del>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 bg-yellow-100 px-1 rounded">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 font-medium">$1</em>')
            .replace(/==(.*?)==/g, '<mark class="bg-yellow-200 px-1 rounded font-medium">$1</mark>')
            .replace(/\^(.*?)\^/g, '<sup class="text-xs text-gray-600">$1</sup>')
            .replace(/~(.*?)~/g, '<sub class="text-xs text-gray-600">$1</sub>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border">$1</code>')
            
            // Enhanced callout blocks for better content organization
            .replace(/^\> \[!NOTE\] (.*$)/gim, '<div class="border-l-4 border-blue-500 bg-blue-50 p-6 my-6 rounded-r-lg shadow-sm"><div class="flex items-center gap-2 mb-3"><span class="text-blue-600 font-semibold text-sm uppercase tracking-wide">📝 Note</span></div><p class="text-gray-700 leading-relaxed">$1</p></div>')
            .replace(/^\> \[!WARNING\] (.*$)/gim, '<div class="border-l-4 border-yellow-500 bg-yellow-50 p-6 my-6 rounded-r-lg shadow-sm"><div class="flex items-center gap-2 mb-3"><span class="text-yellow-600 font-semibold text-sm uppercase tracking-wide">⚠️ Warning</span></div><p class="text-gray-700 leading-relaxed">$1</p></div>')
            .replace(/^\> \[!TIP\] (.*$)/gim, '<div class="border-l-4 border-green-500 bg-green-50 p-6 my-6 rounded-r-lg shadow-sm"><div class="flex items-center gap-2 mb-3"><span class="text-green-600 font-semibold text-sm uppercase tracking-wide">💡 Tip</span></div><p class="text-gray-700 leading-relaxed">$1</p></div>')
            .replace(/^\> \[!INFO\] (.*$)/gim, '<div class="border-l-4 border-purple-500 bg-purple-50 p-6 my-6 rounded-r-lg shadow-sm"><div class="flex items-center gap-2 mb-3"><span class="text-purple-600 font-semibold text-sm uppercase tracking-wide">ℹ️ Info</span></div><p class="text-gray-700 leading-relaxed">$1</p></div>')
            .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 text-gray-700 italic rounded-r-lg shadow-sm font-medium">$1</blockquote>')
            
            // Enhanced lists with better readability
            .replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc text-gray-700 leading-relaxed py-2 hover:bg-gray-50 px-3 rounded transition-colors">$1</li>')
            .replace(/^\- (.*$)/gim, '<li class="ml-6 list-disc text-gray-700 leading-relaxed py-2 hover:bg-gray-50 px-3 rounded transition-colors">$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal text-gray-700 leading-relaxed py-2 hover:bg-gray-50 px-3 rounded transition-colors">$1</li>')
            .replace(/(<li class="ml-6 list-disc.*?<\/li>)+/gs, '<ul class="space-y-1 my-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">$&</ul>')
            .replace(/(<li class="ml-6 list-decimal.*?<\/li>)+/gs, '<ol class="space-y-1 my-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">$&</ol>')
            
            // Enhanced task lists (checkboxes)
            .replace(/^\- \[x\] (.*$)/gim, '<li class="flex items-center gap-3 text-gray-700 py-3 px-4 bg-green-50 rounded-lg border border-green-200 my-2"><svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg><span class="line-through opacity-75">$1</span></li>')
            .replace(/^\- \[ \] (.*$)/gim, '<li class="flex items-center gap-3 text-gray-700 py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 my-2"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>$1</span></li>')
            
            // Enhanced links and images with better styling
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-8 text-center"><img src="$2" alt="$1" class="max-w-full h-auto rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow mx-auto"><p class="text-center text-sm text-gray-500 mt-3 italic font-medium">$1</p></div>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:bg-blue-50 px-1 py-0.5 rounded transition-all duration-200 font-medium">$1 <svg class="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>')
            
            // Enhanced horizontal rule
            .replace(/^---$/gm, '<hr class="border-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8 rounded">')
            
            // Enhanced code blocks with better styling
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<div class="my-8 rounded-lg overflow-hidden shadow-lg border border-gray-200"><div class="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-semibold flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>$1</div><pre class="bg-gray-900 text-green-400 p-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>$2</code></pre></div>')
            .replace(/```([\s\S]*?)```/g, '<div class="my-8 rounded-lg overflow-hidden shadow-lg border border-gray-200"><div class="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-semibold flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>Code</div><pre class="bg-gray-900 text-green-400 p-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>$1</code></pre></div>')
            
            // Enhanced tables (basic implementation)
            .replace(/\|(.+)\|/g, (match) => {
                const rows = match.trim().split('\n');
                if (rows.length < 2) return match;
                
                const headers = rows[0].split('|').slice(1, -1).map(h => h.trim());
                const separator = rows[1];
                const dataRows = rows.slice(2);
                
                let table = '<div class="my-8 overflow-x-auto"><table class="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-sm">';
                table += '<thead class="bg-gray-100"><tr>';
                headers.forEach(header => {
                    table += `<th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">${header}</th>`;
                });
                table += '</tr></thead><tbody>';
                
                dataRows.forEach(row => {
                    const cells = row.split('|').slice(1, -1).map(c => c.trim());
                    table += '<tr class="hover:bg-gray-50">';
                    cells.forEach(cell => {
                        table += `<td class="border border-gray-300 px-4 py-3 text-gray-700">${cell}</td>`;
                    });
                    table += '</tr>';
                });
                
                table += '</tbody></table></div>';
                return table;
            })
            
            // Enhanced paragraphs and line breaks with better spacing
            .replace(/\n\n/g, '</p><p class="mb-6 leading-relaxed text-gray-700 text-lg">')
            .replace(/\n/g, '<br class="my-1">');
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / documentHeight) * 100;
            
            setReadingProgress(progress);
            setShowScrollTop(scrollTop > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                
                // Query blogs collection using slug field
                const blogsRef = collection(database, 'blogs');
                const q = query(blogsRef, where('slug', '==', slug));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    const blogData = { id: docSnap.id, ...docSnap.data() };
                    setBlog(blogData);
                    
                    // Track view count (only once per session)
                    if (!viewTracked) {
                        try {
                            await updateDoc(docSnap.ref, {
                                views: increment(1)
                            });
                            setBlog(prev => ({
                                ...prev,
                                views: (prev.views || 0) + 1
                            }));
                            setViewTracked(true);
                        } catch (viewError) {
                            console.error('Error tracking view:', viewError);
                        }
                    }
                } else {
                    setError('Blog post not found');
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug, viewTracked]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: blog.title,
                    text: blog.excerpt,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
            
            // Track share count
            try {
                const docRef = doc(database, 'blogs', blog.id);
                await updateDoc(docRef, {
                    shares: increment(1)
                });
                setBlog(prev => ({
                    ...prev,
                    shares: (prev.shares || 0) + 1
                }));
            } catch (shareError) {
                console.error('Error tracking share:', shareError);
            }
        } catch (err) {
            console.error('Error sharing:', err);
            toast.error('Failed to share');
        }
    };

    const handleLike = async () => {
        if (liked) return;
        
        try {
            const docRef = doc(database, 'blogs', blog.id);
            await updateDoc(docRef, {
                likes: increment(1)
            });
            setBlog(prev => ({
                ...prev,
                likes: (prev.likes || 0) + 1
            }));
            setLiked(true);
            toast.success('Thanks for liking this post!');
        } catch (err) {
            console.error('Error liking post:', err);
            toast.error('Failed to like post');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <Navbar />
                <div className="pt-20 flex items-center justify-center min-h-screen p-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/20 max-w-sm w-full shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 animate-pulse"></div>
                            <p className="text-gray-700 font-medium">Loading your article...</p>
                            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the content</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
                <Navbar />
                <div className="pt-20 flex items-center justify-center min-h-screen p-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 max-w-md mx-auto border border-white/20 text-center w-full shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{error}</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">The article you're looking for doesn't exist or has been removed. Don't worry, there are many other great articles to explore.</p>
                        <Link 
                            to="/blog" 
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />
            
            {/* Reading Progress Bar */}
            <div className="fixed top-20 left-0 w-full h-1 bg-gray-200 z-40">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
                    style={{ width: `${readingProgress}%` }}
                ></div>
            </div>

            {/* Hero Section with Featured Image */}
            {blog.image && (
                <div className="relative h-[60vh] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                    <img 
                        src={blog.image} 
                        alt={blog.title || "Article featured image"}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
                        <div className="max-w-4xl mx-auto">
                            <Link 
                                to="/blog" 
                                className="inline-flex items-center text-white/80 hover:text-white transition-colors group mb-6 text-sm font-medium bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                                Back to Blog
                            </Link>
                            
                            {/* Tags */}
                            {blog.tags && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {blog.tags.split(',').map((tag, index) => (
                                        <span 
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                                        >
                                            {tag.trim().replace('#', '')}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
                                {blog.title}
                            </h1>
                            
                            {blog.excerpt && (
                                <p className="text-xl text-white/90 leading-relaxed max-w-3xl drop-shadow-md">
                                    {blog.excerpt}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 relative">
                {/* Floating Action Buttons */}
                <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
                        <button
                            onClick={handleLike}
                            disabled={liked}
                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                                liked 
                                    ? 'bg-red-100 text-red-700 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 shadow-md hover:shadow-lg'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                            <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
                        </button>
                        
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                    
                    {showScrollTop && (
                        <button
                            onClick={scrollToTop}
                            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <ChevronUp className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden my-8 sm:my-12">
                    <div className="p-6 sm:p-8 lg:p-12">
                        {/* Article Header for non-image posts */}
                        {!blog.image && (
                            <header className="mb-8 text-center">
                                <Link 
                                    to="/blog" 
                                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group mb-6 text-sm font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                                    Back to Blog
                                </Link>
                                
                                {/* Tags */}
                                {blog.tags && (
                                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                                        {blog.tags.split(',').map((tag, index) => (
                                            <span 
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
                                            >
                                                {tag.trim().replace('#', '')}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                    {blog.title}
                                </h1>

                                {blog.excerpt && (
                                    <p className="text-xl text-gray-600 leading-relaxed mb-6 max-w-3xl mx-auto">
                                        {blog.excerpt}
                                    </p>
                                )}
                            </header>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 pb-8 mb-8 border-b border-gray-200">
                            {blog.timestamp && (
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    <time>
                                        {new Date(blog.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>
                            )}
                            
                            {blog.readTime && (
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                                    <Clock className="w-4 h-4" />
                                    <span>{blog.readTime} min read</span>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                                <Eye className="w-4 h-4" />
                                <span>{blog?.views || 0} views</span>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-2 rounded-full">
                                <CircleCheck className="w-4 h-4" />
                                <span>Blessed reading</span>
                            </div>
                        </div>

                        {/* Article Content */}
                        {blog.content && (
                            <div className="prose prose-lg prose-blue max-w-none mb-12">
                                <div 
                                    className="text-gray-700 leading-relaxed selection:bg-blue-100"
                                    dangerouslySetInnerHTML={{ 
                                        __html: `<div class="leading-relaxed text-gray-700 text-lg">${renderMarkdown(blog.content)}</div>` 
                                    }}
                                />
                            </div>
                        )}

                        {/* Author Information */}
                        <div className="border-t border-gray-200 pt-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="h-8 w-8 text-gray-500" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Written by {blog.author}
                                    </h3>
                                    {blog.authorDescription && (
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {blog.authorDescription}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {blog.timestamp && (
                                            <span>
                                                Published {new Date(blog.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        )}
                                        {blog.category && (
                                            <span className="text-blue-600">
                                                in {blog.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Call to Action */}
                <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">Enjoyed this article?</h3>
                        <p className="text-blue-100 mb-6 text-lg">Join our community and stay updated with the latest spiritual insights and church news.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                to="/blog" 
                                className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Read More Articles
                            </Link>
                            <Link 
                                to="/registration" 
                                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold"
                            >
                                Join Our Community
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
