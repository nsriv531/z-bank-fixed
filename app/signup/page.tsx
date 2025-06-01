"use client";

import { useState} from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const {
    firstName,
    lastName,
    email,
    confirmEmail,
    username,
    password,
    confirmPassword,
  } = formData;

  // Basic validation
  if (email !== confirmEmail) {
    alert("Emails do not match.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Check uniqueness of username
  const { data: existingUsername, error: usernameCheckError } = await supabase
    .from("accounts")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  // Check uniqueness of email
  const { data: existingEmail, error: emailCheckError } = await supabase
    .from("accountdetails")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (usernameCheckError || emailCheckError) {
    alert("There was an error checking uniqueness. Please try again.");
    return;
  }

  if (existingUsername && existingEmail) {
    alert("Both username and email are already in use.");
    return;
  } else if (existingUsername) {
    alert("Username is already in use.");
    return;
  } else if (existingEmail) {
    alert("Email is already in use.");
    return;
  }

  // Insert into 'accounts'
  const { error: accountError } = await supabase.from("accounts").insert([
    {
      username,
      password,
    },
  ]);

  if (accountError) {
    console.error("Error inserting into accounts:", accountError.message);
    alert("Failed to create account.");
    return;
  }

  // Insert into 'accountdetails' with unverified status
  const { error: detailsError } = await supabase.from("accountdetails").insert([
    {
      firstname: firstName,
      lastname: lastName,
      email,
      verified_status: false,
    },
  ]);

  if (detailsError) {
    console.error("Error inserting into accountdetails:", detailsError.message);
    alert("Failed to store account details.");
    return;
  }

  // 📨 Trigger email verification
  try {
    const res = await fetch("/api/sendVerification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, firstName }),
    });

    if (!res.ok) {
      throw new Error("Failed to send verification email");
    }
  } catch (err) {
    console.error("Email send error:", err);
    alert("Account created, but failed to send verification email.");
    return;
  }

  alert("Account successfully created! Please check your email to verify your account.");

  // Reset form
  setFormData({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
};



//  const [accounts, setAccounts] = useState<any[]>([]);

// useEffect(() => {
//   const fetchAccounts = async () => {
//     const { data, error } = await supabase.from("accounts").select("*");

//     if (error) {
//       console.error("Supabase Fetch Error:", error.message);
//     } else {
//       console.log("Fetched Accounts:", data);
//       setAccounts(data || []);
//     }
//   };

//   fetchAccounts();
// }, []);

  return (
    <>
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #1f2937 !important;
          caret-color: #1f2937 !important;
          font-weight: 500 !important;
          border-radius: 0.375rem !important;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="flex items-center justify-center p-6 bg-gray-50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Create Account
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {[
                { label: "First Name", name: "firstName" },
                { label: "Last Name", name: "lastName" },
                { label: "Email", name: "email", type: "email" },
                {
                  label: "Confirm Email",
                  name: "confirmEmail",
                  type: "email",
                },
                { label: "Username", name: "username"},
                { label: "Password", name: "password", type: "password" },
                {
                  label: "Confirm Password",
                  name: "confirmPassword",
                  type: "password",
                },
              ].map(({ label, name, type = "text" }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </form>

            <hr className="my-6 border-gray-200" />
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign In
              </a>
            </p>

            {/* 👇 Add this block just below the paragraph
<div className="mt-6">
  <h3 className="text-sm font-semibold text-gray-700 mb-2">Accounts Table (Debug)</h3>
  <div className="bg-gray-100 text-sm p-2 rounded max-h-48 overflow-y-auto">
    {accounts.length > 0 ? (
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
    ) : (
      <p className="text-gray-500">No accounts found or still loading...</p>
    )}
  </div>
</div> */}
          </div>
        </div>
      </div>
    </>
  );
}
