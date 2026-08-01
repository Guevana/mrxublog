import { ComponentType, SVGProps, CSSProperties } from 'react';
import {
  Box,
  Anchor,
  Frown,
  Image,
  Puzzle,
  Smile,
  Sparkles,
  Briefcase,
  FileText,
  Mail,
  Terminal,
  User,
  Gamepad2,
  Trophy,
  Activity,
  Rocket,
  LocateFixed,
  Hand,
  MousePointerClick,
  Check,
  X,
  Plus,
  Minus,
  Home,
  Menu,
  Search,
  Settings,
  Star,
  Heart,
} from 'lucide-react';

type IconProps = SVGProps<SVGSVGElement>;
type LucideComponent = ComponentType<IconProps>;

const FALLBACK_ICON: LucideComponent = Box;

/**
 * Explicit icon registry.
 *
 * We intentionally use named imports + a plain object map (NOT
 * `import * as icons` / `dynamicIconImports`) so that Vite's production
 * build keeps a dynamically-indexable mapping. The namespace-import and
 * dynamic-import approaches both resolve to undefined at runtime here,
 * which made every icon fall back to `Box`.
 */
const ICON_REGISTRY: Record<string, LucideComponent> = {
  Box,
  Anchor,
  Frown,
  Image,
  Puzzle,
  Smile,
  Sparkles,
  Briefcase,
  FileText,
  Mail,
  Terminal,
  User,
  Gamepad2,
  Trophy,
  Activity,
  Rocket,
  LocateFixed,
  Hand,
  MousePointerClick,
  Check,
  X,
  Plus,
  Minus,
  Home,
  Menu,
  Search,
  Settings,
  Star,
  Heart,
};

/**
 * Convert an arbitrary icon name (PascalCase or kebab-case) to PascalCase.
 *   "gamepad-2" -> "Gamepad2", "map-pin" -> "MapPin", "anchor" -> "Anchor"
 */
function toPascalCase(name: string): string {
  if (!name) return 'Box';
  const cleaned = name.replace(/[\s_-]+/g, ' ');
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const iconCache = new Map<string, LucideComponent>();

/**
 * Resolve a lucide icon by name from the explicit registry.
 * Falls back to `Box` if the name isn't registered.
 */
export function lucideDynamic(name: string): LucideComponent {
  if (iconCache.has(name)) return iconCache.get(name)!;
  const key = toPascalCase(name);
  const Icon = ICON_REGISTRY[key];
  if (Icon) {
    iconCache.set(name, Icon);
    return Icon;
  }
  return FALLBACK_ICON;
}

/**
 * Renders a lucide icon by name, with a `Box` fallback.
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
  return <Icon className={className} style={style as IconProps['style']} />;
}
