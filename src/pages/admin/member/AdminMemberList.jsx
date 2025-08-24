import React, { useState, useEffect } from 'react';
import { database } from '../../../firebaseConfig';
import { collection, getDocs, query, orderBy, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    Phone, 
    Calendar, 
    GraduationCap, 
    User,
    Plus,
    Download,
    RefreshCw,
    BarChart3,
    PieChart,
    TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMemberList() {
    // State management
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(null);

    // Firebase collection reference
    const membersRef = collection(database, 'members');

    /**
     * Fetch all members from Firestore
     * Orders by creation date (newest first)
     */
    const fetchMembers = async () => {
        setLoading(true);
        try {
            const q = query(membersRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const membersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Format createdAt for display
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            
            setMembers(membersList);
            toast.success(`Loaded ${membersList.length} members`);
        } catch (error) {
            console.error('Error fetching members:', error);
            toast.error('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete a member from Firestore
     */
    const handleDeleteMember = async (memberId, memberName) => {
        if (!window.confirm(`Are you sure you want to delete ${memberName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteDoc(doc(database, 'members', memberId));
            setMembers(prev => prev.filter(member => member.id !== memberId));
            toast.success(`${memberName} has been deleted`);
        } catch (error) {
            console.error('Error deleting member:', error);
            toast.error('Failed to delete member');
        }
    };

    /**
     * Toggle member status (active/inactive)
     */
    const handleToggleStatus = async (memberId, currentStatus, memberName) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        try {
            await updateDoc(doc(database, 'members', memberId), {
                status: newStatus
            });
            
            setMembers(prev => prev.map(member => 
                member.id === memberId 
                    ? { ...member, status: newStatus }
                    : member
            ));
            
            toast.success(`${memberName}'s status updated to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            console.error('Error updating member status:', error);
            toast.error('Failed to update member status');
        }
    };

    /**
     * Filter members based on search term and filter type
     */
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.phoneNumber?.includes(searchTerm);
        
        const matchesFilter = filterType === 'all' || 
                            (filterType === 'students' && (member.studentType === 'first_year' || member.studentType === 'ongoing_student' || member.yearStatus === 'first_year_student' || member.yearStatus === 'ongoing_student')) ||
                            (filterType === 'active' && member.status === 'active') ||
                            (filterType === 'inactive' && member.status === 'inactive');
        
        return matchesSearch && matchesFilter;
    });

    /**
     * Format phone number for display
     */
    const formatPhoneNumber = (phone) => {
        if (!phone) return 'N/A';
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 10) {
            return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
        }
        return phone;
    };

    /**
     * Get status badge styling
     */
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 border border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    /**
     * Export members data to CSV
     */
    const exportToCSV = () => {
        const headers = ['Name', 'Student Type', 'Phone', 'Current Year', 'Status', 'Created At'];
        const csvData = filteredMembers.map(member => [
            member.fullName,
            member.studentType === 'first_year' ? 'First Year' : member.studentType === 'ongoing_student' ? 'Ongoing Student' : 'N/A',
            formatPhoneNumber(member.phoneNumber),
            member.currentYear || 'N/A',
            member.status?.replace('_', ' ') || 'N/A',
            member.createdAt?.toLocaleDateString()
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `members_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Members data exported successfully');
    };

    /**
     * Get member statistics for charts
     */
    const getMemberStats = () => {
        const firstYearStudents = members.filter(m => m.studentType === 'first_year' || m.yearStatus === 'first_year_student').length;
        const ongoingStudents = members.filter(m => m.studentType === 'ongoing_student' || m.yearStatus === 'ongoing_student').length;
        const activeMembers = members.filter(m => m.status === 'active').length;
        const inactiveMembers = members.filter(m => m.status === 'inactive').length;

        // Year distribution for students
        const yearDistribution = {
            '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0
        };
        
        members.forEach(member => {
            const year = member.currentYear;
            if (year && yearDistribution.hasOwnProperty(year.toString())) {
                yearDistribution[year.toString()]++;
            }
        });

        // Registration trend over the last 6 months
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthMembers = members.filter(member => {
                const memberDate = new Date(member.createdAt);
                return memberDate.getMonth() === date.getMonth() && 
                       memberDate.getFullYear() === date.getFullYear();
            }).length;
            
            monthlyData.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                count: monthMembers
            });
        }

        return {
            studentTypes: { firstYearStudents, ongoingStudents },
            statusTypes: { activeMembers, inactiveMembers },
            yearDistribution,
            monthlyData
        };
    };

    const stats = getMemberStats();

    /**
     * Pie Chart Component for membership types
     */
    const PieChartComponent = ({ data, title, colors }) => {
        const total = Object.values(data).reduce((sum, val) => sum + val, 0);
        if (total === 0) return null;

        let currentAngle = 0;
        const radius = 80;
        const centerX = 100;
        const centerY = 100;

        const segments = Object.entries(data).map(([key, value], index) => {
            const percentage = (value / total) * 100;
            const angle = (value / total) * 360;
            
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

            return {
                path: pathData,
                color: colors[index],
                label: key,
                value,
                percentage: percentage.toFixed(1)
            };
        });

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    {title}
                </h3>
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <svg width="200" height="200" className="transform -rotate-90">
                            {segments.map((segment, index) => (
                                <path
                                    key={index}
                                    d={segment.path}
                                    fill={segment.color}
                                    stroke="white"
                                    strokeWidth="2"
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{total}</div>
                                <div className="text-sm text-gray-600">Total</div>
                            </div>
                        </div>
                    </div>
                    <div className="ml-8 space-y-2">
                        {segments.map((segment, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: segment.color }}
                                ></div>
                                <span className="text-sm text-gray-700 capitalize">
                                    {segment.label === 'firstYearStudents' ? 'First Year Students' : 
                                     segment.label === 'ongoingStudents' ? 'Ongoing Students' :
                                     segment.label === 'activeMembers' ? 'Active Members' :
                                     segment.label === 'inactiveMembers' ? 'Inactive Members' :
                                     segment.label.replace(/([A-Z])/g, ' $1').trim()}: {segment.value} ({segment.percentage}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Bar Chart Component for year distribution
     */
    const BarChartComponent = ({ data, title }) => {
        const maxValue = Math.max(...Object.values(data));
        if (maxValue === 0) return null;

        const years = Object.entries(data).filter(([key, value]) => value > 0);

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    {title}
                </h3>
                <div className="space-y-4">
                    {years.map(([year, count]) => {
                        const percentage = (count / maxValue) * 100;
                        return (
                            <div key={year} className="flex items-center space-x-4">
                                <div className="w-16 text-sm text-gray-600 font-medium">
                                    Year {year === 'postgraduate' ? 'PG' : year}
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                                        style={{ width: `${percentage}%` }}
                                    >
                                        <span className="text-white text-xs font-medium">{count}</span>
                                    </div>
                                </div>
                                <div className="w-12 text-sm text-gray-500 text-right">
                                    {count}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    /**
     * Line Chart Component for monthly trends
     */
    const LineChartComponent = ({ data, title }) => {
        const maxValue = Math.max(...data.map(d => d.count));
        if (maxValue === 0) return null;

        const svgHeight = 200;
        const svgWidth = 400;
        const padding = 40;
        const chartHeight = svgHeight - 2 * padding;
        const chartWidth = svgWidth - 2 * padding;

        const points = data.map((item, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + chartHeight - (item.count / maxValue) * chartHeight;
            return { x, y, count: item.count, month: item.month };
        });

        const pathData = points.map((point, index) => 
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ');

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    {title}
                </h3>
                <div className="relative">
                    <svg width={svgWidth} height={svgHeight} className="w-full">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => {
                            const y = padding + (i / 4) * chartHeight;
                            return (
                                <line
                                    key={i}
                                    x1={padding}
                                    y1={y}
                                    x2={svgWidth - padding}
                                    y2={y}
                                    stroke="#f3f4f6"
                                    strokeWidth="1"
                                />
                            );
                        })}
                        
                        {/* Area under curve */}
                        <path
                            d={`${pathData} L ${points[points.length - 1].x} ${svgHeight - padding} L ${padding} ${svgHeight - padding} Z`}
                            fill="url(#gradient)"
                            opacity="0.3"
                        />
                        
                        {/* Line */}
                        <path
                            d={pathData}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        
                        {/* Data points */}
                        {points.map((point, index) => (
                            <circle
                                key={index}
                                cx={point.x}
                                cy={point.y}
                                r="4"
                                fill="#3b82f6"
                                stroke="white"
                                strokeWidth="2"
                                className="hover:r-6 transition-all cursor-pointer"
                            />
                        ))}
                        
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 px-10">
                        {data.map((item, index) => (
                            <span key={index} className="text-xs text-gray-500">
                                {item.month}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Load members on component mount
    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Users className="w-8 h-8 text-blue-600 mr-3" />
                                Member Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage and monitor your community members
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={fetchMembers}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Charts and Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Student Types Pie Chart */}
                    <PieChartComponent 
                        data={stats.studentTypes}
                        title="Student Type Distribution"
                        colors={['#3b82f6', '#8b5cf6']}
                    />
                    
                    {/* Status Distribution Pie Chart */}
                    <PieChartComponent 
                        data={stats.statusTypes}
                        title="Member Status"
                        colors={['#10b981', '#6b7280']}
                    />
                </div>

                {/* Year Distribution and Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Year Distribution Bar Chart */}
                    <BarChartComponent 
                        data={stats.yearDistribution}
                        title="Student Year Distribution"
                    />
                    
                    {/* Monthly Registration Trend */}
                    <LineChartComponent 
                        data={stats.monthlyData}
                        title="Registration Trends (6 Months)"
                    />
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-900">{members.length}</div>
                                    <div className="text-sm text-blue-700">Total Members</div>
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-blue-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +{stats.monthlyData[stats.monthlyData.length - 1]?.count || 0} this month
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-200 rounded-full opacity-20"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-900">{stats.studentTypes.firstYearStudents}</div>
                                    <div className="text-sm text-green-700">First Year Students</div>
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-green-600">
                                <div className="flex-1 bg-green-200 rounded-full h-1.5">
                                    <div 
                                        className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${members.length > 0 ? (stats.studentTypes.firstYearStudents / members.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="ml-2">{members.length > 0 ? ((stats.studentTypes.firstYearStudents / members.length) * 100).toFixed(1) : 0}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-200 rounded-full opacity-20"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-900">{stats.studentTypes.ongoingStudents}</div>
                                    <div className="text-sm text-purple-700">Ongoing Students</div>
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-purple-600">
                                <div className="flex-1 bg-purple-200 rounded-full h-1.5">
                                    <div 
                                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${members.length > 0 ? (stats.studentTypes.ongoingStudents / members.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="ml-2">{members.length > 0 ? ((stats.studentTypes.ongoingStudents / members.length) * 100).toFixed(1) : 0}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-200 rounded-full opacity-20"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-yellow-900">{stats.statusTypes.activeMembers}</div>
                                    <div className="text-sm text-yellow-700">Active Members</div>
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-yellow-600">
                                <div className="flex-1 bg-yellow-200 rounded-full h-1.5">
                                    <div 
                                        className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${members.length > 0 ? (stats.statusTypes.activeMembers / members.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="ml-2">{members.length > 0 ? ((stats.statusTypes.activeMembers / members.length) * 100).toFixed(1) : 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or phone number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-gray-400" />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Members</option>
                                    <option value="students">Students</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                                {filteredMembers.length} of {members.length} members
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading members...</span>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterType !== 'all' 
                                    ? 'Try adjusting your search or filter criteria.' 
                                    : 'No members have been registered yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Member
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Academic Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {member.fullName?.charAt(0)?.toUpperCase() || 'N'}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {member.fullName || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Member ID: {member.id.slice(-6)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    member.studentType === 'first_year' || member.yearStatus === 'first_year_student'
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : member.studentType === 'ongoing_student' || member.yearStatus === 'ongoing_student'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {member.studentType === 'first_year' || member.yearStatus === 'first_year_student' 
                                                        ? 'First Year' 
                                                        : member.studentType === 'ongoing_student' || member.yearStatus === 'ongoing_student'
                                                        ? 'Ongoing Student' 
                                                        : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                    {formatPhoneNumber(member.phoneNumber)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span>Year {member.currentYear || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(member.status)}`}>
                                                    {member.status === 'active' ? 'Active' : member.status === 'inactive' ? 'Inactive' : 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {member.createdAt?.toLocaleDateString() || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowDropdown(showDropdown === member.id ? null : member.id)}
                                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                    >
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                    
                                                    {showDropdown === member.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => {
                                                                        handleToggleStatus(member.id, member.status, member.fullName);
                                                                        setShowDropdown(null);
                                                                    }}
                                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                >
                                                                    <Edit className="w-4 h-4 mr-2" />
                                                                    Toggle Status
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        handleDeleteMember(member.id, member.fullName);
                                                                        setShowDropdown(null);
                                                                    }}
                                                                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Delete Member
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}