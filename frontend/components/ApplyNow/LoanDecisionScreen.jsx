"use client";

import { motion } from 'framer-motion';
import LoanDecision from './LoanDecision';

export default function LoanDecisionScreen({ decision, formData, onBack }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden p-6"
        >
            <div className="pb-4 mb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-blue-600">Loan Decision</h2>
                <p className="text-gray-600 mt-2">
                    Review your loan application results
                </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Application Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="font-medium">₹{parseInt(formData.loanAmount).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Loan Purpose</p>
                        <p className="font-medium">{
                            {
                                'personal': 'Personal Expenses',
                                'education': 'Education',
                                'homeImprovement': 'Home Improvement',
                                'medical': 'Medical Expenses',
                                'debt': 'Debt Consolidation',
                                'business': 'Business',
                                'vehicle': 'Vehicle Purchase',
                                'wedding': 'Wedding',
                                'travel': 'Travel',
                                'other': 'Other'
                            }[formData.loanPurpose]
                        }</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Monthly Income</p>
                        <p className="font-medium">₹{parseInt(formData.monthlyIncome).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Credit Score</p>
                        <p className="font-medium">{formData.creditScore}</p>
                    </div>
                </div>
            </div>

            <LoanDecision decision={decision} formData={formData} />

            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Next Steps</h3>
                {decision.status === 'approved' && (
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Our representative will contact you within 24 hours</li>
                        <li>Keep your ID proof and address proof documents ready</li>
                        <li>We might need additional income verification documents</li>
                    </ul>
                )}
                {decision.status === 'rejected' && (
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>You can reapply after 90 days</li>
                        <li>Consider improving your credit score before reapplying</li>
                        <li>Reduce your existing debt obligations if possible</li>
                    </ul>
                )}
                {decision.status === 'more_info' && (
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Our representative will contact you for additional documentation</li>
                        <li>Consider applying for a lower loan amount</li>
                        <li>You may provide additional income proof to increase eligibility</li>
                    </ul>
                )}
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={onBack}
                    className="py-2 px-6 rounded-lg font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 transition-all"
                >
                    Back to Application Form
                </button>
            </div>
        </motion.div>
    );
}