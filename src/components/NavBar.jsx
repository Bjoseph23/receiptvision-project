import React, { useState, useEffect } from "react";
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
import LogoutPopup from "./LogoutPopup"; // Import the popup
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext
import supabase from "../components/supabaseClient";
 import InvoiceProcessor from "./InvoiceProcesssor"// Import the invoice processor

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for logout popup
  const [showInvoiceProcessor, setShowInvoiceProcessor] = useState(false); // State for invoice processor modal
  const { signOut, user } = useAuth(); // Get signOut function and user from AuthContext

  const [userInfo, setUserInfo] = useState({
    name: '',
  });

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setShowLogoutPopup(true); // Show the popup on logout click
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false); // Close the popup
    signOut(); // Call the signOut function to logout
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false); // Hide the popup if the user cancels
  };

  // Fetch user data based on the authenticated user's ID from Supabase
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("name")
            .eq("id", user.id)
            .single();

          if (error) throw error;

          if (data) {
            setUserInfo({
              name: data.name,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon fontSize="large" />, path: "/dashboard" },
    { id: "expenditure", label: "Expenditure", icon: <MonetizationOnIcon fontSize="large" />, path: "/expenditure" },
    { id: "goals", label: "Goals and Tips", icon: <ReceiptIcon fontSize="large" />, path: "/goals" },
    { id: "analytics", label: "Revenue Analytics", icon: <BarChartIcon fontSize="large" />, path: "/analytics" },
    { id: "terms", label: "Privacy Policy", icon: <PolicyIcon fontSize="large" />, path: "/terms" },
  ];

  return (
    <div className="flex m-0 p-0 pr-0">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-200 min-h-screen p-0 m-0 pt-8 pl-2 pr-2 relative duration-90 flex flex-col justify-between overflow-y-auto`}
      >
        <div className="absolute top-2 left-3 ml-2 cursor-pointer p-2" onClick={toggleNav}>
          <MenuIcon fontSize="large" />
        </div>

        {/* ReceiptVision Logo */}
        {isOpen && (
          <div className="pl-3 mt-8 mb-4">
            <h1 className="text-xl font-bold">
              <span className="text-blue-600">Receipt</span>
              <span className="text-black">Vision</span>
            </h1>
          </div>
        )}

        {/* User Avatar and Name */}
        <div className="flex items-center gap-x-4 mt-6 pl-3">
          <img src="https://placehold.co/60" alt="User Avatar" className="w-12 h-12 rounded-full" />
          {isOpen && <h1 className="text-xl font-bold whitespace-nowrap">{userInfo.name || 'User Name'}</h1>}
        </div>

        <ul className="pt-6 pr-1 pl-2 flex-grow">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`relative flex items-center justify-start gap-x-4 p-2 cursor-pointer rounded-md 
                ${
                  activeItem === item.id
                    ? "bg-blue-200 text-blue-900 font-bold"
                    : "text-gray-600"
                } hover:bg-blue-50 transition-all duration-300`}
            >
              <span className="flex-shrink-0 text-xl">{item.icon}</span>
              {isOpen && <span className="origin-left duration-200">{item.label}</span>}
            </NavLink>
          ))}
        </ul>

        <div className="mt-6 pr-2 pl-1">
          {/* Button to open Invoice Processor */}
          <button 
            className="rounded-3xl pl-2 pr-2 flex items-center w-full gap-x-4 p-2 rounded-md bg-blue-800 text-white hover:text-white hover:bg-blue-500"
            onClick={() => setShowInvoiceProcessor(true)}
          >
            <ReceiptIcon fontSize="large" />
            {isOpen && <span>Scan Receipt with AI</span>}
          </button>

          <button className="rounded-2xl flex items-center w-full gap-x-4 p-2 mt-2 bg-blue-200 text-blue-600 hover:text-white hover:bg-blue-400">
            <UploadIcon fontSize="large" />
            {isOpen && <span className="font-bold">Upload Document</span>}
          </button>
        </div>

        <div className="w-full px-4 pl-2">
          <ul>
            <NavLink
              to="/settings"
              onClick={() => setActiveItem("settings")}
              className={`relative flex items-center gap-x-4 pt-3 pl-1 pb-2 cursor-pointer rounded-md
                ${
                  activeItem === "settings"
                    ? "bg-blue-100 text-blue-800 font-bold"
                    : "text-gray-600"
                } hover:bg-blue-50 transition-all duration-300`}
            >
              <SettingsIcon fontSize="large" />
              {isOpen && <span>Settings</span>}
            </NavLink>
            <div
              onClick={handleLogout} // Show the logout popup on click
              className="relative flex items-center gap-x-4 p-2 pl-1 cursor-pointer rounded-md text-gray-600 hover:bg-blue-50 transition-all duration-300"
            >
              <LogoutIcon fontSize="large" />
              {isOpen && <span>Log Out</span>}
            </div>
          </ul>
        </div>
      </div>

      {/* Show LogoutPopup if showLogoutPopup is true */}
      {showLogoutPopup && <LogoutPopup onConfirm={confirmLogout} onCancel={cancelLogout} />}

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
