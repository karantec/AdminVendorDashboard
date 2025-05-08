import { useSidebar } from "../context/SidebarContext";

export default function SidebarWidget() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  
  // Only show full widget content when sidebar is expanded or on hover/mobile
  const isVisible = isExpanded || isHovered || isMobileOpen;

  return (
    <div
      className={`
        mx-auto mt-6 mb-6 w-full 
        rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 
        px-4 py-5 text-center shadow-sm transition-all duration-300
        dark:from-gray-800 dark:to-gray-900
        ${!isVisible ? "max-w-12 p-2" : "max-w-60"}
      `}>
      
      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .max-w-12 {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}