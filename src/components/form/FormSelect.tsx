import React, { type SelectHTMLAttributes, useState } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  endAdornment?: React.ReactNode;
//   children?: React.ReactNode;
}

const FormSelect: React.FC<SelectProps> = ({
  label,
  endAdornment,
  children,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full mb-4">
      <select
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(e.target.value !== "");
          props.onBlur?.(e);
        }}
        className="peer w-full border rounded-md px-3 pr-10 pt-5 pb-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#186255]"
      >
        <option value="" disabled hidden></option>
        {children}
      </select>

      <label
        className={`absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none
          ${focused ? "-top-1 text-xs bg-white px-1" : "top-3 text-sm"}
        `}
      >
        {label}
      </label>

      {/* Optional adornment (like dropdown arrow or icon) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        {endAdornment ?? (
          <svg
            className="w-5 h-5 text-gray-400 peer-focus:text-[#186255] transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default FormSelect;
