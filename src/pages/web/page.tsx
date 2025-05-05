import { useState } from "react";
import Benefits from "./components/Benefits";
import CallToAction from "./components/CallToAction";
import Features from "./components/Features";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import Testimonials from "./components/Testimonial";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Web = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleDemoClick = () => {
    setIsDemoOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => {}} onDemoClick={() => setIsDemoOpen(true)} />
      <Hero onDemoClick={() => setIsDemoOpen(true)} />
      <Features />
      <ProductShowcase />
      <Benefits />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Web;
