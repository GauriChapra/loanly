import React, { useState } from 'react';

export default function SubmitApplication() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            alert('Application submitted successfully!');
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="p-6 border rounded-lg shadow-md bg-blue-50 border-blue-200">
            <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white mr-4 bg-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-2">Submit Application</h2>
                    <p className="text-gray-600 mb-4">
                        Review your application details and submit your loan application. Our team will get back to you within 24 hours.
                    </p>

                    <div className="bg-white p-4 rounded-lg border mb-6">
                        <h3 className="font-medium mb-2">Application Summary</h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Verification Status:</span>
                                <span className="text-green-600 font-medium">Verified</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Video Interview:</span>
                                <span className="text-green-600 font-medium">Completed</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Documents:</span>
                                <span className="text-green-600 font-medium">Verified</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pre-approved Amount:</span>
                                <span className="font-medium">₹5,00,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Interest Rate:</span>
                                <span className="font-medium">10.5% p.a.</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`px-6 py-2 rounded-lg font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-500 text-white'
                                }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}