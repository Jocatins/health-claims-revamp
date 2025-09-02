import React, { useState } from "react";
import Select from "../../components/ui/Select";
import { HiMenu } from "react-icons/hi";

interface TopNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [selectedProvider, setSelectedProvider] = useState("");

  const providers = [
    // { value: "", label: "Select Provider", disabled: true },
    { value: "provider-a", label: "Provider A" },
    { value: "provider-b", label: "Provider B" },
    { value: "provider-c", label: "Provider C" },
  ];

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <HiMenu />
        </button>
        {/* <h2 className="text-lg font-semibold">Dashboard</h2> */}
      </div>

      {/* Right side */}
      <div>
        <Select
          options={providers}
          value={selectedProvider}
          onChange={setSelectedProvider}
          placeholder="Choose a provider"
        />
      </div>
    </header>
  );
};

export default TopNav;
