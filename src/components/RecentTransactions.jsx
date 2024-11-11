import React from "react";

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recent Transactions</h2>
      <ul className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <li key={index} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="text-lg font-medium text-gray-800">
                  {transaction.category_name || "Unknown Category"}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(transaction.transaction_date).toLocaleDateString()} - {transaction.description}
                </p>
              </div>
              <p className="text-lg font-semibold text-red-500">
                -Ksh {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No recent transactions available.</p>
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions;
