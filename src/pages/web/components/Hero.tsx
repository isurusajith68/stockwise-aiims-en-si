"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';

import { TextGenerateEffect } from "./ui/text-generate-effect";
import { ColourfulText } from "./ui/colourful-text";

const Hero: React.FC = () => {
  const [gridHover, setGridHover] = useState(false);
  
  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // Change slide every 5 seconds
    
    // Update current slide index when it changes
    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    
    return () => {
      clearInterval(interval);
      if (emblaApi) emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  
  // Navigation functions
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const words = `Transform your inventory management with AI`;

  return (
    <>
      <section 
        className="relative pt-20 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-gray-200 to-white dark:from-gray-900 dark:to-black h-screen"
        onMouseEnter={() => setGridHover(true)}
        onMouseLeave={() => setGridHover(false)}
      >
        {/* Grid background overlay with hover effect */}
        <motion.div 
          className="absolute inset-0 bg-grid-pattern" 
          animate={{ 
            opacity: gridHover ? 0.4 : 0.15,
            scale: gridHover ? 1.05 : 1,
          }}
          transition={{ duration: 0.5 }}
        ></motion.div>
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
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    scale: gridHover ? 1.03 : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 transform transition-all duration-500"
                  whileHover={{ y: -5 }}
                >
                  {/* Auto-swiper carousel */}
                  <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                      {/* Slide 1: Inventory Analytics Dashboard */}
                      <div className="flex-[0_0_100%] min-w-0 relative">
                        <img
                          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                          alt="Inventory Dashboard"
                          className="w-full h-auto rounded-2xl"
                        />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl p-4 shadow-lg w-[90%] max-w-md transform transition-all duration-300 hover:scale-105">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-gray-800 dark:text-gray-200 font-semibold text-sm">Inventory Analytics</h4>
                              <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">Live Data</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Stock Level</p>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">87.2%</p>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Efficiency</p>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">94.5%</p>
                              </div>
                            </div>
                            
                            <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex items-end">
                              {[35, 65, 45, 70, 85, 60, 75, 90, 80, 95, 65, 75].map((height, index) => (
                                <div 
                                  key={index} 
                                  className="h-full flex-1 flex items-end mx-[1px]"
                                >
                                  <div 
                                    style={{ height: `${height}%` }} 
                                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300"
                                  ></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Slide 2: AI Predictions Dashboard */}
                      <div className="flex-[0_0_100%] min-w-0 relative">
                        <img
                          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                          alt="AI Predictions Dashboard"
                          className="w-full h-auto rounded-2xl"
                        />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl p-4 shadow-lg w-[90%] max-w-md transform transition-all duration-300 hover:scale-105">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-gray-800 dark:text-gray-200 font-semibold text-sm">AI Predictions</h4>
                              <span className="text-purple-600 dark:text-purple-400 text-xs font-medium">Next 30 Days</span>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3 bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Recommended Restock</p>
                                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">+12 Items</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">98.3%</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-600 dark:text-gray-300">Product A</p>
                                <div className="flex items-center">
                                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 dark:bg-purple-400" style={{ width: '75%' }}></div>
                                  </div>
                                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">+8</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-600 dark:text-gray-300">Product B</p>
                                <div className="flex items-center">
                                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 dark:bg-purple-400" style={{ width: '45%' }}></div>
                                  </div>
                                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">+4</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Slide 3: Supply Chain Visualization */}
                      <div className="flex-[0_0_100%] min-w-0 relative">
                        <img
                          src="https://images.unsplash.com/photo-1586528116493-b233f57de4bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                          alt="Supply Chain Visualization"
                          className="w-full h-auto rounded-2xl"
                        />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl p-4 shadow-lg w-[90%] max-w-md transform transition-all duration-300 hover:scale-105">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-gray-800 dark:text-gray-200 font-semibold text-sm">Supply Chain Status</h4>
                              <span className="text-teal-600 dark:text-teal-400 text-xs font-medium">Real-time</span>
                            </div>
                            
                            <div className="relative h-28 mb-2">
                              {/* Supply chain flow visualization */}
                              <div className="absolute inset-0 flex items-center justify-between px-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-1">
                                    <div className="w-6 h-6 rounded-full bg-teal-500 dark:bg-teal-400"></div>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-300">Supplier</p>
                                </div>
                                
                                <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 mx-2 relative">
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse"></div>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-1">
                                    <div className="w-6 h-6 rounded-full bg-teal-500 dark:bg-teal-400"></div>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-300">Warehouse</p>
                                </div>
                                
                                <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 mx-2 relative">
                                  <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse"></div>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-1">
                                    <div className="w-6 h-6 rounded-full bg-teal-500 dark:bg-teal-400"></div>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-300">Retail</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-teal-50 dark:bg-teal-900/30 p-2 rounded-lg">
                              <div className="flex justify-between">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Shipments in Transit</p>
                                <p className="text-sm font-bold text-teal-600 dark:text-teal-400">8 Trucks</p>
                              </div>
                              <div className="flex justify-between">
                                <p className="text-xs text-gray-500 dark:text-gray-400">On-time Delivery</p>
                                <p className="text-sm font-bold text-teal-600 dark:text-teal-400">98.7%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Carousel navigation */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                    {[0, 1, 2].map((index) => (
                      <button 
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white w-4' : 'bg-white/50'}`}
                        onClick={() => emblaApi?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Carousel controls */}
                  <button 
                    onClick={scrollPrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={scrollNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  {/* Overlay with grid pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-30 mix-blend-overlay"></div>
                  
                  {/* Text overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: gridHover ? 1 : 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ y: 10, opacity: 0.9 }}
                      animate={{ y: gridHover ? 0 : 10, opacity: gridHover ? 1 : 0.9 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-white text-xl font-bold mb-2">Transform Inventory with AI</h3>
                      <p className="text-gray-200 text-sm">Smart analytics and predictive insights</p>
                    </motion.div>
                  </motion.div>
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
