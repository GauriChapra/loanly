"use client";

import { useState, useEffect } from 'react';
import VideoRecording from '@/components/ApplyNow/VideoRecording';
import DocumentUpload from '@/components/ApplyNow/DocumentsUploadCard';
import SubmitApplication from '@/components/ApplyNow/SubmitApplication';
import WebcamMonitor from '@/components/WebcamMonitor';
import LoanApplicationForm from '@/components/ApplyNow/LoanApplicationForm';

export default function ApplyNow() {
    const [currentStep, setCurrentStep] = useState(1);
    const [videoRecorded, setVideoRecorded] = useState(false);
    const [documentsUploaded, setDocumentsUploaded] = useState(false);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);
    const [isModalClosing, setIsModalClosing] = useState(false);
    const [loanData, setLoanData] = useState(null);
    const [stepVideos] = useState({
        1: "/videos/start1.mp4",
        2: "/videos/docs.mp4",
        3: "/videos/docs.mp4",
        4: "/videos/docs.mp4"
    });

    const handleVideoRecorded = () => {
        setVideoRecorded(true);
        setCurrentStep(2);
    };

    const handleDocumentUploadComplete = () => {
        setDocumentsUploaded(true);
        closeDocumentUpload();
        setCurrentStep(3);
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

    // Step titles and descriptions
    const stepInfo = {
        1: {
            title: "Identity Verification",
            description: "Record a short verification video to confirm your identity.",
            instructions: [
                "Ensure you are in a well-lit area",
                "Look directly at the camera",
                "State your name and purpose clearly",
                "Complete the full 5-second recording"
            ]
        },
        2: {
            title: "Document Submission",
            description: "Upload clear images of your required identity documents for KYC verification.",
            instructions: [
                "Provide your Aadhaar card (front and back)",
                "Include your PAN card",
                "Upload income proof documents",
                "Ensure all documents are clearly visible"
            ]
        },
        3: {
            title: "Loan Application Details",
            description: "Complete your loan application by providing the necessary information.",
            instructions: [
                "Enter personal details accurately",
                "Provide employment information",
                "Specify loan amount and purpose",
                "Review all information before proceeding"
            ]
        },
        4: {
            title: "Review and Submit",
            description: "Review your application and submit it for processing.",
            instructions: [
                "Verify all provided information",
                "Check document uploads",
                "Read terms and conditions",
                "Submit your completed application"
            ]
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">AI Branch Manager</h1>
                    <div className="h-1 w-20 bg-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Complete the following steps to apply for your loan. Our AI assistant will guide you through the process.
                    </p>

                    {/* Progress Indicator */}
                    <div className="flex justify-center mt-6">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
                                    ${currentStep === step ? 'bg-blue-600 text-white' :
                                            currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {currentStep > step ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : step}
                                    </div>
                                    {step < 4 && (
                                        <div className={`w-10 h-1 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                    <div className="w-full md:w-1/2 bg-white shadow-md">
                        <video
                            src={stepVideos[currentStep]}
                            className="w-full h-full object-cover"
                            autoPlay
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
                        {currentStep === 1 && (
                            <VideoRecording
                                onVideoRecorded={handleVideoRecorded}
                                recordingDuration={5000}
                            />
                        )}

                        {currentStep === 2 && (
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Upload Required Documents</h3>
                                    <p className="text-gray-600 mb-4">
                                        Your identity and income documents are required to process your loan application.
                                    </p>

                                    {documentsUploaded && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex items-center space-x-2 text-green-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span>All documents uploaded and verified</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={handleDocumentsUpload}
                                        className={`w-full px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${documentsUploaded
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                            }`}
                                    >
                                        {documentsUploaded ? 'Review Documents' : 'Upload Documents'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="h-full">
                                <LoanApplicationForm
                                    onComplete={(result) => {
                                        setLoanData(result);
                                        setCurrentStep(4);
                                    }}
                                />
                            </div>
                        )}

                        {currentStep === 4 && (
                            <SubmitApplication loanData={loanData} />
                        )}
                    </div>
                </div>
            </div>

            {/* Document Upload Modal */}
            {showDocumentUpload && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className={`p-6 rounded-lg shadow-lg bg-white max-w-3xl w-full relative transition-opacity duration-300 ${isModalClosing ? 'opacity-0' : 'opacity-100'}`}>
                        <DocumentUpload
                            onComplete={handleDocumentUploadComplete}
                            onClose={closeDocumentUpload}
                            isClosing={isModalClosing}
                        />
                    </div>
                </div>
            )}

            <WebcamMonitor />
        </div>
    );
}