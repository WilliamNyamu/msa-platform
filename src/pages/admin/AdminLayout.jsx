import {useEffect, useState} from 'react';
import {NavLink, useNavigate, useLocation, Outlet} from 'react-router-dom';
import { Home, FileText, Calendar, Image, Users, LogOut, Menu, X, Settings, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, userEmail } = useAuth();

    useEffect(() => {
        // Remove artificial loading delay - set loading to false immediately
        setIsLoading(false);
    }, []);

    const handleSignOut = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/admin-login');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error('Error signing out');
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const navItems = [
        { to: '/admin/dashboard', icon: Home, label: 'Dashboard', end: true },
        { to: '/admin/blogs', icon: FileText, label: 'Blogs' },
        { to: '/admin/events', icon: Calendar, label: 'Events' },
        { to: '/admin/members', icon: Users, label: 'Members' },
    ];

    // Generate breadcrumbs based on current location
    const getBreadcrumbs = () => {
        try {
            const pathSegments = location.pathname.split('/').filter(Boolean);
            const breadcrumbs = [{ label: 'Admin', path: '/admin/dashboard' }];
            
            let currentPath = '';
            pathSegments.forEach((segment, index) => {
                if (segment === 'admin') return;
                
                currentPath += `/${segment}`;
                const fullPath = `/admin${currentPath}`;
                
                // Capitalize and format segment names
                let label = segment.charAt(0).toUpperCase() + segment.slice(1);
                if (label === 'Blog') label = 'Blogs';
                
                // Handle nested paths
                if (segment === 'new' || segment === 'create') {
                    label = 'Create New';
                } else if (segment === 'edit') {
                    label = 'Edit';
                }
                
                breadcrumbs.push({ label, path: fullPath });
            });
            
            return breadcrumbs;
        } catch (error) {
            console.error('Breadcrumbs error:', error);
            return [{ label: 'Admin', path: '/admin/dashboard' }];
        }
    };

    const getCurrentPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/blog')) return 'Blog Management';
        if (path.includes('/events')) return 'Events Management';
        if (path.includes('/members')) return 'Members Management';
        if (path.includes('/dashboard')) return 'Dashboard Overview';
        return 'Admin Panel';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-slate-700 font-medium">Loading admin panel...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                <div className='flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl'>
                    {/* Header */}
                    <div className='flex items-center justify-between p-6 border-b border-slate-200/50'>
                        <div className='flex items-center space-x-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                                <span className='text-white font-bold text-lg'>L</span>
                            </div>
                            <div>
                                <h1 className='text-xl font-bold text-slate-800'>MSA Admin</h1>
                                <p className='text-xs text-slate-500'>Management Panel</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className='md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors'
                        >
                            <X className='w-5 h-5 text-slate-600' />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className='flex-1 px-4 py-6 space-y-2'>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) => 
                                        `group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                                                : 'text-slate-600 hover:bg-white/60 hover:text-slate-800 hover:shadow-md'
                                        }`
                                    }
                                >
                                    <Icon className='w-5 h-5 mr-3 transition-transform group-hover:scale-110' />
                                    <span className='font-medium'>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Admin Profile Section */}
                    <div className='p-4 border-t border-slate-200/50'>
                        <div className='bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 mb-4'>
                            <div className='flex items-center space-x-3'>
                                <div className='relative'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg'>
                                        <span className='text-white font-bold text-lg'>
                                            {userEmail?.charAt(0).toUpperCase() || 'A'}
                                        </span>
                                    </div>
                                    <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-semibold text-slate-800 truncate'>
                                        {userEmail || 'Administrator'}
                                    </p>
                                    <p className='text-xs text-slate-500'>Administrator</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className='space-y-2'>
                            <button className='w-full flex items-center justify-center px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl text-slate-600 hover:bg-white/80 hover:text-slate-800 transition-all duration-200 group'>
                                <Settings className='w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200' />
                                <span className='font-medium'>Settings</span>
                            </button>
                            <button 
                                onClick={handleSignOut}
                                className='w-full flex items-center justify-center px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 group'
                            >
                                <LogOut className='w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform duration-200' />
                                <span className='font-medium'>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className='md:ml-72'>
                {/* Top Bar */}
                <header className='bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm sticky top-0 z-30'>
                    <div className='flex items-center justify-between px-6 py-4'>
                        <div className='flex items-center space-x-4'>
                            <button
                                onClick={toggleSidebar}
                                className='md:hidden p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-colors'
                            >
                                <Menu className='w-5 h-5 text-slate-600' />
                            </button>
                            <div>
                                <h2 className='text-xl font-semibold text-slate-800'>{getCurrentPageTitle()}</h2>
                                <p className='text-sm text-slate-500'>Manage MSA content efficiently</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center space-x-3'>
                            <button className='relative p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-colors'>
                                <Bell className='w-5 h-5 text-slate-600' />
                                <div className='absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full'></div>
                            </button>
                            <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md'>
                                <span className='text-white font-bold text-sm'>
                                    {userEmail?.charAt(0).toUpperCase() || 'A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Breadcrumbs */}
                    <div className='px-6 pb-4'>
                        <nav className='flex items-center space-x-2 text-sm'>
                            {getBreadcrumbs().map((crumb, index) => {
                                const breadcrumbs = getBreadcrumbs();
                                return (
                                    <div key={`${crumb.path}-${index}`} className='flex items-center'>
                                        {index > 0 && <ChevronRight className='w-4 h-4 text-slate-400 mx-2' />}
                                        <NavLink
                                            to={crumb.path}
                                            className={`px-2 py-1 rounded-lg transition-colors ${
                                                index === breadcrumbs.length - 1
                                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            {crumb.label}
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className='p-6 min-h-screen'>
                    <div className='max-w-7xl mx-auto space-y-6'>
                        {/* Content Container with glassmorphism design */}
                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden'>
                            <div className='p-8'>
                                <Outlet />
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className='text-center py-4'>
                            <p className='text-sm text-slate-500'>
                                © 2025 MSA Admin Panel. Built with care for MSA Admin Management.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}