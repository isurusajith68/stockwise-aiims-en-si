"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "../components/ui/SectionTitle";
import { Check } from "lucide-react";

interface StatCardProps {
  value: string;
  label: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, delay }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md text-center border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
    >
      <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        {value}
      </div>
      <div className="text-gray-700 dark:text-gray-300">{label}</div>
    </motion.div>
  );
};

const Benefits = () => {
  const stats = [
    { value: "35%", label: "Reduction in stockouts" },
    { value: "42%", label: "Improved inventory turnover" },
    { value: "28%", label: "Lower carrying costs" },
    { value: "3x", label: "Faster stock processing" },
  ];

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="benefits" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Transform Your Inventory Management"
          subtitle="StockWise AIIMS delivers real business impact with measurable results"
          centered
          className="text-gray-900 dark:text-white"
          subtitleClassName="text-gray-700 dark:text-gray-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              delay={index}
            />
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 bg-blue-600 dark:bg-blue-900">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Achieve operational excellence
                </h3>
                <p className="text-blue-100 dark:text-blue-200 mb-6">
                  StockWise AIIMS helps businesses of all sizes optimize their
                  inventory management, reduce costs, and improve operational
                  efficiency with AI-powered insights.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-500/30 dark:bg-blue-800/50 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-blue-100 dark:text-blue-200">
                      Minimize costly stockouts and overstock situations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500/30 dark:bg-blue-800/50 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-blue-100 dark:text-blue-200">
                      Optimize reorder points with AI-driven forecasting
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500/30 dark:bg-blue-800/50 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-blue-100 dark:text-blue-200">
                      Gain real-time visibility into inventory levels
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500/30 dark:bg-blue-800/50 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-blue-100 dark:text-blue-200">
                      Make data-driven decisions with powerful analytics
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 md:p-0">
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Inventory management visualization"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent dark:from-blue-900/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
