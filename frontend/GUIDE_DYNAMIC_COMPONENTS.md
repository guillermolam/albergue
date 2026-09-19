# Dynamic & i18n-Friendly Astro Components

## Principles

1. **No hardcoded data or text** - All content must come from props or dynamic sources
2. **i18n-ready** - Use translation keys, not literal strings
3. **Astro Islands** - Use `server:defer` for dynamic content that needs data
4. **Type-safe props** - Define TypeScript interfaces for all component props
5. **Slots for content** - Use `<slot />` for flexible composition

## Patterns

### 1. Dynamic Content with Props

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  variant?: 'default' | 'doodle' | 'minimal';
  className?: string;
}

const { title, subtitle, variant = 'default', className = '' } = Astro.props;
---

<Banner class={classes}>
  <h1>{title}</h1>
  {subtitle && <p>{subtitle}</p>}
  <slot />
</Banner>
```

### 2. i18n with Translation Keys

```astro
---
import { t } from '../stores/i18nStore';

interface Props {
  key?: string;
  fallback?: string;
}

const { key = 'common.welcome', fallback } = Astro.props;
const translatedText = t(key, fallback);
---

<h1>{translatedText}</h1>
```

### 3. Dynamic Lists with Props

```astro
---
interface Props {
  items: Array<{ id: string; name: string; count?: number }>;
  emptyMessage?: string;
}

const { items, emptyMessage = 'No items' } = Astro.props;
---

{items.length > 0 ? (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        {item.name}
        {item.count && ` (${item.count})`}
      </li>
    ))}
  </ul>
) : (
  <p>{emptyMessage}</p>
)}
```

### 4. Server Islands for Dynamic Data

```astro
---
interface Props {
  fallbackContent?: string;
}

const { fallbackContent = 'Loading...' } = Astro.props;
---

<details server:defer>
  <summary>{fallbackContent}</summary>
  <slot />
</details>
```

### 5. Conditional Rendering

```astro
---
interface Props {
  hasFeature: boolean;
  featureName: string;
}

const { hasFeature, featureName } = Astro.props;
---

{hasFeature && <FeatureBadge name={featureName} />}
<slot />
```

## Migration Checklist

- [ ] Remove all hardcoded text strings
- [ ] Replace with `t()` function calls or props
- [ ] Add TypeScript interfaces for props
- [ ] Use `<slot />` for flexible content
- [ ] Consider `server:defer` for data-heavy components
- [ ] Test with different locales
