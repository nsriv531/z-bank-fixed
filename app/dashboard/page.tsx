"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Type for chequing/savings accounts
type Account = {
  accountnumber: number;
  balance: number;
  branchnumber: number;
  status: string;
};

type AccountsState = {
  chequing: Account | null;
  savings: Account | null;
};

export default function UserDashboard() {
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountsState>({
    chequing: null,
    savings: null,
  });

useEffect(() => {
  const fetchUserData = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const { data: details, error: detailsError } = await supabase
        .from("accountdetails")
        .select("firstname")
        .eq("id", userId)
        .single();

      const { data: toggle, error: toggleError } = await supabase
        .from("accounttoggle")
        .select("chequing, saving")
        .eq("user_id", userId)
        .single();

      const { data: chequingData, error: chequingError } = await supabase
        .from("userchequingaccounts")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const { data: savingsData, error: savingsError } = await supabase
        .from("usersavingsaccount")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (detailsError || toggleError) {
        console.error("Details/Toggle error:", detailsError || toggleError);
        return;
      }

      if (details?.firstname) setFirstName(details.firstname);

      // Safely populate accounts based on toggle
      setAccounts({
        chequing: toggle?.chequing ? chequingData ?? null : null,
        savings: toggle?.saving ? savingsData ?? null : null,
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, []);

  if (loading) return <div className="p-6 text-xl">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#ecf0f3] p-10 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold">Welcome back, {firstName} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here’s your financial overview</p>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {accounts.chequing && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-blue-600 mb-1">Chequing Account</h2>
            <p className="text-sm text-gray-500">Account #: {accounts.chequing.accountnumber}</p>
            <p className="text-sm text-gray-500">Balance: ${accounts.chequing.balance.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Branch: {accounts.chequing.branchnumber}</p>
            <p className="text-sm text-green-500 font-medium mt-2">Status: {accounts.chequing.status}</p>
          </div>
        )}

        {accounts.savings && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-green-600 mb-1">Savings Account</h2>
            <p className="text-sm text-gray-500">Account #: {accounts.savings.accountnumber}</p>
            <p className="text-sm text-gray-500">Balance: ${accounts.savings.balance.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Branch: {accounts.savings.branchnumber}</p>
            <p className="text-sm text-green-500 font-medium mt-2">Status: {accounts.savings.status}</p>
          </div>
        )}
      </div>

      {/* Rest of the Dashboard */}
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

        {/* Middle Bubble Chart Placeholder */}
        <div className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden h-[460px] flex flex-col justify-start">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Spending Categories</h2>
          <div className="relative flex-1 w-full">
            <div className="absolute w-48 h-48 bg-blue-400 rounded-full blur-2xl opacity-70 left-[5%] top-[20%]"></div>
            <div className="absolute w-44 h-44 bg-purple-400 rounded-full blur-2xl opacity-70 left-[30%] top-[25%]"></div>
            <div className="absolute w-36 h-36 bg-pink-400 rounded-full blur-2xl opacity-70 left-[53%] top-[38%]"></div>
            <div className="absolute w-28 h-28 bg-yellow-300 rounded-full blur-2xl opacity-70 left-[73%] top-[46%]"></div>
            <div className="absolute w-24 h-24 bg-red-400 rounded-full blur-2xl opacity-70 left-[85%] top-[30%]"></div>
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
