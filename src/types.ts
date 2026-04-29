import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

export type ModuleType = 'ARTICLE_LIST' | 'SINGLE_PHOTO' | 'TEXT_LABEL' | 'SINGLE_ARTICLE';

export interface AppModule {
  id: string; // Unique identifier (e.g., 'ART', 'GLR')
  type: ModuleType;
  title: string;
  desc: string; // Description or the text itself for TEXT_LABEL
  iconName: IconName | string; 
  wpCategorySlug?: string; // used for WP fetch
  imageUrl?: string; // Direct image URL configuration for SINGLE_PHOTO
  size?: 'small' | 'medium' | 'large';
  articleId?: number; // Specific article ID for SINGLE_ARTICLE
}

export const DEFAULT_MODULES: AppModule[] = [
  { id: 'ABT', type: 'ARTICLE_LIST', title: 'ABOUT SECTION', desc: 'PERSONAL INFORMATION & BACKGROUND', iconName: 'User', wpCategorySlug: 'about' },
  { id: 'ART', type: 'ARTICLE_LIST', title: 'ARTICLES SECTION', desc: 'TECHNICAL & CREATIVE WRITINGS', iconName: 'FileText', wpCategorySlug: 'articles' },
  { id: 'PRJ', type: 'ARTICLE_LIST', title: 'PROJECTS SECTION', desc: 'DEVELOPMENT & RESEARCH INITIATIVES', iconName: 'Briefcase', wpCategorySlug: 'projects' },
  { id: 'GLR', type: 'SINGLE_PHOTO', title: 'GALLERY', desc: 'VISUAL ARTS & PHOTOGRAPHY', iconName: 'Image', wpCategorySlug: 'gallery' },
  { id: 'SYS', type: 'TEXT_LABEL', title: 'SYSTEM STATUS', desc: 'ALL SYSTEMS NOMINAL. SECURE CONNECTION ESTABLISHED.', iconName: 'Terminal' },
  { id: 'CNT', type: 'ARTICLE_LIST', title: 'CONTACT SECTION', desc: 'COMMUNICATION CHANNELS', iconName: 'Mail', wpCategorySlug: 'contact' },
];
