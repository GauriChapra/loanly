import React, { useState, useRef, useEffect } from 'react';

export default function VideoRecording({ onVideoRecorded, recordingDuration = 10000 }) {
    const [videoRecording, setVideoRecording] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState(null);
    const [webcamError, setWebcamError] = useState(null);

    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [webcamStream, setWebcamStream] = useState(null);

    const handleStartCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setWebcamStream(stream);

            if (webcamRef.current) {
                webcamRef.current.srcObject = stream;
            }

            setVideoRecording(true);

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "video/webm",
            });
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();

            const chunks = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                setRecordedVideo(URL.createObjectURL(blob));
                setVideoRecording(false);
            };

            // Stop recording after specified duration
            setTimeout(() => {
                if (mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
                stream.getTracks().forEach(track => track.stop());
            }, recordingDuration);

        } catch (err) {
            console.error("Error accessing webcam:", err);
            setWebcamError("Could not access webcam. Please ensure you've granted camera permissions.");
            setVideoRecording(false);
        }
    };

    const handleContinue = () => {
        onVideoRecorded();
    };

    useEffect(() => {
        return () => {
            if (webcamStream) {
                webcamStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        };
    }, [webcamStream]);

    return (
        <div className="p-6 border rounded-lg shadow-md bg-blue-50 border-blue-200">
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full text-white mb-4 bg-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>

                <h2 className="text-xl font-semibold mb-2 text-center">Record Your Video</h2>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                    Introduce yourself and answer a few questions about your loan needs. This will help us personalize your experience.
                </p>

                <div className="w-full max-w-md mx-auto">
                    {videoRecording ? (
                        <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "320px" }}>
                            <video
                                ref={webcamRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 right-4">
                                <div className="text-white flex items-center bg-black bg-opacity-50 px-3 py-1 rounded-full">
                                    <div className="h-3 w-3 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                                    <span>Recording...</span>
                                </div>
                            </div>
                        </div>
                    ) : recordedVideo ? (
                        <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: "320px" }}>
                            <video
                                src={recordedVideo}
                                controls
                                className="w-full h-full object-cover"
                                autoPlay
                            />
                        </div>
                    ) : (
                        <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: "320px" }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span className="mt-2">Click 'Start Recording' to begin</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {webcamError && (
                    <div className="mt-2 text-red-500 text-sm">{webcamError}</div>
                )}

                <div className="mt-6 flex justify-center space-x-4">
                    {!recordedVideo ? (
                        <button
                            onClick={handleStartCapture}
                            disabled={videoRecording}
                            className={`px-6 py-2 rounded-lg font-medium ${videoRecording
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white transition'
                                }`}
                        >
                            {videoRecording ? 'Recording...' : 'Start Recording'}
                        </button>
                    ) : (
                        <div className="flex space-x-4">
                            <button
                                onClick={handleStartCapture}
                                className="px-6 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition"
                            >
                                Re-record
                            </button>
                            <button
                                onClick={handleContinue}
                                className="px-6 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition"
                            >
                                Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}