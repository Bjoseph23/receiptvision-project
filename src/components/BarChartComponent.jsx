import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BarChartComponent = ({ title, data, className }) => {
  const chartData = [
    { name: "Mon", income: data.income || 0, expenses: data.expenses || 0 },
    { name: "Tue", income: data.income || 0, expenses: data.expenses || 0 },
    { name: "Wed", income: data.income || 0, expenses: data.expenses || 0 },
    { name: "Thu", income: data.income || 0, expenses: data.expenses || 0 },
    { name: "Fri", income: data.income || 0, expenses: data.expenses || 0 },
  ];

  return (
    <div className={`p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-gray-700 font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill="#82ca9d" />
          <Bar dataKey="expenses" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
