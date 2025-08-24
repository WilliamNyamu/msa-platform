import React, { useState } from "react";
import { Navigate, useLocation } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getAuth } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";


export default function AdminLoginForm(){
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading } = useAuth();
    let auth = getAuth();
    
    // Redirect if already authenticated
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (user) {
        const from = location.state?.from?.pathname || '/admin/dashboard';
        return <Navigate to={from} replace />;
    }

    //Create a logging state to track auth submission
    const [isLogging, setIsLogging] = useState(false)

    //Initialize state for input fields
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
    })

    function handleChange(e){
        const {name, value} = e.currentTarget;
        setAuthData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    //Function to handle SignIn with email and password
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLogging(true)
        try {
            // Sign in with email and password using the authData
            const userCredential = await signInWithEmailAndPassword(auth, authData.email, authData.password);
            const user = userCredential.user

            // Firebase Auth will automatically update the auth state
            // No need to manually store tokens in localStorage
            
            // Reset form
            setAuthData({
                email: '',
                password: '',
            });
            
            toast.success("Login Successful. Taking you to the dashboard", {style: { color: 'green'} });
            
            // Navigate to the intended destination or dashboard
            const from = location.state?.from?.pathname || '/admin/dashboard';
            navigate(from, { replace: true });
        } catch(error) {
            if (error.code === 'auth/user-not-found') {
                //redirect to home page if the user is notfound
                toast.error("You are not an admin. Bye, bye :(", {style: {color : 'red'}});
                navigate('/');
            } else if (error.code === 'auth/wrong-password') {
                toast.error("Invalid password. Please try again.", {style: {color: 'red'}});
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Invalid email address.", {style: {color: 'red'}});
            } else if (error.code === 'auth/user-disabled') {
                toast.error("This account has been disabled.", {style: {color: 'red'}});
            } else {
                //handle other errors
                toast.error(error.message, {style: {color: 'red'}})
            }
        } finally {
            setIsLogging(false); //Reset loading state
        }
    }

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mb-4 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-300">Sign in to access the LKCCU admin dashboard</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={authData.email}
                                    onChange={handleChange}
                                    required
                                    aria-label="email"
                                    className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200"
                                    placeholder="admin@lkccu.org"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type= {showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={authData.password}
                                    onChange={handleChange}
                                    required
                                    aria-label="password"
                                    className="block w-full pl-10 pr-12 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={(() => setShowPassword(!showPassword))}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLogging}
                            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLogging ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <Shield className='w-5 h-5 mr-2' />
                                    Sign In to Dashboard
                                </>
                            )}
                        </button>
                    </form>
                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Authorized personnel only. All access is logged and monitored.
                        </p>
                    </div>
                </div>

                {/* Demo Credentials Note */}
                <div className="mt-6 bg-blue-500/10 border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-300 mb-2">Credentials Note</h3>
                    <p className="text-xs text-blue-200">
                        Contact the system administrator for access credentials if you are unable to login successfully.
                    </p>
                </div>
            </div>
        </div>
    )
}