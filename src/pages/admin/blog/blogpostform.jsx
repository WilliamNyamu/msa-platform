import { useState, useEffect } from "react";
import { database } from "../../../firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { Upload, ArrowLeft, Type, FileText, Tag, User, ImageIcon, BookMarked } from "lucide-react";
import { storage } from "../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { Link, useParams, useNavigate } from 'react-router-dom'
import MarkdownEditor from "../../../components/MarkdownEditor";


export default function BlogPostForm(){
    const {id} = useParams(); //Get the article ID from the URL
    const navigate = useNavigate();
    //Set up the collection reference for blogs in the database
    const collectionRef = collection(database, "blogs")

    //Loading state for submission status
    const [isSubmitting, setIsSubmitting] = useState(false);

    //State for blog data
    const [blogData, setBlogData] = useState({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        category: '',
        author: '',
        authorDescription: '',
        // Analytics fields
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        readTime: 0, // in minutes
        isPublished: false,
        isFeatured: false,
        publishedAt: null,
        lastUpdated: null
    })

    // Function to calculate read time based on content
    function calculateReadTime(content) {
        const wordsPerMinute = 200; // Average reading speed
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    // Function to handle form input changes
    function handleChange(e){
        const {name, value} = e.currentTarget || e.target
        setBlogData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // Special handler for MarkdownEditor content
    function handleContentChange(e) {
        const content = e.target.value;
        setBlogData((prev) => ({
            ...prev,
            content: content,
            readTime: calculateReadTime(content) // Auto-calculate read time
        }));
    }

    //State for the selected image file for upload
    const [uploadImage, setUploadImage] = useState(null)

    //Function to handle image file selection
    function handleImageUpload(e){
        setUploadImage(e.target.files[0]);
    }

    //State for the ImageDownload URL
    const [imageDownloadURL, setImageDownloadURL] = useState(null);

    //Function to upload the image and get the download URL
    function handleImageSubmit(){
        return new Promise((resolve, reject) => {
            if (!uploadImage) {
                reject(new Error("No image selected"));
                return;
            }
            
            const imageRef = ref(storage, `blog/images/${uploadImage.name}`);
            const uploadTask = uploadBytesResumable(imageRef, uploadImage)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    toast(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error("Upload failed", error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            console.log("Image uploaded successfully", downloadURL);
                            setImageDownloadURL(downloadURL);
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            console.error("Failed to get download URL", error);
                            reject(error);
                        })
                }
            )
        })
    }

    //Function to generate a slug so that the blog can be accessed using it instead of the id
    function generateSlug(title){
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') //Replace non-alphanumeric characters with hyphens
            .replace(/^-+|-+$/g, '') //Remove leading and trailing hyphens
    }

    useEffect(() => {
        if (id) {
            //Fetch the blog data for editing
            const fetchBlog = async () => {
                try {
                    const docRef = doc(database, 'blogs', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setBlogData(data);
                        setImageDownloadURL(data.image || null); // Ensure image URL is set for preview
                    } else {
                        toast.error("Blog not found.")
                        //Navigate to somewhere
                    }
                } catch (error) {
                    toast.error("Failed to fetch blog: " + error.message)

                }
            };
            fetchBlog();
        }
    }, [id])

    //Functiom to handle form submission
    async function handleSubmit(e){
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const downloadURL = uploadImage ? await handleImageSubmit() : imageDownloadURL;
            const slug = generateSlug(blogData.title);

            if (id) {
                //Update existing article
                const docRef = doc(database, 'blogs', id);
                await updateDoc(docRef, {
                    ...blogData,
                    image: downloadURL,
                    slug,
                    lastUpdated: serverTimestamp(),
                });
                toast.success("Blog updated successfully!");
            } else {
                //Create new article
                const currentTimestamp = serverTimestamp();
                await addDoc(collectionRef, {
                    ...blogData,
                    image: downloadURL,
                    timestamp: currentTimestamp,
                    publishedAt: blogData.isPublished ? currentTimestamp : null,
                    lastUpdated: currentTimestamp,
                    slug,
                    // Initialize analytics fields for new posts
                    views: 0,
                    likes: 0,
                    shares: 0,
                    comments: 0,
                    engagementScore: 0, // Combined engagement metric
                });
                toast.success("Blog created successfully!");
            }

            //Navigate to somewhere
            
        } catch (error) {
            toast.error("Failed to submit the blog: " +  error.message);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-light text-slate-800 mb-2">
                                {id ? 'Edit Blog Post' : 'Create New Blog Post'}
                            </h1>
                            <p className="text-slate-600">
                                {id ? 'Update your blog post content and settings' : 'Share your thoughts and stories with the community'}
                            </p>
                        </div>
                        <Link 
                            to="/admin/blogs"
                            className="inline-flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title Field */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <Type className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <label htmlFor="title" className="block text-lg font-medium text-slate-800">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <p className="text-sm text-slate-500">Enter a compelling title for your blog post</p>
                            </div>
                        </div>
                        <input 
                            id="title"
                            type="text"
                            name="title"
                            value={blogData.title}
                            onChange={handleChange}
                            placeholder="Enter your blog title..."
                            className="w-full bg-white/50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* Excerpt Field */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="excerpt" className="block text-lg font-medium text-slate-800">
                                    Excerpt <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">A brief summary of your blog post</p>
                                    <span className={`text-xs font-medium ${
                                        blogData.excerpt.length > 160 
                                            ? 'text-red-600' 
                                            : blogData.excerpt.length > 140 
                                                ? 'text-yellow-600' 
                                                : 'text-slate-500'
                                    }`}>
                                        {blogData.excerpt.length}/160
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <input 
                                id="excerpt"
                                type="text"
                                name="excerpt"
                                value={blogData.excerpt}
                                onChange={handleChange}
                                placeholder="Enter a compelling excerpt..."
                                maxLength={160}
                                className={`w-full bg-white/50 border text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                    blogData.excerpt.length > 160 
                                        ? 'border-red-300 focus:ring-red-400' 
                                        : blogData.excerpt.length > 140 
                                            ? 'border-yellow-300 focus:ring-yellow-400' 
                                            : 'border-slate-200 focus:ring-slate-400'
                                }`}
                                required
                            />
                            {blogData.excerpt.length > 140 && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <p className="text-xs text-yellow-800">
                                            {blogData.excerpt.length > 160 
                                                ? 'Excerpt is too long! Search engines may truncate it.' 
                                                : 'Approaching character limit. Consider keeping it shorter for better SEO.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-3 text-xs text-slate-500">
                            <p><strong>SEO Tip:</strong> Keep your excerpt under 160 characters for optimal search engine display</p>
                        </div>
                    </div>
            <MarkdownEditor
                value={blogData.content}
                onChange={handleContentChange}
                placeholder="Write your blog content here using Markdown..."
                rows={15}
            />

            {/* Featured Image */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-800">Featured Image</h3>
                        <p className="text-sm text-slate-500">Choose an eye-catching image for your blog post</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl py-12 px-6 bg-white/30 hover:bg-white/50 transition-colors">
                            <div className="flex justify-center">
                                <label htmlFor="image" className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-xl flex items-center justify-center transition-colors">
                                    <Upload className="mr-2 h-5 w-5 text-slate-600" />
                                    <span className="text-slate-700 font-medium">Select Image</span>
                                </label>
                                <input 
                                    id="image"
                                    type="file"
                                    name="image"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <p className="mt-4 text-sm text-slate-500 text-center">
                                Click to upload or drag and drop<br />
                                <span className="text-slate-400">SVG, PNG, JPG or GIF (max. 2MB)</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        {imageDownloadURL && !uploadImage && (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-slate-700">Current Image:</p>
                                <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-white/50">
                                    <img 
                                        src={imageDownloadURL}
                                        alt="Current Blog Featured"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                        {uploadImage && (
                            <div className="space-y-3">
                                <p className='text-sm font-medium text-slate-700'>New Image Preview:</p>
                                <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-white/50">
                                    <img 
                                        src={URL.createObjectURL(uploadImage)}
                                        alt="New Featured Image Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                        {!imageDownloadURL && !uploadImage && (
                            <div className="w-full h-48 rounded-xl border border-slate-200 bg-white/30 flex items-center justify-center">
                                <p className="text-slate-400">Image preview will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tags Field */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Tag className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-lg font-medium text-slate-800">
                            Tags <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-slate-500">Add relevant tags separated by commas</p>
                    </div>
                </div>
                <input 
                    id="tags"
                    type="text"
                    name="tags"
                    value={blogData.tags}
                    onChange={handleChange}
                    placeholder="faith, community, mission, outreach..."
                    className="w-full bg-white/50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                    required
                />
            </div>
            {/* Category Field */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <BookMarked className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-lg font-medium text-slate-800">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-slate-500">Add the major category for the blog</p>
                    </div>
                </div>
                <input 
                    id="category"
                    type="text"
                    name="category"
                    value={blogData.category}
                    onChange={handleChange}
                    placeholder="faith, community, mission, outreach, dating..."
                    className="w-full bg-white/50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                    required
                />
            </div>

            {/* Author Information */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-800">Author Information</h3>
                        <p className="text-sm text-slate-500">Provide details about the blog author</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-2">
                            Author Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            id="author"
                            type="text"
                            name="author"
                            value={blogData.author}
                            onChange={handleChange}
                            placeholder="Enter author name..."
                            className="w-full bg-white/50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="authorDescription" className="block text-sm font-medium text-slate-700 mb-2">
                            Author Bio <span className="text-red-500">*</span>
                        </label>
                        <input 
                            id="authorDescription"
                            type="text"
                            name="authorDescription"
                            value={blogData.authorDescription}
                            onChange={handleChange}
                            placeholder="Brief description about the author..."
                            className="w-full bg-white/50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Analytics & Publishing Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-800">Analytics & Publishing</h3>
                        <p className="text-sm text-slate-500">Configure publishing settings and track engagement</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Publishing Controls */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-slate-700 mb-3">Publishing Options</h4>
                        
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={blogData.isPublished}
                                    onChange={(e) => setBlogData(prev => ({...prev, isPublished: e.target.checked}))}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <div>
                                    <span className="font-medium text-slate-800">Publish Immediately</span>
                                    <p className="text-xs text-slate-600">Make this blog post visible to readers</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={blogData.isFeatured}
                                    onChange={(e) => setBlogData(prev => ({...prev, isFeatured: e.target.checked}))}
                                    className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                                />
                                <div>
                                    <span className="font-medium text-slate-800">Featured Post</span>
                                    <p className="text-xs text-slate-600">Highlight this post on the homepage</p>
                                </div>
                            </label>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">Estimated Read Time</span>
                            </div>
                            <p className="text-lg font-semibold text-blue-600">
                                {blogData.readTime} {blogData.readTime === 1 ? 'minute' : 'minutes'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Auto-calculated based on content length
                            </p>
                        </div>
                    </div>

                    {/* Analytics Display (for existing posts) */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-slate-700 mb-3">Engagement Analytics</h4>
                        
                        {id ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="text-xs font-medium text-blue-700">Views</span>
                                    </div>
                                    <p className="text-lg font-bold text-blue-800">{blogData.views || 0}</p>
                                </div>

                                <div className="bg-red-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span className="text-xs font-medium text-red-700">Likes</span>
                                    </div>
                                    <p className="text-lg font-bold text-red-800">{blogData.likes || 0}</p>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                        <span className="text-xs font-medium text-green-700">Shares</span>
                                    </div>
                                    <p className="text-lg font-bold text-green-800">{blogData.shares || 0}</p>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span className="text-xs font-medium text-purple-700">Comments</span>
                                    </div>
                                    <p className="text-lg font-bold text-purple-800">{blogData.comments || 0}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-100 rounded-lg p-8 text-center">
                                <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
                                </svg>
                                <p className="text-slate-500 text-sm">Analytics will be available after publishing</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-600 text-sm">
                            {id ? 'Update your blog post' : 'Ready to publish your blog post?'}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                            All fields marked with * are required
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-8 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {id ? "Updating..." : "Publishing..."}
                            </>
                        ) : (
                            id ? "Update Blog Post" : "Publish Blog Post"
                        )}
                    </button>
                </div>
            </div>
        </form>
            </div>
        </div>
    )
}