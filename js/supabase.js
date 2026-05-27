// =========================
// ☁ SUPABASE
// =========================
const SUPABASE_URL =
  "https://rhopvipdkeawvejztzix.supabase.co";

const SUPABASE_KEY =
  "SUA_KEY";

window.supabaseClient = window.supabase?.createClient?.(
  SUPABASE_URL,
  SUPABASE_KEY
);

if (!supabaseClient) {
  console.error("Supabase não carregou");
}

window.supabaseClient = supabaseClient;