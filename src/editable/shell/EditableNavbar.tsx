'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe2, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const primaryLinks = [
  { label: 'Newsroom', href: '/search' },
  { label: 'About', href: '/about' },
  { label: 'For Publishers', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(32,41,26,0.94)] text-[var(--slot4-dark-text)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
       

        <div className="flex min-h-[88px] items-center gap-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-dark-text)] text-lg font-black text-[var(--slot4-dark-bg)]">
              <img src="/favicon.png" alt={`${SITE_CONFIG.name} logo`} className="h-8 w-8 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[2rem] font-light tracking-[-0.06em] text-white">{SITE_CONFIG.name}</p>
              <p className="truncate text-[10px] uppercase tracking-[0.22em] text-[rgba(255,248,236,0.56)]"></p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {primaryLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-[rgba(255,248,236,0.92)] transition hover:text-[var(--slot4-accent-soft)]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-4 lg:flex">
            {session ? (
              <>
                
                <button type="button" onClick={logout} className="text-sm font-semibold text-[rgba(255,248,236,0.92)] hover:text-white">Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-[rgba(255,248,236,0.92)] hover:text-white">Sign In</Link>
            )}
            <Link href={session ? '/create' : '/signup'} className="rounded-full bg-[var(--slot4-dark-text)] px-7 py-3 text-sm font-semibold text-[var(--slot4-dark-bg)] transition hover:bg-[var(--slot4-accent-soft)]">
              {session ? 'Publish' : 'Sign Up'}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[rgba(24,31,19,0.98)] lg:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-3 px-4 py-5 sm:px-6">
            <form action="/search" className="flex overflow-hidden rounded-full border border-white/12 bg-white/6">
              <input name="q" type="search" placeholder="Search the archive" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/45" />
              <button className="px-4 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-soft)]">Go</button>
            </form>
            {[{ label: 'Home', href: '/' }, ...primaryLinks, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign Up', href: '/signup' }])].map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3 text-left text-sm font-semibold text-white">
                Sign Out
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
