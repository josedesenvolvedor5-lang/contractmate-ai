import type { Template } from '@/types/document';
import { contratoTemplates } from './contractTemplates';

export const allTemplates = [...contratoTemplates];

export function getTemplatesByCategory(category: string): Template[] {
  return allTemplates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return allTemplates.find((t) => t.id === id);
}
