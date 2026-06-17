import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  CapabilityCard,
  CompactIndexCard,
  EditorialListStory,
  getEditableExcerpt,
  HorizontalStoryCard,
  ImageFirstCard,
  postHref,
  RailPostCard,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const side = posts.slice(1, 5)
  const heroTitle = pagesContent.home.hero.title.join(' ') || `${SITE_CONFIG.name}: independent stories, culture, and perspective.`

  return (
    <section className="luxury-wave-panel text-[var(--slot4-dark-text)]">
      <div className={`${dc.shell.section} relative py-14 sm:py-20 lg:py-24`}>
        <div className="relative z-[1]">
          <div className="mx-auto max-w-[62rem] text-center">
            <span className="luxury-kicker" />
            <h1 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-[5.5rem]">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-[rgba(255,248,236,0.82)] sm:text-xl">
              Share timely updates, strengthen visibility, and keep every announcement presentation-ready through a polished distribution experience.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="luxury-arrow-button bg-[var(--slot4-accent)] text-[var(--slot4-dark-text)]">
                <span>Send a release</span>
                <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
              </Link>
              <Link href="/about" className="luxury-arrow-button border border-white/14 bg-white text-[var(--slot4-dark-bg)]">
                <span>Learn more</span>
                <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
              </Link>
            </div>
          </div>

          {lead ? (
            <div className="mt-20 grid items-end gap-6 lg:grid-cols-[.55fr_.9fr_.55fr]">
              <div className="grid gap-6 lg:pb-8">
                {side.slice(0, 2).map((post) => (
                  <ImageFirstCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} label="Spotlight" />
                ))}
              </div>

              <Link href={postHref(primaryTask, lead, primaryRoute)} className="group overflow-hidden rounded-[1.8rem] border-[10px] border-white bg-black shadow-[0_30px_90px_rgba(16,20,14,0.35)]">
                <div className="flex min-h-[30rem] flex-col justify-end p-5 sm:p-8">
                  <span className="rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">Featured coverage</span>
                  <h2 className="mt-5 text-3xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl">{lead.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82">{getEditableExcerpt(lead, 160)}</p>
                </div>
              </Link>

              <div className="grid gap-6 lg:pb-8">
                {side.slice(2, 4).map((post) => (
                  <ImageFirstCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} label="Watchlist" />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 8)
  const center = railPosts[2] || railPosts[0]
  if (!railPosts.length || !center) return null

  return (
    <section className="bg-[linear-gradient(180deg,#f4efe4_0%,#eef2ea_100%)]">
      <div className={`${dc.shell.section} py-10 sm:py-14 lg:py-16`}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Latest news</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[var(--slot4-dark-bg)]">Featured coverage</h2>
          </div>
          <Link href="/search" className="luxury-arrow-button hidden border border-[color:rgba(84,107,65,0.28)] bg-white text-[var(--slot4-accent)] sm:inline-flex">
            <span>See all news</span>
            <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr_.85fr]">
          <div className="grid gap-6 lg:pt-10">
            {railPosts.slice(0, 2).map((post, index) => (
              <HorizontalStoryCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} label={index === 0 ? 'Distribution' : 'Coverage'} />
            ))}
          </div>
          <div>
            <Link href={postHref(primaryTask, center, primaryRoute)} className="group block overflow-hidden rounded-[1.8rem] bg-white shadow-[0_22px_52px_rgba(52,64,40,0.14)]">
              <div className="p-6 sm:p-8">
                <p className="text-sm text-[var(--slot4-soft-muted-text)]">{new Date(center.publishedAt || Date.now()).toLocaleDateString('en-US')}</p>
                <h3 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[var(--slot4-accent)] sm:text-4xl">{center.title}</h3>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(center, 140)}</p>
              </div>
            </Link>
          </div>
          <div className="grid gap-6 lg:pt-10">
            {railPosts.slice(2, 4).map((post, index) => (
              <HorizontalStoryCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} label={index === 0 ? 'Featured video' : 'Brand update'} showPlay={index === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[4] || posts[0]
  const cards = [
    {
      title: 'Reach the right readers',
      description: 'Place distribution updates in front of audiences that care about industry moves, launches, and market changes.',
      href: '/search',
    },
    {
      title: 'Show and tell your news',
      description: 'Pair headlines with imagery, media assets, and supporting context so each announcement lands with more clarity.',
      href: '/search',
    },
    {
      title: 'Deliver trusted updates',
      description: 'Present business announcements with a polished, public-facing reading experience that feels credible at first glance.',
      href: '/search',
    },
    {
      title: 'Measure momentum',
      description: 'Build a cleaner path from publication to follow-up with searchable archives and structured post detail pages.',
      href: '/search',
    },
  ]
  if (!feature) return null

  return (
    <section className="bg-[var(--slot4-accent)] text-[var(--slot4-dark-text)]">
      <div className={`${dc.shell.section} py-16 sm:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[1fr_.95fr] lg:items-start">
          <div>
            <span className="luxury-kicker" />
            <h2 className="mt-8 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl">Turn your news into headlines</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[rgba(255,248,236,0.84)]">
            Earn more coverage and extend the reach of every public update with a publishing environment designed for strong presentation, clear reading, and continuous discovery.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {cards.map((card) => <CapabilityCard key={card.title} title={card.title} description={card.description} href={card.href} />)}
        </div>

        <div className="mt-12">
          <Link href={postHref(primaryTask, feature, primaryRoute)} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(255,248,236,0.08)]">
            <div className="p-8 sm:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[rgba(255,248,236,0.7)]">Editor&apos;s selection</p>
              <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">{feature.title}</h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[rgba(255,248,236,0.78)]">{getEditableExcerpt(feature, 180)}</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts.slice(5)
  const testimonials = [
    'The archive stays organized and readable, which makes each release feel more credible the moment it lands.',
    'Publishing and follow-up feel smoother when the story pages, media, and related assets are all connected.',
    'The presentation has the confidence of a premium newsroom while still keeping discovery fast.',
  ]
  const brands = ['Disney', 'Pfizer', 'Coca-Cola', 'Comcast', 'JPMorgan Chase']
  const solutions = [
    { label: 'PR & Corporate Communications', href: 'search' },
    { label: 'IR Professionals', href: '/search' },
    { label: 'Agencies', href: '/search' },
    { label: 'Public Companies', href: '/search' },
    { label: 'Industry-Specific Solutions', href: 'search' },
  ]

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} py-14 sm:py-16 lg:py-20`}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="luxury-kicker" />
            <h2 className="mt-8 text-4xl font-semibold tracking-[-0.06em] text-[var(--slot4-accent)] sm:text-5xl">Deliver your news with confidence</h2>
          </div>
          
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {testimonials.map((quote, index) => (
            <div key={quote} className="luxury-card rounded-[1.8rem] p-8">
              <p className="text-2xl font-semibold leading-10 tracking-[-0.04em] text-[var(--slot4-accent)]">&quot;{quote}&quot;</p>
              <p className="mt-6 text-sm font-semibold text-[var(--slot4-muted-text)]">
                {['Publishing lead', 'Communications director', 'Media strategy team'][index]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--slot4-accent)]">Trusted by top brands</p>
          <div className="mt-8 grid gap-6 text-3xl font-semibold tracking-[-0.05em] text-[rgba(41,48,31,0.75)] sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => <div key={brand}>{brand}</div>)}
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_.95fr] lg:items-start">
          <div>
            <span className="luxury-kicker" />
            <h2 className="mt-8 text-4xl font-semibold leading-[0.95] tracking-[-0.06em] text-[var(--slot4-accent)] sm:text-6xl">Get results with the solutions you need</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
              Browse structured lanes for publishers, agencies, public companies, and visual storytellers while keeping the same connected archive underneath.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((item) => (
                <Link key={item.label} href={item.href} className="group text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[rgba(153,173,122,0.18)] text-[var(--slot4-accent)]">
                    <div className="h-10 w-10 rounded-[1rem] border-2 border-current" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.04em] text-[var(--slot4-accent)] group-hover:text-[var(--slot4-dark-bg)]">{item.label}</h3>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_48px_rgba(52,64,40,0.08)]">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Journalist & media tools</p>
            <h3 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-[var(--slot4-accent)]">Discover your next story</h3>
            <p className="mt-4 text-base leading-8 text-[var(--slot4-muted-text)]">
              Customize the archive with saved searches, filtered categories, and integrated media-rich posts that make discovery feel intentional instead of noisy.
            </p>

            <div className="mt-8 rounded-[1.8rem] bg-[linear-gradient(180deg,#f7f0e3_0%,#eef2ea_100%)] p-4">
              <div className="overflow-hidden rounded-[1.4rem] border border-[color:rgba(84,107,65,0.14)] bg-white">
                <div className="grid grid-cols-[180px_1fr]">
                  <div className="border-r border-[color:rgba(84,107,65,0.12)] bg-[rgba(153,173,122,0.1)] p-4">
                    <div className="grid gap-3 text-xs font-semibold text-[var(--slot4-muted-text)]">
                      <span>Saved searches</span>
                      <span>Keyword search</span>
                      <span>Language</span>
                      <span>Industry</span>
                      <span>Region</span>
                    </div>
                  </div>
                  <div className="p-4">
                    {(source.length ? source : posts.slice(0, 3)).slice(0, 3).map((post, index) => (
                      <EditorialListStory key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/search" className="luxury-arrow-button mt-8 border border-[color:rgba(84,107,65,0.28)] bg-white text-[var(--slot4-accent)]">
              <span>Learn more</span>
              <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            </div>

          <div>
            <div className="border-b border-[color:rgba(84,107,65,0.14)] pb-4">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Search archive</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[var(--slot4-dark-bg)]">Find every {taskLabel(primaryTask).toLowerCase()}</h2>
            </div>
            <form action="/search" className="mt-6 overflow-hidden rounded-[2rem] bg-[var(--slot4-dark-bg)] p-6 text-[var(--slot4-dark-text)] shadow-[0_24px_60px_rgba(30,38,23,0.2)]">
              <p className="max-w-xl text-base leading-8 text-[rgba(255,248,236,0.78)]">
                Search headlines, categories, companies, and supporting media without leaving the current experience.
              </p>
              <label className="mt-6 flex overflow-hidden rounded-full bg-white">
                <Search className="ml-5 mt-4 h-5 w-5 text-[var(--slot4-accent)]" />
                <input name="q" placeholder="Search stories" className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-[var(--slot4-page-text)] outline-none" />
                <button className="bg-[var(--slot4-accent)] px-5 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-text)]">Search</button>
              </label>
              <div className={`${dc.layout.rail} mt-7`}>
                {(posts.slice(0, 5)).map((post, index) => <RailPostCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-page-bg)] pb-16 sm:pb-20">
      <div className={`${dc.shell.section}`}>
        <div className="luxury-wave-panel rounded-[2rem] px-6 py-12 text-[var(--slot4-dark-text)] sm:px-10 lg:grid lg:grid-cols-[1fr_.85fr] lg:items-center lg:px-16 lg:py-16">
          <div className="relative z-[1]">
            <span className="luxury-kicker" />
            <h2 className="mt-8 max-w-xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-6xl">
              The stories shaping what comes next
            </h2>
          </div>
          <div className="relative z-[1] mt-8 lg:mt-0">
            <p className="max-w-xl text-lg leading-8 text-[rgba(255,248,236,0.8)]">
              Fresh releases, brand announcements, media updates, and public information live together in one refined publication system.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="luxury-arrow-button bg-white text-[var(--slot4-dark-bg)]">
                <span>Talk to us</span>
                <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
              </Link>
              <Link href="/signup" className="luxury-arrow-button border border-white/12 bg-white/8 text-white">
                <span>Join the readership</span>
                <span className="bg-[var(--slot4-accent-soft)] text-[var(--slot4-dark-bg)]"><ArrowRight className="h-5 w-5" /></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
