import {Navigate} from 'react-router-dom';

export default function ProtectedRoute ({ children}) {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Check for an auth token

    if (!isAuthenticated) {
        return <Navigate to='/admin-login' /> // Redirect to login if not authenticated. Use an absolute path for better compatibility.
    }

    return children;
}