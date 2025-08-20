import React, { useState } from 'react';
import { database } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, GraduationCap, Phone, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Layout/Navbar';
import RegistrationSuccess from '../components/RegistrationSuccess';

export default function Registration() {
    // Firebase collection reference for storing member data
    const collectionRef = collection(database, 'members');
    
    // Loading state to show user feedback during form submission
    const [isLoading, setIsLoading] = useState(false);
    
    // Success state to show celebration component
    const [showSuccess, setShowSuccess] = useState(false);
    const [registeredMemberName, setRegisteredMemberName] = useState('');

    // State to manage all form data
    const [memberData, setMemberData] = useState({
        fullName: '',
        studentType: '', // 'first_year' or 'ongoing_student'
        currentYear: '', // Only for ongoing students (2, 3, or 4)
        phoneNumber: '',
    });

    /**
     * Format phone number to "0712 345 678" pattern
     * Removes non-digits and applies formatting
     */
    function formatPhoneNumber(value) {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');
        
        // Apply formatting: 0712 345 678
        if (digits.length <= 4) {
            return digits;
        } else if (digits.length <= 7) {
            return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        } else {
            return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
        }
    }

    /**
     * Handle input changes for text inputs and selects
     * Updates the memberData state with new values
     * Special handling for phone number formatting
     */
    function handleChange(e) {
        const { name, value } = e.currentTarget;
        
        // Special handling for phone number formatting
        if (name === 'phoneNumber') {
            const formattedPhone = formatPhoneNumber(value);
            setMemberData((prev) => ({
                ...prev,
                [name]: formattedPhone
            }));
        } else {
            setMemberData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    }

    /**
     * Handle student type selection
     * Resets year field when student type changes
     */
    function handleStudentTypeChange(type) {
        setMemberData(prev => ({
            ...prev,
            studentType: type,
            // Reset year field when changing student type
            currentYear: ''
        }));
    }

    /**
     * Handle form submission
     * Validates data and saves to Firestore
     */
    async function handleSubmit(e) {
        e.preventDefault();
        
        // Start loading state
        setIsLoading(true);

        try {
            // Validate required fields based on membership type
            if (!memberData.fullName.trim()) {
                toast.error('Please enter your full name');
                setIsLoading(false);
                return;
            }

            if (!memberData.studentType) {
                toast.error('Please select whether you are a first year or ongoing student');
                setIsLoading(false);
                return;
            }

            if (!memberData.phoneNumber.trim()) {
                toast.error('Please enter your phone number');
                setIsLoading(false);
                return;
            }

            // Validate phone number has exactly 10 digits
            const phoneDigits = memberData.phoneNumber.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                toast.error('Phone number must be exactly 10 digits');
                setIsLoading(false);
                return;
            }

            // Validate year selection for ongoing students
            if (memberData.studentType === 'ongoing_student' && !memberData.currentYear) {
                toast.error('Please select your current year of study');
                setIsLoading(false);
                return;
            }

            // Prepare data for Firestore
            const memberDataToSave = {
                fullName: memberData.fullName.trim(),
                studentType: memberData.studentType,
                // Remove formatting from phone number before saving (keep only digits)
                phoneNumber: phoneDigits,
                // Add timestamp for when the registration was created
                createdAt: serverTimestamp(),
                // Add registration metadata
                registrationDate: new Date().toISOString(),
                status: 'active'
            };

            // Add year field for ongoing students, set to 1 for first years
            if (memberData.studentType === 'first_year') {
                memberDataToSave.currentYear = 1;
                memberDataToSave.yearStatus = 'first_year_student';
            } else if (memberData.studentType === 'ongoing_student') {
                memberDataToSave.currentYear = parseInt(memberData.currentYear);
                memberDataToSave.yearStatus = 'ongoing_student';
            }

            // Save to Firestore with proper error checking
            const docRef = await addDoc(collectionRef, memberDataToSave);
            
            // Verify the document was created successfully
            if (docRef && docRef.id) {
                // Store the member name for the success component
                setRegisteredMemberName(memberData.fullName.trim());
                
                // Show success message
                toast.success('Registration completed successfully! Welcome to MSA!');
                
                // Log success for debugging
                console.log('Member registered successfully with ID:', docRef.id);

                // Reset form after successful submission
                setMemberData({
                    fullName: '',
                    studentType: '',
                    currentYear: '',
                    phoneNumber: '',
                });

                // Show the celebration component
                setShowSuccess(true);
            } else {
                throw new Error('Failed to create registration record');
            }

        } catch (error) {
            // Handle specific Firebase errors
            console.error('Error registering member:', error);
            
            // Provide specific error messages based on error type
            if (error.code === 'permission-denied') {
                toast.error('Permission denied. Please contact support.');
            } else if (error.code === 'unavailable') {
                toast.error('Service temporarily unavailable. Please try again later.');
            } else if (error.code === 'network-request-failed') {
                toast.error('Network error. Please check your internet connection.');
            } else if (error.message && error.message.includes('quota')) {
                toast.error('Service limit reached. Please try again later.');
            } else {
                toast.error('Registration failed. Please try again or contact support.');
            }
        } finally {
            // Always stop loading state regardless of success or failure
            setIsLoading(false);
        }
    }

    /**
     * Handle WhatsApp group join
     * Opens WhatsApp group link in new window
     */
    const handleJoinWhatsApp = () => {
        // MSA WhatsApp group link - replace with your actual group link
        // Example format: https://chat.whatsapp.com/XXXXXXXXXXXXXXX
        const whatsappGroupLink = ' https://chat.whatsapp.com/BqkU3TR9IbC77Gm0g2Kp9O';
        
        // Open WhatsApp in new window/tab
        window.open(whatsappGroupLink, '_blank', 'noopener,noreferrer');
        
        // Show confirmation message
        toast.success('Redirecting to WhatsApp! Join our community group.');
        
        // Close the success modal after joining
        setTimeout(() => {
            setShowSuccess(false);
        }, 1500);
    };

    /**
     * Handle closing the success modal
     */
    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Success Celebration Modal */}
            {showSuccess && (
                <RegistrationSuccess
                    memberName={registeredMemberName}
                    onJoinWhatsApp={handleJoinWhatsApp}
                    onClose={handleCloseSuccess}
                />
            )}
            
            {/* Hero Section */}
            <section className="relative py-24 bg-gray-900 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 transform rotate-45 translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-600/10 transform -rotate-45 -translate-x-16 translate-y-16"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
                    <p className="text-blue-400 text-lg font-medium tracking-wide uppercase mb-6">
                        Online Registration
                    </p>
                    <h1 className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
                        Register as a
                        <span className="block font-semibold text-blue-400">
                            Member
                        </span>
                    </h1>
                    <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        To securely and accurately store our data, we have digitized our database 
                        so that members can register and/or update their records effortlessly
                    </p>
                </div>
            </section>

            {/* Registration Form Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-900 px-8 py-6">
                        <h2 className="text-2xl font-semibold text-white">Registration Form</h2>
                        <p className="text-gray-300 mt-2 font-light">Please fill in your details below</p>
                    </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={memberData.fullName}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors text-gray-900 placeholder-gray-500 font-light"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Student Type Selection */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-900">
                                    Student Status <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Year Option */}
                                    <div
                                        onClick={() => handleStudentTypeChange('first_year')}
                                        className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
                                            memberData.studentType === 'first_year'
                                                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                                memberData.studentType === 'first_year'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                <GraduationCap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">First Year Student</h3>
                                                <p className="text-sm text-gray-600 font-light">Just starting your studies</p>
                                            </div>
                                        </div>
                                        {memberData.studentType === 'first_year' && (
                                            <div className="absolute top-3 right-3">
                                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ongoing Student Option */}
                                    <div
                                        onClick={() => handleStudentTypeChange('ongoing_student')}
                                        className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
                                            memberData.studentType === 'ongoing_student'
                                                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                                memberData.studentType === 'ongoing_student'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Ongoing Student</h3>
                                                <p className="text-sm text-gray-600 font-light">Currently in 2nd, 3rd, or 4th year</p>
                                            </div>
                                        </div>
                                        {memberData.studentType === 'ongoing_student' && (
                                            <div className="absolute top-3 right-3">
                                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Fields Based on Student Type */}
                            {memberData.studentType && (
                                <div className="space-y-6 pt-4 border-t border-gray-200">
                                    {/* Year Selection for Ongoing Students */}
                                    {memberData.studentType === 'ongoing_student' && (
                                        <div className="space-y-2">
                                            <label htmlFor="currentYear" className="block text-sm font-semibold text-gray-900">
                                                Current Year of Study <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <select
                                                    id="currentYear"
                                                    name="currentYear"
                                                    value={memberData.currentYear}
                                                    onChange={handleChange}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors text-gray-900 font-light"
                                                    required
                                                >
                                                    <option value="">Select your current year</option>
                                                    <option value="2">Second Year</option>
                                                    <option value="3">Third Year</option>
                                                    <option value="4">Fourth Year</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Information for First Year Students */}
                                    {memberData.studentType === 'first_year' && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center space-x-2">
                                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                                <h4 className="font-semibold text-blue-900">
                                                    Hello {memberData.fullName.trim() ? memberData.fullName : "First Year"}!
                                                </h4>
                                            </div>
                                            <p className="text-sm text-blue-700 mt-2">
                                                We are excited to start this journey with you. Just enter your phone number below to complete registration.
                                            </p>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-900">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={memberData.phoneNumber}
                                                onChange={handleChange}
                                                maxLength="12"
                                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 transition-colors text-gray-900 placeholder-gray-500 font-light ${
                                                    memberData.phoneNumber && memberData.phoneNumber.replace(/\D/g, '').length === 10
                                                        ? 'border-green-300 focus:ring-green-600 focus:border-green-600'
                                                        : memberData.phoneNumber && memberData.phoneNumber.replace(/\D/g, '').length > 0
                                                        ? 'border-red-300 focus:ring-red-600 focus:border-red-600'
                                                        : 'border-gray-300 focus:ring-blue-600 focus:border-blue-600'
                                                }`}
                                                placeholder="0712 345 678"
                                                required
                                            />
                                            {memberData.phoneNumber && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    {memberData.phoneNumber.replace(/\D/g, '').length === 10 ? (
                                                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-red-500 font-medium">
                                                            {memberData.phoneNumber.replace(/\D/g, '').length}/10
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {memberData.phoneNumber && memberData.phoneNumber.replace(/\D/g, '').length > 0 && memberData.phoneNumber.replace(/\D/g, '').length !== 10 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Please enter exactly 10 digits ({memberData.phoneNumber.replace(/\D/g, '').length}/10 entered)
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={
                                        !memberData.studentType || 
                                        isLoading || 
                                        !memberData.fullName.trim() ||
                                        (memberData.phoneNumber && memberData.phoneNumber.replace(/\D/g, '').length !== 10) || 
                                        (memberData.studentType === 'ongoing_student' && !memberData.currentYear)
                                    }
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                                        memberData.studentType && 
                                        !isLoading && 
                                        memberData.fullName.trim() &&
                                        (!memberData.phoneNumber || memberData.phoneNumber.replace(/\D/g, '').length === 10) && 
                                        (memberData.studentType === 'first_year' || memberData.currentYear)
                                            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transform hover:scale-105'
                                            : 'bg-gray-300 cursor-not-allowed'
                                    } focus:outline-none`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Registering...
                                        </div>
                                    ) : (
                                        'Complete Registration'
                                    )}
                                </button>
                            </div>

                            {/* Help Text */}
                            <div className="text-center pt-4">
                                <span className='text-xs text-gray-400'>The data collected is meant to keep our database accurate and up-to-date</span>
                                <p className="text-sm text-gray-500 font-light">
                                    By registering, you agree to our{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Additional Info Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Join Our Community</h3>
                            <p className="text-sm text-gray-600 font-light">Connect with like-minded individuals and grow together</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Attend Events</h3>
                            <p className="text-sm text-gray-600 font-light">Participate in exclusive events and activities</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Learn & Grow</h3>
                            <p className="text-sm text-gray-600 font-light">Access resources and opportunities for personal development</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
