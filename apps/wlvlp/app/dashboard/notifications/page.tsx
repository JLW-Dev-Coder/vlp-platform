import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <header className="mb-7">
        <h1 className="font-sora text-3xl font-extrabold text-white mt-0 mb-2 -tracking-[0.5px]">
          Notifications
        </h1>
        <p className="text-white/55 text-[0.95rem] m-0">
          Stay updated on your sites, bids, and account activity.
        </p>
      </header>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
          <Bell className="h-6 w-6 text-brand-primary" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-white">No notifications yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
          When there&apos;s activity on your sites, bids, or account, you&apos;ll see it here.
        </p>
      </div>
    </div>
  );
}
