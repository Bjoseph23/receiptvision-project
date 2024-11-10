import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import AverageSpending from "../components/AverageSpending";
import SpendingTips from "../components/SpendingTips";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import RecentTransactions from "../components/RecentTransactions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import supabase from "../components/supabaseClient";

const processMonthlyData = (data, dateField) => {
  // Create an object to store monthly totals
  const monthlyTotals = data.reduce((acc, item) => {
    // Convert the date string to a Date object
    const date = new Date(item[dateField]);
    // Create a key in format "YYYY-MM"
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Initialize the month if it doesn't exist
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        total: 0
      };
    }
    
    // Add the amount to the monthly total
    acc[monthKey].total += Number(item.amount);
    
    return acc;
  }, {});

  // Convert the object to an array and sort by month
  const monthlyData = Object.values(monthlyTotals)
    .sort((a, b) => a.month.localeCompare(b.month));

  // Format the data for the chart
  return monthlyData.map(item => ({
    month: new Date(item.month).toLocaleString('default', { month: 'short' }),
    amount: Number(item.total.toFixed(2))
  }));
};

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
    plannedBudgets: [], // New: for budget planning
    activeTips: [], // New: from tip_templates
    savingGoals: [], // New: for tracking savings
    upcomingBills: [], // New: for bill tracking
  });

// In Dashboard.jsx
useEffect(() => {
  const fetchUserInfo = async () => {
      if (user) {
          try {
              const { data, error } = await supabase
                  .from("users")
                  .select("email, id")  // Specify exactly what we want to select
                  .eq("id", user.id)
                  .maybeSingle();  // Use maybeSingle() instead of single()

          if (error) throw error;
          if (data) {
            setUserInfo({ name: data.name });
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
          try {
            await insertUserIfNeeded(user);
          } catch (insertError) {
            console.error("Error creating user:", insertError);
          }
        }
      }
  };
  fetchUserInfo();
}, [user]);

  // Fetch dashboard data with enhanced budget planning
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Existing data fetching
        const { data: incomeData, error: incomeError } = await supabase
          .from("income")
          .select(`
            id, amount, description, income_date, is_recurring, frequency,
            income_sources (name)
          `)
          .eq("user_id", user.id)
          .gte("income_date", sixMonthsAgo.toISOString());

        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select(`
            id, amount, description, transaction_date,
            expense_categories (id, name)
          `)
          .eq("user_id", user.id)
          .gte("transaction_date", sixMonthsAgo.toISOString());

        // New: Fetch active tips
        const { data: tipsData } = await supabase
          .from("user_tips")
          .select(`
            *,
            tip_templates (title, description)
          `)
          .eq("user_id", user.id)
          .eq("is_relevant", true);

        // Calculate totals and process data
        const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expensesData.reduce((sum, item) => sum + Number(item.amount), 0);
        const monthlyIncome = processMonthlyData(incomeData, "income_date");
        const monthlyExpenses = processMonthlyData(expensesData, "transaction_date");

        // Process categories with budget planning
        const categoryTotals = expensesData.reduce((acc, expense) => {
          const categoryName = expense.expense_categories.name;
          const categoryId = expense.expense_categories.id;
          if (!acc[categoryId]) {
            acc[categoryId] = {
              name: categoryName,
              spent: 0,
              planned: 0,
              id: categoryId
            };
          }
          acc[categoryId].spent += Number(expense.amount);
          return acc;
        }, {});

        const plannedBudgets = Object.values(categoryTotals).map(category => ({
          ...category,
          remaining: category.planned - category.spent,
          percentage: category.planned > 0 ? (category.spent / category.planned) * 100 : 0
        }));

        setDashboardData({
          income: monthlyIncome,
          expenses: monthlyExpenses,
          categories: Object.values(categoryTotals),
          recentTransactions: expensesData.slice(0, 5).map(expense => ({
            id: expense.id,
            amount: expense.amount,
            description: expense.description,
            date: expense.transaction_date,
            category: expense.expense_categories.name
          })),
          totalIncome,
          totalExpenses,
          averageMonthlyIncome: totalIncome / 6,
          averageMonthlyExpenses: totalExpenses / 6,
          plannedBudgets,
          activeTips: tipsData?.map(tip => ({
            title: tip.tip_templates.title,
            description: tip.tip_templates.description,
            isActedUpon: tip.is_acted_upon
          })) || [],
          recurringIncome: incomeData.filter(income => income.is_recurring),
          oneTimeIncome: incomeData.filter(income => !income.is_recurring),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Combined tips generation
  const generateTips = (data) => {
    const tips = [];
    const spendingRatio = data.totalExpenses / data.totalIncome;

    // Proactive tips
    tips.push("Plan your monthly budget before the month begins");
    tips.push("Set aside emergency funds first");
    
    // Reactive tips
    if (spendingRatio > 0.8) {
      tips.push("Your expenses are high relative to income. Consider reviewing non-essential spending.");
    }
    if (data.categories.length > 0) {
      const highestCategory = [...data.categories].sort((a, b) => b.spent - a.spent)[0];
      tips.push(`Highest spending category is ${highestCategory.name}. Consider setting a lower budget for this category.`);
    }

    // Add tips from database
    data.activeTips.forEach(tip => tips.push(tip.description));

    return tips;
  };

  const BudgetPlanningCard = ({ category }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={category.percentage} className="mb-2" />
        <div className="flex justify-between text-sm">
          <span>Planned: ${category.planned}</span>
          <span>Spent: ${category.spent}</span>
          <span>Remaining: ${category.remaining}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100">Loading...</div>;
  }

  return (
    <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        <span className="text-blue-600">Welcome Back,   </span>
        <span className="text-black">{userInfo.name || "User Name"}</span>
      </h1>
      <h2 className="text-xl font-semibold mt-7 mb-6">Budget Planning Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Budget Planning Section */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Budget Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboardData.plannedBudgets.map((category) => (
                  <BudgetPlanningCard key={category.id} category={category} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section - Enhanced Visibility */}
        <div className="lg:row-span-2">
          <SpendingTips 
            tips={generateTips(dashboardData)} 
            className="bg-white rounded-lg p-6 sticky top-0"
          />
        </div>

        {/* Existing Components */}
        <div className="lg:col-span-2">
          <AverageSpending
            spending={dashboardData.averageMonthlyExpenses}
            income={dashboardData.averageMonthlyIncome}
            expenses={dashboardData.totalExpenses}
            className="bg-white rounded-lg p-6"
          />
        </div>

        <div className="lg:col-span-2">
          <PieChartComponent 
            title="Budget Allocation" 
            data={dashboardData.plannedBudgets.map(budget => ({
              name: budget.name,
              value: budget.planned
            }))} 
            className="bg-white rounded-lg p-6" 
          />
        </div>

        <div className="lg:col-span-3">
          <RecentTransactions 
            transactions={dashboardData.recentTransactions} 
            className="bg-white rounded-lg p-6" 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;