import supabase from "../../../config/supabaseConfig.js";

export async function checkUserAuth() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return false;
  }

  return true;
}