import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionTitle from "../components/ui/SectionTitle";
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
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="bg-primary-50 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
        <div className="text-primary-600">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-primary-950 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Intelligent Features"
          subtitle="Designed to transform your inventory management experience"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
