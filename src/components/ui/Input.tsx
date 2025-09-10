import React, { type InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  endAdornment?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  endAdornment,
  type = "text",
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full mb-4">
      <input
        type={type}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(e.target.value !== "");
          props.onBlur?.(e);
        }}
        className="peer w-full border rounded-md px-3 pr-10 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-green-700"
      />
      <label
        className={`absolute left-3 text-gray-500 transition-all duration-200 
          ${focused ? "-top-1 text-xs bg-white px-1" : "top-3 text-sm"}
        `}
      >
        {label}
      </label>

      {endAdornment && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          {endAdornment}
        </div>
      )}
    </div>
  );
};

export default Input;
