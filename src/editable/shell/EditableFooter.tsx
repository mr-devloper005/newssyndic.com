'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Media Distribution', href: '/search' }
    ],
  },
  
]

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
      <div className="mx-auto max-w-[1440px] px-4 pt-14 sm:px-6 lg:px-10 lg:pt-20">
       

        <section className="grid gap-12 px-2 py-14 lg:grid-cols-[1.05fr_1.45fr] lg:py-16">
          <div>
            <div className="flex items-center gap-4">
              <img src="/favicon.png" alt={`${SITE_CONFIG.name} logo`} className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20" />
              <Link href="/" className="text-[2.5rem] font-light tracking-[-0.07em] text-[var(--slot4-accent)] sm:text-[3rem]">
                {SITE_CONFIG.name}
              </Link>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">
              Curated stories, distribution-ready updates, and searchable media assets presented through a polished editorial interface.
            </p>
           
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">{column.title}</h3>
                <div className="mt-5 grid gap-3">
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className="text-sm font-semibold transition hover:text-[var(--slot4-accent)]">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[color:rgba(84,107,65,0.14)] py-6">
          <div className="flex flex-col gap-3 text-sm text-[var(--slot4-muted-text)] md:flex-row md:items-center md:justify-between">
            <p>© {year} {SITE_CONFIG.name}. Distribution stories and public media updates.</p>
            <div className="flex flex-wrap gap-4">
              {session ? (
                <>
                  <Link href="/create" className="font-semibold hover:text-[var(--slot4-accent)]">Publish</Link>
                  <button type="button" onClick={logout} className="text-left font-semibold hover:text-[var(--slot4-accent)]">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="font-semibold hover:text-[var(--slot4-accent)]">Sign In</Link>
                  <Link href="/signup" className="font-semibold hover:text-[var(--slot4-accent)]">Create Account</Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </footer>
  )
}
