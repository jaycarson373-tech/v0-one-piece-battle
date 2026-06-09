export function Logo({ className = "" }: { className?: string }) {
  return (
    <img src="/kotp-logo.png" alt="King of the Pirates" className={`h-9 w-9 object-contain ${className}`} />
  )
}
