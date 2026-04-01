## 2024-04-01 - Avoid duplicate user queries in API routes
**Learning:** Found N+1-like performance issues where we query `profiles` by `clerk_id` to get `user_id` and then immediately query another table (like `generations`) with `user_id`.
**Action:** Use Supabase inner joins `!inner` to fetch data by `clerk_id` directly in a single query when the intermediate `profile.id` is not strictly needed for anything else.
