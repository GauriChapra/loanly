import React, { useState } from 'react';
import VideoPlayer from "./videoplayer";

const HeroSection = () => {
    const [isScrolling, setIsScrolling] = useState(false);

    const handleScroll = () => {
        const howItWorksSection = document.getElementById('how-it-works');
        if (howItWorksSection) {
            howItWorksSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90 z-10"></div>

            <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>

            <div className="relative h-full w-full flex items-center justify-center z-20">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 text-white">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Banking <span className="text-yellow-400">Beyond</span> Branches
                        </h1>
                        <p className="text-xl mb-8 max-w-lg">
                            Experience personalized banking through video conversations with our
                            <span className="text-yellow-400 font-semibold"> AI Branch Manager</span>.
                            Apply for loans anytime, anywhere.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <a
                                href="/applynow"
                                className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 text-center text-lg"
                            >
                                Apply for a Loan
                            </a>
                            <button
                                onClick={handleScroll}
                                className="border-2 border-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition duration-300 text-center text-lg"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 mt-12 md:mt-0 relative">
                        <div className="rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
                            <VideoPlayer />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                <button
                    onClick={handleScroll}
                    className="animate-bounce bg-white bg-opacity-20 p-2 w-10 h-10 ring-1 ring-white ring-opacity-20 rounded-full flex items-center justify-center"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </button>
            </div>
        </section>
    );
};

// Add this to your global CSS or style block
const styles = `
    .bg-grid-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
`;

export default HeroSection;