import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  ChevronRight,
  Database,
  Globe2,
  LayoutGrid,
  Mail,
  Menu,
  MessageSquareText,
  Search,
  Sparkles,
  Zap,
  X,
} from 'lucide-react'
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import horizontalLogo from '../imports/Horizontal_Logo.png'
import verticalLogo from '../imports/Vertical_Logo.png'
import bannerImage from '../imports/Web_Header_Banner.png'

type CardProps = {
  title: string
  description: string
  icon: ReactNode
  eyebrow?: string
}

type JobProps = {
  title: string
  company: string
  location: string
  tags: string[]
  status: string
  note: string
}

const navItems = [
  { label: '홈', href: '#top' },
  { label: '서비스', href: '#services' },
  { label: 'AI 구조', href: '#ai-ops' },
  { label: '채용 예시', href: '#jobs' },
  { label: '배포 플랜', href: '#roadmap' },
]

const stats = [
  { label: '초기 운영비', value: '0원' },
  { label: '우선 제작 범위', value: '홈페이지 1개' },
  { label: '다음 확장', value: '채용 공고 자동화' },
  { label: '운영 방식', value: 'AI + 최소 수작업' },
]

const serviceCards: CardProps[] = [
  {
    eyebrow: '브랜드',
    title: '로고 중심의 첫인상',
    description: '상단 히어로, 고정 내비게이션, 명확한 CTA, 하단 푸터까지 브랜드를 한 번에 인지할 수 있게 구성한다.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    eyebrow: '채용 허브',
    title: '나중에 채용 공고를 붙이기 쉬운 구조',
    description: '게시물 카드, 필터, 검색, 정렬을 미리 넣어두면 데이터만 연결했을 때 바로 공고 페이지로 전환할 수 있다.',
    icon: <BriefcaseBusiness className="h-5 w-5" />,
  },
  {
    eyebrow: '유지보수',
    title: '한 곳만 수정하면 되는 구조',
    description: '문구, 카드, 버튼, FAQ, 연락처는 모두 상단의 데이터 배열만 바꾸면 전체 사이트가 같이 바뀌도록 설계한다.',
    icon: <Database className="h-5 w-5" />,
  },
  {
    eyebrow: 'AI 운영',
    title: '글 생성과 요약 자동화',
    description: 'GPT, Claude, Gemini는 초안 생성과 정리에 쓰고, 최종 게시 전에는 사람이 한 번만 검수하도록 둔다.',
    icon: <Bot className="h-5 w-5" />,
  },
]

const opsCards = [
  {
    title: '수집 에이전트',
    description: '채용 페이지, 공고 RSS, 수동 입력 폼에서 데이터를 받는다.',
    icon: <Globe2 className="h-5 w-5" />,
  },
  {
    title: '정리 에이전트',
    description: '중복 제거, 국가/직무 분류, 요약, 핵심 키워드 추출을 담당한다.',
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    title: '작성 에이전트',
    description: 'AI가 공고 소개문, 뉴스레터 문구, 카드용 한 줄 요약을 만든다.',
    icon: <MessageSquareText className="h-5 w-5" />,
  },
  {
    title: '발행 에이전트',
    description: '검수 후 홈페이지와 게시물 목록에 반영한다.',
    icon: <Bell className="h-5 w-5" />,
  },
]

const roadmap = [
  {
    step: '01',
    title: '브랜드 랜딩 완성',
    description: '메인 히어로, 소개, 서비스, FAQ, 문의 영역까지 먼저 완성한다.',
  },
  {
    step: '02',
    title: '공고 카드 연결',
    description: 'Notion 또는 간단한 JSON 데이터로 채용 카드만 먼저 연결한다.',
  },
  {
    step: '03',
    title: 'AI 초안 자동화',
    description: '새 공고가 들어오면 AI가 제목, 요약, 태그를 자동 생성한다.',
  },
  {
    step: '04',
    title: '운영자 대시보드',
    description: '승인, 예약 발행, 수정 이력, 클릭 추적까지 한 화면에서 본다.',
  },
]

const sampleJobs: JobProps[] = [
  {
    title: 'Technical Operation Manager',
    company: 'Polestar Korea',
    location: 'Seoul · Hybrid',
    tags: ['Automotive', 'Technical SME', 'Operations'],
    status: '예시 공고',
    note: '카드와 필터 구조가 실제 공고 데이터로 바뀌면 바로 사용하는 영역이다.',
  },
  {
    title: 'Software Verification Engineer',
    company: 'Global Mobility Team',
    location: 'Pangyo · On-site',
    tags: ['Verification', 'Automotive', 'Embedded'],
    status: '예시 공고',
    note: '검색, 정렬, 분야 태그를 붙이면 실제 채용 허브로 전환하기 쉽다.',
  },
  {
    title: 'AI Content Ops Associate',
    company: 'HiSponsor',
    location: 'Remote',
    tags: ['AI Ops', 'Content', 'Automation'],
    status: '내부 포지션',
    note: '1인 운영 시 가장 먼저 필요한 역할을 설명하는 샘플 영역이다.',
  },
]

const faqItems = [
  {
    q: '코딩을 몰라도 유지할 수 있나?',
    a: '가능하다. 문구, 카드, 버튼, FAQ는 상단 배열만 수정하면 되고, 디자인은 Tailwind 클래스만 건드리면 된다.',
  },
  {
    q: 'AI는 어디에 붙이는 것이 좋은가?',
    a: '공고 요약, 카드 문구, 뉴스레터 초안, 태그 추천, 검색어 제안에 붙이는 것이 가장 효율적이다.',
  },
  {
    q: '무료 플랜으로 시작 가능한가?',
    a: '가능하다. 초기에는 수동 입력과 무료 AI 플랜으로 운영하고, 트래픽이 생기면 자동화만 확장한다.',
  },
]

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-[0.22em] text-sky-600 uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{description}</p>
    </div>
  )
}

function ServiceCard({ title, description, icon, eyebrow }: CardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700">{icon}</div>
      {eyebrow ? <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{eyebrow}</p> : null}
      <h3 className="mt-2 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  )
}

function JobCard({ title, company, location, tags, status, note }: JobProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:bg-white hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{status}</div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{company} · {location}</p>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 text-slate-400" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">{tag}</span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{note}</p>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [query, setQuery] = useState('')

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sampleJobs
    return sampleJobs.filter((job) =>
      [job.title, job.company, job.location, job.status, ...job.tags, job.note].some((value) =>
        value.toLowerCase().includes(q),
      ),
    )
  }, [query])

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.alert('이 영역은 배포 후 이메일 수집 도구로 연결하면 된다.')
    setEmail('')
  }

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src={horizontalLogo} alt="HiSponsor" className="hidden h-9 w-auto sm:block" />
            <img src={verticalLogo} alt="HiSponsor" className="h-10 w-auto sm:hidden" />
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="#newsletter" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              대기자 등록
            </a>
            <a href="#contact" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
              문의하기
            </a>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="메뉴 열기"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_25%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
                <BadgeCheck className="h-4 w-4" /> 0원에서 시작하는 AI 채용 허브
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                홈페이지부터 먼저 만들고, 그 다음 채용 공고를 붙이는 구조
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                처음에는 브랜드를 보여주는 랜딩 페이지로 시작하고, 나중에는 채용 공고 수집·정리·발행까지 이어지는 운영 체계로 확장한다. 코딩을 몰라도 수정하기 쉽고, AI를 붙이기 쉬운 형태로 설계했다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                  구조 보기 <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#ai-ops" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                  AI 구조 보기 <Sparkles className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-sky-200/40 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-slate-900/10 blur-3xl" />
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
                <img src={bannerImage} alt="HiSponsor banner" className="h-56 w-full object-cover object-center" />
                <div className="p-6 sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Homepage Preview</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">배포 전에 이미 사용 가능한 첫 화면</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    로고, 배너, 설명, 검색창, CTA, 뉴스레터, FAQ까지 들어간 상태를 기준으로 시작한다. 여기에 데이터만 붙이면 공고 허브로 확장된다.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">브랜드</p>
                      <p className="mt-1 text-slate-600">로고 중심 구조</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">운영</p>
                      <p className="mt-1 text-slate-600">데이터 배열만 수정</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">AI</p>
                      <p className="mt-1 text-slate-600">요약·태그·초안</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">확장</p>
                      <p className="mt-1 text-slate-600">채용 데이터 연결</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <SectionTitle
            eyebrow="서비스 구조"
            title="처음 배포할 때 넣어야 하는 핵심 화면"
            description="최소한의 화면이 아니라, 실제로 사람들이 들어와도 이해할 수 있는 구조로 만든다. 이후 기능을 붙일 때도 페이지 전체를 갈아엎지 않아도 되게 설계한다."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {serviceCards.map((card) => (
              <ServiceCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section id="ai-ops" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionTitle
                eyebrow="AI 운영 구조"
                title="1인 기업처럼 돌아가게 만드는 역할 분리"
                description="AI를 한 덩어리로 쓰지 말고, 수집·정리·작성·발행으로 나눠두면 유지보수와 검수가 쉬워진다."
              />
              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-50 p-3 text-sky-700"><Zap className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">연결 원칙</p>
                    <p className="text-sm text-slate-600">무료 플랜은 초안과 보조 작업에 우선 사용한다.</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />GPT: 요약, 구조화, 글 초안</li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />Claude: 긴 글 정리, 정책 문서, 세부 문구</li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />Gemini: 검색 보조, 비교, 빠른 리서치</li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />Notion: 원본 데이터 저장소</li>
                </ul>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {opsCards.map((card) => (
                <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700">{card.icon}</div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="jobs" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <SectionTitle
            eyebrow="채용 예시"
            title="실제 공고가 들어오면 바로 바뀌는 카드 영역"
            description="지금은 예시 카드지만, 실제 공고 데이터가 들어오면 회사명, 위치, 태그, 상태만 교체하면 된다."
          />
          <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="직무, 회사, 위치, 태그로 검색"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>
            <div className="text-sm text-slate-500">검색 결과: <span className="font-semibold text-slate-900">{filteredJobs.length}</span>건</div>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={`${job.company}-${job.title}`} {...job} />
            ))}
          </div>
        </section>

        <section id="roadmap" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <SectionTitle
            eyebrow="배포 로드맵"
            title="지금 당장 만들 순서"
            description="완성도를 먼저 쌓고, 그 다음 자동화를 붙이는 방식이 가장 안정적이다."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-4">
            {roadmap.map((item) => (
              <div key={item.step} className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
                <div className="text-sm font-semibold tracking-[0.2em] text-sky-300">STEP {item.step}</div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="newsletter" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-slate-950 p-8 text-white sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Launch checklist</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">배포 전에 채워야 하는 정보</h2>
                <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                  <p className="flex gap-3"><CalendarClock className="mt-1 h-4 w-4 flex-shrink-0 text-sky-300" />도메인 연결 후 사이트 제목과 메타 설명만 먼저 확정한다.</p>
                  <p className="flex gap-3"><Mail className="mt-1 h-4 w-4 flex-shrink-0 text-sky-300" />뉴스레터 메일 수집 도구를 연결한다.</p>
                  <p className="flex gap-3"><BarChart3 className="mt-1 h-4 w-4 flex-shrink-0 text-sky-300" />클릭 추적과 전환 이벤트를 붙인다.</p>
                </div>
              </div>
              <div className="p-8 sm:p-10">
                <h3 className="text-2xl font-semibold text-slate-900">대기자 등록 영역</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  지금은 데모 폼이다. 나중에 이메일 서비스, CRM, Notion, 자동화 도구 중 하나에 연결하면 된다.
                </p>
                <form className="mt-6 space-y-4" onSubmit={handleSubscribe}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">이메일</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                  </label>
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                    등록하기 <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  비워둘 필드: 주소, 회사 소개, 상세 설명은 초기 버전에서 생략하고, 배포 후 필요한 만큼만 추가한다.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <SectionTitle
            eyebrow="FAQ"
            title="초기 운영에서 자주 막히는 부분"
            description="미리 답을 박아두면 수정 요청이 들어와도 빠르게 대응할 수 있다."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-slate-900 px-6 py-10 text-white shadow-2xl sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Ready to deploy</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">이 상태에서 바로 다음 단계로 넘어갈 수 있다</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  지금 구조는 홈페이지, 채용 허브, AI 운영, 뉴스레터, FAQ까지 한 번에 들어간 베이스다. 여기서 회사명, 문구, 공고 데이터만 바꾸면 실제 서비스용으로 발전시킬 수 있다.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href="#top" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                  맨 위로 이동 <ChevronRight className="h-4 w-4" />
                </a>
                <a href="#newsletter" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  대기자 등록 <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <img src={horizontalLogo} alt="HiSponsor" className="h-9 w-auto" />
              <p className="mt-4 text-sm leading-7 text-slate-600">
                HiSponsor는 채용 공고를 수집하고, AI로 정리하고, 브랜드 중심으로 보여주는 구조를 만드는 출발점이다.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">탐색</p>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                  <a href="#services">서비스</a>
                  <a href="#ai-ops">AI 구조</a>
                  <a href="#jobs">채용 예시</a>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">운영</p>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                  <a href="#roadmap">배포 로드맵</a>
                  <a href="#newsletter">대기자 등록</a>
                  <a href="#faq">FAQ</a>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">기본값</p>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                  <span>홈페이지 우선</span>
                  <span>채용 공고 후속</span>
                  <span>무료 AI 활용</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
            © 2026 HiSponsor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
