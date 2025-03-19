"use client";

import { motion } from 'framer-motion';

export default function LoanDecision({ decision, formData }) {
    if (!decision) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg text-white ${decision.status === 'approved' ? 'bg-green-600' :
                    decision.status === 'rejected' ? 'bg-red-600' : 'bg-yellow-500'
                }`}
        >
            <div className="flex items-center mb-3">
                <div className="flex-shrink-0 mr-3">
                    {decision.status === 'approved' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {decision.status === 'rejected' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {decision.status === 'more_info' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-bold">
                        {decision.status === 'approved' && 'Loan Approved! ✅'}
                        {decision.status === 'rejected' && 'Loan Application Rejected ❌'}
                        {decision.status === 'more_info' && 'Additional Information Required 🔄'}
                    </h3>
                    <p className="mt-1">
                        {decision.status === 'approved' && 'Congratulations! Your loan application has been approved.'}
                        {decision.status === 'rejected' && 'We are unable to approve your loan application at this time.'}
                        {decision.status === 'more_info' && 'We need more information to process your application.'}
                    </p>
                </div>
            </div>

            {/* Loan Details for Approved */}
            {decision.status === 'approved' && (
                <div className="bg-green-700 bg-opacity-30 p-3 rounded-md mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <p className="text-sm opacity-80">Approved Loan Amount:</p>
                            <p className="text-xl font-bold">₹{parseInt(formData.loanAmount).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm opacity-80">Recommended Monthly EMI:</p>
                            <p className="text-xl font-bold">₹{decision.recommendedEMI.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Reasons for Rejection or More Info */}
            {(decision.status === 'rejected' || decision.status === 'more_info') && decision.reasons.length > 0 && (
                <div className={`${decision.status === 'rejected' ? 'bg-red-700' : 'bg-yellow-600'} bg-opacity-30 p-3 rounded-md`}>
                    <p className="font-medium mb-1">Reasons:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {decision.reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                    {decision.status === 'more_info' && (
                        <div className="mt-3 pt-3 border-t border-yellow-400 border-opacity-30">
                            <p className="font-medium">Maximum eligible loan amount: ₹{decision.maxEligibleAmount.toLocaleString()}</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}