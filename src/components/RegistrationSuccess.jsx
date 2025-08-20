import React, { useEffect } from 'react';
import { CheckCircle, Users, MessageCircle, Sparkles, Trophy, Heart } from 'lucide-react';

export default function RegistrationSuccess({ memberName, onJoinWhatsApp, onClose }) {
    // Auto-confetti animation on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            // You can add confetti library here if needed
            console.log('🎉 Celebrating new member:', memberName);
        }, 300);

        return () => clearTimeout(timer);
    }, [memberName]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
                {/* Celebration Header */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 text-center overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                        <div className="absolute top-8 right-8 w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                        <div className="absolute bottom-6 left-8 w-2 h-2 bg-green-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        <div className="absolute bottom-4 right-4 w-3 h-3 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
                        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" style={{animationDelay: '0.7s'}}></div>
                    </div>
                    
                    {/* Success Icon */}
                    <div className="relative mb-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounceIn">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles className="w-4 h-4 text-yellow-700" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2 animate-fadeIn">
                        🎉 Welcome to MSA!
                    </h2>
                    <p className="text-blue-100 text-lg animate-fadeIn" style={{animationDelay: '0.3s'}}>
                        Congratulations, <span className="font-semibold text-white">{memberName}</span>!
                    </p>
                </div>

                {/* Content Section */}
                <div className="p-8">
                    <div className="text-center mb-6 animate-fadeIn" style={{animationDelay: '0.5s'}}>
                        <div className="flex items-center justify-center mb-4">
                            <Trophy className="w-8 h-8 text-yellow-500 mr-2 animate-wiggle" />
                            <h3 className="text-xl font-semibold text-gray-900">Registration Complete!</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            The MSA team will reach out to you for more info.
                            Get ready for an amazing journey of growth, learning, and networking!
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 animate-fadeIn" style={{animationDelay: '0.7s'}}>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Heart className="w-4 h-4 text-red-500 mr-2 animate-pulse" />
                            What's Next?
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center animate-slideInLeft" style={{animationDelay: '0.9s'}}>
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                                Access to exclusive events and workshops
                            </li>
                            <li className="flex items-center animate-slideInLeft" style={{animationDelay: '1.1s'}}>
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                                Networking opportunities with industry professionals
                            </li>
                            <li className="flex items-center animate-slideInLeft" style={{animationDelay: '1.3s'}}>
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                                Career development resources and mentorship
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 animate-fadeIn" style={{animationDelay: '1.5s'}}>
                        {/* WhatsApp Join Button */}
                        <button
                            onClick={onJoinWhatsApp}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center group transform hover:scale-105 shadow-lg animate-pulse hover:animate-none"
                        >
                            <MessageCircle className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                            Join Our WhatsApp Community
                            <Users className="w-4 h-4 ml-2 opacity-75" />
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Continue Exploring
                        </button>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-6 text-center animate-fadeIn" style={{animationDelay: '1.7s'}}>
                        <p className="text-xs text-gray-500">
                            You can always find the WhatsApp link in your member dashboard
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(30px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                
                @keyframes bounceIn {
                    0% { 
                        opacity: 0; 
                        transform: scale(0.3); 
                    }
                    50% { 
                        opacity: 1; 
                        transform: scale(1.05); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                }
                
                @keyframes slideInLeft {
                    from { 
                        opacity: 0; 
                        transform: translateX(-20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }
                
                @keyframes wiggle {
                    0%, 7% { transform: rotateZ(0deg); }
                    15% { transform: rotateZ(-15deg); }
                    20% { transform: rotateZ(10deg); }
                    25% { transform: rotateZ(-10deg); }
                    30% { transform: rotateZ(6deg); }
                    35% { transform: rotateZ(-4deg); }
                    40%, 100% { transform: rotateZ(0deg); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                .animate-slideUp {
                    animation: slideUp 0.6s ease-out forwards;
                }
                
                .animate-bounceIn {
                    animation: bounceIn 0.8s ease-out forwards;
                }
                
                .animate-slideInLeft {
                    animation: slideInLeft 0.5s ease-out forwards;
                }
                
                .animate-wiggle {
                    animation: wiggle 2s ease-in-out infinite;
                }
                
                .animate-twinkle {
                    animation: twinkle 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
