/*
=========================================================
JEPOY'S JBL PARTYBOX
SUPABASE CONFIGURATION
=========================================================
*/

const SUPABASE_URL = "https://mxercqhnytshxmnoyoja.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_3VccmXrJiyEbLWxdWZSj5g_1GXSr9ni";


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
