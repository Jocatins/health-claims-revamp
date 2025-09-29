import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { type UseFormRegisterReturn } from "react-hook-form";

interface PhoneNumberInputProps {
  error?: string;
  register: UseFormRegisterReturn;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ error, register }) => {
  const [phone, setPhone] = React.useState("");

  const handleChange = (phoneNumber: string) => {
    setPhone(phoneNumber);
    
    // Trigger React Hook Form's onChange event
    register.onChange({
      target: {
        name: register.name,
        value: phoneNumber,
      },
    });
  };

  // const handleBlur = () => {
  //   register.onBlur();
  // };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // Create a proper FocusEvent for React Hook Form
    const blurEvent = {
      ...event,
      target: {
        ...event.target,
        name: register.name,
        value: phone,
      },
    };
       register.onBlur(blurEvent);
      
  }

  return (
    <div className="relative w-full mb-4 phone-input-container">
      <PhoneInput
        defaultCountry="ng"
        value={phone}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Phone Number"
        inputClassName={`w-full h-12 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#186255]`}
        countrySelectorStyleProps={{
          buttonClassName: `h-12 border ${error ? 'border-red-500' : 'border-gray-300'} border-r-0 rounded-l-md px-3 flex items-center bg-gray-100`,
          dropdownStyleProps: {
            className: "border border-gray-300 rounded-md shadow-lg mt-1 bg-white text-sm",
          },
        }}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;