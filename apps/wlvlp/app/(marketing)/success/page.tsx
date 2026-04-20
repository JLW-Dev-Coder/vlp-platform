import Link from 'next/link';
import { PurchaseBeacon } from '@vlp/member-ui';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PurchaseBeacon app="wlvlp" />
      <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-[960px] mx-auto px-6 h-[60px] flex items-center">
          <Link
            href="/"
            className="font-sora font-extrabold text-[1.2rem] text-brand-primary no-underline [text-shadow:0_0_20px_rgba(168,85,247,0.5)]"
          >
            Website Lotto
          </Link>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center py-[60px] px-6 gap-5 text-center max-w-[600px] mx-auto">
        <div className="text-[5rem] [filter:drop-shadow(0_0_24px_rgba(168,85,247,0.4))] motion-safe:animate-[scale-in_0.5s_ease_forwards]">
          🎉
        </div>
        <h1 className="font-sora text-[2.4rem] font-extrabold text-white tracking-tight">You&apos;re live!</h1>
        <p className="text-white/60 text-base leading-relaxed">Your site has been claimed and is now live. Here&apos;s what to do next:</p>
        <ol className="list-none flex flex-col gap-3 text-left bg-white/[0.03] border border-border-subtle rounded-2xl p-6 w-full [counter-reset:steps] [&>li]:relative [&>li]:pl-7 [&>li]:text-white/70 [&>li]:text-sm [&>li]:leading-relaxed [&>li]:[counter-increment:steps] [&>li]:before:content-[counter(steps)] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-px [&>li]:before:w-5 [&>li]:before:h-5 [&>li]:before:bg-brand-primary/15 [&>li]:before:border [&>li]:before:border-brand-primary/30 [&>li]:before:rounded-full [&>li]:before:text-brand-primary [&>li]:before:text-[0.72rem] [&>li]:before:font-bold [&>li]:before:flex [&>li]:before:items-center [&>li]:before:justify-center">
          <li>Visit your dashboard to customize your site</li>
          <li>Add your brand name, tagline, and contact info</li>
          <li>Upload your logo and set your brand colors</li>
          <li>Share your site URL with the world</li>
        </ol>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/dashboard"
            className="inline-block px-7 py-[13px] bg-brand-primary text-white font-bold text-[0.92rem] rounded-lg no-underline transition-all shadow-brand hover:-translate-y-0.5"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-block px-7 py-[13px] bg-transparent text-brand-primary font-semibold text-[0.92rem] rounded-lg no-underline border border-brand-primary/40 transition-all hover:border-brand-primary hover:bg-brand-primary/10"
          >
            Browse More Templates
          </Link>
        </div>
        <p className="text-white/[0.35] text-[0.82rem] leading-relaxed">Check your email for login instructions and your site URL.</p>
      </main>
    </div>
  );
}
