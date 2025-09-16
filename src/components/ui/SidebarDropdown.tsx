import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Add these imports
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import type { SidebarItem } from "../../constant/sideBarItems";

interface SidebarDropdownProps {
  item: SidebarItem;
  level?: number;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Add useLocation hook

  const toggleDropdown = () => {
    // Only allow toggling if the item has children
    if (item.children && item.children.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  // Check if item has children
  const hasChildren = item.children && item.children.length > 0;

  // Check if a route is active
  const isActive = (path: string | undefined) => {
    return path && location.pathname === path;
  };

  return (
    <div>
      {/* Parent item */}
      <div
        onClick={toggleDropdown}
        className={`flex items-center justify-between px-4 py-3 transition-colors duration-200 group cursor-pointer ${
          isActive(item.path)
            ? "bg-[#186255] text-white" 
            : "hover:bg-[#145247]  hover:text-white"
        }`}
        style={{ paddingLeft: `${level * 20 + 16}px` }}
      >
        <div className="flex items-center space-x-3">
          <span className={`transition-colors duration-200 ${
            isActive(item.path) ? "text-white" : "group-hover:text-white"
          }`}>
            {item.icon}
          </span>
          <span className={`transition-colors duration-200 ${
            isActive(item.path) ? "text-white" : "group-hover:text-white"
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
          {item.children.map((child, index) => {
            if (child.children) {
              // If child has its own children, render recursively
              return <SidebarDropdown key={index} item={child} level={level + 1} />;
            } else {
              // If child is a leaf node, render as Link
              return (
                <Link
                  key={index}
                  to={child.path || "#"}
                  className={`flex items-center space-x-3 px-4 py-3 transition-colors duration-200 group ${
                    isActive(child.path)
                      ? "  bg-[#186255] text-white"
                      : " hover:bg-[#145247]  hover:text-white"
                  }`}
                  style={{ paddingLeft: `${(level + 1) * 20 + 16}px` }}
                  onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle when clicking link
                >
                  <span
                    className={`text-xl transition-colors duration-200 ${
                      isActive(child.path) ? "text-white" : "group-hover:text-white"
                    }`}
                  >
                    {child.icon}
                  </span>
                  <span
                    className={`transition-colors duration-200 ${
                      isActive(child.path) ? "text-white" : "group-hover:text-white"
                    }`}
                  >
                    {child.label}
                  </span>
                </Link>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarDropdown;