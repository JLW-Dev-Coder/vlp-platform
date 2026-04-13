# @vlp/member-ui

Shared UI components, types, and styles for the VLP platform member area.

## Usage

Apps in `apps/*` depend on this package as a workspace dependency:

```json
{
  "dependencies": {
    "@vlp/member-ui": "*"
  }
}
```

### Import types

```ts
import type { PlatformConfig } from "@vlp/member-ui";
```

### Import styles

```ts
import "@vlp/member-ui/styles";
```

## Structure

- `src/components/` — shared React components (sidebar, nav, member layout)
- `src/styles/globals.css` — structural CSS variables (--member-card, --member-border, etc.)
- `src/types/config.ts` — `PlatformConfig` type definition
- `tailwind.config.ts` — shared Tailwind config mapping CSS vars to utility classes
