import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const CTASection = () => {
    const router = useRouter();
    const { user } = useAuth();

    const handleApplyClick = (e) => {
        e.preventDefault();
        if (user) {
            router.push('/applynow');
        } else {
            router.push('/login');
        }
    };

    return (
        <section className="py-20 bg-blue-900 text-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    Ready to Experience <span className="text-yellow-400">Banking Beyond Branches</span>?
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                    Apply for your loan today with our AI Branch Manager. No more waiting in lines or filling out paperwork.
                </p>
                <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 text-lg"
                    onClick={handleApplyClick}>
                    Get Started Now
                </button>
            </div>
        </section>
    );
};

export default CTASection;