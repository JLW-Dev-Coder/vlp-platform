import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Avatars',
  description:
    'Browse the Tax Avatar Pro avatar roster. Choose the AI host that fits your tax practice — six options, each with their own delivery style and look variety.',
}

type Avatar = {
  code: string
  name: string
  looks: number
  specialty: string
  color: string
  videoUrl: string
  looksImageUrl: string
  bio: string
  bestFor: string
  voice: string
}

const R2 = 'https://api.virtuallaunch.pro/tavlp'

const AVATARS: Avatar[] = [
  {
    code: 'A001',
    name: 'Annie',
    looks: 57,
    specialty: 'All Channel Types',
    color: '#ec4899',
    videoUrl: `${R2}/videos/A001-annie-intro.mp4`,
    looksImageUrl: `${R2}/avatars/A001-annie-looks.png`,
    bio: "Annie spent a decade in financial communications before pivoting to client education. She can explain a 1040-X amendment in plain English and make it feel like a conversation, not a lecture. With 57 looks — more than any other avatar in the lineup — she adapts to any firm's aesthetic. Boardroom presentations one week, approachable explainers the next.",
    bestFor: 'Firms that publish frequently and want visual variety across videos.',
    voice: 'Clear, warm, mid-paced. Authoritative without being stiff.',
  },
  {
    code: 'V002',
    name: 'Tariq',
    looks: 14,
    specialty: 'Transcript Codes',
    color: '#10b981',
    videoUrl: `${R2}/videos/V002-tariq-intro.mp4`,
    looksImageUrl: `${R2}/avatars/V002-tariq-looks.png`,
    bio: "Tariq brings a calm, methodical delivery that works perfectly for technical IRS content. He walks through transcript codes step by step without rushing. Taxpayers watching at midnight with a letter from the IRS don't need energy — they need clarity. Tariq delivers that.",
    bestFor: 'IRS transcript code channels. Technical content where credibility and calm authority matter.',
    voice: "Measured, confident, deliberate. The voice you'd want explaining your tax situation.",
  },
  {
    code: 'V003',
    name: 'Genesis',
    looks: 12,
    specialty: 'Penalty Abatement',
    color: '#f97316',
    videoUrl: `${R2}/videos/V003-genesis-intro.mp4`,
    looksImageUrl: `${R2}/avatars/V003-genesis-looks.png`,
    bio: "Genesis has a natural warmth that cuts through the anxiety taxpayers feel when searching for penalty help. She doesn't talk at viewers — she talks with them. Her delivery makes complex legal concepts like the Kwong ruling feel accessible, not intimidating.",
    bestFor: 'Form 843 and penalty abatement channels. Content that needs to feel reassuring, not clinical.',
    voice: 'Warm, empathetic, conversational. Makes the IRS less scary.',
  },
  {
    code: 'A004',
    name: 'Knox',
    looks: 25,
    specialty: 'Tax Education',
    color: '#3b82f6',
    videoUrl: `${R2}/videos/A004-knox-intro.mp4`,
    looksImageUrl: `${R2}/avatars/A004-knox-looks.png`,
    bio: "Knox has the energy of someone who actually enjoys explaining how things work. He's the avatar for channels that lean into education — tax tools walkthroughs, form breakdowns, deadline explainers. Engaging without being over-the-top.",
    bestFor: 'Tax Tools and games channels. Educational content where engagement matters as much as accuracy.',
    voice: 'Engaging, clear, slightly upbeat. Makes learning feel like progress.',
  },
  {
    code: 'V005',
    name: 'Denyse',
    looks: 33,
    specialty: 'All Channel Types',
    color: '#ec4899',
    videoUrl: `${R2}/videos/V005-denyse-intro.mp4`,
    looksImageUrl: `${R2}/avatars/V005-denyse-looks.png`,
    bio: 'Denyse combines professional polish with natural approachability. With 33 looks — the second-highest in the lineup — she gives your channel the visual diversity that keeps thumbnails fresh and viewers clicking. Works across all three channel types.',
    bestFor: 'Firms planning to scale content across multiple IRS topics. Her look variety prevents visual fatigue.',
    voice: 'Polished, direct, professional. Adapts to the content without overpowering it.',
  },
  {
    code: 'A006',
    name: 'Griffin',
    looks: 20,
    specialty: 'Authority & Trust',
    color: '#10b981',
    videoUrl: `${R2}/videos/A006-griffin-intro.mp4`,
    looksImageUrl: `${R2}/avatars/A006-griffin-looks.png`,
    bio: "Griffin reads as someone who's been in the room. His looks range from suited-up cityscape backgrounds to relaxed professional settings, giving your channel a premium, established feel from day one. The kind of presence that makes a viewer trust within the first three seconds.",
    bestFor: 'Established firms wanting their channel to match existing brand authority.',
    voice: 'Authoritative, steady, trustworthy. The voice of experience.',
  },
]

export default function AvatarsPage() {
  return (
    <div className="bg-[#020617] text-[#f1f5f9]">
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
        <p className="text-[0.625rem] uppercase tracking-[0.25em] font-semibold text-[#ec4899] mb-4">
          Six avatars · One job: bring you leads
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          Choose your{' '}
          <span className="bg-gradient-to-br from-[#ec4899] via-[#f472b6] to-[#fb923c] bg-clip-text text-transparent">
            avatar
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
          Each avatar delivers the same proven IRS code explainer content — your brand, your CTA, your leads. Pick the face and voice that represents your practice.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-32 space-y-20">
        {AVATARS.map((a) => (
          <article
            key={a.code}
            className="rounded-3xl border border-white/[0.06] bg-white/[0.015] overflow-hidden"
          >
            <div className="grid md:grid-cols-[1fr,1fr] gap-0">
              <div className="bg-black">
                <video
                  src={a.videoUrl}
                  controls
                  playsInline
                  preload="none"
                  className="w-full aspect-video block"
                />
              </div>
              <div className="p-6 md:p-10 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[0.6875rem] font-semibold uppercase tracking-wider"
                    style={{ background: `${a.color}14`, color: a.color }}
                  >
                    {a.specialty}
                  </span>
                  <span className="text-[0.6875rem] text-white/25 font-medium">{a.looks} looks</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{a.name}</h2>
                <p className="text-white/60 leading-relaxed mb-5">{a.bio}</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[0.5625rem] uppercase tracking-[0.15em] text-white/25 font-semibold mb-1">Best for</p>
                    <p className="text-white/70 leading-relaxed">{a.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-[0.5625rem] uppercase tracking-[0.15em] text-white/25 font-semibold mb-1">Voice</p>
                    <p className="text-white/70 leading-relaxed">{a.voice}</p>
                  </div>
                </div>
                <Link
                  href={`/#start`}
                  className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-[0_0_20px_rgba(236,72,153,0.18)] transition hover:brightness-110 hover:-translate-y-0.5 self-start"
                  style={{ background: `linear-gradient(135deg,${a.color},#db2777)` }}
                >
                  Choose {a.name} →
                </Link>
              </div>
            </div>
            <div className="border-t border-white/[0.06] bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.looksImageUrl}
                alt={`${a.name} looks gallery — all ${a.looks} variations`}
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>
          </article>
        ))}
      </div>

      <section className="mx-auto max-w-3xl px-6 pb-32 text-center">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          Ready to{' '}
          <span className="bg-gradient-to-br from-[#ec4899] via-[#f472b6] to-[#fb923c] bg-clip-text text-transparent">
            get started?
          </span>
        </h2>
        <p className="text-lg text-white/60 mb-10">
          Pick your avatar, send us a photo (or use one of theirs), and we'll have your branded YouTube channel publishing within 14 days.
        </p>
        <Link
          href="/#start"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-semibold text-white text-[1.0625rem] bg-gradient-to-br from-[#ec4899] to-[#db2777] shadow-[0_0_30px_rgba(236,72,153,0.18)] transition hover:brightness-110 hover:-translate-y-0.5"
        >
          Get Your Avatar Channel — $29/mo →
        </Link>
      </section>
    </div>
  )
}
