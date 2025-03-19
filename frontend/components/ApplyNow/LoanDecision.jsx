"use client";
import { motion } from 'framer-motion';

export default function LoanDecision({ decision, formData }) {
    const renderStatusIndicator = () => {
        switch (decision.status) {
            case 'approved':
                return (
                    <div className="flex items-center space-x-2 text-green-600 mb-4">
                        <span className="text-2xl">✅</span>
                        <span className="text-xl font-semibold">Approved</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="flex items-center space-x-2 text-red-600 mb-4">
                        <span className="text-2xl">❌</span>
                        <span className="text-xl font-semibold">Rejected</span>
                    </div>
                );
            case 'more_info':
                return (
                    <div className="flex items-center space-x-2 text-blue-600 mb-4">
                        <span className="text-2xl">🔄</span>
                        <span className="text-xl font-semibold">More Information Needed</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Application Status</h3>

            {renderStatusIndicator()}

            {decision.status === 'approved' && (
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-lg font-medium text-green-700 mb-2">
                        Congratulations! Your loan application has been approved.
                    </p>
                    <p className="text-gray-600">
                        Our team will contact you shortly with the next steps to complete your loan process.
                    </p>
                </div>
            )}

            {decision.status === 'rejected' && decision.reasons && (
                <div className="bg-red-50 p-3 rounded-md mb-2">
                    <p className="font-medium text-red-800 mb-2">Reasons:</p>
                    <ul className="list-disc pl-5 space-y-1 text-red-700">
                        {decision.reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                </div>
            )}

            {decision.status === 'more_info' && decision.requiredInfo && (
                <div className="bg-blue-50 p-3 rounded-md mb-2">
                    <p className="font-medium text-blue-800 mb-2">Additional Information Required:</p>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
                        {decision.requiredInfo.map((info, index) => (
                            <li key={index}>{info}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}