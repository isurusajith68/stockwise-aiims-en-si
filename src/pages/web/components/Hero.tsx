"use client";

import type React from "react";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import { ArrowRight, ChevronDown } from "lucide-react";

import { TextGenerateEffect } from "./ui/text-generate-effect";
import { ColourfulText } from "./ui/colourful-text";

const Hero: React.FC = () => {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const words = `Transform your inventory management with AI`;

  return (
    <>
      <section className="relative pt-20 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-gray-200 to-white dark:from-gray-900 dark:to-black h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 mb-12 lg:mb-0"
            >
              <div className="max-w-2xl">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block px-4 py-1.5 mb-5 text-sm font-medium bg-blue-600 text-white rounded-full dark:bg-blue-900 dark:text-blue-300 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  AI-Powered Inventory Management
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white"
                >
                  <TextGenerateEffect words={words} />
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="text-lg md:text-xl text-gray-800 mb-8 dark:text-gray-300 leading-relaxed"
                >
                  StockWise AIIMS intelligently optimizes your inventory,
                  provides real-time insights, and streamlines operations with
                  powerful analytics and multilingual support.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2  text-blue-700 dark:text-blue-400  hover:bg-blue-50 dark:hover:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Request Demo
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 ml-3"
            >
              <div className="relative">
                <motion.div
                  className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20"
                  whileHover={{ y: -5 }}
                >
                  <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="StockWise AIIMS Dashboard"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white text-sm font-medium px-3 py-1 bg-black/70 rounded-full">
                      Interactive Dashboard
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced decorative elements */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-500/30 rounded-full -z-10 dark:bg-blue-900/30"
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 0.5,
                  }}
                  className="absolute -top-6 -left-6 w-48 h-48 bg-gray-300/50 rounded-full -z-10 dark:bg-gray-800/50"
                />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0.3 }}
                  animate={{ scale: 1, opacity: 0.7 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 0.2,
                  }}
                  className="absolute top-1/2 -right-12 w-24 h-24 bg-yellow-400/20 rounded-full -z-10 dark:bg-yellow-600/20"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white dark:bg-gray-800 p-2 z-50 rounded shadow"
        >
          Skip to main content
        </a>
      </section>
      <div className="flex justify-center items-center">
        <motion.div
          className="absolute bottom-2 transform  cursor-pointer text-center "
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          onClick={scrollToNextSection}
        >
          <div className="flex flex-col items-center mb-10">
            <span className="text-sm text-gray-700 dark:text-gray-400 mb-2">
              Scroll to explore
            </span>
            <ChevronDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Hero;
