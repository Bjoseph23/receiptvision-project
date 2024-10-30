import React, { useState, useEffect } from "react";
import AverageSpending from "../components/AverageSpending";
import SpendingTips from "../components/SpendingTips";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import RecentTransactions from "../components/RecentTransactions";

const Dashboard = () => {
  const [data, setData] = useState({
    spending: 0,
    income: 0,
    expenses: 0,
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
      <div className="flex-1 pl-4 m-0 first-line:p-6 bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome Back James Kariuki</h1>
        <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

        {/* Grid layout for the cards and charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* First two rows (Average Spending & Tips) */}
          <AverageSpending
            spending={data.spending}
            income={data.income}
            expenses={data.expenses}
            className="col-span-2 bg-blue-100"
          />
          <SpendingTips tips={data.tips} className="col-span-2 bg-blue-100" />

          {/* Line Charts */}
          <LineChartComponent title="Monthly Earnings" data={data} className="col-span-2 bg-blue-100" />
          <LineChartComponent title="Monthly Expenses" data={data} className="col-span-2 bg-blue-100" />

          {/* Bar Chart (Horizontal Bar Chart spanning two columns) */}
          <BarChartComponent title="Income Against Expenses" data={data} className="col-span-4 bg-white" />

          {/* Right column containing Pie Chart and Recent Transactions */}
          <div className="col-span-2 bg-blue-100 rounded-lg p-4 flex flex-col space-y-6">
            {/* Pie Chart for Spending Breakdown */}
            <PieChartComponent title="Spending Breakdown" data={data.categories} className="bg-white rounded-lg" />
            {/* Recent Transactions (Transparent Background) */}
            <RecentTransactions transactions={data.transactions} className="bg-transparent" />
          </div>
        </div>
      </div>
    
  );
};

export default Dashboard;
