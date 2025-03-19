import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
    return (
        <section id='features' className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
                        Experience Modern Banking Features
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Banking reimagined with innovative technology that puts you in control.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    <FeatureCard
                        icon={<UserIcon />}
                        title="Virtual AI Branch Manager"
                        description="Interact with our AI manager through immersive video conversations, just like in a physical branch but from anywhere in the world."
                        delay={0.1}
                        accentColor="from-indigo-600 to-blue-700"
                        iconBgColor="bg-gradient-to-br from-indigo-600 to-blue-700"
                    />

                    <FeatureCard
                        icon={<CameraIcon />}
                        title="Video-Based Interaction"
                        description="Record video responses instead of filling out lengthy paper forms. Our system detects emotions and provides personalized support."
                        delay={0.3}
                        accentColor="from-purple-600 to-indigo-700"
                        iconBgColor="bg-gradient-to-br from-purple-600 to-indigo-700"
                    />

                    <FeatureCard
                        icon={<DocumentIcon />}
                        title="Smart Document Processing"
                        description="Upload documents via mobile or webcam with real-time OCR technology that extracts all necessary information in seconds."
                        delay={0.5}
                        accentColor="from-blue-600 to-cyan-700"
                        iconBgColor="bg-gradient-to-br from-blue-600 to-cyan-700"
                    />

                    <FeatureCard
                        icon={<CheckmarkIcon />}
                        title="Instant AI-Powered Decisions"
                        description="Get loan approvals, feedback, or requests for additional information in real-time with our advanced machine learning algorithms."
                        delay={0.7}
                        accentColor="from-indigo-600 to-violet-700"
                        iconBgColor="bg-gradient-to-br from-indigo-600 to-violet-700"
                    />
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon, title, description, delay, accentColor, iconBgColor }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col group hover:shadow-2xl transition-all duration-500"
        >
            <div className={`h-2 w-full bg-gradient-to-r ${accentColor}`}></div>

            <div className="p-8 flex flex-col h-full">
                <motion.div
                    className={`${iconBgColor} text-white rounded-2xl w-20 h-20 mb-6 flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-all duration-300`}
                    whileHover={{ rotate: 10, scale: 1.05 }}
                >
                    {icon}
                </motion.div>

                <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                    {title}
                </h3>

                <p className="text-gray-600 flex-grow">
                    {description}
                </p>

                <motion.div
                    className="mt-6 flex items-center text-indigo-700 font-medium cursor-pointer group-hover:text-indigo-500"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:ml-3 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </motion.div>
            </div>
        </motion.div>
    );
};

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Features;