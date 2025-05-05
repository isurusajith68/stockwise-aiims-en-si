import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

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
      id="showcase"
      className="py-20 bg-gray-900 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Experience StockWise AIIMS"
          subtitle="See how our intelligent system transforms your inventory management"
          centered
          light
        />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-12"
        >
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              variants={itemVariants}
              className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Powerful Analytics Dashboard
              </h3>
              <p className="text-gray-300 mb-6">
                Get a complete overview of your inventory with real-time updates
                and AI-powered insights. Our intuitive dashboard presents
                complex data in an accessible format, helping you make informed
                decisions quickly.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Visual inventory status with color-coded alerts
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Trend analysis with AI-powered forecasting
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Customizable views for different roles and needs
                  </span>
                </li>
              </ul>
              <Button variant="primary" href="#cta">
                See it in action
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:w-1/2">
              <div className="relative bg-primary-800 p-2 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/8947100/pexels-photo-8947100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="StockWise AIIMS Dashboard"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent rounded-xl"></div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col-reverse lg:flex-row items-center mt-24">
            <motion.div
              variants={itemVariants}
              className="lg:w-1/2 mt-8 lg:mt-0"
            >
              <div className="relative bg-primary-800 p-2 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/8867434/pexels-photo-8867434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="StockWise AIIMS Mobile App"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent rounded-xl"></div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:w-1/2 lg:pl-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Seamless Mobile Experience
              </h3>
              <p className="text-gray-300 mb-6">
                Manage your inventory on the go with our responsive mobile
                application. Scan barcodes, update stock levels, and receive
                alerts wherever you are, ensuring you never miss critical
                inventory events.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Native mobile application for iOS and Android
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Barcode scanning for quick product identification
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-accent-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Push notifications for critical inventory events
                  </span>
                </li>
              </ul>
              <Button variant="primary" href="#cta">
                Learn more
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
