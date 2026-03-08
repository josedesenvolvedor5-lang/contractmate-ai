import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, FileText, Scroll, File, MoreHorizontal, Clock, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { useTemplates } from '@/hooks/useTemplates';
import type { DocumentCategory, WorkflowStep } from '@/types/document';

const baseCategories: Omit<DocumentCategory, 'templateCount'>[] = [
  {
    id: 'contratos',
    name: 'Escrituras',
    description: 'Contratos comerciais e civis entre partes',
    icon: 'Scroll',
    requiredDocs: ['RG/CNH das partes', 'CPF', 'Certidão de Casamento', 'Comprovante de Endereço', 'Matrícula do Imóvel'],
  },
  {
    id: 'procuracoes',
    name: 'Procuração',
    description: 'Procurações e instrumentos de mandato',
    icon: 'File',
    requiredDocs: ['Cópia RG/CNH', 'Comprovante de Endereço', 'Certidão de Estado Civil'],
  },
  {
    id: 'diversos',
    name: 'Diversos',
    description: 'Uso Futuro',
    icon: 'MoreHorizontal',
    requiredDocs: ['Cópia documento das partes', 'Comprovante de Endereço'],
  },
];

interface DashboardViewProps {
  userName?: string;
  onStartWorkflow: (step: WorkflowStep, categoryId?: string, categoryName?: string) => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function DashboardView({ userName = 'Usuário', onStartWorkflow }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 250);
  const inputRef = useRef<HTMLInputElement>(null);
  const { templates } = useTemplates();

  // Compute all categories with counts (memoized)
  const allCategories = useMemo(() => {
    const categories: DocumentCategory[] = baseCategories.map((cat) => ({
      ...cat,
      templateCount: templates.filter((t) => t.category === cat.id).length,
    }));

    const existingIds = new Set(baseCategories.map((c) => c.id));
    templates.forEach((t) => {
      if (!existingIds.has(t.category) && !categories.find((c) => c.id === t.category)) {
        existingIds.add(t.category);
        categories.push({
          id: t.category,
          name: t.category.charAt(0).toUpperCase() + t.category.slice(1),
          description: `Modelos de ${t.category}`,
          icon: 'FileText',
          requiredDocs: [],
          templateCount: templates.filter((tt) => tt.category === t.category).length,
        });
      }
    });

    return categories;
  }, [templates]);

  // Filter categories AND templates by debounced query
  const { filteredCategories, matchedTemplates } = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) {
      return { filteredCategories: allCategories, matchedTemplates: [] };
    }

    const catMatches = allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(q)
    );

    const tplMatches = templates.filter((t) =>
      t.name.toLowerCase().includes(q)
    );

    return { filteredCategories: catMatches, matchedTemplates: tplMatches };
  }, [debouncedQuery, allCategories, templates]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    inputRef.current?.focus();
  }, []);

  const hasResults = filteredCategories.length > 0 || matchedTemplates.length > 0;

  return (
    <div>
      <PageHeader
        title={`Bem vindo ${userName},`}
        subtitle="selecione o documento desejado..."
      />

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busque por categoria ou modelo..."
            className="w-full pl-12 pr-20 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onStartWorkflow('upload-template')}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Template search results */}
      <AnimatePresence>
        {debouncedQuery && matchedTemplates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mb-6"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Modelos encontrados ({matchedTemplates.length})
            </h3>
            <div className="space-y-2">
              {matchedTemplates.map((tpl) => (
                <motion.button
                  key={tpl.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onStartWorkflow('select-template', tpl.category, allCategories.find(c => c.id === tpl.category)?.name || tpl.category)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-accent hover:bg-secondary/50 transition-all text-left group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary group-hover:bg-accent group-hover:text-accent-foreground transition-colors shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{tpl.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{allCategories.find(c => c.id === tpl.category)?.name || tpl.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tpl.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                      <span>•</span>
                      <span>{tpl.variables.length} campos</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Cards */}
      {filteredCategories.length > 0 && (
        <>
          {debouncedQuery && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Categorias</h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                onClick={() => onStartWorkflow('select-template', category.id, category.name)}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!hasResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="heading-3 text-foreground mb-2">Nenhum resultado para "{debouncedQuery}"</h3>
          <p className="body-regular text-muted-foreground mb-6">
            Tente buscar por outro termo ou crie um novo modelo
          </p>
          <button
            onClick={() => onStartWorkflow('upload-template')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Criar novo modelo
          </button>
        </motion.div>
      )}
    </div>
  );
}
