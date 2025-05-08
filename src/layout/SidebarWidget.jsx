import { useSidebar } from "../context/SidebarContext";

export default function SidebarWidget() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Only show full widget content when sidebar is expanded or on hover/mobile
  const isVisible = isExpanded || isHovered || isMobileOpen;

  return (
    <div className={`transition-all duration-300 ${isVisible ? "w-64" : "w-20"}`}>
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
        {isVisible ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Widget Title</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Some expanded sidebar content goes here.
            </p>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-500 dark:text-gray-400">⋮</span>
          </div>
        )}
      </div>
    </div>
  );
}
