import { useEffect } from "react";
import { useSidebar } from "../context/SidebarContext";

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isMobileOpen) {
        toggleMobileSidebar();
      }
    };

    if (isMobileOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen, toggleMobileSidebar]);

  if (!isMobileOpen) return null;

  // Return a backdrop element that closes the sidebar when clicked
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      onClick={toggleMobileSidebar}
      aria-hidden="true"
    />
  );
};

export default Backdrop;