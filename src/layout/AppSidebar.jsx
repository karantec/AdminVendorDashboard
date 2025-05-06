import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
  MenuIcon,
  XIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Analytics", path: "/", pro: false }],
  },
];

const othersItems = [
  {
    icon: <PieChartIcon />,
    name: "Analytics",
    subItems: [
      { name: "Sales Report", path: "/salesreport", pro: false },
      { name: "Vendor Performance", path: "/vendorperformance", pro: false },
      { name: "Product Popularity", path: "/productpopularity", pro: false },
      {
        name: "User Engagment Metrics",
        path: "/userengagementmetrics",
        pro: false,
      },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Platform Settings",
    subItems: [
      {
        name: "Payment Gateway Setting",
        path: "/paymentgatewaysetting",
        pro: false,
      },
      {
        name: "Delievery Zone Managment",
        path: "/deliveryzonemanagement",
        pro: false,
      },
      { name: "Commission Settings", path: "/commissionsetting", pro: false },
      { name: "App Settings", path: "/appsetting", pro: false },
      { name: "System Performance", path: "/performance", pro: false },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Vendor Portal Settings",
    subItems: [
      {
        name: "Vendor Login Approval",
        path: "/vendorloginapproval",
        pro: false,
      },
      {
        name: "View Vendor Stock Updates",
        path: "/viewvendorstockupdates",
        pro: false,
      },
      {
        name: "Process Stock Exchange requests",
        path: "/processstockexchangerequest",
        pro: false,
      },
      {
        name: "Show order assignment to vendors",
        path: "/showorderassignmenttovendor",
        pro: false,
      },
      { name: "System Performance", path: "/systemperformance", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Categories Management",
    subItems: [
      { name: "Add New Categories", path: "/categorymanagement", pro: false },
      { name: "View Categories", path: "/viewcategory", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Product Management",
    subItems: [
      { name: "Add New Product", path: "/addproductpage", pro: false },
      { name: "View Products", path: "/viewproduct", pro: false },
      {
        name: "Manage Product Pricing",
        path: "/productpricingmanagement",
        pro: false,
      },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Vendor Management",
    subItems: [
      { name: "Approve New Vendor", path: "/approvevendorpage", pro: false },
      {
        name: "Manage Vendor Accounts",
        path: "/vendoraccountmanagement",
        pro: false,
      },
      {
        name: "Review Vendor Stock updates",
        path: "/VendorStockUpdates",
        pro: false,
      },
      { name: "View Vendor Analytics", path: "/vendoranalytics", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Order Management",
    subItems: [
      { name: "View All Orders", path: "/viewallorders", pro: false },
      { name: "Track Order Status", path: "/trackorderstatus", pro: false },
      { name: "Handle Order Issues", path: "/handleorderissue", pro: false },
      { name: "Order Reassigned", path: "/orderreassigned", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "User Management",
    subItems: [
      { name: "View User Account", path: "/useraccountlist", pro: false },
      { name: "Handle User Cases", path: "/usercasemanagement", pro: false },
      { name: "User Analytics", path: "/useranalyticspage", pro: false },
      { name: "User Order", path: "/userorderspage", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar = () => {
  const { isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  // Handle click outside to close mobile sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen, setIsMobileOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu when switching to desktop
      if (window.innerWidth >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileOpen, setIsMobileOpen]);

  // Match active menu item with current route
  useEffect(() => {
    let submenuMatched = false;

    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      othersItems.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    }

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  // Update submenu height when opened
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  // FIX: Improved toggle handlers with explicit names
  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleDesktopToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered && !isMobileOpen
                  ? "lg:justify-center"
                  : "lg:justify-start"
              } w-full`}
            >
              <span
                className={`menu-item-icon-size flex-shrink-0 ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text truncate">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } w-full`}
              >
                <span
                  className={`menu-item-icon-size flex-shrink-0 ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text truncate">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      } flex items-center`}
                      onClick={() => {
                        // Close mobile menu when clicking a link
                        if (window.innerWidth < 1024) {
                          setIsMobileOpen(false);
                        }
                      }}
                    >
                      <span className="truncate">{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto flex-shrink-0">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  // FIX: Updated z-index and positioning for better stacking
  const sidebarClasses = `
    fixed z-50 h-screen transition-all duration-300
    ${isMobileOpen ? "left-0" : "-left-full md:-left-64 lg:left-0"}
    ${isExpanded ? "w-64" : "w-20"}
    ${isMobileOpen ? "w-3/4 sm:w-64" : ""}
    lg:mt-4 p-4 bg-white border border-gray-200 shadow-lg
    overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300
  `;

  // FIX: Updated mobile toggle button with improved styles and z-index
  const mobileToggle = (
    <button
      onClick={handleMobileToggle}
      className="fixed z-50 bottom-6 left-6 lg:hidden p-3 bg-blue-600 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isMobileOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
    </button>
  );

  // FIX: Improved desktop toggle button styles for better visibility and interaction
  const desktopToggle = (
    <button
      onClick={handleDesktopToggle}
      className="hidden lg:flex items-center justify-center p-2 my-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
    >
      {isExpanded ? (
        <ChevronDownIcon className="w-5 h-5 rotate-90" />
      ) : (
        <ChevronDownIcon className="w-5 h-5 -rotate-90" />
      )}
    </button>
  );

  // FIX: Updated overlay z-index to ensure proper layering
  const overlay = isMobileOpen && (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      onClick={() => setIsMobileOpen(false)}
    />
  );

  return (
    <>
      {overlay}
      {mobileToggle}
      <aside
        ref={sidebarRef}
        className={sidebarClasses}
        onMouseEnter={() => !isMobileOpen && setIsHovered(true)}
        onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
      >
        <div className="flex items-center justify-between mb-6">
          {(isExpanded || isHovered || isMobileOpen) && (
            <h1 className="text-lg font-semibold">Admin Portal</h1>
          )}
          {desktopToggle}
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
              aria-label="Close sidebar"
            >
              <XIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav className="flex flex-col gap-6">
          {renderMenuItems(navItems, "main")}
          <div className="border-t border-gray-200 my-2"></div>
          {renderMenuItems(othersItems, "others")}
          {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
        </nav>
      </aside>
      {/* Main content spacer - add this to your layout component */}
      <div className={`lg:ml-${isExpanded ? '64' : '20'} transition-all duration-300`}></div>
    </>
  );
};

export default AppSidebar;