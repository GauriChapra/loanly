"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoanApplicationForm({ onComplete }) {
    const [formData, setFormData] = useState({
        loanAmount: '',
        loanPurpose: 'personal',
        employmentType: 'salaried',
        monthlyIncome: '',
        existingEMIs: '',
        creditScore: '',
        residenceType: 'owned',
        residenceDuration: '',
        companyName: '',
        employmentDuration: '',
        bankName: '',
        accountType: 'savings',
        accountDuration: '',
    });

    const [errors, setErrors] = useState({});
    const [decision, setDecision] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loanPurposeOptions = [
        { value: 'personal', label: 'Personal Expenses' },
        { value: 'education', label: 'Education' },
        { value: 'homeImprovement', label: 'Home Improvement' },
        { value: 'medical', label: 'Medical Expenses' },
        { value: 'debt', label: 'Debt Consolidation' },
        { value: 'business', label: 'Business' },
        { value: 'vehicle', label: 'Vehicle Purchase' },
        { value: 'wedding', label: 'Wedding' },
        { value: 'travel', label: 'Travel' },
        { value: 'other', label: 'Other' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }

        // Clear decision when any field is changed
        if (decision) {
            setDecision(null);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.loanAmount || formData.loanAmount <= 0) {
            newErrors.loanAmount = 'Please enter a valid loan amount';
        }

        if (!formData.monthlyIncome || formData.monthlyIncome <= 0) {
            newErrors.monthlyIncome = 'Please enter your monthly income';
        }

        if (!formData.existingEMIs && formData.existingEMIs !== 0) {
            newErrors.existingEMIs = 'Please enter your existing EMI amount (0 if none)';
        }

        if (!formData.creditScore) {
            newErrors.creditScore = 'Please provide your credit score';
        } else if (formData.creditScore < 300 || formData.creditScore > 900) {
            newErrors.creditScore = 'Credit score must be between 300 and 900';
        }

        if (!formData.residenceDuration) {
            newErrors.residenceDuration = 'Please enter how long you have lived at your current residence';
        }

        if (!formData.companyName && formData.employmentType === 'salaried') {
            newErrors.companyName = 'Please enter your company name';
        }

        if (!formData.employmentDuration && formData.employmentType !== 'unemployed') {
            newErrors.employmentDuration = 'Please enter your employment duration';
        }

        if (!formData.bankName) {
            newErrors.bankName = 'Please enter your bank name';
        }

        if (!formData.accountDuration) {
            newErrors.accountDuration = 'Please enter how long you have held this bank account';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateEligibility = () => {
        // Convert string inputs to numbers for calculations
        const income = parseFloat(formData.monthlyIncome);
        const existingEMIs = parseFloat(formData.existingEMIs);
        const creditScore = parseInt(formData.creditScore);
        const loanAmount = parseFloat(formData.loanAmount);
        const employmentDuration = parseFloat(formData.employmentDuration);

        // Rule-based decision system
        let decision = { status: null, reasons: [], maxEligibleAmount: 0, recommendedEMI: 0 };

        // Calculate max loan eligibility (50% of monthly income minus existing EMIs)
        const maxEMICapacity = income * 0.5 - existingEMIs;

        // Calculate max loan amount based on 36-month term
        const maxLoanAmount = maxEMICapacity * 36;
        decision.maxEligibleAmount = Math.round(maxLoanAmount);
        decision.recommendedEMI = Math.round(maxEMICapacity);

        // Credit score check
        if (creditScore < 650) {
            decision.reasons.push('Low credit score (below 650)');
        }

        // Debt-to-income ratio check
        const dtiRatio = (existingEMIs / income) * 100;
        if (dtiRatio > 40) {
            decision.reasons.push('High debt-to-income ratio (over 40%)');
        }

        // Employment stability check
        if (employmentDuration < 1) {
            decision.reasons.push('Employment duration less than 1 year');
        }

        // Loan amount vs eligibility check
        if (loanAmount > maxLoanAmount) {
            decision.reasons.push(`Requested loan amount exceeds your eligibility (max: ₹${maxLoanAmount.toLocaleString()})`);
        }

        // Final decision
        if (decision.reasons.length === 0) {
            decision.status = 'approved';
        } else if (creditScore < 550 || dtiRatio > 60 || loanAmount > maxLoanAmount * 2) {
            decision.status = 'rejected';
        } else {
            decision.status = 'more_info';
        }

        return decision;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            // Simulate processing time
            setTimeout(() => {
                const result = calculateEligibility();
                setDecision(result);
                setIsSubmitting(false);

                if (result.status === 'approved') {
                    // If approved, wait 2 seconds then call onComplete
                    setTimeout(() => {
                        onComplete && onComplete({
                            decision: result,
                            formData: formData
                        });
                    }, 2000);
                }
            }, 1500);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden p-6"
        >
            <div className="pb-4 mb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-blue-600">Loan Application</h2>
                <p className="text-gray-600 mt-2">
                    Please provide the following details to help us determine your loan eligibility
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Loan Details Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Loan Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
                            <input
                                type="number"
                                name="loanAmount"
                                value={formData.loanAmount}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.loanAmount ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter amount"
                            />
                            {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Purpose</label>
                            <select
                                name="loanPurpose"
                                value={formData.loanPurpose}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                {loanPurposeOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Financial Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Financial Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹)</label>
                            <input
                                type="number"
                                name="monthlyIncome"
                                value={formData.monthlyIncome}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter monthly income"
                            />
                            {errors.monthlyIncome && <p className="text-red-500 text-xs mt-1">{errors.monthlyIncome}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Existing Monthly EMIs (₹)</label>
                            <input
                                type="number"
                                name="existingEMIs"
                                value={formData.existingEMIs}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.existingEMIs ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Total of existing EMIs"
                            />
                            {errors.existingEMIs && <p className="text-red-500 text-xs mt-1">{errors.existingEMIs}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Credit Score (300-900)</label>
                            <input
                                type="number"
                                name="creditScore"
                                value={formData.creditScore}
                                onChange={handleChange}
                                min="300"
                                max="900"
                                className={`w-full p-2 border rounded-md ${errors.creditScore ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your credit score"
                            />
                            {errors.creditScore && <p className="text-red-500 text-xs mt-1">{errors.creditScore}</p>}
                        </div>
                    </div>
                </div>

                {/* Employment Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                            <select
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="salaried">Salaried</option>
                                <option value="self-employed">Self-Employed</option>
                                <option value="businessman">Business Owner</option>
                                <option value="professional">Professional</option>
                                <option value="retired">Retired</option>
                                <option value="unemployed">Unemployed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company/Business Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter company name"
                            />
                            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Duration (years)</label>
                            <input
                                type="number"
                                name="employmentDuration"
                                value={formData.employmentDuration}
                                onChange={handleChange}
                                step="0.1"
                                className={`w-full p-2 border rounded-md ${errors.employmentDuration ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Years in current employment"
                            />
                            {errors.employmentDuration && <p className="text-red-500 text-xs mt-1">{errors.employmentDuration}</p>}
                        </div>
                    </div>
                </div>

                {/* Residence Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Residence Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Residence Type</label>
                            <select
                                name="residenceType"
                                value={formData.residenceType}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="owned">Self-Owned</option>
                                <option value="familyOwned">Family-Owned</option>
                                <option value="rented">Rented</option>
                                <option value="companyProvided">Company Provided</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Residence Duration (years)</label>
                            <input
                                type="number"
                                name="residenceDuration"
                                value={formData.residenceDuration}
                                onChange={handleChange}
                                step="0.1"
                                className={`w-full p-2 border rounded-md ${errors.residenceDuration ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Years at current residence"
                            />
                            {errors.residenceDuration && <p className="text-red-500 text-xs mt-1">{errors.residenceDuration}</p>}
                        </div>
                    </div>
                </div>

                {/* Banking Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Banking Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your bank name"
                            />
                            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                            <select
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="savings">Savings</option>
                                <option value="current">Current</option>
                                <option value="salary">Salary Account</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Banking Relationship (years)</label>
                            <input
                                type="number"
                                name="accountDuration"
                                value={formData.accountDuration}
                                onChange={handleChange}
                                step="0.1"
                                className={`w-full p-2 border rounded-md ${errors.accountDuration ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Years with this bank"
                            />
                            {errors.accountDuration && <p className="text-red-500 text-xs mt-1">{errors.accountDuration}</p>}
                        </div>
                    </div>
                </div>

                {/* Decision Display */}
                {decision && (
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
                                        <p className="text-xl font-bold">₹{formData.loanAmount.toLocaleString()}</p>
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
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`py-3 px-8 rounded-lg font-medium text-white transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : decision ? 'Update Application' : 'Check Eligibility'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}