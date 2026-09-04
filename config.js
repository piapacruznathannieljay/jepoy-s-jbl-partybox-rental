/*
=========================================================
JEPOY'S JBL PARTYBOX
SUPABASE CONFIGURATION
=========================================================
*/

const SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";

const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY_HERE";


/*
=========================================================
DO NOT CHANGE BELOW THIS LINE
=========================================================
*/

if (
  !SUPABASE_URL ||
  SUPABASE_URL.includes("PASTE_YOUR") ||
  !SUPABASE_ANON_KEY ||
  SUPABASE_ANON_KEY.includes("PASTE_YOUR")
) {
  console.error(
    "Supabase configuration is missing. Check config.js."
  );
}

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
