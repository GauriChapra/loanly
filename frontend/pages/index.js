"use client";
import Head from 'next/head';
import { useState } from 'react';
import HeroSection from '@/components/hero';
import Features from '@/components/features';
import HowItWorksSection from '@/components/how-it-works';
import CTASection from '@/components/cta';
import TestimonialsSection from '@/components/testimonials';
import ContactForm from '@/components/contact';

export default function Home() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Loanly - Banking Beyond Branches</title>
        <meta name="description" content="AI-powered loan assistance through video conversations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <HeroSection setVideoPlaying={setVideoPlaying} />

      <Features />

      <HowItWorksSection />

      <TestimonialsSection />

      <CTASection />

      <ContactForm />

    </div>
  );
}