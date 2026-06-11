// =========================
// ☁ SUPABASE
// =========================
const SUPABASE_URL =
  "https://rhopvipdkeawvejztzix.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJob3B2aXBka2Vhd3Zlanp0eml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTUxNDUsImV4cCI6MjA5NDY5MTE0NX0.U7NAbG461jLbeSqwkP6gecHFg1UoNDkKY4mUH29NtYA";

  const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

window.supabaseClient = supabaseClient;