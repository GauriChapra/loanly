import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
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
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Loanly - Banking Beyond Branches</title>
        <meta name="description" content="AI-powered loan assistance through video conversations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-blue-900 text-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl font-bold">Loanly</span>
            <span className="ml-5 text-yellow-400 text-extrabold text-lg">Banking Beyond Branches</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-yellow-400 transition duration-300">Features</a>
            <a href="#how-it-works" className="hover:text-yellow-400 transition duration-300">How It Works</a>
            <a href="#testimonials" className="hover:text-yellow-400 transition duration-300">Testimonials</a>
            <a href="#contact" onClick={() => setShowContactForm(true)} className="hover:text-yellow-400 transition duration-300">Contact</a>
          </div>
          <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition duration-300">
            Get Started
          </button>
        </div>
      </nav>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-blue-900 mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-6">Have questions or need assistance? Reach out to our team.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Your Virtual <span className="text-yellow-400">Branch Manager</span>
            </h1>
            <p className="text-lg mb-8">
              Experience branch-like personal service from anywhere. Apply for loans through interactive video conversations with our AI Branch Manager.
            </p>
            <div className="flex space-x-4">
              <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300">
                Apply for a Loan
              </button>
              <button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative">
            <div className="bg-black rounded-lg shadow-xl overflow-hidden border-4 border-white">
              <div className="relative pt-[56.25%]">
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900">
                  {!videoPlaying ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto cursor-pointer" onClick={() => setVideoPlaying(true)}>
                        <div className="w-0 h-0 border-t-8 border-b-8 border-l-16 border-transparent border-l-white ml-1"></div>
                      </div>
                      <p className="mt-4 text-white">Meet your AI Branch Manager</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <p className="text-white">Video would play here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            Experience <span className="text-yellow-400">Modern Banking</span> Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Virtual AI Branch Manager</h3>
              <p className="text-gray-600">Interact with our AI manager through video conversations, just like in a physical branch.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Video-Based Interaction</h3>
              <p className="text-gray-600">Record video responses instead of filling out lengthy paper forms.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Simplified Documents</h3>
              <p className="text-gray-600">Upload documents via mobile or webcam - we'll extract all necessary information.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Instant Decisions</h3>
              <p className="text-gray-600">Get loan approvals, feedback, or requests for additional information in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            How <span className="text-yellow-400">Loanly</span> Works
          </h2>

          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:w-1/4 mb-8 md:mb-0 text-center">
              <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <span className="text-yellow-400 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Start Conversation</h3>
              <p className="text-gray-600">Begin video interaction with our AI Branch Manager.</p>
            </div>

            <div className="md:w-1/4 mb-8 md:mb-0 text-center">
              <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <span className="text-yellow-400 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Provide Information</h3>
              <p className="text-gray-600">Answer questions through video responses.</p>
            </div>

            <div className="md:w-1/4 mb-8 md:mb-0 text-center">
              <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <span className="text-yellow-400 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Submit Documents</h3>
              <p className="text-gray-600">Upload required documents for verification.</p>
            </div>

            <div className="md:w-1/4 mb-8 md:mb-0 text-center">
              <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <span className="text-yellow-400 text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Get Your Decision</h3>
              <p className="text-gray-600">Receive instant feedback on your loan application.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300">
              Start Your Application
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            What Our <span className="text-yellow-400">Customers</span> Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-900 w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-yellow-400 font-bold">RP</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Ravi Patel</h4>
                  <p className="text-sm text-gray-500">Home Loan Customer</p>
                </div>
              </div>
              <p className="text-gray-600">"I applied for a home loan without leaving my house. The video interaction felt so natural, and I got my approval in just hours!"</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-900 w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-yellow-400 font-bold">AS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Anita Sharma</h4>
                  <p className="text-sm text-gray-500">Business Loan Customer</p>
                </div>
              </div>
              <p className="text-gray-600">"Loanly's AI Branch Manager guided me through each step of my business loan application. Much easier than endless paperwork!"</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-900 w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-yellow-400 font-bold">VK</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Vikas Kumar</h4>
                  <p className="text-sm text-gray-500">Personal Loan Customer</p>
                </div>
              </div>
              <p className="text-gray-600">"I was skeptical about video banking, but Loanly changed my mind. It felt like talking to a real person, and the process was smooth."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Alternative to Modal */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            Get in <span className="text-yellow-400">Touch</span> With Us
          </h2>

          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name-inline" className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="name-inline"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email-inline" className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email-inline"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone-inline" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  id="phone-inline"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message-inline" className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  id="message-inline"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience <span className="text-yellow-400">Banking Beyond Branches</span>?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Apply for your loan today with our AI Branch Manager. No more waiting in lines or filling out paperwork.</p>
          <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 text-lg">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Loanly</h3>
              <p className="text-sm text-gray-300">Banking Beyond Branches</p>
              <p className="text-sm text-gray-300 mt-2">© 2025 Loanly. All rights reserved.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-yellow-400 font-semibold mb-3">Products</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Home Loans</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Personal Loans</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Business Loans</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Education Loans</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-yellow-400 font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Careers</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Press</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-yellow-400 font-semibold mb-3">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Help Center</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}