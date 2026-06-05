import { faqs } from "@/lib/data"

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">FAQ</div>
      <h2 className="font-heading text-3xl font-extrabold text-foreground">Questions, answered.</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="flex items-start gap-2 font-heading text-base font-extrabold text-foreground">
              <span className="text-primary">●</span>
              {f.q}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
