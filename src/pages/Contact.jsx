import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, Building2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Layout/Navbar';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate form data
            if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
                toast.error('Please fill in all required fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Please enter a valid email address');
                return;
            }

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success handling
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                inquiryType: 'general'
            });

        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full transform translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-600/10 rounded-full transform -translate-x-16 translate-y-16"></div>
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-400/5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-400/20 rounded-full mb-6">
                        <MessageSquare className="w-4 h-4 text-orange-400 mr-2" />
                        <span className="text-orange-400 text-sm font-medium">Get In Touch</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
                        Contact
                        <span className="block font-semibold text-blue-400">
                            MSA
                        </span>
                    </h1>
                    
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-8"></div>
                    
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Have questions, suggestions, or want to get involved? We'd love to hear from you. 
                        Reach out to the Marketing Students Association team.
                    </p>
                </div>
            </section>


            {/* Contact Form Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-6">
                                <Send className="w-4 h-4 text-orange-600 mr-2" />
                                <span className="text-orange-600 text-sm font-medium">Send Message</span>
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                                Let's Start a
                                <span className="block font-semibold text-orange-600">
                                    Conversation
                                </span>
                            </h2>
                            
                            <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                                Whether you have questions about membership, events, or want to collaborate 
                                with us, we're here to help. Fill out the form and we'll get back to you 
                                within 24 hours.
                            </p>

                            {/* Features List */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">Quick response within 24 hours</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">Professional and friendly support</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">Multiple ways to reach us</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Inquiry Type Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Type of Inquiry
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, inquiryType: 'general' }))}
                                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                                formData.inquiryType === 'general'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            General Inquiry
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, inquiryType: 'membership' }))}
                                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                                formData.inquiryType === 'membership'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Membership
                                        </button>
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors text-gray-900 placeholder-gray-500"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors text-gray-900 placeholder-gray-500"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Subject
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors text-gray-900 placeholder-gray-500"
                                            placeholder="Brief subject of your message"
                                        />
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors text-gray-900 placeholder-gray-500 resize-none"
                                        placeholder="Please share your message, questions, or feedback..."
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                                        isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 transform hover:scale-105'
                                    } focus:outline-none`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending Message...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                            Frequently Asked
                            <span className="block font-semibold text-blue-600">Questions</span>
                        </h2>
                        <p className="text-lg text-gray-600 font-light">
                            Quick answers to common questions about MSA
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                question: "How can I become a member of MSA?",
                                answer: "You can register as a member through our online registration form. Simply visit the registration page, fill in your details, and you'll be part of our community!"
                            },
                            {
                                question: "What events does MSA organize?",
                                answer: "We organize various events including networking sessions, professional development workshops, career fairs, guest speaker sessions, and social gatherings throughout the academic year."
                            },
                            {
                                question: "Is there a membership fee?",
                                answer: "MSA membership details including any fees are communicated during registration. Contact us directly for the most current information about membership requirements."
                            },
                            {
                                question: "How can I get involved in MSA leadership?",
                                answer: "We encourage active participation! Attend our events, volunteer for activities, and keep an eye out for leadership position announcements. We value members who show initiative and commitment."
                            },
                            {
                                question: "Can I suggest ideas for events or activities?",
                                answer: "Absolutely! We welcome suggestions from our members. You can share your ideas through this contact form, during our meetings, or by speaking directly with our leadership team."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
