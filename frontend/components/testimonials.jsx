// components/testimonials.js
import React from 'react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            initials: "RP",
            name: "Ravi Patel",
            role: "Home Loan Customer",
            quote: "I applied for a home loan without leaving my house. The video interaction felt so natural, and I got my approval in just hours!"
        },
        {
            initials: "AS",
            name: "Anita Sharma",
            role: "Business Loan Customer",
            quote: "Loanly's AI Branch Manager guided me through each step of my business loan application. Much easier than endless paperwork!"
        },
        {
            initials: "VK",
            name: "Vikas Kumar",
            role: "Personal Loan Customer",
            quote: "I was skeptical about video banking, but Loanly changed my mind. It felt like talking to a real person, and the process was smooth."
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                    What Our <span className="text-yellow-400">Customers</span> Say
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            initials={testimonial.initials}
                            name={testimonial.name}
                            role={testimonial.role}
                            quote={testimonial.quote}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialCard = ({ initials, name, role, quote }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-900 w-12 h-12 flex items-center justify-center mr-4">
                    <span className="text-yellow-400 font-bold">{initials}</span>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">{name}</h4>
                    <p className="text-sm text-gray-500">{role}</p>
                </div>
            </div>
            <p className="text-gray-600">"{quote}"</p>
        </div>
    );
};

export default TestimonialsSection;