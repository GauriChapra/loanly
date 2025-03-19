"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import LoanDecision from './LoanDecision';

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

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateEligibility = () => {
        const income = parseFloat(formData.monthlyIncome);
        const existingEMIs = parseFloat(formData.existingEMIs);
        const creditScore = parseInt(formData.creditScore);
        const loanAmount = parseFloat(formData.loanAmount);
        const employmentDuration = parseFloat(formData.employmentDuration);

        let decision = { status: null, reasons: [], maxEligibleAmount: 0, recommendedEMI: 0 };

        const maxEMICapacity = income * 0.5 - existingEMIs;

        const maxLoanAmount = maxEMICapacity * 36;
        decision.maxEligibleAmount = Math.round(maxLoanAmount);
        decision.recommendedEMI = Math.round(maxEMICapacity);

        if (creditScore < 650) {
            decision.reasons.push('Low credit score (below 650)');
        }

        const dtiRatio = (existingEMIs / income) * 100;
        if (dtiRatio > 40) {
            decision.reasons.push('High debt-to-income ratio (over 40%)');
        }

        if (employmentDuration < 1) {
            decision.reasons.push('Employment duration less than 1 year');
        }

        if (loanAmount > maxLoanAmount) {
            decision.reasons.push(`Requested loan amount exceeds your eligibility (max: ₹${maxLoanAmount.toLocaleString()})`);
        }

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

            setTimeout(() => {
                const result = calculateEligibility();
                setDecision(result);
                setIsSubmitting(false);

                if (result.status === 'approved') {
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