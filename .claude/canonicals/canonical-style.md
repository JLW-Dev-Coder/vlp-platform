# canonical-style.md

Template for STYLE.md files that define visual design standards for VLP ecosystem platforms.

---

## Required Sections (in order)

### 1. Header
- Product name, last updated

### 2. Stack
- CSS approach: Tailwind CSS (primary) + CSS Modules (legacy/page-specific)
- Global tokens location: `@vlp/member-ui` CSS variables
- What is NOT used: No Bootstrap, no Material UI, no external CSS frameworks

### 3. Design Tokens

#### Colors
- Primary brand color (from PlatformConfig — see canonical-stack.md)
- Semantic colors: success, warning, error, info
- Neutral scale: background, surface, border, text
- Member area CSS variables: `--member-card`, `--member-border`, `--member-bg`, etc.

#### Typography
- Font family: system font stack (Inter for headings where available)
- Scale: h1 (2.25rem), h2 (1.875rem), h3 (1.5rem), body (1rem), small (0.875rem)
- Weight: regular (400), medium (500), semibold (600), bold (700)

#### Spacing
- Base unit: 4px (Tailwind default)
- Section padding: `py-16` to `py-24`
- Card padding: `p-6`
- Gap: `gap-4` to `gap-8`

#### Radius
- Small: `rounded` (4px)
- Medium: `rounded-lg` (8px)
- Large: `rounded-xl` (12px)
- Full: `rounded-full`

#### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

### 4. Layout Patterns
- Max content width: `max-w-7xl` (1280px)
- Section padding: `px-4 sm:px-6 lg:px-8`
- Grid: Tailwind grid system (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Cards: `bg-white rounded-lg shadow-sm border p-6`

### 5. Button Patterns
- Primary: `bg-{brand} text-white rounded-lg px-6 py-3 font-semibold`
- Secondary: `border border-{brand} text-{brand} rounded-lg px-6 py-3 font-semibold`
- Small: `px-4 py-2 text-sm`

### 6. Typography Patterns
- h1: `text-4xl font-bold tracking-tight`
- h2: `text-3xl font-semibold`
- body: `text-base text-gray-700`
- muted: `text-sm text-gray-500`
- badge: `text-xs font-medium px-2 py-1 rounded-full`

### 7. Existing Components
- List shared components from `@vlp/member-ui` with descriptions
- Note which are structural (layout) vs. presentational (cards, badges)

### 8. Page File Pattern
- `app/{route}/page.tsx` — page component
- `app/{route}/page.module.css` — page-specific styles (legacy, use Tailwind for new)
- `components/{Component}.tsx` — reusable components

### 9. Self-Check
Before delivering any styled page, verify:
- [ ] Brand color matches PlatformConfig
- [ ] Mobile responsive at all breakpoints
- [ ] No hardcoded colors — use Tailwind classes or CSS variables
- [ ] Consistent spacing (multiples of 4px)
- [ ] Accessible contrast ratios (WCAG AA minimum)
- [ ] No external CSS framework dependencies
