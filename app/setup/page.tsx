"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SetupPage() {
  const router = useRouter();
  const [chequingSelected, setChequingSelected] = useState(false);
  const [savingsSelected, setSavingsSelected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    setUserId(id);
    setLoading(false);
  }, []);

  const generateAccountNumber = () => {
    return Math.floor(10000000 + Math.random() * 90000000); // 8-digit unique number
  };

  const handleSubmit = async () => {
    if (!userId) return;

    // Update toggle status
    await supabase
      .from("accounttoggle")
      .update({
        chequing: chequingSelected,
        saving: savingsSelected,
        tfsa: false
      })
      .eq("user_id", userId);

    // Insert chequing account
    if (chequingSelected) {
      await supabase.from("userchequingaccounts").insert([
        {
          user_id: userId,
          accountnumber: generateAccountNumber(),
          balance: 1000,
          branchnumber: 12,
          status: "active"
        }
      ]);
    }

    // Insert savings account
    if (savingsSelected) {
      await supabase.from("usersavingsaccount").insert([
        {
          user_id: userId,
          accountnumber: generateAccountNumber(),
          balance: 1000,
          branchnumber: 12,
          status: "active"
        }
      ]);
    }

    router.push("/dashboard");
  };

  if (loading) return <div className="p-6 text-xl">Loading setup...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Set Up Your Accounts</h1>
      <p className="mb-4 text-gray-600">Choose which accounts you’d like to open:</p>

      <div className="space-y-4 w-full max-w-md mb-6">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={chequingSelected}
            onChange={() => setChequingSelected(!chequingSelected)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-800">Chequing Account</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={savingsSelected}
            onChange={() => setSavingsSelected(!savingsSelected)}
            className="form-checkbox h-5 w-5 text-green-600"
          />
          <span className="text-gray-800">Savings Account</span>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
      >
        Finish Setup
      </button>
    </div>
  );
}
