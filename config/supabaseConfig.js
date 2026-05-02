import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://nyiizjfxgukjwjknlttc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aWl6amZ4Z3Vrandqa25sdHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTMwODcsImV4cCI6MjA5MzI4OTA4N30.YvTIJNARR1ZKIbILDRgw8gJmZ7N2pnrxONvF7eg1rCc",
);

export default supabase;
