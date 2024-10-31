import React, { useState, useEffect } from "react";
import AverageSpending from "../components/AverageSpending";
import SpendingTips from "../components/SpendingTips";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import RecentTransactions from "../components/RecentTransactions";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";


const Dashboard = () => {
  const [data, setData] = useState({
    spending: 500,
    income: 1000,
    expenses: 200,
    tips: [],
    transactions: [],
    categories: []
  });

  useEffect(() => {
    // Fetch data from API
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
      <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome Back James Kariuki</h1>
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

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
