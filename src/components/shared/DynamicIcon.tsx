import { ComponentType, SVGProps, CSSProperties, ForwardRefExoticComponent } from 'react';
import { Box } from 'lucide-react';
import { DynamicIcon as OfficialDynamicIcon } from 'lucide-react/dynamic';

type IconProps = SVGProps<SVGSVGElement>;
type LucideComponent = ComponentType<IconProps>;

// Official DynamicIcon accepts { name, fallback, ...icon props }.
const Dynamic = OfficialDynamicIcon as unknown as ForwardRefExoticComponent<
  IconProps & { name: string; fallback?: LucideComponent }
>;

const FALLBACK_ICON: LucideComponent = Box;

/**
 * Convert name to kebab-case (the format lucide's dynamic icon names use).
 *   "Gamepad2" -> "gamepad-2", "MapPin" -> "map-pin", "anchor" -> "anchor"
 */
export function toKebabCase(name: string): string {
  if (!name) return 'box';
  const normalized = name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
  return normalized || 'box';
}

/**
 * Resolve a lucide icon by name.
 *
 * We delegate to lucide-react's OFFICIAL `DynamicIcon` component, which uses
 * `dynamicIconImports[name]()` internally to load ONLY the requested icon's
 * chunk on demand. This is the package's supported dynamic-loading path and
 * avoids the ESM namespace-indexing pitfalls of hand-rolled approaches.
 */
export function lucideDynamic(name: string): LucideComponent {
  return function DynamicIconWrapper(props: IconProps) {
    return (
      <Dynamic
        name={toKebabCase(name)}
        fallback={FALLBACK_ICON}
        {...(props as Record<string, unknown>)}
      />
    );
  } as LucideComponent;
}

/**
 * Renders a lucide icon by name, loaded on demand via lucide's official
 * DynamicIcon. Falls back to `Box` until the icon chunk resolves (or on error).
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
  return (
    <Dynamic
      name={toKebabCase(name)}
      fallback={FALLBACK_ICON}
      className={className}
      style={style as Record<string, unknown>}
    />
  );
}
