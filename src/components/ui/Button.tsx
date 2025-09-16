import React from "react";
import type { IconType } from "react-icons";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: IconType;
  iconPosition?: "left" | "right";
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  size = "md",
  variant = "solid",
}) => {
 const baseStyles =
  "bg-[#186255] text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#186255] focus:ring-offset-2";

const stateStyles = disabled
  ? "opacity-50 cursor-not-allowed"
  : "hover:bg-[#145247] active:bg-[#104036]";

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Icon size mapping
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

const variantStyles =
  variant === "outline"
    ? "bg-transparent border border-[#186255] text-[#186255] hover:bg-[#186255]/10"
    : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${stateStyles}
        ${sizeStyles[size]}
        ${variantStyles}
        ${className}
        inline-flex items-center justify-center gap-2
      `}
    >
      {Icon && iconPosition === "left" && (
        <Icon size={iconSizes[size]} className="flex-shrink-0" />
      )}

      <span>{children}</span>

      {Icon && iconPosition === "right" && (
        <Icon size={iconSizes[size]} className="flex-shrink-0" />
      )}
    </button>
  );
};

export default Button;
