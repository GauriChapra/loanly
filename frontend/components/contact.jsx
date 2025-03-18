import { useState } from 'react';

const ContactForm = ({ inline = false, onClose = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        loanType: 'personal' // Added field for loan type
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        submitting: false,
        error: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus({ ...formStatus, submitting: true });

        // Simulate API call with timeout
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setFormStatus({
                submitted: true,
                submitting: false,
                error: null
            });

            // Reset form after submission
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    loanType: 'personal'
                });

                if (onClose) {
                    onClose();
                }
            }, 2000);
        }, 1000);
    };

    // Success message after form submission
    const SuccessMessage = () => (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                        Thank you for your message! We'll be in touch soon.
                    </p>
                </div>
            </div>
        </div>
    );

    // If this is a modal form, render with modal container
    if (!inline && onClose) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-900 mb-4">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-blue-900">Get in Touch</h3>
                        <p className="text-gray-600 mt-2">We're here to help with your financial journey</p>
                    </div>

                    {formStatus.submitted ? <SuccessMessage /> : renderForm()}
                </div>
            </div>
        );
    }

    // Otherwise render the form directly
    return (
        <div id='contact' className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-blue-900">Contact Us</h3>
                <p className="text-gray-600 mt-2">Have questions or need assistance? We're here to help.</p>
            </div>

            {formStatus.submitted ? <SuccessMessage /> : renderForm()}
        </div>
    );

    function renderForm() {
        return (
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-group">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="+1 (123) 456-7890"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="loanType" className="block text-gray-700 font-medium mb-2">Interested In</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <select
                            id="loanType"
                            name="loanType"
                            value={formData.loanType}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                            required
                        >
                            <option value="personal">Personal Loan</option>
                            <option value="home">Home Loan</option>
                            <option value="business">Business Loan</option>
                            <option value="education">Education Loan</option>
                            <option value="other">Other Services</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="4"
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="How can we help you with your financial needs?"
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="form-group pt-3">
                    <button
                        type="submit"
                        disabled={formStatus.submitting}
                        className={`w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 transform hover:-translate-y-0.5 ${formStatus.submitting ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                    >
                        {formStatus.submitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Send Message'
                        )}
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                    By submitting this form, you agree to our Privacy Policy and Terms of Service.
                </p>
            </form>
        );
    }
};

// Add this to your global CSS for the fade-in animation
const styles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
    }
`;

export default ContactForm;