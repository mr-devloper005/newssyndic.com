import Link from 'next/link'
import { ArrowRight, Clock3, FileText, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  return ''
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Latest'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Cover story' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block min-w-0 overflow-hidden rounded-[2rem] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)] shadow-[0_22px_60px_rgba(30,38,23,0.24)]">
      <div className="relative aspect-[16/10] min-h-[430px] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,18,0.02),rgba(20,24,18,0.9))]" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
          <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--slot4-dark-bg)]">{label}</span>
          <h3 className="mt-5 max-w-4xl text-4xl font-semibold leading-[.94] tracking-[-.055em] sm:text-6xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[rgba(255,248,236,0.82)] sm:text-base">{getEditableExcerpt(post, 190)}</p>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden rounded-[1.8rem] bg-[var(--slot4-surface-bg)] ${dc.motion.lift} luxury-card`}>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[.18em] text-[var(--slot4-accent)]">
          <span>{getEditableCategory(post)}</span><span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="mt-3 line-clamp-3 text-xl font-semibold leading-[1.04] tracking-[-.04em] text-black">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 grid-cols-[46px_1fr] gap-4 border-t border-[color:rgba(84,107,65,0.14)] py-5 first:border-t-0">
      <span className="text-3xl font-semibold leading-none text-[var(--slot4-accent)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--slot4-soft-muted-text)]"><Clock3 className="h-3 w-3" /> {getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-tight tracking-[-.03em] group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group min-w-0 overflow-hidden rounded-[2rem] border border-[color:rgba(84,107,65,0.14)] bg-white py-0 shadow-[0_14px_36px_rgba(52,64,40,0.08)]">
      <div className="min-w-0 p-5 sm:p-6">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}</p>
        <h2 className="mt-3 line-clamp-3 text-3xl font-semibold leading-[1.02] tracking-[-.05em] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em]">Read story <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export function ImageFirstCard({ post, href, label }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.8rem] bg-white shadow-[0_14px_36px_rgba(52,64,40,0.09)]">
      <div className="p-5">
        {label ? <span className="rounded-full bg-[rgba(153,173,122,0.16)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{label}</span> : null}
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</p>
        <h3 className="mt-3 line-clamp-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-black">{post.title}</h3>
        <p className="mt-3 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}

export function HorizontalStoryCard({ post, href, label, showPlay = false }: { post: SitePost; href: string; label?: string; showPlay?: boolean }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.8rem] bg-white shadow-[0_14px_36px_rgba(52,64,40,0.09)]">
      <div className="flex flex-col justify-end p-5 sm:p-6">
        {showPlay ? <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(153,173,122,0.16)] text-[var(--slot4-accent)]"><FileText className="h-5 w-5" /></span> : null}
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">{label || getEditableCategory(post)}</p>
        <h3 className="mt-3 line-clamp-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-black">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

export function EditorialListStory({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid items-start gap-4 border-t border-[color:rgba(84,107,65,0.14)] py-5 sm:grid-cols-[72px_1fr]">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">0{index + 1}</span>
      <div>
        <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-[-0.04em] text-black group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 100)}</p>
      </div>
    </Link>
  )
}

export function CapabilityCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="group luxury-card rounded-[1.8rem] p-8 transition duration-300 hover:-translate-y-1">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(153,173,122,0.18)] text-[var(--slot4-accent)]">
        <Sparkles className="h-10 w-10" />
      </div>
      <h3 className="mt-7 text-2xl font-semibold leading-tight tracking-[-0.04em] text-[var(--slot4-dark-bg)]">{title}</h3>
      <p className="mt-4 text-base leading-8 text-[var(--slot4-muted-text)]">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-accent)]">Learn more <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}
