// hooks/useGroups.ts
import { supabase } from "@/lib/supabaseClient";

export interface Group {
  id: string;
  group_name: string;
  created_by: string;
  created_at: string;
}

export interface NewGroup {
  group_name: string;
  created_by: string;
}

export function useGroups() {
  // Create a new group
  const createGroup = async (groupData: NewGroup): Promise<Group> => {
    const { data, error } = await supabase
      .from("groups")
      .insert([groupData])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Group;
  };

  // Fetch all groups
  const fetchGroups = async (): Promise<Group[]> => {
    const { data, error } = await supabase.from("groups").select("*");
    if (error) throw new Error(error.message);
    return data as Group[];
  };

  // Update a group by ID
  const updateGroup = async (
    groupId: string,
    groupData: Partial<NewGroup>
  ): Promise<Group> => {
    const { data, error } = await supabase
      .from("groups")
      .update(groupData)
      .eq("id", groupId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Group;
  };

  // Delete a group by ID
  const deleteGroup = async (groupId: string): Promise<boolean> => {
    const { error } = await supabase.from("groups").delete().eq("id", groupId);
    if (error) throw new Error(error.message);
    return true;
  };

  return { createGroup, fetchGroups, updateGroup, deleteGroup };
}
