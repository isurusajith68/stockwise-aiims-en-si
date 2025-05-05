import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

interface HeroProps {
  onDemoClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onDemoClick }) => {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 mb-12 lg:mb-0"
          >
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-primary-100 text-primary-600 rounded-full">
                AI-Powered Inventory Management
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-950 leading-tight mb-6">
                Transform your inventory management with{" "}
                <span className="text-primary-600">AI</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                StockWise AIIMS intelligently optimizes your inventory, provides
                real-time insights, and streamlines operations with powerful
                analytics and multilingual support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" onClick={onDemoClick}>
                  Request Demo
                </Button>
                <Button variant="outline" size="lg" href="#features">
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="StockWise AIIMS Dashboard"
                  className="w-full h-auto"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary-100 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-accent-100 rounded-full -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
