// components/how-it-works.js
import React from 'react';

const HowItWorksSection = () => {
    const steps = [
        {
            number: 1,
            title: "Start Conversation",
            description: "Begin video interaction with our AI Branch Manager."
        },
        {
            number: 2,
            title: "Provide Information",
            description: "Answer questions through video responses."
        },
        {
            number: 3,
            title: "Submit Documents",
            description: "Upload required documents for verification."
        },
        {
            number: 4,
            title: "Get Your Decision",
            description: "Receive instant feedback on your loan application."
        }
    ];

    return (
        <section id="how-it-works" className="py-20 bg-gray-100">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                    How <span className="text-yellow-400">Loanly</span> Works
                </h2>

                <div className="flex flex-col md:flex-row justify-between">
                    {steps.map((step) => (
                        <StepItem
                            key={step.number}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300">
                        Start Your Application
                    </button>
                </div>
            </div>
        </section>
    );
};

const StepItem = ({ number, title, description }) => {
    return (
        <div className="md:w-1/4 mb-8 md:mb-0 text-center">
            <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <span className="text-yellow-400 text-2xl font-bold">{number}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default HowItWorksSection;