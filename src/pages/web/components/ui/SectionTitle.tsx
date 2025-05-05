import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  centered = false,
  light = false,
}) => {
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

  const textColor = light ? 'text-white' : 'text-primary-950';
  const subtitleColor = light ? 'text-gray-300' : 'text-gray-600';
  const alignment = centered ? 'text-center mx-auto' : 'text-left';

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`max-w-3xl ${alignment} mb-12`}
    >
      <motion.h2 
        variants={itemVariants}
        className={`text-3xl md:text-4xl font-bold ${textColor} mb-4`}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          variants={itemVariants}
          className={`text-lg md:text-xl ${subtitleColor}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;