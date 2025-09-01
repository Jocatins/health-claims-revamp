import React from "react";
import Button from "../../components/ui/Button";

interface SideNavProps {
  sidebarOpen: boolean;
}

// removed sidebarOpen props from function
const SideNav: React.FC<SideNavProps> = () => {
  return (
    //custom white bg color change
    <aside className="w-64 bg-green-900 text-white h-full flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">HIMIS</h1>
      </div>

      <div className="p-4 text-sm text-green-200">Dashboard</div>

      <nav className="flex-1 space-y-1 mt-2">
        {[
          { icon: "📊", label: "Enrollees", active: false },
          { icon: "👥", label: "Providers", active: true },
          { icon: "💳", label: "Payments", active: false },
          { icon: "📑", label: "Reports", active: false },
        ].map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center space-x-3 px-4 py-3 ${
              item.active ? "bg-green-800" : "hover:bg-green-800"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
            {item.active && (
              <span className="ml-auto text-sm bg-green-700 px-2 py-1 rounded">
                +
              </span>
            )}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-green-800 mt-auto">
        <Button
          className="w-full justify-center"
          onClick={() => console.log("Logout clicked")}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default SideNav;
