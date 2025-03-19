"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const WebcamMonitor = ({ onPersonChanged }) => {
    const [active, setActive] = useState(true);
    const [minimized, setMinimized] = useState(false);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const webcamRef = useRef(null);

    useEffect(() => {
        const initializeWebcam = async () => {
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 120 },
                        height: { ideal: 120 },
                        facingMode: "user"
                    }
                });

                setStream(videoStream);

                if (webcamRef.current) {
                    webcamRef.current.srcObject = videoStream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                setError("Could not access webcam. Please ensure you've granted camera permissions.");
            }
        };

        if (active) {
            initializeWebcam();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [active]);

    const toggleMinimize = () => {
        setMinimized(!minimized);
    };

    const toggleActive = () => {
        if (!active) {
            setActive(true);
        } else {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            setActive(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg overflow-hidden ${active ? 'bg-gray-900' : 'bg-gray-700'
                }`}
            style={{
                width: minimized ? '40px' : '120px',
                height: minimized ? '40px' : '120px'
            }}
        >
            {/* Webcam Feed */}
            {active && !minimized && (
                <div className="relative w-full h-full">
                    {error ? (
                        <div className="absolute inset-0 flex items-center justify-center p-2 text-white text-xs text-center">
                            {error}
                        </div>
                    ) : (
                        <video
                            ref={webcamRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    )}

                    <div className="absolute top-2 left-2 flex items-center">
                        <div className="h-2 w-2 bg-red-600 rounded-full mr-1 animate-pulse"></div>
                        <span className="text-white text-xs">Monitoring</span>
                    </div>
                </div>
            )}

            <div className={`${minimized ? 'w-full h-full' : 'h-8'
                } bg-gray-800 flex items-center ${minimized ? 'justify-center' : 'justify-end'
                } px-2`}>
                {minimized ? (
                    <button
                        onClick={toggleMinimize}
                        className="text-white p-1 hover:bg-gray-700 rounded"
                        aria-label="Expand webcam monitor"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={toggleActive}
                            className="text-white p-1 hover:bg-gray-700 rounded mr-1"
                            aria-label={active ? "Pause webcam monitor" : "Resume webcam monitor"}
                        >
                            {active ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={toggleMinimize}
                            className="text-white p-1 hover:bg-gray-700 rounded"
                            aria-label="Minimize webcam monitor"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default WebcamMonitor;