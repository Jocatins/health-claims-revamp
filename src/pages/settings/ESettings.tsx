
import React, { useState } from 'react';
import GeneralSettings from './tabs/GeneralSettings';
import EnrolleeType from './tabs/EnrolleeType';
import EnrolleeClass from './tabs/EnrolleeClass';
import PlanManagement from './tabs/PlanManagement';
import RoleManager from './tabs/RoleManager';
import RolePermission from './tabs/RolePermission';
import RoleAccess from './tabs/RoleAccess';

const tabs = [
  { key: "general", label: "General Settings" },
  { key: "enrolleeType", label: "Enrollee Type" },
  { key: "enrolleeClass", label: "Enrollee Class" },
  { key: "planManagement", label: "Plan Management" },
  { key: "roleManager", label: "Role Manager" },
  { key: "rolePermission", label: "Role Permission" },
  { key: "roleAccess", label: "Role Access" },
];

const ESettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

 

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'enrolleeType':
        return <EnrolleeType />;
      case 'enrolleeClass':
        return <EnrolleeClass />;
      case 'planManagement':
        return <PlanManagement />;
      case 'roleManager':
        return <RoleManager />;
      case 'rolePermission':
        return <RolePermission />;
      case 'roleAccess':
        return <RoleAccess />;
     
      default:
        return <GeneralSettings />;
    }
  };


  return (
    <div className="w-full bg-white border rounded-lg shadow-sm">
      {/* Tabs Header */}
      <div className="border-b flex space-x-2 overflow-x-auto px-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-green-700 text-green-700 font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">{renderContent()}</div>
    </div>
  );
};

export default ESettings;