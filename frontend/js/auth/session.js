import supabase from "/config/supabaseClient.js";

export async function checkUserAuth() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return false;
  }

  return true;
}

export async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // return the access token
  return session?.access_token || null;
}
