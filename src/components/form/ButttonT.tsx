// the transparent button

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const ButtonT: React.FC<ButtonProps> = ({
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
        border border-[#DC2626]-700 
        text-[#DC2626] font-semibold 
        rounded-md 
        transition-colors duration-200
         hover:bg-[#B91C1C]  hover:text-white 
        focus:outline-none focus:ring-2 focus:ring-[#DC2626]-500 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ButtonT;
