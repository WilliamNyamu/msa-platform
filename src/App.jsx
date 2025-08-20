import { useState } from 'react'
import {Route, Routes, Outlet} from 'react-router-dom'
import Navbar from './components/Layout/Navbar.jsx';
import Footer from './components/Layout/Footer.jsx';
import Home from './components/home.jsx';
import About from './pages/About.jsx';
import BlogPostForm from './pages/admin/blog/blogpostform.jsx'
import EventsPostForm from './pages/admin/events/eventspostform.jsx'
import AdminLoginForm from './pages/Admin/AdminLoginForm.jsx'
import Events from './pages/Events.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/Blog[id].jsx';
import Gallery from './pages/Gallery.jsx'
import Registration from './pages/Register.jsx';
import Contact from './pages/Contact.jsx';
import AdminLayout from './pages/Admin/AdminLayout.jsx'
import ProtectedRoute from './components/Layout/ProtectedRoute.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import AdminBlogList from './pages/admin/blog/AdminBlogList.jsx'
import AdminEventList from './pages/admin/events/AdminEventsList.jsx'
import AdminMemberList from './pages/admin/member/AdminMemberList.jsx'

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/admin-login' element={<AdminLoginForm />} />
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/events' element={<Events />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/:slug' element={<BlogPost />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/contact' element={<Contact />} />
        </Route>
        {/* Add other routes here */}
        <Route
          path='/admin'
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='blogs' element={<AdminBlogList />} />
          <Route path='blogs/new' element={<BlogPostForm />} />
          <Route path='blogs/edit/:id' element={<BlogPostForm />} />
          <Route path='events' element={<AdminEventList />} />
          <Route path='events/new' element={<EventsPostForm />} />
          <Route path='events/edit/:id' element={<EventsPostForm />} />
          <Route path='members' element={<AdminMemberList />} />
        </Route>
      </Routes>
      
    </>
  )
}

export default App
