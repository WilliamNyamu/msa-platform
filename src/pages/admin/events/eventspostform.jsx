import { useState, useEffect } from "react";
import { Upload, ArrowLeft, Calendar, Clock, MapPin, FileText, Image as ImageIcon, Save, X } from "lucide-react";
import { database } from "../../../firebaseConfig";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { storage } from "../../../firebaseConfig";
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { toast } from "sonner";
import { Link, useParams, useNavigate } from "react-router-dom";




export default function EventsPostForm(){
    //Fetch id
    const {id} = useParams()
    const collectionRef = collection(database, 'events');
    const navigate = useNavigate();
    //Loading state to track submission status
    const [isSubmitting, setIsSubmitting] = useState(false);

    //Initialize state for event data
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: ''
    })

    //Function for handling change
    function handleChange(e){
        const {name, value} = e.currentTarget;
        setEventData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    //State for handling Image upload
    const [uploadImage, setUploadImage] = useState(null);
    //Function for handling state
    function handleImageUpload(e){
        setUploadImage(e.target.files[0]);
    }


    // Initialize state for the downloadImageURL
    const [downloadImageURL, setImageDownloadURL] = useState(null);

    // Function for handling image submit
    function handleImageSubmit() {
        return new Promise((resolve, reject) => {
            if (!uploadImage) {
                reject(new Error("No image selected"));
                return;
            }

            const imageRef = ref(storage, `events/images/${uploadImage.name}`)
            const uploadTask = uploadBytesResumable(imageRef, uploadImage)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    toast.success(`Upload is ${progress.toFixed(0)}% done`)
                }, (error) => {
                    toast.error(error.message);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            toast.success("Image uploaded successfully")
                            setImageDownloadURL(url)
                            resolve(url);
                        })
                        .catch((error) => {
                            toast.error(error.message);
                            reject(error);
                        });
                }
            );
        });
    }

    useEffect(() => {
        if (id) {
            //Fetch the event data for editing
            const fetchEvent = async () => {
                try {
                    const docRef = doc(database, 'events', id);
                    const docSnap = await getDoc(docRef)
                    
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setEventData(data);
                        setImageDownloadURL(data.image || null); // Ensure image URL is set for preview
                    } else {
                        toast.error("Event not found.")
                        //navigate to somewhere
                    }
                } catch (error) {
                    toast.error("Failed to fetch event: " + error.message);
                }
            };
            fetchEvent();
        }
    }, [id, navigate]) 

    function handleSubmit(e){
        e.preventDefault();
        setIsSubmitting(true);

        // If there's an image to upload, upload it first
        const uploadPromise = uploadImage ? handleImageSubmit() : Promise.resolve(downloadImageURL);

        uploadPromise
            .then((imageUrl) => {
                const event = {
                    title: eventData.title,
                    description: eventData.description,
                    date: eventData.date,
                    time: eventData.time,
                    image: imageUrl,
                    venue: eventData.venue,
                    createdAt: id ? undefined : new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                if (id) {
                    const docRef = doc(database, "events", id);
                    return updateDoc(docRef, event);
                } else {
                    return addDoc(collectionRef, event)
                }
            })
            .then (() => {
                toast.success(id ? "Event updated successfully!" : "Event created successfully!");
                navigate('/admin/events');
            })
            .catch((error) => {
                toast.error("Failed to submit the event: " + error.message);
            })
            .finally(() => {
                setIsSubmitting(false);
            })
    }


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Section */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Link to='/admin/events' className='p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors'>
                            <ArrowLeft className='h-5 w-5' />
                        </Link>
                        <div>
                            <h1 className='text-2xl font-bold'>
                                {id ? 'Edit Event' : 'Create New Event'}
                            </h1>
                            <p className='text-white/80 mt-1'>
                                {id ? 'Update your event details' : 'Fill in the details to create a new event'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Event Title */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            <FileText className="h-4 w-4 text-blue-200" />
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input 
                            id="title"
                            type="text"
                            name="title"
                            value={eventData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e69ab] focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                            placeholder="Enter a compelling event title..."
                            required
                        />
                    </div>

                    {/* Event Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            <FileText className="h-4 w-4 text-blue-200" />
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={eventData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e69ab] focus:border-transparent transition-colors text-gray-900 placeholder-gray-500 resize-none"
                            placeholder="Describe your event in detail..."
                            required
                        />
                    </div>

                    {/* Date and Time Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                <Calendar className="h-4 w-4 text-blue-200" />
                                Event Date <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="date"
                                id="date"
                                name="date"
                                value={eventData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e69ab] focus:border-transparent transition-colors text-gray-900"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="time" className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                <Clock className="h-4 w-4 text-blue-200" />
                                Event Time <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="time"
                                id="time"
                                name="time"
                                value={eventData.time}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e69ab] focus:border-transparent transition-colors text-gray-900"
                                required
                            />
                        </div>
                    </div>

                    {/* Venue */}
                    <div className="space-y-2">
                        <label htmlFor="venue" className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            <MapPin className="h-4 w-4 text-blue-200" />
                            Venue <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            id="venue"
                            name="venue"
                            value={eventData.venue}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e69ab] focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                            placeholder="Where will this event take place?"
                            required
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            <ImageIcon className="h-4 w-4 text-blue-200" />
                            Event Image/Poster
                        </label>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Upload Area */}
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#7e69ab] transition-colors">
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Upload className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="image"
                                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Choose Image
                                            </label>
                                            <input 
                                                id="image"
                                                name="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Upload a poster or image for your event<br />
                                            <span className="text-xs">PNG, JPG, GIF up to 2MB</span>
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Selected file info */}
                                {uploadImage && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-900">{uploadImage.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setUploadImage(null)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Image Preview */}
                            <div className="space-y-4">
                                {(downloadImageURL || uploadImage) && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            {uploadImage ? 'New Image Preview' : 'Current Image'}
                                        </h4>
                                        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                            <img 
                                                src={uploadImage ? URL.createObjectURL(uploadImage) : downloadImageURL}
                                                alt={uploadImage ? "New preview" : "Current event image"}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                                                    {uploadImage ? 'Preview' : 'Current'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <Link to="/admin/events">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {id ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {id ? "Update Event" : "Create Event"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}