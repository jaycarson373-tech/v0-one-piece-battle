import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export type SupabaseDuelStatus = "open" | "resolving" | "resolved"
export const DUELS_REALTIME_CHANNEL = "public:duels"
export const DUELS_REALTIME_FILTER = { event: "*", schema: "public", table: "duels" } as const

export type SupabaseDuelRow = {
  id: string
  creator_wallet: string
  acceptor_wallet: string | null
  status: SupabaseDuelStatus
  winner_wallet: string | null
  vrf_proof: string | null
  result_hash: string | null
  created_at: string
}

type Database = {
  public: {
    Tables: {
      duels: {
        Row: SupabaseDuelRow
        Insert: {
          id: string
          creator_wallet: string
          acceptor_wallet?: string | null
          status?: SupabaseDuelStatus
          winner_wallet?: string | null
          vrf_proof?: string | null
          result_hash?: string | null
          created_at?: string
        }
        Update: Partial<Omit<SupabaseDuelRow, "id" | "created_at">>
      }
    }
  }
}

let supabaseClient: SupabaseClient<Database> | null | undefined

export function getSupabaseDuelsClient() {
  if (supabaseClient !== undefined) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  supabaseClient =
    supabaseUrl && supabaseAnonKey
      ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        })
      : null
  return supabaseClient
}
