import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import PolicyIcon from "@mui/icons-material/Policy";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import UploadIcon from "@mui/icons-material/CloudUpload";
import InvoiceProcessor from "./InvoiceProcesssor"; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showInvoiceProcessor, setShowInvoiceProcessor] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon fontSize="large" />, path: "/dashboard" },
    { id: "expenditure", label: "Expenditure", icon: <MonetizationOnIcon fontSize="large" />, path: "/expenditure" },
    { id: "goals", label: "Goals and Tips", icon: <ReceiptIcon fontSize="large" />, path: "/goals" },
    { id: "analytics", label: "Revenue Analytics", icon: <BarChartIcon fontSize="large" />, path: "/analytics" },
    { id: "privacy", label: "Privacy Policy", icon: <PolicyIcon fontSize="large" />, path: "/privacy" },
  ];

  return (
    <div className="flex m-0 p-0 pr-0">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-200 h-screen p-0 m-0 pt-8 pl-2 pr-2 relative duration-300`}
      >
        {/* Menu Icon */}
        <div className="absolute top-2 left-3 cursor-pointer p-2" onClick={toggleNav}>
          <MenuIcon fontSize="large" />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-x-4 mt-16 pl-3">
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
        <ul className="pt-6 pr-1 pl-2">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`relative flex items-center justify-start gap-x-4 p-2 cursor-pointer rounded-md 
                ${
                  activeItem === item.id
                    ? "bg-blue-100 text-blue-800 font-bold"
                    : "text-gray-600"
                } hover:bg-blue-50 transition-all duration-300`}
            >
              <span className="flex-shrink-0 text-xl">{item.icon}</span>
              {isOpen && (
                <span className="origin-left duration-200">{item.label}</span>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Special Buttons */}
        <div className="mt-6 pr-2 pl-1">
          <button 
            className="flex items-center w-full gap-x-4 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowInvoiceProcessor(true)}
          >
            <ReceiptIcon fontSize="large" />
            {isOpen && <span>Scan Receipt with AI</span>}
          </button>

          <button className="flex items-center w-full gap-x-4 p-2 mt-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200">
            <UploadIcon fontSize="large" />
            {isOpen && <span className="font-bold">Upload Document</span>}
          </button>
        </div>

        {/* Settings and Logout */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <ul>
            <NavLink
              to="/settings"
              onClick={() => setActiveItem("settings")}
              className={`relative flex items-center gap-x-4 p-2 cursor-pointer rounded-md
                ${
                  activeItem === "settings"
                    ? "bg-blue-100 text-blue-800 font-bold"
                    : "text-gray-600"
                } hover:bg-blue-50 transition-all duration-300`}
            >
              <SettingsIcon fontSize="large" />
              {isOpen && <span>Settings</span>}
            </NavLink>
            <NavLink
              to="/logout"
              onClick={() => setActiveItem("logout")}
              className={`relative flex items-center gap-x-4 p-2 cursor-pointer rounded-md
                ${
                  activeItem === "logout"
                    ? "bg-blue-100 text-blue-800 font-bold"
                    : "text-gray-600"
                } hover:bg-blue-50 transition-all duration-300`}
            >
              <LogoutIcon fontSize="large" />
              {isOpen && <span>Log Out</span>}
            </NavLink>
          </ul>
        </div>
      </div>

      {/* Invoice Processor Modal */}
      {showInvoiceProcessor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold">Scan Receipt</h2>
              <button 
                onClick={() => setShowInvoiceProcessor(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <InvoiceProcessor />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;