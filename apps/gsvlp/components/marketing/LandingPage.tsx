'use client'

import { useEffect, useRef, useState } from 'react'

const VIDEO_URL_MP4 = 'https://api.virtuallaunch.pro/r2/gsvlp/videos/demo-call-45s.mp4'
const VIDEO_URL_MOV = 'https://api.virtuallaunch.pro/r2/gsvlp/videos/demo-call-45s.mov'

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = root.querySelectorAll<HTMLElement>('.gsp-reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gsp-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const displayName = name.trim() || '[your name]'
  const nameIsPlaceholder = !name.trim()

  return (
    <div className="gsp-lp" ref={rootRef}>
      <style>{GSP_LANDING_CSS}</style>

      {/* Section 1: Hero */}
      <section className="gsp-section gsp-hero" id="top">
        <div className="gsp-wrap">
          <span className="gsp-badge gsp-reveal">Free to join · 20% commission</span>
          <h1 className="gsp-h1 gsp-reveal">
            <span>You don&apos;t sell.</span>
            <span>You don&apos;t close.</span>
            <span className="gsp-accent">You just book the call.</span>
          </h1>
          <p className="gsp-lede gsp-reveal">
            Earn 20% commission on every deal that closes. All you do is call tax pros,
            read a 28-second script, and book the appointment. We handle everything else.
          </p>
          <div className="gsp-cta-row gsp-reveal">
            <a href="#video" onClick={scrollTo('video')} className="gsp-btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch the 45-sec demo
            </a>
            <a href="#signup" onClick={scrollTo('signup')} className="gsp-btn-ghost">
              Start right now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="gsp-props gsp-reveal">
            <div className="gsp-prop">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
              <div>
                <strong>2 hours/day</strong>
                <span>Work your own schedule</span>
              </div>
            </div>
            <div className="gsp-prop">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>28-second script</strong>
                <span>We give you the words</span>
              </div>
            </div>
            <div className="gsp-prop">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#FF6B00" d="M21.35 11.1H12v3.2h5.35c-.55 2.4-2.55 3.7-5.35 3.7-3.25 0-5.85-2.6-5.85-5.85S8.75 6.3 12 6.3c1.5 0 2.85.55 3.9 1.45L18.3 5.4C16.6 3.85 14.45 3 12 3 7.05 3 3 7.05 3 12s4.05 9 9 9c5.2 0 8.65-3.65 8.65-8.8 0-.6-.1-1.2-.3-1.1z" />
              </svg>
              <div>
                <strong>Sign up in seconds</strong>
                <span>All you need is a Google account</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Who is JLW */}
      <section className="gsp-section gsp-alt">
        <div className="gsp-wrap">
          <span className="gsp-label gsp-reveal">WHO YOU&apos;RE WORKING WITH</span>
          <p className="gsp-prose gsp-reveal">
            I&apos;m Jamie. Call me JLW. I&apos;m a tax pro — but I&apos;m not practicing.
            I help other tax pros grow. That&apos;s what I&apos;m good at. I have 10 sites,
            a treasure trove of products, and tax professionals who need to see what we have.
            I close. I just need my calendar full. That&apos;s where you come in.
          </p>
        </div>
      </section>

      {/* Section 3: Video Demo */}
      <section className="gsp-section" id="video">
        <div className="gsp-wrap">
          <span className="gsp-label gsp-reveal">WATCH HOW EASY THIS IS</span>
          <h2 className="gsp-h2 gsp-reveal">One call. Twenty-eight seconds.</h2>
          <div className="gsp-video-wrap gsp-reveal">
            <video controls playsInline preload="metadata" className="gsp-video">
              <source src={VIDEO_URL_MP4} type="video/mp4" />
              <source src={VIDEO_URL_MOV} type="video/quicktime" />
              {/* TODO(video-route): Worker R2 serving route not yet created for gsvlp bucket */}
              <p className="gsp-video-fallback">
                Your browser doesn&apos;t support this video format.{' '}
                <a href={VIDEO_URL_MP4} className="gsp-link">Download it instead.</a>
              </p>
            </video>
          </div>
          <p className="gsp-caption gsp-reveal">
            JLW plays both sides — the setter and the skeptical tax pro.
            Glasses on = grumpy. Glasses off = you.
          </p>
        </div>
      </section>

      {/* Section 4: The Script */}
      <section className="gsp-section gsp-alt">
        <div className="gsp-wrap">
          <span className="gsp-label gsp-reveal">THE ENTIRE SCRIPT</span>
          <h2 className="gsp-h2 gsp-reveal">This is everything you say.</h2>
          <div className="gsp-script-card gsp-reveal">
            <p className="gsp-script-line">
              &ldquo;Hi. I&apos;m [your name]. I&apos;m working with JLW at Virtual Launch Pro.
              She&apos;s a tax pro like you. Can she help clients find you in the next 30 days?&rdquo;
            </p>
            <p className="gsp-muted">Pause. Let them respond.</p>
            <div className="gsp-pills">
              <span className="gsp-pill gsp-pill-gray">No</span>
              <span className="gsp-pill gsp-pill-gold">Maybe — you have 20 seconds</span>
              <span className="gsp-pill gsp-pill-green">Yes</span>
            </div>
            <p className="gsp-script-line">
              &ldquo;She has availability on Friday at 9 AM or after 3 PM. Which works better?&rdquo;
            </p>
            <p className="gsp-script-line">
              &ldquo;Great. She&apos;ll look forward to speaking with you then. May I follow up
              Thursday around 9 AM to confirm?&rdquo;
            </p>
          </div>
          <p className="gsp-caption gsp-reveal">
            That&apos;s it. They hang up. You log the appointment. Done.
          </p>
        </div>
      </section>

      {/* Section 5: How You Get Paid */}
      <section className="gsp-section">
        <div className="gsp-wrap">
          <span className="gsp-label gsp-label-gold gsp-reveal">THE MONEY PART</span>
          <h2 className="gsp-h2 gsp-reveal">You get 20% of every closed deal.</h2>
          <ol className="gsp-steps">
            <li className="gsp-step gsp-reveal">
              <span className="gsp-step-num">1</span>
              <div>
                <strong>You call a tax pro</strong>
                <span>From the list we give you. Their phone numbers are public.</span>
              </div>
            </li>
            <li className="gsp-step gsp-reveal">
              <span className="gsp-step-num">2</span>
              <div>
                <strong>They book with JLW</strong>
                <span>You log the appointment and set a reminder to follow up.</span>
              </div>
            </li>
            <li className="gsp-step gsp-reveal">
              <span className="gsp-step-num">3</span>
              <div>
                <strong>JLW closes the deal</strong>
                <span>She handles the consultation and the sale.</span>
              </div>
            </li>
            <li className="gsp-step gsp-reveal">
              <span className="gsp-step-num">4</span>
              <div>
                <strong>You get paid</strong>
                <span>20% commission. All yours. For a 28-second call.</span>
              </div>
            </li>
          </ol>
          <div className="gsp-highlight gsp-reveal">
            <strong>Did you know?</strong> Salespeople make more money than any other
            profession. And the best part? You&apos;re not even selling. You&apos;re just
            setting appointments.
          </div>
        </div>
      </section>

      {/* Section 6: What You Need */}
      <section className="gsp-section gsp-alt">
        <div className="gsp-wrap">
          <span className="gsp-label gsp-reveal">REQUIREMENTS</span>
          <h2 className="gsp-h2 gsp-reveal">All you need is this.</h2>
          <ul className="gsp-needs">
            <li className="gsp-need gsp-reveal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="3" aria-hidden="true">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>A Google account</strong>
                <span>That&apos;s how you sign up and access your dashboard.</span>
              </div>
            </li>
            <li className="gsp-need gsp-reveal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="3" aria-hidden="true">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>A phone</strong>
                <span>To call tax pros from the list we provide.</span>
              </div>
            </li>
            <li className="gsp-need gsp-reveal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="3" aria-hidden="true">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>Two hours</strong>
                <span>Per day. Or per week. Work as much or as little as you want.</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Section 7: Script Practice */}
      <section className="gsp-section">
        <div className="gsp-wrap">
          <span className="gsp-label gsp-reveal">TRY IT RIGHT NOW</span>
          <h2 className="gsp-h2 gsp-reveal">Enter your name. Read the script. You&apos;re ready.</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="gsp-input gsp-reveal"
            aria-label="Your first name"
          />
          <div className="gsp-script-card gsp-reveal">
            <p className="gsp-script-line">
              &ldquo;Hi. I&apos;m{' '}
              <span className={nameIsPlaceholder ? 'gsp-name-placeholder' : 'gsp-name-filled'}>
                {displayName}
              </span>
              . I&apos;m working with JLW at Virtual Launch Pro. She&apos;s a tax pro like you.
              Can she help clients find you in the next 30 days?&rdquo;
            </p>
          </div>
          <p className="gsp-caption gsp-reveal">
            See? That&apos;s it. Take a deep breath. You just became an appointment setter.
          </p>
        </div>
      </section>

      {/* Section 8: Sign Up */}
      <section className="gsp-section gsp-alt gsp-section-tall" id="signup">
        <div className="gsp-wrap gsp-center">
          <h2 className="gsp-h1 gsp-h1-cta gsp-reveal">You in?</h2>
          <p className="gsp-lede gsp-reveal">Free to join. Start making calls today.</p>
          <a href="/sign-in" className="gsp-btn-primary gsp-btn-large gsp-reveal">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M21.35 11.1H12v3.2h5.35c-.55 2.4-2.55 3.7-5.35 3.7-3.25 0-5.85-2.6-5.85-5.85S8.75 6.3 12 6.3c1.5 0 2.85.55 3.9 1.45L18.3 5.4C16.6 3.85 14.45 3 12 3 7.05 3 3 7.05 3 12s4.05 9 9 9c5.2 0 8.65-3.65 8.65-8.8 0-.6-.1-1.2-.3-1.1z" />
            </svg>
            Sign Up with Google
          </a>
          <p className="gsp-fineprint gsp-reveal">
            No credit card. No commitment. Just a Google account.
          </p>
        </div>
      </section>

      {/* Section 9: Footer (minimal page footer — global Footer also renders) */}
      <section className="gsp-pagefoot">
        <div className="gsp-wrap gsp-center">
          <p className="gsp-fineprint">
            © 2026 Grow Setter Pro · A{' '}
            <a href="https://virtuallaunch.pro" className="gsp-link">Virtual Launch Pro</a>{' '}
            Company
          </p>
        </div>
      </section>
    </div>
  )
}

const GSP_LANDING_CSS = `
.gsp-lp {
  --gsp-bg: #0D0D0D;
  --gsp-alt: #111111;
  --gsp-surface: #1A1A1A;
  --gsp-border: #333333;
  --gsp-orange: #FF6B00;
  --gsp-orange-soft: rgba(255, 107, 0, 0.15);
  --gsp-gold: #F59E0B;
  --gsp-green: #10B981;
  --gsp-text: #FFFFFF;
  --gsp-text-2: #999999;
  --gsp-text-3: #666666;

  background: var(--gsp-bg);
  color: var(--gsp-text);
  font-family: var(--font-inter), system-ui, sans-serif;

  /* break out of any constrained main wrapper to span full width */
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
.gsp-lp *, .gsp-lp *::before, .gsp-lp *::after { box-sizing: border-box; }

.gsp-lp .gsp-section { padding: 80px 24px; background: var(--gsp-bg); }
.gsp-lp .gsp-section-tall { padding: 100px 24px; }
.gsp-lp .gsp-alt { background: var(--gsp-alt); }

.gsp-lp .gsp-wrap { max-width: 720px; margin: 0 auto; }
.gsp-lp .gsp-center { text-align: center; }
.gsp-lp .gsp-center .gsp-lede,
.gsp-lp .gsp-center .gsp-fineprint { margin-left: auto; margin-right: auto; }

.gsp-lp .gsp-hero { padding-top: 96px; padding-bottom: 96px; }

.gsp-lp .gsp-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--gsp-orange-soft);
  color: var(--gsp-orange);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-bottom: 28px;
}

.gsp-lp .gsp-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gsp-orange);
  margin-bottom: 20px;
}
.gsp-lp .gsp-label-gold { color: var(--gsp-gold); }

.gsp-lp .gsp-h1 {
  font-family: var(--font-outfit), system-ui, sans-serif;
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0 0 24px;
  color: var(--gsp-text);
}
.gsp-lp .gsp-h1 span { display: block; }
.gsp-lp .gsp-h1-cta { font-size: clamp(48px, 7vw, 80px); margin-bottom: 16px; }
.gsp-lp .gsp-accent { color: var(--gsp-orange); }

.gsp-lp .gsp-h2 {
  font-family: var(--font-outfit), system-ui, sans-serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin: 0 0 32px;
  color: var(--gsp-text);
}

.gsp-lp .gsp-lede {
  font-size: 15px;
  line-height: 1.65;
  color: var(--gsp-text-2);
  margin: 0 0 32px;
  max-width: 600px;
}

.gsp-lp .gsp-prose {
  font-size: 18px;
  line-height: 1.7;
  color: var(--gsp-text);
  margin: 0;
}

.gsp-lp .gsp-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 48px;
}

.gsp-lp .gsp-btn-primary,
.gsp-lp .gsp-btn-primary:link,
.gsp-lp .gsp-btn-primary:visited {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--gsp-orange);
  color: #FFFFFF !important;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  box-shadow: 0 4px 24px rgba(255, 107, 0, 0.25);
}
.gsp-lp .gsp-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255, 107, 0, 0.45);
  background: #FF8533;
}
.gsp-lp .gsp-btn-large { padding: 18px 32px; font-size: 17px; margin: 24px 0 16px; }

.gsp-lp .gsp-btn-ghost,
.gsp-lp .gsp-btn-ghost:link,
.gsp-lp .gsp-btn-ghost:visited {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: var(--gsp-text);
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  border: 1px solid var(--gsp-border);
  transition: border-color 0.15s ease, background 0.15s ease;
}
.gsp-lp .gsp-btn-ghost:hover {
  border-color: var(--gsp-orange);
  background: var(--gsp-orange-soft);
}

.gsp-lp .gsp-props {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.gsp-lp .gsp-prop { display: flex; align-items: flex-start; gap: 12px; }
.gsp-lp .gsp-prop > div { display: flex; flex-direction: column; }
.gsp-lp .gsp-prop strong { color: var(--gsp-text); font-size: 14px; font-weight: 600; }
.gsp-lp .gsp-prop span { color: var(--gsp-text-3); font-size: 13px; line-height: 1.4; }

.gsp-lp .gsp-video-wrap { margin: 0 0 16px; }
.gsp-lp .gsp-video {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--gsp-border);
  background: var(--gsp-surface);
  display: block;
}
.gsp-lp .gsp-video-fallback {
  padding: 40px;
  text-align: center;
  color: var(--gsp-text-2);
}

.gsp-lp .gsp-caption {
  font-size: 13px;
  color: var(--gsp-text-3);
  line-height: 1.5;
  margin: 0;
}

.gsp-lp .gsp-script-card {
  background: var(--gsp-surface);
  border: 1px solid var(--gsp-border);
  border-radius: 12px;
  padding: 24px;
  margin: 0 0 24px;
}
.gsp-lp .gsp-script-line {
  font-family: var(--font-inter), system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.55;
  color: var(--gsp-orange);
  margin: 0 0 16px;
}
.gsp-lp .gsp-script-line:last-child { margin-bottom: 0; }
.gsp-lp .gsp-muted { color: var(--gsp-text-3); font-size: 14px; margin: 0 0 16px; }

.gsp-lp .gsp-pills { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 20px; }
.gsp-lp .gsp-pill {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--gsp-border);
}
.gsp-lp .gsp-pill-gray { color: var(--gsp-text-2); background: transparent; }
.gsp-lp .gsp-pill-gold { color: var(--gsp-gold); border-color: var(--gsp-gold); background: rgba(245, 158, 11, 0.1); }
.gsp-lp .gsp-pill-green { color: var(--gsp-green); border-color: var(--gsp-green); background: rgba(16, 185, 129, 0.1); }

.gsp-lp .gsp-name-placeholder { color: var(--gsp-orange); font-style: italic; }
.gsp-lp .gsp-name-filled { color: var(--gsp-orange); font-weight: 700; }

.gsp-lp .gsp-input {
  width: 100%;
  font-size: 18px;
  padding: 16px 20px;
  border-radius: 10px;
  background: var(--gsp-surface);
  border: 1px solid var(--gsp-border);
  color: var(--gsp-text);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  margin-bottom: 24px;
}
.gsp-lp .gsp-input:focus {
  border-color: var(--gsp-orange);
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.25);
}
.gsp-lp .gsp-input::placeholder { color: var(--gsp-text-3); }

.gsp-lp .gsp-steps { list-style: none; padding: 0; margin: 0 0 32px; }
.gsp-lp .gsp-step { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 24px; }
.gsp-lp .gsp-step:last-child { margin-bottom: 0; }
.gsp-lp .gsp-step-num {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.15);
  color: var(--gsp-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  border: 1px solid var(--gsp-gold);
}
.gsp-lp .gsp-step > div { display: flex; flex-direction: column; gap: 4px; padding-top: 6px; }
.gsp-lp .gsp-step strong { font-size: 17px; font-weight: 600; color: var(--gsp-text); }
.gsp-lp .gsp-step span { font-size: 15px; line-height: 1.5; color: var(--gsp-text-2); }

.gsp-lp .gsp-highlight {
  background: var(--gsp-surface);
  border-left: 4px solid var(--gsp-green);
  padding: 20px 24px;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--gsp-text-2);
}
.gsp-lp .gsp-highlight strong { color: var(--gsp-green); }

.gsp-lp .gsp-needs { list-style: none; padding: 0; margin: 0; }
.gsp-lp .gsp-need { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px; }
.gsp-lp .gsp-need:last-child { margin-bottom: 0; }
.gsp-lp .gsp-need > svg { flex: 0 0 auto; margin-top: 4px; }
.gsp-lp .gsp-need > div { display: flex; flex-direction: column; gap: 4px; }
.gsp-lp .gsp-need strong { font-size: 17px; font-weight: 600; color: var(--gsp-text); }
.gsp-lp .gsp-need span { font-size: 15px; line-height: 1.5; color: var(--gsp-text-2); }

.gsp-lp .gsp-fineprint { font-size: 13px; color: var(--gsp-text-3); margin: 0; }
.gsp-lp .gsp-link, .gsp-lp .gsp-link:link, .gsp-lp .gsp-link:visited { color: var(--gsp-orange); }
.gsp-lp .gsp-link:hover { text-decoration: underline; }

.gsp-lp .gsp-pagefoot { padding: 32px 24px; background: var(--gsp-bg); border-top: 1px solid var(--gsp-border); }

/* Reveal animation */
.gsp-lp .gsp-reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.gsp-lp .gsp-in { opacity: 1; transform: none; }

/* Responsive */
@media (max-width: 768px) {
  .gsp-lp .gsp-section { padding: 64px 24px; }
  .gsp-lp .gsp-hero { padding-top: 72px; padding-bottom: 72px; }
  .gsp-lp .gsp-props { grid-template-columns: 1fr; gap: 16px; }
  .gsp-lp .gsp-cta-row { flex-direction: column; align-items: stretch; }
  .gsp-lp .gsp-btn-primary, .gsp-lp .gsp-btn-ghost { justify-content: center; }
  .gsp-lp .gsp-script-line { font-size: 15px; }
  .gsp-lp .gsp-step { gap: 14px; }
}

html { scroll-behavior: smooth; }
`
