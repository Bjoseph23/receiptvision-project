import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import PolicyIcon from "@mui/icons-material/Policy";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import UploadIcon from "@mui/icons-material/CloudUpload";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "expenditure", label: "Expenditure", icon: <MonetizationOnIcon /> },
    { id: "goals", label: "Goals and Tips", icon: <ReceiptIcon /> },
    { id: "analytics", label: "Revenue analytics", icon: <BarChartIcon /> },
    { id: "privacy", label: "Privacy Policy", icon: <PolicyIcon /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-100 h-full p-0 m-0 pt-8 pl-2 pr-2 relative duration-90`}
      >
        {/* Menu Icon */}
        <div className="absolute top-6 right-6 cursor-pointer pl-3" onClick={toggleNav}>
          <MenuIcon />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-x-4">
          <img
            src="https://placehold.co/60"
            alt="User Avatar"
            className="w-12 h-12 rounded-full"
          />
          {isOpen && (
            <h1 className="text-xl font-bold whitespace-nowrap">James Kariuki</h1>
          )}
        </div>

        {/* Menu Items */}
        <ul className="pt-6">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`flex items-center gap-x-4 p-2 cursor-pointer rounded-md 
                ${
                  activeItem === item.id
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                } hover:bg-blue-50 transition-all duration-300`}
            >
              {item.icon}
              {isOpen && <span className="origin-left duration-200">{item.label}</span>}
            </li>
          ))}
        </ul>

        {/* Special Buttons */}
        <div className="mt-6">
          <button className="flex items-center w-full gap-x-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            <ReceiptIcon />
            {isOpen && <span>Scan Receipt with AI</span>}
          </button>

          <button className="flex items-center w-full gap-x-4 p-2 mt-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200">
            <UploadIcon />
            {isOpen && <span>Upload Document</span>}
          </button>
        </div>

        {/* Settings and Logout */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <ul>
            <li
              onClick={() => setActiveItem("settings")}
              className={`flex items-center gap-x-4 p-2 cursor-pointer rounded-md
                ${
                  activeItem === "settings"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                } hover:bg-blue-50 transition-all duration-300`}
            >
              <SettingsIcon />
              {isOpen && <span>Settings</span>}
            </li>
            <li
              onClick={() => setActiveItem("logout")}
              className={`flex items-center gap-x-4 p-2 cursor-pointer rounded-md
                ${
                  activeItem === "logout"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                } hover:bg-blue-50 transition-all duration-300`}
            >
              <LogoutIcon />
              {isOpen && <span>Log Out</span>}
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10">
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default NavBar;
