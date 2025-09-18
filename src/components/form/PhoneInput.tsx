import React, { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const PhoneNumberInput: React.FC = () => {
  const [phone, setPhone] = useState("");

  return (
    <>
      <div className="relative w-full mb-4 phone-input-container">
        <PhoneInput
          defaultCountry="ng"
          value={phone}
          onChange={(phone) => setPhone(phone)}
          placeholder="Phone Number"
          inputClassName="w-full h-12 border border-gray-300 rounded-md px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#186255]"
          countrySelectorStyleProps={{
            buttonClassName:
              "h-12 border border-gray-300 border-r-0 rounded-l-md px-3 flex items-center bg-gray-100",
            dropdownStyleProps: {
              className:
                "border border-gray-300 rounded-md shadow-lg mt-1 bg-white text-sm",
            },
          }}
        />
      </div>
    </>
  );
};

export default PhoneNumberInput;
