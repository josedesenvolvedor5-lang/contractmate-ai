import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText, Scroll, File, MoreHorizontal } from 'lucide-react';
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

export function DashboardView({ userName = 'Usuário', onStartWorkflow }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { templates } = useTemplates();

  // Dynamically compute template counts per category
  const categories: DocumentCategory[] = baseCategories.map((cat) => ({
    ...cat,
    templateCount: templates.filter((t) => t.category === cat.id).length,
  }));

  // Also add categories that exist in templates but not in baseCategories
  const existingIds = new Set(baseCategories.map((c) => c.id));
  const dynamicCategories = templates.reduce((acc, t) => {
    if (!existingIds.has(t.category) && !acc.find((c) => c.id === t.category)) {
      acc.push({
        id: t.category,
        name: t.category.charAt(0).toUpperCase() + t.category.slice(1),
        description: `Modelos de ${t.category}`,
        icon: 'FileText',
        requiredDocs: [],
        templateCount: templates.filter((tt) => tt.category === t.category).length,
      });
    }
    return acc;
  }, [] as DocumentCategory[]);

  const allCategories = [...categories, ...dynamicCategories];

  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busque o modelo..."
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
          <button
            onClick={() => onStartWorkflow('upload-template')}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
            onClick={() => onStartWorkflow('select-template', category.id, category.name)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="heading-3 text-foreground mb-2">Nenhum modelo encontrado</h3>
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
