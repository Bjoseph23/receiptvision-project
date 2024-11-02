import React, { useState, useEffect } from "react";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";

const Expenditure = () => {
  const [data, setData] = useState({
    spending: 500,
    income: 1000,
    expenses: 200,
    tips: [],
    transactions: [],
    categories: []
  });

  // State to store the current day and date
  const [currentDate, setCurrentDate] = useState({
    day: '',
    date: ''
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

    // Get current day and date
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    const [day, ...dateParts] = formattedDate.split(" ");
    
    setCurrentDate({
      day,
      date: dateParts.join(" ")
    });
  }, []);

  return (
    <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100">
      {/* Display current day and date */}
      <h1 className="text-4xl font-bold text-blue-600 mb-2">{currentDate.day}</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{currentDate.date}</h2>

      {/* Grid layout for the charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line charts row for Monthly Earnings and Monthly Expenses */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChartComponent title="Monthly Earnings" data={data} className="bg-white rounded-lg p-6" />
          <LineChartComponent title="Monthly Expenses" data={data} className="bg-white rounded-lg p-6" />
        </div>

        {/* Income against Expenses Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6">
          <BarChartComponent title="Income against Expenses" data={data} />
        </div>

        {/* Pie chart and Spending Breakdown */}
        <div className="bg-white rounded-lg p-6">
          <PieChartComponent title="Spending Breakdown" data={data.categories} className="bg-white rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Expenditure;
