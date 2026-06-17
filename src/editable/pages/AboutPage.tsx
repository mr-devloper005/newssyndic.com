import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="luxury-wave-panel text-[var(--slot4-dark-text)]">
          <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="relative z-[1] max-w-5xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.about.badge}</p>
              <span className="luxury-kicker mt-8 block" />
              <h1 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-[5.2rem]">
                Premium presentation for stories that deserve a stronger first impression.
              </h1>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <article className="rounded-[2rem] bg-white p-7 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">About {SITE_CONFIG.name}</p>
              <p className="mt-6 text-3xl font-semibold leading-[1.18] tracking-[-0.05em] text-[var(--slot4-dark-bg)] sm:text-4xl">
                {pagesContent.about.description}
              </p>
              <div className="article-content mt-10 space-y-6">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>

            <aside className="space-y-5">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className="rounded-[1.8rem] bg-[linear-gradient(180deg,#f7f0e3_0%,#eef2ea_100%)] p-7 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">0{index + 1}</span>
                    <CheckCircle2 className="h-5 w-5 text-[var(--slot4-accent)]" />
                  </div>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{value.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div className="luxury-wave-panel rounded-[2rem] px-6 py-12 text-[var(--slot4-dark-text)] sm:px-10 lg:grid lg:grid-cols-[1fr_.7fr] lg:items-center lg:px-16 lg:py-16">
              <div className="relative z-[1]">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">Continue exploring</p>
                <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-5xl">
                  Browse the archive and see how the experience carries across every story page.
                </h2>
              </div>
              <div className="relative z-[1] mt-8 lg:mt-0 lg:justify-self-end">
                <Link href="/search" className="luxury-arrow-button bg-white text-[var(--slot4-dark-bg)]">
                  <span>Explore the archive</span>
                  <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
