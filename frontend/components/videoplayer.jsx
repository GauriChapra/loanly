import { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ videoSrc = "/videos/start1.mp4" }) => {
    const [videoPlaying, setVideoPlaying] = useState(false);
    const videoRef = useRef(null);

    // Auto-play video when component mounts
    useEffect(() => {
        const playVideo = async () => {
            try {
                if (videoRef.current) {
                    // Try to play video automatically
                    await videoRef.current.play();
                    setVideoPlaying(true);
                }
            } catch (error) {
                // Browser might block autoplay, handle that case
                console.log('Autoplay was prevented:', error);
                setVideoPlaying(false);
            }
        };

        playVideo();
    }, []);

    const handlePauseClick = () => {
        if (videoPlaying) {
            videoRef.current.pause();
            setVideoPlaying(false);
        } else {
            videoRef.current.play();
            setVideoPlaying(true);
        }
    };

    // When video ends, reset the playing state
    const handleVideoEnded = () => {
        setVideoPlaying(false);
    };

    return (
        <div className="bg-black rounded-lg shadow-xl overflow-hidden border-4 border-white mt-6">
            <div className="relative pt-[100%]">
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover"
                    onEnded={handleVideoEnded}
                    autoPlay
                    playsInline
                />

                {/* Video controls */}
                <div className="absolute bottom-4 right-4 z-10">
                    <button
                        className="bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all duration-300"
                        onClick={handlePauseClick}
                        aria-label={videoPlaying ? "Pause video" : "Play video"}
                    >
                        {videoPlaying ? (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;