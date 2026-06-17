'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'rounded-[1.25rem] border border-[color:rgba(84,107,65,0.18)] bg-[var(--slot4-warm)] px-4 py-3 text-sm font-bold text-[var(--slot4-page-text)] outline-none transition placeholder:text-current/35 focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] px-4 py-16 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="luxury-wave-panel rounded-[2rem] p-8 text-[var(--slot4-dark-text)] sm:p-10">
              <div className="relative z-[1]">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.create.locked.badge}</p>
                <span className="luxury-kicker mt-8 block" />
                <h1 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl">{pagesContent.create.locked.title}</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-[rgba(255,248,236,0.8)]">{pagesContent.create.locked.description}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-[2rem] bg-white p-8 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(153,173,122,0.16)] text-[var(--slot4-accent)]">
                <Lock className="h-9 w-9" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-[var(--slot4-dark-bg)]">Access the publishing workspace</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Sign in to draft and organize new content within the same premium interface.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="luxury-arrow-button bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
                  <span>Login</span>
                  <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
                </Link>
                <Link href="/signup" className="luxury-arrow-button border border-[color:rgba(84,107,65,0.18)] bg-white text-[var(--slot4-accent)]">
                  <span>Sign up</span>
                  <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <aside className="luxury-wave-panel rounded-[2rem] p-8 text-[var(--slot4-dark-text)] sm:p-10">
              <div className="relative z-[1]">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.create.hero.badge}</p>
                <span className="luxury-kicker mt-8 block" />
                <h1 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl">{pagesContent.create.hero.title}</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-[rgba(255,248,236,0.8)]">{pagesContent.create.hero.description}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {enabledTasks.map((item) => {
                    const Icon = taskIcon[item.key] || FileText
                    const active = item.key === task
                    return (
                      <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`rounded-[1.5rem] border p-4 text-left transition ${active ? 'border-white/10 bg-white text-[var(--slot4-dark-bg)]' : 'border-white/10 bg-white/8 text-white hover:-translate-y-0.5'}`}>
                        <Icon className="h-5 w-5" />
                        <span className="mt-3 block text-sm font-black">{item.label}</span>
                        <span className="mt-1 block text-xs font-semibold opacity-70">{item.description}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-[-0.06em] text-[var(--slot4-dark-bg)]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-[rgba(153,173,122,0.16)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 text-sm font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-accent)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
