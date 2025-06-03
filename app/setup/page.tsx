"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function Setup() {
  const router = useRouter();
  const [chequing, setChequing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (id) setUserId(id);
    setLoading(false);
  }, []);

  const generateAccountNumber = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleSubmit = async () => {
    if (!userId) return;

    await supabase.from("accounttoggle").update({
      chequing,
      saving
    }).eq("id", userId);

    if (chequing) {
      await supabase.from("userchequingaccounts").insert([{
        user_id: userId,
        accountnumber: generateAccountNumber(),
        balance: 1000,
        branchnumber: "B12",
        status: "active"
      }]);
    }

    if (saving) {
      await supabase.from("usersavingsaccount").insert([{
        user_id: userId,
        accountnumber: generateAccountNumber(),
        balance: 1000,
        branchnumber: "B12",
        status: "active"
      }]);
    }

    router.push("/dashboard");
  };

  if (loading) return <div className="p-6 text-xl">Loading setup...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Let's set up your ZBank account</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input type="checkbox" id="chequing" checked={chequing} onChange={() => setChequing(!chequing)} className="mr-3" />
            <label htmlFor="chequing" className="text-gray-700 font-medium">Open a Chequing Account</label>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="saving" checked={saving} onChange={() => setSaving(!saving)} className="mr-3" />
            <label htmlFor="saving" className="text-gray-700 font-medium">Open a Savings Account</label>
          </div>

          <button onClick={handleSubmit} className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition">
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
