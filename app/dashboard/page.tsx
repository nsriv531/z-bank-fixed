"use client";

import { useState, useEffect} from "react";
import { supabase } from "../../lib/supabaseClient";

export default function UserDashboard() {
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const id = localStorage.getItem("user_id");

      if (!id) return;

      const { data, error } = await supabase
        .from("accountdetails")
        .select("firstname")
        .eq("id", id)
        .single();

      if (!error && data) {
        setFirstName(data.firstname);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <div className="p-6 text-xl">Loading dashboard...</div>;

   return (
    <div className="min-h-screen bg-[#ecf0f3] p-10 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold">Welcome back, {firstName} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here’s your financial overview</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_340px] gap-8 xl:gap-14 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-sm uppercase tracking-wide text-gray-500">Total Expenses</h2>
            <p className="text-5xl font-bold text-gray-900 mt-2">$1,520</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-sm uppercase tracking-wide text-gray-500">Insights</h2>
            <p className="mt-2 text-gray-600 text-sm">
              You’re spending $75 per month on subscriptions. Cancel unused ones to save up to $900/year!
              <br /><br />
              Automate your savings: transfer $50 monthly to savings for stress-free growth.
            </p>
          </div>
        </div>

        {/* Middle Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden h-[460px] flex flex-col justify-start">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Spending Categories</h2>
          <div className="relative flex-1 w-full">
            <div className="absolute w-48 h-48 bg-blue-400 rounded-full blur-2xl opacity-70 left-[5%] top-[20%] transition-transform duration-500 hover:scale-105"></div>
            <div className="absolute w-44 h-44 bg-purple-400 rounded-full blur-2xl opacity-70 left-[30%] top-[25%] transition-transform duration-500 hover:scale-105"></div>
            <div className="absolute w-36 h-36 bg-pink-400 rounded-full blur-2xl opacity-70 left-[53%] top-[38%] transition-transform duration-500 hover:scale-105"></div>
            <div className="absolute w-28 h-28 bg-yellow-300 rounded-full blur-2xl opacity-70 left-[73%] top-[46%] transition-transform duration-500 hover:scale-105"></div>
            <div className="absolute w-24 h-24 bg-red-400 rounded-full blur-2xl opacity-70 left-[85%] top-[30%] transition-transform duration-500 hover:scale-105"></div>
          </div>
          <p className="text-xs text-gray-500 mt-auto z-10">Bubble size represents spending</p>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm uppercase tracking-wide text-gray-500">Smart Score</h2>
              <span className="text-sm font-semibold text-green-600">82/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full w-[82%]"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Your spending habits are balanced. Improve by reducing dining expenses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Recent Transactions</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-gray-800"><span>Starbucks Coffee</span><span>-$5.20</span></li>
              <li className="flex justify-between text-gray-800"><span>Spotify Premium</span><span>-$9.99</span></li>
              <li className="flex justify-between text-gray-800"><span>Amazon Purchase</span><span>-$43.80</span></li>
              <li className="flex justify-between text-gray-800"><span>Italian Bistro Dinner</span><span>-$42.50</span></li>
              <li className="flex justify-between text-gray-800"><span>Parking Space Rental</span><span>-$100</span></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Spending Trend</h2>
            <div className="h-24 w-full bg-gradient-to-tr from-blue-100 to-purple-200 rounded-lg shadow-inner flex items-center justify-center text-gray-400 text-xs">
              (Spending graph placeholder)
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
