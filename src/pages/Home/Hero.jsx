import React from 'react'
import { Link } from 'react-router-dom'
import { MemberStats } from './memberstats'
import HeroImage from '/images/home/practice.jpg'

export default function Hero(){
    return (
        <section className='pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-slate-50 via-white to-gray-100 overflow-hidden '>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col lg:flex-row items-center '>
                    <div className='w-full lg:w-1/2 mb-10 lg:mb-0 lg:mr-2'>
                        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900'>
                            Where Strategy <br /> <span className='text-orange-500 font-display'>Meets</span> <br /> <span className='text-gray-700'>Creativity</span>
                        </h1>
                        <p className='text-lg md:text-xl text-gray-700 mb-8 max-w-xl'>
                            We don’t just dream of what’s possible — we imagine it, shape it, and bring it to life.
                        </p>
                        <MemberStats />
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Link to="/register">
                                <button className='px-4 py-3 rounded-sm w-78 border-orange-400 border-2 text-white hover:text-black bg-orange-500 hover:bg-orange-50 font-span font-semibold'>
                                    Join Us Today
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className='w-full lg:w-1/2 relative'>
                        <div className='relative rounded-lg overflow-hidden shadow-xl'>
                            <div className='absolute inset-0 bg-gradient-to-r from-brand-blue/30 to-brand-blue-alt/30 mix-blend-multiply'></div>
                            <img 
                                src={HeroImage}
                                alt='African Youth learning digital skills'
                                className='w-full h-auto object-cover'
                            />
                        </div>
                        <div className='absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg max-w-[200px] hidden md:block'>
                            <div className='flex items-center justify-center mb-2'>
                                <span className='text-3xl font-bold text-brand-blue'>200+</span>
                            </div>
                            <p className='text-center text-sm text-gray-600'>
                                Active Members
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}