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

  return (
    <div
      className="fixed inset-0 z-40  lg:hidden" // Removed backdrop-blur, reduced opacity
      onClick={toggleMobileSidebar}
      aria-hidden="true"
      role="presentation"
      style={{
        animation: "fadeIn 0.2s ease-out forwards"
      }}
    >
    </div>
  );
};

export default Backdrop;