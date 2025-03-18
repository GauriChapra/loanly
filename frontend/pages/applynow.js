"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentUpload from '@/components/DocumentUpload';

export default function ApplyNow() {
    const [videoRecorded, setVideoRecorded] = useState(false);
    const [documentsUploaded, setDocumentsUploaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);
    const [videoRecording, setVideoRecording] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [isModalClosing, setIsModalClosing] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState(null);
    const [webcamStream, setWebcamStream] = useState(null);
    const [webcamError, setWebcamError] = useState(null);

    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const initializeWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setWebcamStream(stream);
            setWebcamError(null);

            // Connect the stream to the video element if ref exists
            if (webcamRef.current) {
                webcamRef.current.srcObject = stream;
            }

            return stream;
        } catch (err) {
            console.error("Error accessing webcam:", err);
            setWebcamError("Could not access webcam. Please ensure you've granted camera permissions.");
            return null;
        }
    };

    const handleStartCapture = async () => {
        try {
            // Initialize webcam
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setWebcamStream(stream);

            // Connect stream to video element
            if (webcamRef.current) {
                webcamRef.current.srcObject = stream;
            }

            // Start recording
            setCapturing(true);
            setVideoRecording(true);
            setRecordedChunks([]);

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
                setVideoRecorded(true);
                setActiveStep(2);
                setCapturing(false);
            };

            setTimeout(() => {
                mediaRecorder.stop();
                setVideoRecording(false);
            }, 5000); // Stop recording after 5 seconds

        } catch (err) {
            console.error("Error accessing webcam:", err);
            setWebcamError("Could not access webcam. Please ensure you've granted camera permissions.");
            setVideoRecording(false);
            setCapturing(false);
        }
    };

    const handleRetakeVideo = () => {
        setVideoRecorded(false);
        setRecordedVideo(null);
    };

    const handleVideoUpload = () => {
        if (!videoRecorded) {
            setVideoRecording(true);
            setTimeout(() => {
                setVideoRecording(false);
                setVideoRecorded(true);
                setActiveStep(2);
            }, 3000);
        } else {
            setVideoRecorded(false);
            setTimeout(() => {
                setVideoRecorded(true);
            }, 1000);
        }
    };

    const handleDocumentsUpload = () => {
        setShowDocumentUpload(true);
    };

    const closeDocumentUpload = () => {
        setIsModalClosing(true);
        setTimeout(() => {
            setShowDocumentUpload(false);
            setIsModalClosing(false);
        }, 300);
    };

    const handleDocumentUploadComplete = () => {
        setDocumentsUploaded(true);
        closeDocumentUpload();
        setActiveStep(3);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            alert('Application submitted successfully!');
            setIsSubmitting(false);
        }, 2000);
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

    useEffect(() => {
        if (showDocumentUpload) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [showDocumentUpload]);

    const StepIndicator = ({ number, active, completed }) => (
        <div className="flex flex-col items-center">
            <motion.div
                animate={{
                    scale: active ? 1.1 : 1,
                    backgroundColor: completed ? '#10B981' : active ? '#3B82F6' : '#E5E7EB'
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2 transition-colors duration-300`}
            >
                {completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : number}
            </motion.div>
            <div className={`text-xs font-medium ${active || completed ? 'text-blue-700' : 'text-gray-500'}`}>
                Step {number}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">AI Branch Manager</h1>
                    <div className="h-1 w-20 bg-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Complete the following steps to apply for your loan. Our AI assistant will guide you through the process.
                    </p>
                </motion.div>

                <div className="flex justify-center mb-10">
                    <div className="flex items-center">
                        <StepIndicator number={1} active={activeStep === 1} completed={videoRecorded} />
                        <div className={`w-16 h-1 ${videoRecorded ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>
                        <StepIndicator number={2} active={activeStep === 2} completed={documentsUploaded} />
                        <div className={`w-16 h-1 ${documentsUploaded ? 'bg-green-500' : 'bg-gray-300'} mx-2`}></div>
                        <StepIndicator number={3} active={activeStep === 3} completed={false} />
                    </div>
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`p-6 border rounded-lg shadow-md ${activeStep === 1 ? 'bg-blue-50 border-blue-200' : 'bg-white'} transition-colors duration-300`}
                    >
                        <div className="flex items-start">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 ${videoRecorded ? 'bg-green-500' : 'bg-blue-500'}`}>
                                {videoRecorded ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold mb-2">Record Your Video</h2>
                                <p className="text-gray-600 mb-4">
                                    Introduce yourself and answer a few questions about your loan needs. This will help us personalize your experience.
                                </p>

                                <div className="mt-4">
                                    <AnimatePresence>
                                        {videoRecording ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="relative w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden"
                                                style={{ height: "240px" }}
                                            >
                                                <video
                                                    ref={webcamRef}
                                                    autoPlay
                                                    playsInline
                                                    muted
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-4 right-4">
                                                    <div className="text-white flex items-center">
                                                        <div className="h-4 w-4 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                                                        <span>Recording...</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : videoRecorded ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="relative w-full max-w-md mx-auto bg-gray-800 rounded-lg overflow-hidden"
                                                style={{ height: "240px" }}
                                            >
                                                {recordedVideo && (
                                                    <video
                                                        src={recordedVideo}
                                                        controls
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                {!recordedVideo && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-white flex flex-col items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="mt-2">Video Recorded</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="relative w-full max-w-md mx-auto bg-gray-800 rounded-lg overflow-hidden"
                                                style={{ height: "240px" }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-white flex flex-col items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="mt-2">Click 'Start Recording' to begin</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="mt-4 flex justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleStartCapture}
                                        disabled={videoRecording}
                                        className={`px-6 py-2 rounded-lg font-medium ${videoRecording
                                            ? 'bg-gray-400 cursor-not-allowed text-white'
                                            : videoRecorded
                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            }`}
                                    >
                                        {videoRecording ? 'Recording...' : videoRecorded ? 'Re-record Video' : 'Start Recording'}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className={`p-6 border rounded-lg shadow-md ${activeStep === 2 ? 'bg-blue-50 border-blue-200' : 'bg-white'} transition-colors duration-300`}
                    >
                        <div className="flex items-start">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 ${documentsUploaded ? 'bg-green-500' : 'bg-blue-500'}`}>
                                {documentsUploaded ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold mb-2">Upload Required Documents</h2>
                                <p className="text-gray-600 mb-4">
                                    Upload clear images of your Aadhaar card, PAN card, and income proof documents. This information is required for KYC verification.
                                </p>

                                <div className="mt-4 space-y-2">
                                    {documentsUploaded && (
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>All documents uploaded and verified</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleDocumentsUpload}
                                        className={`px-6 py-2 rounded-lg font-medium ${documentsUploaded
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                            }`}
                                    >
                                        {documentsUploaded ? 'Review Documents' : 'Upload Documents'}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className={`p-6 border rounded-lg shadow-md ${activeStep === 3 ? 'bg-blue-50 border-blue-200' : 'bg-white'} transition-colors duration-300`}
                    >
                        <div className="flex items-start">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 bg-blue-500`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold mb-2">Submit Application</h2>
                                <p className="text-gray-600 mb-4">
                                    Review your application details and submit your loan application. Our team will get back to you within 24 hours.
                                </p>

                                <div className="mt-4 flex justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`px-6 py-2 rounded-lg font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {showDocumentUpload && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 rounded-lg shadow-lg bg-white max-w-3xl w-full relative"
                        >
                            <DocumentUpload onComplete={handleDocumentUploadComplete} onClose={closeDocumentUpload} isClosing={isModalClosing} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}