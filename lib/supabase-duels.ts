import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export type SupabaseDuelStatus = "open" | "resolving" | "resolved"
export type VaultCardStatus = "available" | "reserved" | "airdropped"
export const DUELS_REALTIME_CHANNEL = "public:duels"
export const DUELS_REALTIME_FILTER = { event: "*", schema: "public", table: "duels" } as const
export const VAULT_CARDS_REALTIME_CHANNEL = "public:vault_cards"
export const VAULT_CARDS_REALTIME_FILTER = { event: "*", schema: "public", table: "vault_cards" } as const
export const PROOF_LOG_REALTIME_CHANNEL = "public:proof_log"
export const PROOF_LOG_REALTIME_FILTER = { event: "*", schema: "public", table: "proof_log" } as const

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

export type VaultCardRow = {
  id: string
  name: string
  grade: string | null
  tier: string
  value_usd: number
  status: VaultCardStatus
  assigned_to: string | null
  assigned_at: string | null
  created_at: string
}

export type ProofLogRow = {
  event_id: string
  event_type: string
  winner_wallet: string | null
  slab_id: string | null
  vrf_proof: string | null
  result_hash: string | null
  timestamp: string
  status: string
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
      vault_cards: {
        Row: VaultCardRow
        Insert: {
          id: string
          name: string
          grade?: string | null
          tier: string
          value_usd: number
          status?: VaultCardStatus
          assigned_to?: string | null
          assigned_at?: string | null
          created_at?: string
        }
        Update: Partial<Omit<VaultCardRow, "id" | "created_at">>
      }
      proof_log: {
        Row: ProofLogRow
        Insert: {
          event_id: string
          event_type: string
          winner_wallet?: string | null
          slab_id?: string | null
          vrf_proof?: string | null
          result_hash?: string | null
          timestamp?: string
          status?: string
        }
        Update: Partial<Omit<ProofLogRow, "event_id" | "timestamp">>
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
