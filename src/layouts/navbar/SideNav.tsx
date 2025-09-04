import React from "react";
import Button from "../../components/ui/Button";
import {  ADMIN_SIDEBAR, PROVIDER_SIDEBAR  } from "../../constant/sideBarItems";
import HimisLogo from "../../assets/himis-logo";
import SidebarDropdown from "../../components/ui/SidebarDropdown";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import type { RootState } from "../../services/store/store";

interface SideNavProps {
  sidebarOpen: boolean;
}

const SideNav: React.FC<SideNavProps> = () => {
  const {logout} = useAuth();

   const { user } = useSelector((state: RootState) => state.auth);


  // Sidebar check
  const sidebarItems = user?.isProvider ? PROVIDER_SIDEBAR : ADMIN_SIDEBAR;

  return (
    <aside className="w-64 bg-white text-gray-700 h-full flex flex-col font-avenir">
      <div className="flex items-center justify-center p-4">
        <HimisLogo className="w-8 h-8"/>
        <h1 className="text-xl text-green-800 text-center">HIMIS</h1>
      </div>

      <nav className="flex-1 space-y-1 mt-2 overflow-y-auto">
        {sidebarItems.map((item, index) => {
          if (item.children) {
            // Render dropdown for items with children
            return <SidebarDropdown key={index} item={item} />;
          } else {
            
            return (
              <a
                key={index}
                href={item.path || "#"}
                className={`flex items-center space-x-3 px-4 py-3 transition-colors duration-200 group ${
                  item.active 
                    ? "bg-green-800 text-white" 
                    : "hover:bg-green-800 hover:text-white"
                }`}
              >
                <span className={`text-xl transition-colors duration-200 ${
                  item.active 
                    ? "text-white" 
                    : "group-hover:text-white"
                }`}>
                  {item.icon}
                </span>
                <span className={`transition-colors duration-200 ${
                  item.active 
                    ? "text-white" 
                    : "group-hover:text-white"
                }`}>
                  {item.label}
                </span>
                {item.active && (
                  <span className="ml-auto text-sm bg-green-700 text-white px-2 py-1 rounded">
                    +
                  </span>
                )}
              </a>
            );
          }
        })}
      </nav>

      <div className="p-4 border-t border-green-800 mt-auto">
        <Button
          className="w-full justify-center bg-green-800 hover:bg-green-700 text-white"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default SideNav;