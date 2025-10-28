import React, { useState } from "react";
import AllEnrollees from "./AllEnrollees";
import CorporateEnrollees from "./CorporateEnrollees";

const EnrolleesPage: React.FC = () => {
  const [view, setView] = useState<"individual" | "corporate">("individual");

  return (
    <div className="p-6">
      {/* Toggle buttons */}
      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="enrolleeType"
            value="individual"
            checked={view === "individual"}
            onChange={() => setView("individual")}
            className="text-[#DC2626]-700 focus:ring-[#DC2626]-700"
          />
          <span
            className={`${
              view === "individual" ? "font-semibold text-gray-900" : "text-gray-500"
            }`}
          >
            Individual
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="enrolleeType"
            value="corporate"
            checked={view === "corporate"}
            onChange={() => setView("corporate")}
            className="text-[#DC2626]-700 focus:ring-[#DC2626]-700"
          />
          <span
            className={`${
              view === "corporate" ? "font-semibold text-gray-900" : "text-gray-500"
            }`}
          >
            Corporate
          </span>
        </label>
      </div>

      {/* Conditional rendering */}
      {view === "individual" ? <AllEnrollees /> : <CorporateEnrollees />}
    </div>
  );
};

export default EnrolleesPage;
