
import React, { type InputHTMLAttributes, useState } from "react";

interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  value,
  onChange,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full mb-4">
      <input
        type="date"
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(e.target.value !== "");
          props.onBlur?.(e);
        }}
        className={`peer w-full border rounded-md px-3 pr-10 pt-5 pb-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#186255]
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...props}
      />

      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none
          ${focused || value ? "-top-1 text-xs bg-white px-1" : "top-3 text-sm"}
          ${error ? 'text-red-500' : 'text-gray-500'}
        `}
      >
        {label}
      </label>

      {/* Calendar icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400 peer-focus:text-[#186255] transition-colors"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;