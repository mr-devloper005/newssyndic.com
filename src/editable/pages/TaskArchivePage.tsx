import Link from 'next/link'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Newspaper, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import {
  CompactIndexCard,
  EditorialListStory,
  getEditableCategory,
  getEditableExcerpt,
  HorizontalStoryCard,
  ImageFirstCard,
} from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo) || asText(content.avatar)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; badge: string; promise: string }> = {
  mediaDistribution: { icon: Newspaper, promise: 'Newswire cards prioritize source, category, headline, and concise summary blocks.', badge: 'News' },
  article: { icon: FileText, promise: 'Readable editorial cards keep headlines and summaries front and center.', badge: 'Read' },
  listing: { icon: Building2, promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: Megaphone, promise: 'Offer-board cards emphasize value, availability, and response actions.', badge: 'Offer' },
  image: { icon: Camera, promise: 'Gallery-first browsing focuses on strong visuals with compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, promise: 'Saved-resource cards stay clean and text-led for fast scanning.', badge: 'Bookmark' },
  pdf: { icon: Download, promise: 'Document cards surface context, summary, and direct access intent.', badge: 'PDF' },
  profile: { icon: UserRound, promise: 'Profile cards focus on identity, role, and discoverability.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category
  const lead = posts[0]
  const side = posts.slice(1, 5)
  const stream = posts.slice(5)
  const sourceForList = stream.length ? stream : posts.slice(1)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="luxury-wave-panel text-[var(--slot4-dark-text)]">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div className="relative z-[1]">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent-soft)]">
                  <Icon className="h-4 w-4" /> {deck.badge}
                </div>
                <span className="luxury-kicker mt-8 block" />
                <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-[5.1rem]">
                  {voice?.headline || `Browse ${label}`}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[rgba(255,248,236,0.8)]">
                  {voice?.description || SITE_CONFIG.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={basePath} className="luxury-arrow-button bg-[var(--slot4-accent)] text-[var(--slot4-dark-text)]">
                    <span>Browse all</span>
                    <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
                  </Link>
                  <Link href="/search" className="luxury-arrow-button border border-white/10 bg-white text-[var(--slot4-dark-bg)]">
                    <span>Search archive</span>
                    <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><Search className="h-5 w-5" /></span>
                  </Link>
                </div>
              </div>

              <div className="relative z-[1] rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-[0_24px_60px_rgba(16,20,14,0.18)] backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent-soft)]">
                  <Filter className="h-4 w-4" /> Refine the feed
                </div>
                <form action={basePath} className="mt-5 grid gap-3">
                  <select name="category" defaultValue={category} className="h-12 rounded-[1.1rem] border border-white/12 bg-white px-4 text-sm font-semibold text-[var(--slot4-page-text)] outline-none">
                    <option value="all">All categories</option>
                    {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="h-12 rounded-[1.1rem] bg-[var(--slot4-accent)] text-sm font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-text)]">Apply filter</button>
                </form>
                <p className="mt-4 text-sm text-[rgba(255,248,236,0.74)]">{deck.promise}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[rgba(255,248,236,0.62)]">Showing: {categoryLabel}</p>
              </div>
            </div>
          </div>
        </section>

        {lead ? (
          <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-[1.18fr_.82fr]">
              <Link href={`${basePath}/${lead.slug}`} className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_54px_rgba(52,64,40,0.12)]">
                <div className="min-h-[24rem] bg-[var(--slot4-dark-bg)] p-6 text-[var(--slot4-dark-text)] sm:min-h-[32rem] sm:p-8">
                  <span className="rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-dark-bg)]">{getCategory(lead, label)}</span>
                  <h2 className="mt-8 max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-6xl">{lead.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">{getSummary(lead)}</p>
                </div>
              </Link>

              <div className="grid gap-6">
                <div className="rounded-[2rem] bg-[linear-gradient(180deg,#f7f0e3_0%,#eef2ea_100%)] p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Top stories</p>
                  <p className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--slot4-dark-bg)]">What the desk is watching right now.</p>
                </div>
                {side.slice(0, 2).map((post) => (
                  <HorizontalStoryCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} label={getCategory(post, label)} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[color:rgba(84,107,65,0.14)] pb-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">More from the desk</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[var(--slot4-dark-bg)]">Archive stream</h2>
                </div>
                <form action={basePath} className="flex overflow-hidden rounded-full border border-[color:rgba(84,107,65,0.16)] bg-white">
                  <select name="category" defaultValue={category} className="h-11 min-w-44 bg-transparent px-4 text-xs font-black uppercase outline-none">
                    <option value="all">All categories</option>
                    {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="h-11 bg-[var(--slot4-dark-bg)] px-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--slot4-dark-text)]">Filter</button>
                </form>
              </div>

              {posts.length ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {posts.map((post, index) => (
                    index % 4 === 0
                      ? <ImageFirstCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} label={getCategory(post, label)} />
                      : index % 4 === 1
                        ? <ArchiveMetaCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} task={task} />
                        : index % 4 === 2
                          ? <ArchiveTextCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} task={task} index={index} />
                          : <HorizontalStoryCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} label={getCategory(post, label)} showPlay={task === 'image'} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-[2rem] border border-dashed border-[color:rgba(84,107,65,0.18)] bg-white p-10 text-center">
                  <Search className="mx-auto h-8 w-8 text-[var(--slot4-accent)]" />
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">No posts found</h2>
                  <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Try another category or refresh this page after publishing new content.</p>
                </div>
              )}

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[color:rgba(84,107,65,0.18)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
                <span className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-[var(--slot4-dark-text)]">Page {page} of {pagination.totalPages || 1}</span>
                {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[color:rgba(84,107,65,0.18)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
              </div>
            </div>

            <aside className="space-y-8">
              <div className="rounded-[2rem] bg-white p-6 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Quick reads</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[var(--slot4-dark-bg)]">The briefing</h2>
                <div className="mt-4">
                  {sourceForList.slice(0, 6).map((post, index) => (
                    <CompactIndexCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-[linear-gradient(180deg,#f7f0e3_0%,#eef2ea_100%)] p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Curated picks</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[var(--slot4-dark-bg)]">Editor&apos;s short list</h2>
                <div className="mt-4">
                  {sourceForList.slice(0, 5).map((post, index) => (
                    <EditorialListStory key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />
                  ))}
                </div>
              </div>

              <form action="/search" className="luxury-wave-panel rounded-[2rem] p-6 text-[var(--slot4-dark-text)] shadow-[0_24px_60px_rgba(30,38,23,0.18)]">
                <p className="relative z-[1] text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent-soft)]">Search archive</p>
                <h2 className="relative z-[1] mt-3 text-4xl font-semibold tracking-[-0.06em]">Find what matters fast</h2>
                <p className="relative z-[1] mt-4 text-sm leading-7 text-[rgba(255,248,236,0.76)]">Use headlines, keywords, and categories to move through the full publishing archive.</p>
                <label className="relative z-[1] mt-6 flex overflow-hidden rounded-full bg-white">
                  <input name="q" placeholder="Search this archive" className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm text-[var(--slot4-page-text)] outline-none" />
                  <button className="bg-[var(--slot4-accent)] px-5 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-text)]">Search</button>
                </label>
              </form>
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchiveTextCard({ post, href, task, index }: { post: SitePost; href: string; task: TaskKey; index: number }) {
  return (
    <Link href={href} className="flex min-h-full flex-col rounded-[1.8rem] bg-[var(--slot4-dark-bg)] p-6 text-[var(--slot4-dark-text)] shadow-[0_20px_52px_rgba(30,38,23,0.2)]">
      <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-soft)]">
        <span>{getCategory(post, task)}</span>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[rgba(255,248,236,0.78)]">{getSummary(post)}</p>
      <span className="mt-auto pt-8 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-soft)]">Open story</span>
    </Link>
  )
}

function ArchiveMetaCard({ post, href, task }: { post: SitePost; href: string; task: TaskKey }) {
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} />
}

function ArticleArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[1.8rem] bg-white p-6 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 160)}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Read more <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const location = getField(post, ['location', 'address', 'city'])
  return (
    <Link href={href} className="group rounded-[1.8rem] bg-white p-6 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[rgba(153,173,122,0.16)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[color:rgba(84,107,65,0.16)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.05em] text-[var(--slot4-dark-bg)]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.8rem] bg-[var(--slot4-accent)] text-[var(--slot4-dark-text)] shadow-[0_18px_48px_rgba(52,64,40,0.18)]">
      <div className="p-6">
        <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">Classified</span>
        <h2 className="mt-8 text-4xl font-semibold leading-none tracking-[-0.07em]">{price || 'Open offer'}</h2>
        <p className="mt-3 text-sm font-semibold text-[rgba(255,248,236,0.82)]">{condition || 'Details inside'}</p>
      </div>
      <div className="bg-white p-6 text-[var(--slot4-page-text)]">
        <h3 className="text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return <ImageFirstCard post={post} href={href} label="Visual" />
}

function BookmarkArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group rounded-[1.8rem] bg-white p-6 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-[color:rgba(84,107,65,0.18)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Saved resource</span>
        <Bookmark className="h-5 w-5 text-[var(--slot4-accent)]" />
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[1.8rem] bg-white p-6 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--slot4-dark-bg)] p-5 text-[var(--slot4-dark-text)]"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[rgba(153,173,122,0.16)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</span>
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[1.8rem] bg-white p-6 text-center shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(153,173,122,0.16)] text-[var(--slot4-accent)]">
        <UserRound className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
