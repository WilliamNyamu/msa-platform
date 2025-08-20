import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Edit, PlusCircle, Trash2, Search, Filter, MapPin, Clock, Users } from 'lucide-react';
import { database } from '../../../firebaseConfig';
import { getDocs, doc, collection, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';


export default function AdminEventList(){
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

    useEffect(() =>{
        function fetchEvents(){
            setIsLoading(true)
            const eventsRef = collection(database, "events")
            getDocs(eventsRef)
                .then((snapshot) => {
                    const events = snapshot.docs.map((doc) => {
                        const event = doc.data()
                        const eventDate = new Date(`${event.date} ${event.time}`)
                        const currentDate = new Date()
                        return {
                            ...event,
                            id: doc.id, // Ensure the id is correctly set from Firestore document
                            status: eventDate < currentDate ? "Past" : "Upcoming",
                        }
                    })
                    setEvents(events)
                })
                .catch((error) => {
                    toast.error("Error fetching events. Please busy yourself as we resolve this issue", error, {style: {color: 'red'}})
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
        fetchEvents()
    }, [])

    async function handleDelete(eventId) {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteDoc(doc(database, "events", eventId));
                setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
                toast.success("Event deleted successfully.");
            } catch (error) {
                toast.error("Failed to delete event: " + error.message);
            }
        }
    }

    // Filter and search functionality
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.venue?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || 
                            (filterStatus === 'upcoming' && event.status === 'Upcoming') ||
                            (filterStatus === 'past' && event.status === 'Past');
        return matchesSearch && matchesFilter;
    });

    const upcomingEventsCount = events.filter(event => event.status === 'Upcoming').length;
    const pastEventsCount = events.filter(event => event.status === 'Past').length;

    return (
        <>
            <div className='space-y-6'>
                {/* Header Section */}
                <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h1 className='text-3xl font-bold mb-2'>Events Management</h1>
                            <p className='text-white/80'>Manage and organize your church events</p>
                            <div className='flex gap-4 mt-3 text-sm'>
                                <div className='flex items-center gap-1'>
                                    <Calendar className='h-4 w-4' />
                                    <span>{upcomingEventsCount} Upcoming</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Clock className='h-4 w-4' />
                                    <span>{pastEventsCount} Past Events</span>
                                </div>
                            </div>
                        </div>
                        <Link to='/admin/events/new'>
                            <button className='px-6 py-3 rounded-lg flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 transition-colors font-medium shadow-md'>
                                <PlusCircle className='h-5 w-5'/>
                                New Event
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className='bg-white rounded-lg shadow-sm p-4'>
                    <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                        <div className='relative flex-1 max-w-md'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-4 w-4' />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className='w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='flex gap-3 items-center'>
                            <div className='relative'>
                                <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-4 w-4' />
                                <select
                                    className='pl-10 pr-8 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Events</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="past">Past</option>
                                </select>
                            </div>
                            <div className='flex bg-gray-100 rounded-lg p-1'>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                        viewMode === 'table' 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Table
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Grid
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                {isLoading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {[1,2,3,4,5,6].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                                <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
                                <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
                                <div className='h-4 bg-gray-200 rounded w-2/3 mb-4'></div>
                                <div className='flex justify-between items-center'>
                                    <div className='h-6 bg-gray-200 rounded w-20'></div>
                                    <div className='flex space-x-2'>
                                        <div className='h-8 bg-gray-200 rounded w-16'></div>
                                        <div className='h-8 bg-gray-200 rounded w-16'></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    viewMode === 'table' ? (
                        // Table View
                        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead className='bg-gray-50 border-b border-gray-200'>
                                        <tr>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Event</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Date & Time</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Venue</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Status</th>
                                            <th className='px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {filteredEvents.map((item) => (
                                            <tr key={item.id} className='hover:bg-gray-50 transition-colors'>
                                                <td className='px-6 py-4'>
                                                    <div className='font-medium text-gray-900'>{item.title || 'Untitled'}</div>
                                                    {item.description && (
                                                        <div className='text-sm text-gray-500 mt-1 truncate max-w-xs'>
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <Calendar className='h-4 w-4 text-gray-400' />
                                                        <div>
                                                            <div className='font-medium'>{item.date || 'N/A'}</div>
                                                            <div className='text-gray-500'>{item.time || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <MapPin className='h-4 w-4 text-gray-400' />
                                                        <span>{item.venue || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    {item.status === "Upcoming" ? (
                                                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                                                            <div className='w-2 h-2 bg-green-400 rounded-full mr-2'></div>
                                                            Upcoming
                                                        </span>
                                                    ) : (
                                                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700'>
                                                            <div className='w-2 h-2 bg-gray-400 rounded-full mr-2'></div>
                                                            Past
                                                        </span>
                                                    )}
                                                </td>
                                                <td className='px-6 py-4 text-right'>
                                                    <div className='flex justify-end space-x-2'>
                                                        <Link to={`/admin/events/edit/${item.id}`}>
                                                            <button className='p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors'>
                                                                <Edit className='h-4 w-4' />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className='p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors'
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className='h-4 w-4' />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        // Grid View
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {filteredEvents.map((item) => (
                                <div key={item.id} className='bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100'>
                                    <div className='p-6'>
                                        <div className='flex justify-between items-start mb-4'>
                                            <h3 className='font-semibold text-lg text-gray-900 truncate'>{item.title || 'Untitled'}</h3>
                                            <div className='flex space-x-1 ml-2'>
                                                <Link to={`/admin/events/edit/${item.id}`}>
                                                    <button className='p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors'>
                                                        <Edit className='h-4 w-4' />
                                                    </button>
                                                </Link>
                                                <button
                                                    className='p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors'
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {item.description && (
                                            <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                                                {item.description}
                                            </p>
                                        )}
                                        
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                <Calendar className='h-4 w-4 text-gray-400' />
                                                <span>{item.date || 'N/A'} • {item.time || 'N/A'}</span>
                                            </div>
                                            
                                            <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                <MapPin className='h-4 w-4 text-gray-400' />
                                                <span>{item.venue || 'N/A'}</span>
                                            </div>
                                            
                                            <div className='flex justify-between items-center pt-3 border-t border-gray-100'>
                                                {item.status === "Upcoming" ? (
                                                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                                                        <div className='w-2 h-2 bg-green-400 rounded-full mr-2'></div>
                                                        Upcoming
                                                    </span>
                                                ) : (
                                                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700'>
                                                        <div className='w-2 h-2 bg-gray-400 rounded-full mr-2'></div>
                                                        Past
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className='text-center py-16 bg-white rounded-xl shadow-sm'>
                        <div className='max-w-md mx-auto'>
                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <Calendar className='w-8 h-8 text-gray-400' />
                            </div>
                            <h3 className='text-xl font-medium text-gray-900 mb-2'>
                                {searchTerm || filterStatus !== 'all' ? 'No events found' : 'No Events Yet'}
                            </h3>
                            <p className='text-gray-500 mb-8'>
                                {searchTerm || filterStatus !== 'all' 
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Get started by creating your first event to engage your community.'
                                }
                            </p>
                            {(!searchTerm && filterStatus === 'all') && (
                                <Link to='/admin/events/new'>
                                    <button className='inline-flex items-center px-6 py-3 rounded-lg bg-[#7e69ab] hover:bg-[#6e59a5] text-white font-medium transition-colors'>
                                        <PlusCircle className='mr-2 h-5 w-5' />
                                        Create Your First Event
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Implement Delete alert here */}
        </>
    )
}