import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "./ui/SectionTitle";
import Button from "./ui/Button";
import { Check } from "lucide-react";

const ProductShowcase = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="product"
      className="py-24 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Experience StockWise AIIMS"
          subtitle="See how our intelligent system transforms your inventory management"
          centered
          className="text-white"
          subtitleClassName="text-gray-400"
        />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16"
        >
          {/* First showcase item */}
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              variants={itemVariants}
              className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
            >
              <div className="mb-6">
                <span className="bg-primary-900/50 text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                  Dashboard
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Powerful Analytics Dashboard
              </h3>
              <p className="text-gray-400 mb-6 text-lg">
                Get a complete overview of your inventory with real-time updates
                and AI-powered insights. Our intuitive dashboard presents
                complex data in an accessible format, helping you make informed
                decisions quickly.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-primary-900/30 rounded-full p-1 mr-3">
                    <Check className="h-5 w-5 text-primary-400" />
                  </div>
                  <span className="text-gray-300">
                    Visual inventory status with color-coded alerts
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-900/30 rounded-full p-1 mr-3">
                    <Check className="h-5 w-5 text-primary-400" />
                  </div>
                  <span className="text-gray-300">
                    Trend analysis with AI-powered forecasting
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-900/30 rounded-full p-1 mr-3">
                    <Check className="h-5 w-5 text-primary-400" />
                  </div>
                  <span className="text-gray-300">
                    Customizable views for different roles and needs
                  </span>
                </li>
              </ul>
              <Button
                variant="primary"
                href="#cta"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
              >
                See it in action
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl opacity-30 blur-sm group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900 p-3 rounded-xl overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="StockWise AIIMS Dashboard"
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent rounded-lg"></div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gray-900/80 p-4 rounded-lg backdrop-blur-sm border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          Inventory Status
                        </span>
                        <span className="text-primary-400 text-sm font-medium">
                          97.4% Optimized
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          style={{ width: "97%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
