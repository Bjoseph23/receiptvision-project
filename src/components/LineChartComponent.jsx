import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LineChartComponent = ({ title, data, className }) => {
  const chartData = [
    { name: "Jan", value: data.income || 0 },
    { name: "Feb", value: data.income || 0 },
    { name: "Mar", value: data.income || 0 },
    { name: "Apr", value: data.income || 0 },
    { name: "May", value: data.income || 0 },
  ];

  return (
    
    <div className={`p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-gray-600 font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
