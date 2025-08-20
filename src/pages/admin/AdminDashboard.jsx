import React, { useState, useEffect } from "react";
import { 
  CirclePlus, 
  Eye, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  Activity, 
  ArrowUpRight,
  Users,
  GraduationCap,
  User,
  Heart,
  BarChart3,
  PieChart
} from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalEvents: 0,
    totalPhotos: 0,
    totalMembers: 0,
    currentStudents: 0,
    associates: 0,
    activeMembers: 0,
    newMembersThisMonth: 0
  });

  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatsAndActions() {
      setLoading(true);
      try {
        // Fetch total blogs
        const blogsSnapshot = await getDocs(collection(database, "blogs"));
        const totalBlogs = blogsSnapshot.size;

        // Fetch total events
        const eventsSnapshot = await getDocs(collection(database, "events"));
        const totalEvents = eventsSnapshot.size;

        // Fetch total photos
        const gallerySnapshot = await getDocs(collection(database, "gallery"));
        const totalPhotos = gallerySnapshot.size;

        // Fetch members data
        const membersSnapshot = await getDocs(query(collection(database, "members"), orderBy('createdAt', 'desc')));
        const members = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));

        const totalMembers = members.length;
        const currentStudents = members.filter(m => m.membershipType === 'current_student').length;
        const associates = members.filter(m => m.membershipType === 'associate').length;
        const activeMembers = members.filter(m => m.status === 'active_student' || m.status === 'associate_member').length;

        // Calculate new members this month
        const now = new Date();
        const newMembersThisMonth = members.filter(member => {
          const memberDate = new Date(member.createdAt);
          return memberDate.getMonth() === now.getMonth() && 
                 memberDate.getFullYear() === now.getFullYear();
        }).length;

        // Update stats
        setStats({ 
          totalBlogs, 
          totalEvents, 
          totalPhotos, 
          totalMembers,
          currentStudents,
          associates,
          activeMembers,
          newMembersThisMonth
        });

        // Enhanced recent actions from multiple collections
        const recentBlogActions = blogsSnapshot.docs.slice(0, 2).map((doc) => ({
          action: "Added new blog",
          item: doc.data().title,
          time: "Recently",
          type: "blog"
        }));

        const recentEventActions = eventsSnapshot.docs.slice(0, 2).map((doc) => ({
          action: "Created event",
          item: doc.data().title,
          time: "Recently",
          type: "event"
        }));

        const recentMemberActions = members.slice(0, 2).map((member) => ({
          action: "New member joined",
          item: member.fullName,
          time: "Recently",
          type: "member"
        }));

        setRecentActions([...recentBlogActions, ...recentEventActions, ...recentMemberActions].slice(0, 5));
      } catch (error) {
        console.error("Error fetching stats or actions: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStatsAndActions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h1>
          <p className="text-slate-600">Here's what's happening with MSA today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/admin/blogs/new">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl">
              <CirclePlus size={18} />
              New Blog
            </button>
          </Link>
          <Link to='/admin/events/new'>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl">
              <CirclePlus size={18} />
              New Event
            </button>
          </Link>
        </div>
      </div>

      {/* Member Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Members Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{stats.newMembersThisMonth}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.totalMembers}</h3>
          <p className="text-slate-600 text-sm mb-3">Total Members</p>
          <Link to="/admin/members" className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            Manage members
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Current Students Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <Activity className="w-4 h-4 mr-1" />
              Active
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.currentStudents}</h3>
          <p className="text-slate-600 text-sm mb-3">Current Students</p>
          <div className="flex items-center text-xs text-green-600">
            <div className="flex-1 bg-green-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalMembers > 0 ? (stats.currentStudents / stats.totalMembers) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="ml-2">{stats.totalMembers > 0 ? ((stats.currentStudents / stats.totalMembers) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>

        {/* Associates Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <Activity className="w-4 h-4 mr-1" />
              Alumni
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.associates}</h3>
          <p className="text-slate-600 text-sm mb-3">Associates</p>
          <div className="flex items-center text-xs text-purple-600">
            <div className="flex-1 bg-purple-200 rounded-full h-1.5">
              <div 
                className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalMembers > 0 ? (stats.associates / stats.totalMembers) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="ml-2">{stats.totalMembers > 0 ? ((stats.associates / stats.totalMembers) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>

        {/* Engagement Score Card */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              High
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">
            {Math.round((stats.totalBlogs + stats.totalEvents + stats.totalPhotos + stats.totalMembers) / 4 * 8.5)}
          </h3>
          <p className="text-slate-600 text-sm mb-3">Engagement Score</p>
          <div className="flex items-center text-xs text-orange-600">
            <BarChart3 className="w-3 h-3 mr-1" />
            Community Activity
          </div>
        </div>
      </div>

      {/* Content Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              Active
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.totalBlogs}</h3>
          <p className="text-slate-600 text-sm mb-3">Total Blogs</p>
          <Link to="/admin/blogs" className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            View all blogs
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <Activity className="w-4 h-4 mr-1" />
              Live
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.totalEvents}</h3>
          <p className="text-slate-600 text-sm mb-3">Total Events</p>
          <Link to="/admin/events" className="inline-flex items-center text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors">
            View all events
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              Growing
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.totalPhotos}</h3>
          <p className="text-slate-600 text-sm mb-3">Gallery Photos</p>
          <Link to="/admin/gallery" className="inline-flex items-center text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors">
            Manage gallery
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800">Recent Activity</h3>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        {recentActions.length > 0 ? (
          <div className="space-y-4">
            {recentActions.map((action, index) => {
              const getIcon = (type) => {
                switch(type) {
                  case 'blog': return FileText;
                  case 'event': return Calendar;
                  case 'member': return Users;
                  default: return Activity;
                }
              };
              
              const getColor = (type) => {
                switch(type) {
                  case 'blog': return 'from-blue-500 to-indigo-500';
                  case 'event': return 'from-purple-500 to-pink-500';
                  case 'member': return 'from-green-500 to-emerald-500';
                  default: return 'from-gray-500 to-gray-600';
                }
              };

              const IconComponent = getIcon(action.type);
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white/20 hover:bg-white/80 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getColor(action.type)} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{action.action}</p>
                      <p className="text-sm text-slate-600 truncate max-w-xs">{action.item}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{action.time}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500">No recent activity to show</p>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Getting Started</h3>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Manage your community",
                description: "View member statistics, track growth, and engage with your community.",
                color: "from-blue-500 to-indigo-500"
              },
              {
                step: "2", 
                title: "Create engaging content",
                description: "Add blogs, schedule events, and upload photos to keep members informed.",
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Monitor analytics", 
                description: "Track member engagement, content performance, and community growth.",
                color: "from-emerald-500 to-teal-500"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{item.title}</h4>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to='/admin/blog/new'>
              <button className="w-full p-4 bg-white/60 hover:bg-white/80 border border-white/20 rounded-xl transition-all duration-200 hover:shadow-md group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <CirclePlus className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-slate-700">Create Blog</span>
                </div>
              </button>
            </Link>
            
            <Link to='/admin/events/new'>
              <button className="w-full p-4 bg-white/60 hover:bg-white/80 border border-white/20 rounded-xl transition-all duration-200 hover:shadow-md group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-slate-700">Schedule Event</span>
                </div>
              </button>
            </Link>
            
            <Link to='/admin/gallery/new'>
              <button className="w-full p-4 bg-white/60 hover:bg-white/80 border border-white/20 rounded-xl transition-all duration-200 hover:shadow-md group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-slate-700">Upload Photos</span>
                </div>
              </button>
            </Link>
            
            <Link to='/'>
              <button className="w-full p-4 bg-white/60 hover:bg-white/80 border border-white/20 rounded-xl transition-all duration-200 hover:shadow-md group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-slate-700">View Website</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
