import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' || task === 'mediaDistribution' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' || task === 'mediaDistribution' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent-soft)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
  return (
    <section>
      <header className="luxury-wave-panel text-[var(--slot4-dark-text)]">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="relative z-[1]">
            <BackLink task={task} />
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-[rgba(255,248,236,0.7)]">
              <span className="rounded-full bg-white/10 px-4 py-2 text-[var(--slot4-accent-soft)]">{categoryOf(post, 'News')}</span>
              {published ? <time>{published}</time> : null}
            </div>
            <span className="luxury-kicker mt-8 block" />
            <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-[5.3rem]">{post.title}</h1>
            {summaryText(post) ? <p className="mt-6 max-w-4xl text-xl leading-9 text-[rgba(255,248,236,0.82)]">{summaryText(post)}</p> : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            {images[0] ? (
              <figure className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_52px_rgba(52,64,40,0.12)]">
                <img src={images[0]} alt="" className="max-h-[48rem] w-full object-cover" />
                <figcaption className="border-t border-[color:rgba(84,107,65,0.12)] px-5 py-4 text-sm text-[var(--slot4-muted-text)]">Featured image for {post.title}</figcaption>
              </figure>
            ) : null}

            <article className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_14px_36px_rgba(52,64,40,0.08)] sm:p-10">
              <BodyContent post={post} />
            </article>

            <EditableComments slug={post.slug} comments={comments} />
          </div>

          <aside className="space-y-6">
            <AboutPanel task={task} post={post} />
            <RelatedPanel task={task} related={related} />
          </aside>
        </div>
      </div>
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <article className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_52px_rgba(52,64,40,0.1)]">
          <div className="luxury-wave-panel px-6 py-10 text-[var(--slot4-dark-text)] sm:px-10">
            <div className="relative z-[1] grid gap-6 sm:grid-cols-[150px_1fr] sm:items-center">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-white/12">
                {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14" />}
              </div>
              <div>
                <BackLink task="listing" />
                <h1 className="mt-6 text-4xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-6xl">{post.title}</h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[rgba(255,248,236,0.8)]">{summaryText(post)}</p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-10">
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Business showcase" />
          </div>
        </article>

        <aside className="space-y-6">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" related={related} />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="luxury-wave-panel rounded-[2rem] p-7 text-[var(--slot4-dark-text)] shadow-[0_24px_60px_rgba(30,38,23,0.2)] lg:sticky lg:top-24 lg:self-start">
          <div className="relative z-[1]">
            <BackLink task="classified" />
            <p className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">Classified notice</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[0.96] tracking-[-0.06em]">{post.title}</h1>
            <div className="mt-8 grid gap-3">
              {price ? <BadgeLine label="Price" value={price} /> : null}
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-dark-bg)]">Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/15 px-5 py-3 text-sm font-black">Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="rounded-[2rem] bg-white p-6 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-10">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" related={related} />
        </article>
      </div>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] bg-white p-7 shadow-[0_14px_36px_rgba(52,64,40,0.08)] lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slot4-dark-text)]"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="mt-6 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[var(--slot4-dark-bg)]">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] bg-white shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
              <img src={image} alt="" className="w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm text-[var(--slot4-muted-text)]">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-8"><RelatedPanel task="image" related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[2rem] bg-white p-7 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-10">
          <BackLink task="sbm" />
          <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]"><Bookmark className="h-9 w-9" /></div>
          <h1 className="mt-7 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-[var(--slot4-dark-text)]">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" related={related} />
      </div>
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[2rem] bg-white p-6 shadow-[0_20px_52px_rgba(52,64,40,0.1)] sm:p-10">
          <BackLink task="pdf" />
          <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]"><FileText className="h-12 w-12" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">PDF resource</p>
              <h1 className="mt-3 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-[color:rgba(84,107,65,0.14)] bg-[var(--slot4-page-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-[color:rgba(84,107,65,0.14)] bg-white p-4">
                <span className="text-sm font-black">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-xs font-black text-[var(--slot4-dark-text)]">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" related={related} />
      </div>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_52px_rgba(52,64,40,0.1)] lg:sticky lg:top-24 lg:self-start">
          <BackLink task="profile" />
          <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[rgba(153,173,122,0.16)]">
            {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 text-[var(--slot4-accent)]" />}
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[0.96] tracking-[-0.06em]">{post.title}</h1>
          {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{role}</p> : null}
          <ContactAction website={website} email={email} />
        </aside>
        <article className="rounded-[2rem] bg-white p-7 shadow-[0_14px_36px_rgba(52,64,40,0.08)] sm:p-10">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" related={related} />
        </article>
      </div>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] bg-[linear-gradient(180deg,#f7f0e3_0%,#eef2ea_100%)] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-semibold leading-6 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black text-[var(--slot4-page-text)]"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-sm font-black text-[var(--slot4-dark-text)]">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(84,107,65,0.18)] px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(84,107,65,0.18)] px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-white/12 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] opacity-70">{label}</span><span className="font-black">{value}</span></div>
}

function AboutPanel({ task, post }: { task: TaskKey; post: SitePost }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">About this post</p>
      <div className="mt-4 grid gap-3 text-sm text-[var(--slot4-muted-text)]">
        <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
        <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
        {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
      </div>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  if (!related.length) return null
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-[-0.04em] text-[var(--slot4-dark-bg)]">More like this</h2>
        <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">View all</Link>
      </div>
      <div className="mt-5 grid gap-3">
        {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
      </div>
    </div>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group border-t border-[color:rgba(84,107,65,0.12)] py-3 first:border-t-0">
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-semibold leading-tight tracking-[-0.03em] text-[var(--slot4-dark-bg)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <div className="flex items-center gap-2 text-lg font-semibold text-[var(--slot4-dark-bg)]"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.2rem] bg-[linear-gradient(180deg,#f7f0e3_0%,#eef2ea_100%)] p-4">
            <p className="text-sm font-black text-[var(--slot4-dark-bg)]">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
