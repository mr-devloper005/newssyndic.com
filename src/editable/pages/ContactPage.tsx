'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaigns.' },
  { icon: Mail, title: 'General support', body: 'Reach out for account, publishing, and site-related help.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="luxury-wave-panel text-[var(--slot4-dark-text)]">
          <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="relative z-[1] max-w-5xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.contact.eyebrow}</p>
              <span className="luxury-kicker mt-8 block" />
              <h1 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-[5.1rem]">{pagesContent.contact.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[rgba(255,248,236,0.82)]">{pagesContent.contact.description}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
            <aside className="space-y-5">
              {desks.map((desk, index) => (
                <div key={desk.title} className="rounded-[1.8rem] bg-[linear-gradient(180deg,#f7f0e3_0%,#eef2ea_100%)] p-7 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
                  <div className="flex items-center justify-between">
                    <desk.icon className="h-5 w-5 text-[var(--slot4-accent)]" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">0{index + 1}</span>
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{desk.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{desk.body}</p>
                </div>
              ))}
            </aside>

            <div className="rounded-[2rem] bg-white p-7 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Send a message</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{pagesContent.contact.formTitle}</h2>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
