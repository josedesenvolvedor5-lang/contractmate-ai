import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, FileText, Clock, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { getTemplatesByCategory } from '@/data/templates';
import type { Template, TemplateVariable } from '@/types/document';

interface TemplateSelectionViewProps {
  categoryId: string;
  categoryName: string;
  onSelectTemplate: (template: Template) => void;
  onBack: () => void;
}

export function TemplateSelectionView({
  categoryId,
  categoryName,
  onSelectTemplate,
  onBack,
}: TemplateSelectionViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const templates = getTemplatesByCategory(categoryId);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <PageHeader
          title={categoryName}
          subtitle="Selecione um modelo para preencher"
        />
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar modelo..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
      </motion.div>

      {/* Template List */}
      <div className="space-y-3">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectTemplate(template)}
            className="card-interactive p-5 cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="heading-3 text-card-foreground mb-1">
                  {template.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {template.createdAt.toLocaleDateString('pt-BR')}
                  </span>
                  <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                    {template.variables.length} campos
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="heading-3 text-foreground mb-2">
            Nenhum modelo encontrado
          </h3>
          <p className="body-regular text-muted-foreground">
            Tente buscar por outro termo
          </p>
        </motion.div>
      )}
    </div>
  );
}
