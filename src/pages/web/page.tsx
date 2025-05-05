"use client";
import { useEffect } from "react";
import Benefits from "./components/Benefits";
import CallToAction from "./components/CallToAction";
import Features from "./components/Features";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import Testimonials from "./components/Testimonial";
import Footer from "./components/Footer";
import { NavbarDemo } from "./components/Header";
import MagneticScrollButton from "./components/ui/MagneticScrollButton";
import ChatBot from "./components/ChatBot";

const Web = () => {
  // Add smooth scrolling effect
  useEffect(() => {
    // Function to handle smooth scrolling when clicking on navigation links
    const handleSmoothScroll = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");

      if (href && href.startsWith("#")) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start", // Scroll to the top of the section
          });

          // Update URL without page reload
          window.history.pushState(null, "", href);
        }
      }
    };

    // Select all anchor links that link to sections within the page
    const navLinks = document.querySelectorAll('a[href^="#"]');

    // Attach event listeners for smooth scrolling
    navLinks.forEach((link) => {
      link.addEventListener("click", handleSmoothScroll);
    });

    // Clean up event listeners when component unmounts
    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-200 to-white dark:from-gray-900  dark:to-black">
      <NavbarDemo />
      <main>
        <div id="home">
          <Hero />
        </div>
        <div id="features">
          <Features />
        </div>
        <ProductShowcase />
        <Benefits />
        <Testimonials />
        <div id="contact">
          <CallToAction />
        </div>
        <Footer />
      </main>
      <MagneticScrollButton />
      <ChatBot />
    </div>
  );
};

export default Web;
