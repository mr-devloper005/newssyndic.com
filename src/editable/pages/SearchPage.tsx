import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { CATEGORY_OPTIONS } from '@/lib/categories'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 4 === 0

  return (
    <Link href={href} className={`group rounded-[1.8rem] bg-white p-6 shadow-[0_14px_36px_rgba(52,64,40,0.08)] ${strong ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[rgba(153,173,122,0.16)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{taskLabel}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h2 className="mt-5 line-clamp-3 text-3xl font-semibold leading-[1.04] tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{post.title}</h2>
      {summary ? <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Open result <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const categoryOptions = CATEGORY_OPTIONS.slice(0, 14)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="luxury-wave-panel text-[var(--slot4-dark-text)]">
          <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
              <div className="relative z-[1]">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.search.hero.badge}</p>
                <span className="luxury-kicker mt-8 block" />
                <h1 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-[5rem]">{pagesContent.search.hero.title}</h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[rgba(255,248,236,0.8)]">{pagesContent.search.hero.description}</p>
              </div>

              <form action="/search" className="relative z-[1] rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-[0_24px_60px_rgba(16,20,14,0.18)] backdrop-blur-sm lg:p-7">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-full bg-white px-4 py-3">
                  <Search className="h-5 w-5 text-[var(--slot4-accent)]" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold text-[var(--slot4-page-text)] outline-none placeholder:text-current/35" />
                </label>
                <div className="mt-4 rounded-[1.5rem] bg-white p-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                    <Filter className="h-4 w-4" />
                    Category
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="cursor-pointer">
                      <input type="radio" name="category" value="" defaultChecked={!category} className="peer sr-only" />
                      <span className="flex min-h-[3.25rem] items-center justify-center rounded-[1rem] border border-[color:rgba(84,107,65,0.16)] px-4 py-3 text-center text-sm font-bold text-[var(--slot4-page-text)] transition peer-checked:bg-[var(--slot4-accent)] peer-checked:text-[var(--slot4-dark-text)]">
                        All categories
                      </span>
                    </label>
                    {categoryOptions.map((item) => (
                      <label key={item.slug} className="cursor-pointer">
                        <input type="radio" name="category" value={item.slug} defaultChecked={category === item.slug} className="peer sr-only" />
                        <span className="flex min-h-[3.25rem] items-center justify-center rounded-[1rem] border border-[color:rgba(84,107,65,0.16)] px-4 py-3 text-center text-sm font-bold text-[var(--slot4-page-text)] transition peer-checked:bg-[var(--slot4-accent)] peer-checked:text-[var(--slot4-dark-text)]">
                          {item.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <button className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--slot4-accent)] px-6 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-text)] transition hover:bg-white hover:text-[var(--slot4-dark-bg)]" type="submit">Search</button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[color:rgba(84,107,65,0.14)] pb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">{results.length} results</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            </div>

          {results.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--slot4-dark-bg)]">No matching posts found.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
