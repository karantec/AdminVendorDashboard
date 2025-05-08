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
      
      {/* Backdrop for mobile view */}
      <Backdrop />
      
      <div className="flex flex-1 pt-16"> {/* Add padding top to account for fixed header */}
        {/* Sidebar - AppSidebar handles its own positioning */}
        <AppSidebar />
        
        {/* Main content area with proper spacing for both mobile and desktop */}
        <div
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${isExpanded ? "lg:ml-64" : "lg:ml-20"}
            ${isHovered && !isExpanded ? "lg:ml-64" : ""}
            w-full
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