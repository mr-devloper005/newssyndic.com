import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid min-h-[calc(100vh-16rem)] gap-8 lg:grid-cols-[.95fr_1.05fr]">
            <div className="flex flex-col justify-center rounded-[2rem] bg-white p-7 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-12 lg:p-16">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create account</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{pagesContent.auth.signup.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-6 border-t border-[color:rgba(84,107,65,0.14)] pt-6 text-sm text-[var(--slot4-muted-text)]">
                Already have an account? <Link href="/login" className="font-black text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link>
              </p>
            </div>

            <div className="luxury-wave-panel rounded-[2rem] p-8 text-[var(--slot4-dark-text)] sm:p-12 lg:p-16">
              <div className="relative z-[1]">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.auth.signup.badge}</p>
                <span className="luxury-kicker mt-8 block" />
                <h2 className="mt-8 max-w-xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-[5rem]">{pagesContent.auth.signup.title}</h2>
                <p className="mt-6 max-w-lg text-base leading-8 text-[rgba(255,248,236,0.78)]">{pagesContent.auth.signup.description}</p>
                <div className="mt-10 grid gap-4">
                  {[
                    'Create a publishing-ready account in one step',
                    'Start drafting posts across active content types',
                    'Keep discovery, publishing, and follow-up connected',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-4">
                      <Sparkles className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
                      <span className="text-sm font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
