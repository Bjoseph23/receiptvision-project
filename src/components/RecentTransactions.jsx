import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-gray-600 font-bold mb-4">Recent Transactions</h3>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 border-b border-gray-200"
            >
              <div>
                <p className="text-sm">{transaction.date}</p>
                <p className="font-semibold">${transaction.amount}</p>
              </div>
              <ArrowForwardIcon />
            </li>
          ))
        ) : (
          <p>No recent transactions available.</p>
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions;
