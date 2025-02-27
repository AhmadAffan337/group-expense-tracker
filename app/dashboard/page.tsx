"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define types for Expense and Group
type Expense = {
  expense_id: string;
  amount: number;
  description: string;
};

type Group = {
  group_id: string;
  created_by: string;
  group_name: string;
  expenses: Expense[];
};

export default function DashboardPage() {
  const router = useRouter();
  // View mode state: "expenses" (default) or "groups"
  const [viewMode, setViewMode] = useState<"expenses" | "groups">("expenses");
  // Groups data loaded from localStorage
  const [groups, setGroups] = useState<Group[]>([]);

  // Load groups from localStorage when component mounts
  useEffect(() => {
    const storedGroups = localStorage.getItem("groups");
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }
  }, []);

  // Build a list of all expenses from all groups for the "expenses" view.
  const allExpenses = groups.flatMap((group) =>
    group.expenses.map((expense) => ({
      ...expense,
      group_name: group.group_name,
      group_id: group.group_id,
      created_by: group.created_by,
    }))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* Navigation Buttons for Profile and Manage Groups with updated colors */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => router.push("/profile")}
          className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
        >
          Profile
        </button>
        <button
          onClick={() => router.push("/manage-groups")}
          className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 transition-colors"
        >
          Manage Groups
        </button>
      </div>

      {/* Toggle Buttons for View Modes */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setViewMode("expenses")}
          className={`px-4 py-2 rounded transition-colors ${
            viewMode === "expenses"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Expenses Wise
        </button>
        <button
          onClick={() => setViewMode("groups")}
          className={`px-4 py-2 rounded transition-colors ${
            viewMode === "groups"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Group Wise
        </button>
      </div>

      {viewMode === "expenses" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allExpenses.length === 0 ? (
            <p className="text-center col-span-full text-gray-600">
              No expenses available.
            </p>
          ) : (
            allExpenses.map((expense) => (
              <div
                key={expense.expense_id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <h2 className="text-xl font-semibold">{expense.description}</h2>
                <p className="text-gray-600">Amount: ${expense.amount}</p>
                <p className="text-gray-500 text-sm">
                  Group: {expense.group_name}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groups.length === 0 ? (
            <p className="text-center text-gray-600">No groups available.</p>
          ) : (
            groups.map((group) => (
              <div
                key={group.group_id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <h2 className="text-2xl font-bold capitalize mb-2">
                  {group.group_name}
                </h2>
                <p className="text-gray-500 mb-2">
                  Created by: {group.created_by}
                </p>
                {group.expenses.length === 0 ? (
                  <p className="text-gray-600">No expenses in this group.</p>
                ) : (
                  <ul className="space-y-2">
                    {group.expenses.map((expense) => (
                      <li
                        key={expense.expense_id}
                        className="border p-2 rounded flex justify-between"
                      >
                        <span>{expense.description}</span>
                        <span>${expense.amount}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
