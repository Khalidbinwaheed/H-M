import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function test() {
  console.log("Creating test user...");
  const email = `test_${Date.now()}@example.com`;
  const password = "password123";

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("Auth Error:", authError.message);
    return;
  }

  console.log("Logged in as:", authData.user?.email);

  console.log("Testing Supabase Insert...");
  const { data, error } = await supabase.from("customers").insert({
    name: "Test Customer Authenticated",
    type: "B2B",
    email: "testb2b@example.com",
    city: "Lahore"
  }).select("*").single();
  
  if (error) {
    console.error("Insert Error:", error);
  } else {
    console.log("Insert Success:", data);
  }
}

test();
