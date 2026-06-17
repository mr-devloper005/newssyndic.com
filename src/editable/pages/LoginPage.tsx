import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid min-h-[calc(100vh-16rem)] gap-8 lg:grid-cols-[1.05fr_.95fr]">
            <div className="luxury-wave-panel rounded-[2rem] p-8 text-[var(--slot4-dark-text)] sm:p-12 lg:p-16">
              <div className="relative z-[1]">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.auth.login.badge}</p>
                <span className="luxury-kicker mt-8 block" />
                <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-[5rem]">{pagesContent.auth.login.title}</h1>
                <p className="mt-6 max-w-lg text-base leading-8 text-[rgba(255,248,236,0.78)]">{pagesContent.auth.login.description}</p>
                <div className="mt-10 grid gap-4">
                  {[
                    'Access your publishing workspace',
                    'Manage submissions with the same premium interface',
                    'Move back into the archive and task pages without friction',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-4">
                      <CheckCircle2 className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
                      <span className="text-sm font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-[2rem] bg-white p-7 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-12 lg:p-16">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Member access</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-6 border-t border-[color:rgba(84,107,65,0.14)] pt-6 text-sm text-[var(--slot4-muted-text)]">
                New here? <Link href="/signup" className="font-black text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
