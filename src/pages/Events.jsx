import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { MapPin, CalendarOff } from 'lucide-react'
import { database, storage } from '../firebaseConfig'
import { doc, getDocs, collection } from 'firebase/firestore'


export default function Events(){
    const [events,setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('Upcoming')

    useEffect(() => {
        function fetchEvents() {
            const eventRef = collection(database, "events");
            getDocs(eventRef)
                .then((snapshot) => {
                    const eventsData = snapshot.docs.map((doc) => {
                        const event = doc.data();
                        const eventDateTime = new Date(`${event.date} ${event.time}`)
                        const currentDateTime = new Date()

                        return {
                            ...event,
                            id: doc.id,
                            status: eventDateTime < currentDateTime ? "Past" : "Upcoming",
                        };
                    });
                    setEvents(eventsData);
                })
                .catch((error) => {
                    console.error("Error fetching events. Please try again")
                });
        }
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => event.status === activeTab);


    return (
        <div className="min-h-screen bg-white">
            {/* Microsoft-style Header */}
            <header className="bg-gradient-to-r from-blue-700 to-blue-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2 flex items-center">
                            <Calendar className="h-8 w-8 mr-3 text-white" />
                            Events
                        </h1>
                        <p className="text-blue-100 text-lg max-w-2xl">
                            Discover, join, and stay up to date with our latest events, workshops, and community gatherings.
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <img
                            src="https://cdn.microsoft.com/images/ms-logo.png"
                            alt="Microsoft Logo"
                            className="h-14 w-auto rounded shadow"
                        />
                    </div>
                </div>
            </header>
                        
            {/* Navigation Tabs */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'Upcoming'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('Upcoming')}
                        >
                            Upcoming events
                        </button>
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'Past'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('Past')}
                        >
                            Past events
                        </button>
                    </nav>
                </div>
            </div>

            {/* Events Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Link 
                                key={event.id} 
                                // to={`/events/${event.id}`} 
                                className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="aspect-w-16 aspect-h-9">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            event.status === 'Upcoming' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {event.status || 'Upcoming'}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                        {event.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
                                    </p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span>{event.date} • {event.time}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="truncate">{event.venue}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
                                            Free
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <CalendarOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No {activeTab.toLowerCase()} events
                        </h3>
                        <p className="text-gray-500">
                            Check back soon for new events and announcements.
                        </p>
                    </div>
                )}
            </div>

            {/* Microsoft-style Footer CTA */}
            <div className="bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-light text-gray-900 mb-4">
                            Stay connected with our community
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Don't miss out on upcoming events. Subscribe to our newsletter or follow us on social media to get the latest updates.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition-colors duration-200">
                                Subscribe to newsletter
                            </button>
                            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded font-medium hover:bg-blue-50 transition-colors duration-200">
                                Follow us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}