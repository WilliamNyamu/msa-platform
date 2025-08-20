import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  CalendarDays,
  Sparkles 
} from 'lucide-react';
import { database } from '../../firebaseConfig';
import { getDocs, collection, query, orderBy, limit, where } from 'firebase/firestore';

export default function UpcomingEvent() {
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextEvent() {
      try {
        const eventRef = collection(database, "events");
        const snapshot = await getDocs(eventRef);
        
        const eventsData = snapshot.docs.map((doc) => {
          const event = doc.data();
          const eventDateTime = new Date(`${event.date} ${event.time}`);
          const currentDateTime = new Date();

          return {
            ...event,
            id: doc.id,
            eventDateTime,
            status: eventDateTime < currentDateTime ? "Past" : "Upcoming",
          };
        });

        // Filter upcoming events and sort by date
        const upcomingEvents = eventsData
          .filter(event => event.status === "Upcoming")
          .sort((a, b) => a.eventDateTime - b.eventDateTime);

        if (upcomingEvents.length > 0) {
          setNextEvent(upcomingEvents[0]);
        }
      } catch (error) {
        console.error("Error fetching next event:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNextEvent();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get days until event
  const getDaysUntil = (dateString, timeString) => {
    const eventDate = new Date(`${dateString} ${timeString}`);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!nextEvent) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Upcoming Events
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're planning exciting new events! Check back soon or browse our past events to see what we're all about.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>View All Events</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const daysUntil = getDaysUntil(nextEvent.date, nextEvent.time);

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-orange-800 font-medium text-sm">Next Event</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Don't Miss Out!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us for our next exciting event and be part of our vibrant marketing community.
          </p>
        </div>

        {/* Event Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Event Image */}
            <div className="relative overflow-hidden">
              <img
                src={nextEvent.image}
                alt={nextEvent.title}
                className="w-full h-80 md:h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              {/* Countdown Badge */}
              <div className="absolute top-6 left-6">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-bold text-sm">
                      {daysUntil === 0 ? 'Today!' : 
                       daysUntil === 1 ? 'Tomorrow' : 
                       `${daysUntil} days left`}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="absolute bottom-6 left-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Upcoming
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {nextEvent.title}
              </h3>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {nextEvent.description.length > 150 
                  ? `${nextEvent.description.substring(0, 150)}...` 
                  : nextEvent.description}
              </p>

              {/* Event Meta Information */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{formatDate(nextEvent.date)}</p>
                    <p className="text-sm text-gray-500">{nextEvent.time}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{nextEvent.venue}</p>
                    <p className="text-sm text-gray-500">Event Location</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Free Admission</p>
                    <p className="text-sm text-gray-500">Open to all members</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4"> 
                <Link
                  to="/events"
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 border-2  hover:text-gray-700 font-semibold rounded border-orange-500 text-orange-600 transition-all duration-300"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>View Events</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
