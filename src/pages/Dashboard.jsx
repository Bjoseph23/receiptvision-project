import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import AverageSpending from "../components/AverageSpending";
import SpendingTips from "../components/SpendingTips";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import RecentTransactions from "../components/RecentTransactions";
import supabase from "../components/supabaseClient";

const Dashboard = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    income: [],
    expenses: [],
    categories: [],
    recentTransactions: [],
    totalIncome: 0,
    totalExpenses: 0,
    averageMonthlyIncome: 0,
    averageMonthlyExpenses: 0,
  });
  const [categoryMap, setCategoryMap] = useState({});

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("name, id")
            .eq("id", user.id)
            .maybeSingle();

          if (error) throw error;
          if (data) {
            setUserInfo({ name: data.name });
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  // Fetch expense categories to map category IDs to category names
  useEffect(() => {
    const fetchExpenseCategories = async () => {
      try {
        const { data: categories, error } = await supabase
          .from("expense_categories")
          .select("id, name");

        if (error) throw error;

        // Create a mapping of category ID to category name
        const categoryMapping = {};
        categories.forEach((category) => {
          categoryMapping[category.id] = category.name;
        });

        setCategoryMap(categoryMapping);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchExpenseCategories();
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Fetch income data
        const { data: incomeData, error: incomeError } = await supabase
          .from("income")
          .select("amount, income_date, income_sources (name)")
          .eq("user_id", user.id)
          .gte("income_date", sixMonthsAgo.toISOString())
          .order("income_date", { ascending: false });

        if (incomeError) throw incomeError;

        // Fetch expenses data
        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select("amount, category_id, transaction_date, description, expense_categories (name)")
          .eq("user_id", user.id)
          .gte("transaction_date", sixMonthsAgo.toISOString())
          .order("transaction_date", { ascending: false });

        if (expensesError) throw expensesError;

        // Calculate totals and averages
        const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expensesData.reduce((sum, item) => sum + Number(item.amount), 0);

        // Process category data for pie chart
        const categoryTotals = expensesData.reduce((acc, expense) => {
          const categoryName = expense.expense_categories.name;
          acc[categoryName] = (acc[categoryName] || 0) + Number(expense.amount);
          return acc;
        }, {});

        const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value,
        }));

        // Process monthly data for line charts
        const monthlyIncome = processMonthlyData(incomeData, "income_date");
        const monthlyExpenses = processMonthlyData(expensesData, "transaction_date");

        // Attach category name to each transaction
        const recentTransactions = expensesData.slice(0, 5).map((transaction) => ({
          ...transaction,
          category_name: categoryMap[transaction.category_id] || "Unknown Category",
        }));

        setDashboardData({
          income: monthlyIncome,
          expenses: monthlyExpenses,
          categories: categoryData,
          recentTransactions,
          totalIncome,
          totalExpenses,
          averageMonthlyIncome: totalIncome / 6,
          averageMonthlyExpenses: totalExpenses / 6,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, categoryMap]);

  // Helper function to process monthly data
  const processMonthlyData = (data, dateField) => {
    const monthlyTotals = data.reduce((acc, item) => {
      const date = new Date(item[dateField]);
      const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      acc[monthYear] = (acc[monthYear] || 0) + Number(item.amount);
      return acc;
    }, {});

    return Object.entries(monthlyTotals).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  // Helper function to generate spending tips based on the data
  const generateTips = (data) => {
    const tips = [];
    const spendingRatio = data.totalExpenses / data.totalIncome;

    if (spendingRatio > 0.8) {
      tips.push("Your expenses are high relative to income. Consider reviewing non-essential spending.");
    }
    if (data.categories.length > 0) {
      const highestCategory = [...data.categories].sort((a, b) => b.value - a.value)[0];
      tips.push(`Highest spending category is ${highestCategory.name}. Consider setting a budget for this category.`);
    }
    if (data.averageMonthlyExpenses > data.averageMonthlyIncome) {
      tips.push("Monthly expenses exceed income. Consider creating a savings plan.");
    }

    return tips;
  };

  if (loading) {
    return <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100">Loading...</div>;
  }

  return (
    <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100 overflow-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        <span className="text-blue-600">Welcome Back, </span>
        <span className="text-black">{userInfo.name || "User Name"}</span>
      </h1>
      <h2 className="text-xl font-semibold mt-7 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <AverageSpending
            spending={dashboardData.averageMonthlyExpenses}
            income={dashboardData.averageMonthlyIncome}
            expenses={dashboardData.totalExpenses}
            className="bg-white rounded-lg p-6"
          />
          <SpendingTips tips={generateTips(dashboardData)} className="bg-white rounded-lg p-6" />
        </div>

        <div className="lg:row-span-2 lg:col-span-1 bg-white rounded-lg p-6 flex flex-col space-y-6">
          <PieChartComponent title="Spending Breakdown" data={dashboardData.categories} className="bg-white rounded-lg" />
          <RecentTransactions transactions={dashboardData.recentTransactions} className="bg-transparent" />
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <LineChartComponent title="Monthly Earnings" data={dashboardData.income} className="bg-white rounded-lg p-6" />
          <LineChartComponent title="Monthly Expenses" data={dashboardData.expenses} className="bg-white rounded-lg p-6" />
        </div>

        <div className="lg:col-span-3 bg-white rounded-lg p-6">
          <BarChartComponent title="Income Against Expenses" data={{ income: dashboardData.income, expenses: dashboardData.expenses }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
