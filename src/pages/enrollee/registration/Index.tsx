import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationType = () => {
  const [selectedType, setSelectedType] = useState<"individual" | "corporate">("individual");
  const navigate = useNavigate();

  const handleNext = () => {
    console.log("Selected registration type:", selectedType);
    
    // Route to the appropriate page based on selection
    if (selectedType === "individual") {
      navigate("/enrollee/registration/individual");
    } else {
      navigate("/enrollee/registration/corporate");
    }
  };

  return (
    <>
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Registration Type</h2>

      <div className="flex items-center space-x-8 mb-8">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="registrationType"
            value="individual"
            checked={selectedType === "individual"}
            onChange={() => setSelectedType("individual")}
            className="accent-[#186255] w-4 h-4"
          />
          <span className="text-gray-800">Individual Registration</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="registrationType"
            value="corporate"
            checked={selectedType === "corporate"}
            onChange={() => setSelectedType("corporate")}
            className="accent-[#186255] w-4 h-4"
            />
          <span className="text-gray-800">Corporate Registration</span>
        </label>
      </div>

      <button
        onClick={handleNext}
        className="w-32 bg-[#186255] text-white py-2.5 rounded-md hover:bg-[#145247] transition-all flex items-center justify-center space-x-2"
      >
        <span>Next</span>
        <span>→</span>
      </button>
    </div>
        </>
  );
};

export default RegistrationType;