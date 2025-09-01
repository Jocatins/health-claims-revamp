import { useState, useEffect } from "react";
import SideNav from "./navbar/SideNav";
import TopNav from "./navbar/TopNav";
import ProductsList from "../pages/Products";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const checkScreenSize = () => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    setSidebarOpen(!mobile);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Different behavior for mobile vs desktop */}
      {isMobile ? (
        // Mobile: SideNav as overlay
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SideNav sidebarOpen={sidebarOpen} />
          </div>
        </>
      ) : (
        //  Desktop: Normal behavior
        <SideNav sidebarOpen={sidebarOpen} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 w-full">
        <TopNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-y-auto p-6 w-full">
          <ProductsList />
        </main>
      </div>
    </div>
  );
};

export default Layout;
