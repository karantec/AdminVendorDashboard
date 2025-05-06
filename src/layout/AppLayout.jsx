import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header - fixed at top */}
      <AppHeader />
      
      <div className="flex flex-1 pt-16"> {/* Add padding top to account for fixed header */}
        {/* Sidebar wrapper - fixed on mobile, absolute on desktop */}
        <div 
          className={`
            fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:z-0
          `}
        >
          <AppSidebar />
        </div>
        
        {/* Backdrop only shows on mobile */}
        {isMobileOpen && <Backdrop />}

        {/* Main content area */}
        <div
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${isExpanded || isHovered ? "lg:ml-[270px]" : "lg:ml-[80px]"}
          `}
        >
          <main className="p-4 sm:p-5 md:p-6 mx-auto w-full max-w-7xl">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;