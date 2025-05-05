import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors";

  // Size classes
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  // Variant classes (including light/dark mode)
  const variantClasses = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-500 dark:hover:bg-primary-600 dark:text-white",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
    outline:
      "border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300",
    text: "hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
  };

  // Combine all classes
  const buttonClasses = `${baseStyles} ${sizeClasses[size]} ${
    variantClasses[variant]
  } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  // Render as link or button
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
