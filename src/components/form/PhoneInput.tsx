import React, { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "../../assets/styles/PhoneInput.css";

const PhoneNumberInput: React.FC = () => {
  const [phone, setPhone] = useState("");

  return (
    <div className="relative w-full mb-4 phone-input-container">
      {/* <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number
      </label> */}
      <div className="react-international-phone-wrapper">
        <PhoneInput
          defaultCountry="ng"
          value={phone}
          onChange={(phone) => setPhone(phone)}
          placeholder="801 234 5678"
          inputClassName="w-full border rounded-md px-3 py-4 focus:outline-none focus:ring-2 focus:ring-[#186255] phone-input-field"
          countrySelectorStyleProps={{
            buttonClassName: "border rounded-l-md px-3 h-full flex items-center bg-gray-100 country-selector-button",
            dropdownStyleProps: {
              className: "border border-gray-300 rounded-md shadow-lg mt-1"
            }
          }}
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput;