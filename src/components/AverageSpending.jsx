import React from "react";
import { ArrowUpward} from "@mui/icons-material/ArrowUpward";
import { ArrowDownward } from "@mui/icons-material/ArrowDownward";


const AverageSpending = ({ spending = 0, income = 0, expenses = 0 }) => {
  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Average Spending</h3>
      <div className="text-4xl font-bold text-gray-800 mb-2">KSh {spending}</div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center bg-green-100 text-green-500 rounded-full p-2 mr-2">
            <ArrowUpward />
          </div>
          <div>
            <span className="text-sm text-gray-500">Income</span>
            <div className="text-lg font-semibold">KSh {income}</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center bg-red-100 text-red-500 rounded-full p-2 mr-2">
            <ArrowDownward />
          </div>
          <div>
            <span className="text-sm text-gray-500">Expenses</span>
            <div className="text-lg font-semibold">KSh {expenses}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AverageSpending;
