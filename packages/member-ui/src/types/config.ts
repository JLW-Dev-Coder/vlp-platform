export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide-react icon name
  children?: { label: string; href: string; icon?: string }[];
}

export interface NavSection {
  title: string; // e.g., "WORKSPACE", "EARNINGS", "SETTINGS"
  items: NavItem[];
}

export interface PlatformConfig {
  brandName: string;           // e.g., "Transcript Tax Monitor"
  brandAbbrev: string;         // e.g., "TTMP"
  brandColor: string;          // e.g., "#14b8a6"
  brandSubtitle: string;       // e.g., "Pro Dashboard"
  logoText: string;            // e.g., "TT" (displayed in sidebar logo)
  navSections: NavSection[];
  routes: {
    home: string;              // marketing site home
    signIn: string;
    signOut: string;
    dashboard: string;
    account: string;
    profile: string;
    support: string;
  };
  apiBaseUrl: string;          // e.g., "https://api.taxmonitor.pro"
  calcomReferralLink?: string;
}
