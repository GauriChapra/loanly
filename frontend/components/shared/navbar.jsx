import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-blue-900 text-white sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/">
                        <span className="text-3xl font-bold cursor-pointer">Loanly</span>
                    </Link>
                    <span className="ml-5 text-yellow-400 font-bold text-lg">Banking Beyond Branches</span>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="#features">
                        <span className="hover:text-yellow-400 transition duration-300 cursor-pointer">Features</span>
                    </Link>
                    <Link href="#how-it-works">
                        <span className="hover:text-yellow-400 transition duration-300 cursor-pointer">How It Works</span>
                    </Link>
                    <Link href="#testimonials">
                        <span className="hover:text-yellow-400 transition duration-300 cursor-pointer">Testimonials</span>
                    </Link>
                    <Link href="#contact">
                        <span className="hover:text-yellow-400 transition duration-300 cursor-pointer">Contact</span>
                    </Link>
                    <Link href="#apply">
                        <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition duration-300">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-blue-800 px-6 py-4">
                    <div className="flex flex-col space-y-4">
                        <Link href="#features">
                            <span className="block hover:text-yellow-400 transition duration-300" onClick={() => setIsMenuOpen(false)}>Features</span>
                        </Link>
                        <Link href="#how-it-works">
                            <span className="block hover:text-yellow-400 transition duration-300" onClick={() => setIsMenuOpen(false)}>How It Works</span>
                        </Link>
                        <Link href="#testimonials">
                            <span className="block hover:text-yellow-400 transition duration-300" onClick={() => setIsMenuOpen(false)}>Testimonials</span>
                        </Link>
                        <Link href="#contact">
                            <span className="block hover:text-yellow-400 transition duration-300" onClick={() => setIsMenuOpen(false)}>Contact</span>
                        </Link>
                        <Link href="#apply">
                            <button
                                className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 inline-block"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;