"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "./ui/SectionTitle";
import { Brain, Globe, BarChart3, Search, Lock, Clock } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800"
    >
      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Brain size={24} />,
      title: "AI-Powered Insights",
      description:
        "Get intelligent recommendations, predict stock needs, and optimize inventory levels automatically.",
    },
    {
      icon: <Globe size={24} />,
      title: "Multilingual Support",
      description:
        "Full support for multiple languages with an extensible framework for localization.",
    },
    {
      icon: <Clock size={24} />,
      title: "Real-Time Tracking",
      description:
        "Monitor stock levels in real-time with instant notifications and alerts for low inventory.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Smart Analytics",
      description:
        "Powerful dashboards with predictive analytics and forecasting capabilities to drive decisions.",
    },
    {
      icon: <Search size={24} />,
      title: "Advanced Search",
      description:
        "Find any product instantly with intelligent search, filtering, and categorization tools.",
    },
    {
      icon: <Lock size={24} />,
      title: "Role-Based Access",
      description:
        "Customized views and permissions for admins, managers, and staff members.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Intelligent Features"
          subtitle="Designed to transform your inventory management experience"
          centered
          className="text-gray-900 dark:text-white"
          subtitleClassName="text-gray-700 dark:text-gray-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
