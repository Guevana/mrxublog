import { Suspense, lazy, ComponentType, SVGProps, CSSProperties } from 'react';
import { Box } from 'lucide-react';
import * as dynamicIconImports from 'lucide-react/dynamicIconImports';

type IconProps = SVGProps<SVGSVGElement>;
type LucideComponent = ComponentType<IconProps>;

const FALLBACK_ICON: LucideComponent = Box;

/**
 * Converts a Lucide icon name (PascalCase or kebab-case) to the kebab-case
 * key used by lucide-react's dynamicIconImports map.
 *
 * Examples:
 *   "Gamepad2"  -> "gamepad-2"
 *   "smile"     -> "smile"
 *   "MapPin"    -> "map-pin"
 */
export function toKebabCase(name: string): string {
  if (!name) return 'box';
  const normalized = name
    // Insert hyphen between lowercase/digit and uppercase (camel -> kebab)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
  return normalized || 'box';
}

const iconLoaderCache = new Map<string, LucideComponent>();

/**
 * Resolves (and caches) a lucide icon component by name, using dynamic
 * imports so the main bundle only carries the icons actually referenced at
 * runtime. Falls back to `Box` if the name isn't a valid lucide icon.
 */
export function lucideDynamic(name: string): LucideComponent {
  const key = toKebabCase(name) as keyof typeof dynamicIconImports;

  if (iconLoaderCache.has(key)) {
    return iconLoaderCache.get(key)!;
  }

  const loader = (dynamicIconImports as Record<string, unknown>)[key];
  if (typeof loader === 'function') {
    const Lazy = lazy(() =>
      (loader as () => Promise<{ default: LucideComponent }>)().then(
        m => ({ default: m.default }),
      ),
    );
    iconLoaderCache.set(key, Lazy);
    return Lazy;
  }

  return FALLBACK_ICON;
}

/**
 * Renders a lazily loaded lucide icon by name, with a `Box` fallback.
 * Uses `dynamicIconImports` under the hood so each icon is its own chunk.
 */
export function DynamicIcon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = lucideDynamic(name);
  return (
    <Suspense fallback={null}>
      <Icon className={className} style={style as IconProps['style']} />
    </Suspense>
  );
}
