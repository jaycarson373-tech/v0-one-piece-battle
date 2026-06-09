import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"

type RealtimeBackoffOptions = {
  supabase: SupabaseClient
  label: string
  createChannel: () => RealtimeChannel
  onSubscribed?: () => void
}

const RETRY_BASE_MS = 1000
const RETRY_MAX_MS = 30000

export function subscribeWithBackoff({ supabase, label, createChannel, onSubscribed }: RealtimeBackoffOptions) {
  let channel: RealtimeChannel | null = null
  let retryCount = 0
  let retryTimer: ReturnType<typeof window.setTimeout> | null = null
  let active = true

  function scheduleReconnect(status: string) {
    if (!active) return

    const delay = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** retryCount)
    retryCount += 1
    console.warn(`${label} realtime ${status}; reconnecting in ${delay}ms`)

    if (channel) {
      void supabase.removeChannel(channel)
      channel = null
    }

    retryTimer = window.setTimeout(connect, delay)
  }

  function connect() {
    if (!active) return

    channel = createChannel()
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        retryCount = 0
        onSubscribed?.()
        return
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        scheduleReconnect(status)
      }
    })
  }

  connect()

  return () => {
    active = false
    if (retryTimer) window.clearTimeout(retryTimer)
    if (channel) void supabase.removeChannel(channel)
  }
}
