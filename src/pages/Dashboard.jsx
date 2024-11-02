import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; // Import the AuthContext to access the authenticated user
import AverageSpending from "../components/AverageSpending";
import SpendingTips from "../components/SpendingTips";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import RecentTransactions from "../components/RecentTransactions";
import supabase from "../components/supabaseClient"; // Import supabase client to fetch additional data

const Dashboard = () => {
  const { user } = useAuth(); // Get the current user from the AuthContext
  const [userInfo, setUserInfo] = useState({
    name: '',
  });
  
  const [data, setData] = useState({
    spending: 500,
    income: 1000,
    expenses: 200,
    tips: [],
    transactions: [],
    categories: []
  });

  // Fetch the user's full name from Supabase if logged in
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
            setUserInfo({ name: data.name });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  // Fetch data for dashboard components
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/dashboard-data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        <span className="text-blue-600">Welcome Back </span>
        <span className="text-black">{userInfo.name || 'User Name'}</span>  {/* Display user name dynamically */}
      </h1>
      <h2 className="text-xl font-semibold mt-7 mb-6">Dashboard</h2>

      {/* Grid layout for the cards and charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* First row */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <AverageSpending
            spending={data.spending}
            income={data.income}
            expenses={data.expenses}
            className="bg-white rounded-lg p-6"
          />
          <SpendingTips tips={data.tips} className="bg-white rounded-lg p-6" />
        </div>

        {/* Right column for Pie Chart and Transactions */}
        <div className="lg:row-span-2 lg:col-span-1 bg-white rounded-lg p-6 flex flex-col space-y-6">
          <PieChartComponent title="Spending Breakdown" data={data.categories} className="bg-white rounded-lg" />
          <RecentTransactions transactions={data.transactions} className="bg-transparent" />
        </div>

        {/* Line charts row */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <LineChartComponent title="Monthly Earnings" data={data} className="bg-white rounded-lg p-6" />
          <LineChartComponent title="Monthly Expenses" data={data} className="bg-white rounded-lg p-6" />
        </div>

        {/* Full-width bar chart */}
        <div className="lg:col-span-3 bg-white rounded-lg p-6">
          <BarChartComponent title="Income Against Expenses" data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
