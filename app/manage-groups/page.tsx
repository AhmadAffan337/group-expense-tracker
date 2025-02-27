"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Custom hooks for API integration
import { useGroups } from "@/hooks/useGroups";
import { useExpenses } from "@/hooks/useExpenses";

// Local state types
type Expense = {
  expense_id: string;
  amount: number;
  description: string;
};

type Group = {
  group_id: string; // local key to store the DB's real ID
  created_by: string;
  group_name: string;
  expenses: Expense[];
};

export default function ManageGroupsPage() {
  const router = useRouter();
  const { createGroup: apiCreateGroup, deleteGroup: apiDeleteGroup } =
    useGroups();
  const {
    createExpense: apiCreateExpense,
    updateExpense: apiUpdateExpense,
    deleteExpense: apiDeleteExpense,
  } = useExpenses();

  // Local storage
  const [groups, setGroups] = useState<Group[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("groups");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userEmail") || "";
    }
    return "";
  });

  // Other states
  const [groupSelected, setGroupSelected] = useState<string>("grocery");
  const [groupError, setGroupError] = useState("");
  const [expenseGroup, setExpenseGroup] = useState("grocery");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseError, setExpenseError] = useState("");

  // For editing expenses
  const [editingExpense, setEditingExpense] = useState<{
    groupId: string;
    expenseId: string;
    amount: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  // --------------------------------------------------
  // CREATE GROUP - Let the DB generate the ID
  // --------------------------------------------------
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) {
      setGroupError("User email not found. Please log in again.");
      return;
    }

    // Check if local group with this name already exists
    const exists = groups.find((g) => g.group_name === groupSelected);
    if (exists) {
      setGroupError(`A group for "${groupSelected}" already exists.`);
      return;
    }

    try {
      // 1. Insert group in DB, let DB generate the 'id'
      const newDbGroup = await apiCreateGroup({
        group_name: groupSelected,
        created_by: userEmail,
      });
      // newDbGroup.id is the real DB ID

      // 2. Store it in local state with group_id = newDbGroup.id
      const localGroup: Group = {
        group_id: newDbGroup.id, // real DB ID
        created_by: userEmail,
        group_name: groupSelected,
        expenses: [],
      };
      setGroups([...groups, localGroup]);
      setGroupError("");
    } catch (error) {
      console.error("API createGroup error:", error);
      setGroupError(String(error));
    }
  };

  // --------------------------------------------------
  // ADD EXPENSE - use the DB's real group_id
  // --------------------------------------------------
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || isNaN(Number(expenseAmount))) {
      setExpenseError("Please enter a valid amount.");
      return;
    }
    // Find the local group
    const group = groups.find((g) => g.group_name === expenseGroup);
    if (!group) {
      setExpenseError(`Group "${expenseGroup}" not found in local state.`);
      return;
    }

    // 1. Insert expense in DB referencing the real DB group ID
    try {
      const newDbExpense = await apiCreateExpense({
        amount: Number(expenseAmount),
        description: expenseDescription,
        group_id: group.group_id, // Must match the DB 'id' in 'groups'
        created_by: userEmail,
      });
      // newDbExpense.id is the DB's expense ID

      // 2. Add it to local state
      const newExpense: Expense = {
        expense_id: newDbExpense.id, // store DB expense ID in local
        amount: newDbExpense.amount,
        description: newDbExpense.description,
      };
      // update local group
      const updatedGroup: Group = {
        ...group,
        expenses: [...group.expenses, newExpense],
      };
      const updatedGroups = groups.map((g) =>
        g.group_id === group.group_id ? updatedGroup : g
      );
      setGroups(updatedGroups);
      setExpenseError("");
      setExpenseAmount("");
      setExpenseDescription("");
    } catch (error) {
      console.error("API createExpense error:", error);
      setExpenseError(String(error));
    }
  };

  // --------------------------------------------------
  // DELETE GROUP
  // --------------------------------------------------
  const handleDeleteGroup = async (groupId: string) => {
    // Remove from local
    setGroups(groups.filter((g) => g.group_id !== groupId));
    try {
      await apiDeleteGroup(groupId); // real DB ID
    } catch (error) {
      console.error("API deleteGroup error:", error);
    }
  };

  // --------------------------------------------------
  // DELETE EXPENSE
  // --------------------------------------------------
  const handleDeleteExpense = async (groupId: string, expenseId: string) => {
    // local
    const updatedGroups = groups.map((g) => {
      if (g.group_id === groupId) {
        return {
          ...g,
          expenses: g.expenses.filter((exp) => exp.expense_id !== expenseId),
        };
      }
      return g;
    });
    setGroups(updatedGroups);
    try {
      await apiDeleteExpense(expenseId); // real DB expense ID
    } catch (error) {
      console.error("API deleteExpense error:", error);
    }
  };

  // --------------------------------------------------
  // EDIT EXPENSE
  // --------------------------------------------------
  const handleEditExpense = (groupId: string, expense: Expense) => {
    setEditingExpense({
      groupId,
      expenseId: expense.expense_id,
      amount: expense.amount.toString(),
      description: expense.description,
    });
  };

  const handleSaveExpense = async () => {
    if (!editingExpense) return;
    const { groupId, expenseId, amount, description } = editingExpense;
    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount.");
      return;
    }
    // local
    const updatedGroups = groups.map((group) => {
      if (group.group_id === groupId) {
        const updatedExpenses = group.expenses.map((exp) => {
          if (exp.expense_id === expenseId) {
            return { ...exp, amount: Number(amount), description };
          }
          return exp;
        });
        return { ...group, expenses: updatedExpenses };
      }
      return group;
    });
    setGroups(updatedGroups);
    setEditingExpense(null);

    // DB
    try {
      await apiUpdateExpense(expenseId, {
        amount: Number(amount),
        description,
      });
    } catch (error) {
      console.error("API updateExpense error:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => router.push("/profile")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Profile
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
        >
          Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Manage Groups</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Group Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Create Group</h2>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-gray-700">Group Name</label>
              <select
                value={groupSelected}
                onChange={(e) => setGroupSelected(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              >
                {["grocery", "travelling", "rent", "bills"].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {groupError && <p className="text-red-500 text-sm">{groupError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-colors"
            >
              Create Group
            </button>
          </form>
        </div>

        {/* Add Expense Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-gray-700">Select Group</label>
              <select
                value={expenseGroup}
                onChange={(e) => setExpenseGroup(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              >
                {["grocery", "travelling", "rent", "bills"].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                placeholder="Expense description"
                required
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            {expenseError && (
              <p className="text-red-500 text-sm">{expenseError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition-colors"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>

      {/* Display created groups and their expenses */}
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
        {groups.length === 0 ? (
          <p className="text-gray-600">No groups created yet.</p>
        ) : (
          groups.map((group) => (
            <div
              key={group.group_id}
              className="bg-white p-4 rounded-lg shadow mb-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold capitalize">
                  {group.group_name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/manage-groups/${group.group_id}`)
                    }
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.group_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete Group
                  </button>
                </div>
              </div>
              <p className="text-gray-500">Created by: {group.created_by}</p>
              <h4 className="mt-2 font-semibold">Expenses:</h4>
              {group.expenses.length === 0 ? (
                <p className="text-gray-600">No expenses added yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {group.expenses.map((expense) => (
                    <li
                      key={expense.expense_id}
                      className="flex flex-col gap-2 border p-2 rounded"
                    >
                      {editingExpense &&
                      editingExpense.expenseId === expense.expense_id &&
                      editingExpense.groupId === group.group_id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="number"
                            value={editingExpense.amount}
                            onChange={(e) =>
                              setEditingExpense({
                                ...editingExpense,
                                amount: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                          <input
                            type="text"
                            value={editingExpense.description}
                            onChange={(e) =>
                              setEditingExpense({
                                ...editingExpense,
                                description: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveExpense}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingExpense(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>
                            {expense.description} - ${expense.amount}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleEditExpense(group.group_id, expense)
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteExpense(
                                  group.group_id,
                                  expense.expense_id
                                )
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
