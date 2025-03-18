// components/features.js
import React from 'react';

const features = () => {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                    Experience <span className="text-yellow-400">Modern Banking</span> Features
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<UserIcon />}
                        title="Virtual AI Branch Manager"
                        description="Interact with our AI manager through video conversations, just like in a physical branch."
                    />

                    <FeatureCard
                        icon={<CameraIcon />}
                        title="Video-Based Interaction"
                        description="Record video responses instead of filling out lengthy paper forms."
                    />

                    <FeatureCard
                        icon={<DocumentIcon />}
                        title="Simplified Documents"
                        description="Upload documents via mobile or webcam - we'll extract all necessary information."
                    />

                    <FeatureCard
                        icon={<CheckmarkIcon />}
                        title="Instant Decisions"
                        description="Get loan approvals, feedback, or requests for additional information in real-time."
                    />
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

// Icons components
const UserIcon = () => (
    <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
    </svg>
);

const CameraIcon = () => (
    <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
    </svg>
);

const DocumentIcon = () => (
    <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
    </svg>
);

const CheckmarkIcon = () => (
    <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
    </svg>
);

export default features;