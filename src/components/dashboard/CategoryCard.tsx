import { motion } from 'framer-motion';
import { FileText, File, Scroll, MoreHorizontal } from 'lucide-react';
import type { DocumentCategory } from '@/types/document';

interface CategoryCardProps {
  category: DocumentCategory;
  onClick: () => void;
  index: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'requerimentos': FileText,
  'declaracoes': File,
  'contratos': Scroll,
  'outros': MoreHorizontal,
};

export function CategoryCard({ category, onClick, index }: CategoryCardProps) {
  const Icon = iconMap[category.id] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card-interactive p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {category.templateCount} modelos
        </span>
      </div>
      
      <h3 className="heading-3 text-card-foreground mb-2">{category.name}</h3>
      <p className="body-small text-muted-foreground mb-4">{category.description}</p>
      
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Documentos necessários:
        </p>
        <ul className="text-sm text-muted-foreground">
          {category.requiredDocs.slice(0, 2).map((doc, i) => (
            <li key={i} className="truncate">{doc}</li>
          ))}
          {category.requiredDocs.length > 2 && (
            <li className="text-accent">+{category.requiredDocs.length - 2} mais</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
