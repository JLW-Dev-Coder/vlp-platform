/**
 * WLVLP YouTube Playlists
 *
 * Source of truth for playlist metadata. Used in:
 * - Email drip campaigns (playlist recommendations by topic)
 * - Landing page content
 * - Video description footers
 *
 * Studio URLs are for internal reference only — public URLs use the `id` field:
 *   https://www.youtube.com/playlist?list={id}
 */

export const YOUTUBE_CHANNEL = {
  name: "Website Lotto Virtual Launch Pro AI",
  url: "https://www.youtube.com/channel/UCMWWyBdpnYHX3OGMWMHKX6A",
  handle: "@WLVLP", // update once handle is claimed
} as const;

export interface YouTubePlaylist {
  id: string;
  title: string;
  slug: string;
  description: string;
  studioUrl: string;
  publicUrl: string;
}

export const YOUTUBE_PLAYLISTS: YouTubePlaylist[] = [
  {
    id: "PLwAMb0GB_U_Yd7S3sLDDs14Gj1WbHJ21J",
    title: "First Impressions & Above the Fold",
    slug: "first-impressions",
    description:
      "Your website gets 3 seconds. This playlist covers what visitors see first — headlines, hero sections, layout hierarchy, and the psychology behind instant clarity. Learn how to stop the scroll and keep people on your page.",
    studioUrl:
      "https://studio.youtube.com/playlist/PLwAMb0GB_U_Yd7S3sLDDs14Gj1WbHJ21J/edit",
    publicUrl:
      "https://www.youtube.com/playlist?list=PLwAMb0GB_U_Yd7S3sLDDs14Gj1WbHJ21J",
  },
  {
    id: "PLwAMb0GB_U_atp1krudfJewO2gcrjI3Ir",
    title: "CTA & Conversion",
    slug: "cta-conversion",
    description:
      "Buttons, forms, and offers that actually get clicked. These videos break down call-to-action placement, copy, color, sizing, and the conversion mechanics that turn traffic into leads and sales.",
    studioUrl:
      "https://studio.youtube.com/playlist/PLwAMb0GB_U_atp1krudfJewO2gcrjI3Ir/edit",
    publicUrl:
      "https://www.youtube.com/playlist?list=PLwAMb0GB_U_atp1krudfJewO2gcrjI3Ir",
  },
  {
    id: "PLwAMb0GB_U_aC2k6sMmcRDMei8JYQBnJP",
    title: "Trust & Social Proof",
    slug: "trust-social-proof",
    description:
      "People buy from sites they trust. Learn how to use testimonials, reviews, trust badges, case studies, and design signals that make visitors feel confident enough to take action.",
    studioUrl:
      "https://studio.youtube.com/playlist/PLwAMb0GB_U_aC2k6sMmcRDMei8JYQBnJP/edit",
    publicUrl:
      "https://www.youtube.com/playlist?list=PLwAMb0GB_U_aC2k6sMmcRDMei8JYQBnJP",
  },
  {
    id: "PLwAMb0GB_U_YDWY81L_iZ1KGsHVr2mHsa",
    title: "SEO & Performance",
    slug: "seo-performance",
    description:
      "A beautiful site nobody finds is useless. These videos cover page speed, Core Web Vitals, on-page SEO, meta tags, structured data, and the technical foundation that gets your site ranking and converting.",
    studioUrl:
      "https://studio.youtube.com/playlist/PLwAMb0GB_U_YDWY81L_iZ1KGsHVr2mHsa/edit",
    publicUrl:
      "https://www.youtube.com/playlist?list=PLwAMb0GB_U_YDWY81L_iZ1KGsHVr2mHsa",
  },
  {
    id: "PLwAMb0GB_U_b76C9LhZnSRxMz5M1_PK79",
    title: "Mobile & UX",
    slug: "mobile-ux",
    description:
      "Over 60% of traffic is mobile. This playlist covers responsive design, touch targets, mobile navigation, load times, and the UX patterns that keep mobile visitors engaged instead of bouncing.",
    studioUrl:
      "https://studio.youtube.com/playlist/PLwAMb0GB_U_b76C9LhZnSRxMz5M1_PK79/edit",
    publicUrl:
      "https://www.youtube.com/playlist?list=PLwAMb0GB_U_b76C9LhZnSRxMz5M1_PK79",
  },
  {
    id: "PLwAMb0GB_U_a7_01eyF8NJ0k_kUbZBW9s",
    title: "Templates & Tools",
    slug: "templates-tools",
    description:
      "Walkthroughs of Website Lotto templates, customization tutorials, and the tools you need to go live fast. See real examples of high-converting layouts and how to make them yours.",
    studioUrl:
      "https://studio.youtube.com/playlist/PLwAMb0GB_U_a7_01eyF8NJ0k_kUbZBW9s/edit",
    publicUrl:
      "https://www.youtube.com/playlist?list=PLwAMb0GB_U_a7_01eyF8NJ0k_kUbZBW9s",
  },
  {
    id: "PLwAMb0GB_U_Z7Kx3lNhfo3SmOt1XOkhTL",
    title: "Strategy & Mindset",
    slug: "strategy-mindset",
    description:
      "The bigger picture. Website strategy, pricing psychology, competitor analysis, when to launch vs when to wait, and the mindset shifts that separate sites that sell from sites that sit.",
    studioUrl:
      "https://studio.youtube.com/playlist/PLwAMb0GB_U_Z7Kx3lNhfo3SmOt1XOkhTL/edit",
    publicUrl:
      "https://www.youtube.com/playlist?list=PLwAMb0GB_U_Z7Kx3lNhfo3SmOt1XOkhTL",
  },
];

/**
 * Get a playlist by slug (for email templates, routing, etc.)
 */
export function getPlaylistBySlug(slug: string): YouTubePlaylist | undefined {
  return YOUTUBE_PLAYLISTS.find((p) => p.slug === slug);
}

/**
 * Get playlist public URL by slug
 */
export function getPlaylistUrl(slug: string): string | undefined {
  return getPlaylistBySlug(slug)?.publicUrl;
}