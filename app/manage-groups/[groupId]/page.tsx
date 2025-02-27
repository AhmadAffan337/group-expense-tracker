// app/manage-groups/[groupId]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function GroupDetailsPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    // Load groups from localStorage
    const groupsData = localStorage.getItem("groups");
    if (groupsData) {
      const groups: Group[] = JSON.parse(groupsData);
      const currentGroup = groups.find((g) => g.group_id === groupId);
      setGroup(currentGroup || null);
    }
  }, [groupId]);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Group not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4 capitalize">
          {group.group_name} Group Details
        </h1>
        <p className="mb-4 text-gray-600">
          Created by: <span className="font-medium">{group.created_by}</span>
        </p>
        <h2 className="text-2xl font-semibold mb-2">Expenses</h2>
        {group.expenses.length === 0 ? (
          <p className="text-gray-600">No expenses added yet.</p>
        ) : (
          <ul className="space-y-2">
            {group.expenses.map((expense) => (
              <li
                key={expense.expense_id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>
                  {expense.description} - ${expense.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => router.push("/manage-groups")}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Back to Manage Groups
        </button>
      </div>
    </div>
  );
}
