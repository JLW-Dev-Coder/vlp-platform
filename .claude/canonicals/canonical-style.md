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

### 9. Dropdown / Select Styling (mandatory)

All `<select>` elements must be styled to match the form's design system. Never use plain browser-default dropdowns.

Required properties:
- `appearance: none` — remove browser chrome
- Background matching the form's input fields (e.g. `bg-white` or `bg-[var(--member-card)]`)
- Border and border-radius matching adjacent text inputs
- Custom dropdown arrow via CSS `background-image` (inline SVG chevron) or a positioned pseudo-element
- Minimum padding: `py-3 px-4` (12px vertical, 16px horizontal)
- Minimum `text-base` (16px) — never smaller than body text (prevents iOS zoom)
- Focus state: brand-color border + subtle ring (`focus:ring-2 focus:ring-{brand}/30`)
- Consistent height with adjacent text inputs (`h-[48px]` or matching)
- Disabled state: `opacity-60 cursor-not-allowed`

Tailwind example:
```
className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3
           text-base focus:border-{brand} focus:ring-2 focus:ring-{brand}/30
           bg-[url('data:image/svg+xml,...')] bg-no-repeat bg-[right_12px_center]"
```

### 10. Phone Number Input Normalization (mandatory)

All phone number inputs across every platform must normalize on blur:

**Behavior:**
- Accept any common format during typing: `1234567890`, `123-456-7890`, `(123) 456-7890`, `+1 123 456 7890`
- Allow only digits, spaces, hyphens, parentheses, and `+` during input
- On blur: format as `(XXX) XXX-XXXX` for 10-digit US numbers
- On blur: format as `+1 (XXX) XXX-XXXX` for 11-digit numbers starting with `1`
- Store as digits only (with optional country code prefix)

**HTML attributes:**
- `type="tel"`
- `inputMode="numeric"` (mobile numeric keyboard)
- `placeholder="(555) 123-4567"`

**Implementation pattern (React):**
```tsx
import { formatPhone, filterPhoneInput } from '@/lib/phone';

<input
  type="tel"
  inputMode="numeric"
  value={phone}
  onChange={(e) => setPhone(filterPhoneInput(e.target.value))}
  onBlur={() => setPhone(formatPhone(phone))}
  placeholder="(555) 123-4567"
/>
```

**Shared utility (`lib/phone.ts`):**
```ts
export function stripPhone(value: string): string {
  return value.replace(/[^\d]/g, '');
}
export function formatPhone(value: string): string {
  const digits = stripPhone(value);
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits[0] === '1') return `+1 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  return value;
}
export function filterPhoneInput(value: string): string {
  return value.replace(/[^\d\s\-()+ ]/g, '');
}
```

### 11. Self-Check
Before delivering any styled page, verify:
- [ ] Brand color matches PlatformConfig
- [ ] Mobile responsive at all breakpoints
- [ ] No hardcoded colors — use Tailwind classes or CSS variables
- [ ] Consistent spacing (multiples of 4px)
- [ ] Accessible contrast ratios (WCAG AA minimum)
- [ ] No external CSS framework dependencies
- [ ] All `<select>` elements use custom styling (no browser defaults)
- [ ] All phone inputs normalize on blur
