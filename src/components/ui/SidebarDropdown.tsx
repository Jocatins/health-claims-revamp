import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import type { SidebarItem } from "../../constant/sideBarItems";

interface SidebarDropdownProps {
  item: SidebarItem;
  level?: number;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    // Only allow toggling if the item has children
    if (item.children && item.children.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  // Check if item has children
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      {/* Parent item */}
      <div
        onClick={toggleDropdown}
        className={`flex items-center justify-between px-4 py-3 transition-colors duration-200 group cursor-pointer ${
          item.active 
            ? "bg-green-800 text-white" 
            : "hover:bg-green-800 hover:text-white"
        }`}
        style={{ paddingLeft: `${level * 20 + 16}px` }}
      >
        <div className="flex items-center space-x-3">
          <span className={`transition-colors duration-200 ${
            item.active ? "text-white" : "group-hover:text-white"
          }`}>
            {item.icon}
          </span>
          <span className={`transition-colors duration-200 ${
            item.active ? "text-white" : "group-hover:text-white"
          }`}>
            {item.label}
          </span>
        </div>
        
        {/* Conditionally render chevron icon only for items with children */}
        {hasChildren && (
          <span className={`transition-transform duration-200 ${isOpen ? "rotate-0" : "rotate-0"}`}>
            {isOpen ? <FiChevronDown /> : <FiChevronRight />}
          </span>
        )}
      </div>

      {/* Dropdown children */}
      {isOpen && item.children && (
        <div className="overflow-hidden">
          {item.children.map((child, index) => (
            <SidebarDropdown key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarDropdown;