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

const Web = () => {
  // Add smooth scrolling effect
  useEffect(() => {
    // Function to handle smooth scrolling when clicking on navigation links
    const handleSmoothScroll = (e: any) => {
      // Only apply to anchor links
      const href = e.currentTarget.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Smooth scroll to the element
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Update URL without page reload
          window.history.pushState(null, "", href);
        }
      }
    };

    // Add event listeners to all anchor links in the navbar
    const navLinks = document.querySelectorAll('a[href^="#"]');
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
    <div className="bg-lime-50 text-gray-900 dark:bg-black dark:text-white">
      <NavbarDemo />
      <div className="">
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
      </div>
    </div>
  );
};

export default Web;
