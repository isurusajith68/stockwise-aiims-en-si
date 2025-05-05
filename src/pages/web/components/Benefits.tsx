import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "../components/ui/SectionTitle";

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
      className="bg-white p-6 rounded-xl shadow-md text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
        {value}
      </div>
      <div className="text-gray-600">{label}</div>
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
    <section id="benefits" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Transform Your Inventory Management"
          subtitle="StockWise AIIMS delivers real business impact with measurable results"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              delay={index}
            />
          ))}
        </div>

        <div className="mt-16 bg-primary-900 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Achieve operational excellence
                </h3>
                <p className="text-gray-300 mb-6">
                  StockWise AIIMS helps businesses of all sizes optimize their
                  inventory management, reduce costs, and improve operational
                  efficiency with AI-powered insights.
                </p>
                <ul className="space-y-3">
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
                      Minimize costly stockouts and overstock situations
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
                      Optimize reorder points with AI-driven forecasting
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
                      Gain real-time visibility into inventory levels
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
                      Make data-driven decisions with powerful analytics
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>

            <div className="bg-primary-800 p-8 md:p-0">
              <img
                src="https://images.pexels.com/photos/7947304/pexels-photo-7947304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Inventory management visualization"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
