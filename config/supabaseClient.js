import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://xnlstthktpfeyxmgobtq.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHN0dGhrdHBmZXl4bWdvYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1OTQ2NzksImV4cCI6MjA5MzE3MDY3OX0._USj6X3d2Wwghceiq7YyfWt-J_S2oIOeIDuMUzFyiNE",
);

export default supabase;
