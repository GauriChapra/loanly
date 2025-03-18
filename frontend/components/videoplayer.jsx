import { useState } from 'react';

const VideoPlayer = () => {
    const [videoPlaying, setVideoPlaying] = useState(false);

    return (
        <div className="bg-black rounded-lg shadow-xl overflow-hidden border-4 border-white">
            <div className="relative pt-[56.25%]">
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900">
                    {!videoPlaying ? (
                        <div className="text-center">
                            <div
                                className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-yellow-500 transition-colors duration-300"
                                onClick={() => setVideoPlaying(true)}
                                aria-label="Play video"
                            >
                                <div className="w-0 h-0 border-t-8 border-b-8 border-l-16 border-transparent border-l-white ml-1"></div>
                            </div>
                            <p className="mt-4 text-white">Meet your AI Branch Manager</p>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                            {/* In a real implementation, this would be a video element */}
                            <div className="relative w-full h-full">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-white">Video content would play here</p>
                                </div>
                                <button
                                    className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all duration-300"
                                    onClick={() => setVideoPlaying(false)}
                                    aria-label="Pause video"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;