import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Button from "../components/ui/Button";

const CallToAction = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="cta" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:py-24 lg:px-16">
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to transform your inventory management?
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Join businesses that have optimized their operations with
                  StockWise AIIMS. Request a demo today to see how our
                  AI-powered system can transform your inventory management.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-white text-primary-700 hover:bg-gray-100"
                  >
                    Request a Demo
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Contact Sales
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 hidden lg:block">
              <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
                <defs>
                  <pattern
                    id="square-pattern"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      fill="rgba(255, 255, 255, 0.1)"
                    />
                  </pattern>
                </defs>
                <rect width="404" height="404" fill="url(#square-pattern)" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 hidden lg:block">
              <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
                <defs>
                  <pattern
                    id="circle-pattern"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="3"
                      fill="rgba(255, 255, 255, 0.1)"
                    />
                  </pattern>
                </defs>
                <rect width="404" height="404" fill="url(#circle-pattern)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
