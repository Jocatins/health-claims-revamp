// components/form/AdvancedDatePicker.tsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface AdvancedDatePickerProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
}

const AdvancedDatePicker: React.FC<AdvancedDatePickerProps> = ({
  label,
  selected,
  onChange,
  error,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full mb-4">
      <DatePicker
        selected={selected}
        onChange={onChange}
        onCalendarOpen={() => setFocused(true)}
        onCalendarClose={() => setFocused(!!selected)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(!!selected)}
        dateFormat="yyyy-MM-dd"
        className={`peer w-full border rounded-md px-3 pr-10 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-[#186255] ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={new Date()}
        placeholderText=" " // Important: empty space for floating label
      />

      {/* Floating label */}
      <label
        className={`absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none
          ${
            focused || selected
              ? "-top-1 text-xs bg-white px-1"
              : "top-3 text-sm"
          }
          ${error ? "text-red-500" : "text-gray-500"}
        `}
      >
        {label}
      </label>

      {/* Calendar icon - positioned correctly inside the input */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400 peer-focus:text-[#186255] transition-colors"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Hide the default react-datepicker calendar icon */}
      {/* <style jsx global>{`
        .react-datepicker-wrapper {
          display: block;
          width: 100%;
        }
        .react-datepicker__input-container::after {
          display: none !important;
        }
      `}</style> */}
    </div>
  );
};

export default AdvancedDatePicker;
