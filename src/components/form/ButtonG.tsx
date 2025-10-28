// The [#DC2626] button in the forms
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const ButtonG: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
    px-16 py-2 
    bg-[#DC2626]
    text-white font-semibold 
    rounded-md 
    transition-colors duration-200
    hover:bg-[#145247] 
    focus:outline-none focus:ring-2 focus:ring-[#DC2626]-500 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ButtonG;
