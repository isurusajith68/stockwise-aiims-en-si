import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  subtitleClassName?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = false,
  className = "text-primary-950",
  subtitleClassName = "text-gray-600",
}) => {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${className}`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg max-w-3xl ${
            centered ? "mx-auto" : ""
          } ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
