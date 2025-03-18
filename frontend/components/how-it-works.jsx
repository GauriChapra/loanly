import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
    const steps = [
        {
            number: 1,
            title: "Start Conversation",
            description: "Begin video interaction with our AI Branch Manager.",
            icon: "💬"
        },
        {
            number: 2,
            title: "Provide Information",
            description: "Answer questions through video responses.",
            icon: "📋"
        },
        {
            number: 3,
            title: "Submit Documents",
            description: "Upload required documents for verification.",
            icon: "📄"
        },
        {
            number: 4,
            title: "Get Your Decision",
            description: "Receive instant feedback on your loan application.",
            icon: "✅"
        }
    ];

    const containerRef = useRef(null);

    // For animating on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const sections = document.querySelectorAll('.animate-on-scroll');
        sections.forEach(section => {
            observer.observe(section);
        });

        return () => {
            sections.forEach(section => {
                observer.unobserve(section);
            });
        };
    }, []);

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const headingVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
                        How <span className="text-yellow-400 relative inline-block">
                            Loanly
                        </span> Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Our streamlined process gets you from application to approval in four simple steps
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    ref={containerRef}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {steps.map((step, index) => (
                        <StepItem
                            key={step.number}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                            icon={step.icon}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </motion.div>

                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <button className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 text-lg">
                        Start Your Application
                    </button>
                    <p className="mt-4 text-gray-500">No credit check required to get started</p>
                </motion.div>
            </div>
        </section>
    );
};

const StepItem = ({ number, title, description, icon, isLast }) => {
    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="relative flex flex-col items-center"
            variants={itemVariants}
        >
            {/* Number circle with icon */}
            <div className="relative">
                <div className="rounded-full bg-blue-900 w-20 h-20 flex items-center justify-center mb-6 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-105">
                    <span className="text-white text-3xl">{icon}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                    <span className="text-blue-900 text-sm font-bold">{number}</span>
                </div>
            </div>

            {/* Step content */}
            <div className="bg-white p-6 rounded-xl shadow-md w-full h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-t-4 border-blue-900">
                <h3 className="text-xl font-bold mb-3 text-blue-900">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>

        </motion.div>
    );
};

export default HowItWorksSection;