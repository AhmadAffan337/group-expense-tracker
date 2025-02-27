// hooks/useExpenses.ts
import { supabase } from "@/lib/supabaseClient";

export interface Expense {
  id: string;
  amount: number;
  description: string;
  group_id: string;
  created_at: string;
  created_by: string;
}

export interface NewExpense {
  amount: number;
  description: string;
  group_id: string;
  created_by: string;
}

export function useExpenses() {
  // Create a new expense
  const createExpense = async (expenseData: NewExpense): Promise<Expense> => {
    const { data, error } = await supabase
      .from("expenses")
      .insert([expenseData])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Expense;
  };

  // Fetch expenses – if groupId is provided, filter by group
  const fetchExpenses = async (groupId?: string): Promise<Expense[]> => {
    let query = supabase.from("expenses").select("*");
    if (groupId) {
      query = query.eq("group_id", groupId);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Expense[];
  };

  // Update an expense by ID
  const updateExpense = async (
    expenseId: string,
    expenseData: Partial<NewExpense>
  ): Promise<Expense> => {
    const { data, error } = await supabase
      .from("expenses")
      .update(expenseData)
      .eq("id", expenseId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Expense;
  };

  // Delete an expense by ID
  const deleteExpense = async (expenseId: string): Promise<boolean> => {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId);
    if (error) throw new Error(error.message);
    return true;
  };

  return { createExpense, fetchExpenses, updateExpense, deleteExpense };
}
