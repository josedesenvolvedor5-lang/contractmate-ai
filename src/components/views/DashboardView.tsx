import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText, Scroll, File, MoreHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import type { DocumentCategory, WorkflowStep } from '@/types/document';

const categories: DocumentCategory[] = [
  {
    id: 'requerimentos',
    name: 'Requerimentos',
    description: 'Pedidos formais para órgãos públicos e privados',
    icon: 'FileText',
    requiredDocs: ['Cópia documento', 'Comprovante de Endereço'],
    templateCount: 8,
  },
  {
    id: 'declaracoes',
    name: 'Declarações',
    description: 'Declarações de fé pública e manifestações formais',
    icon: 'File',
    requiredDocs: ['Cópia documento', 'Comprovante de Endereço'],
    templateCount: 12,
  },
  {
    id: 'contratos',
    name: 'Contratos',
    description: 'Contratos comerciais e civis entre partes',
    icon: 'Scroll',
    requiredDocs: ['Cópia documento das partes', 'Comprovante de Endereço', 'Certidão de Nascimento'],
    templateCount: 15,
  },
];

interface DashboardViewProps {
  userName?: string;
  onStartWorkflow: (step: WorkflowStep, categoryId?: string) => void;
}

export function DashboardView({ userName = 'Usuário', onStartWorkflow }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((cat) =>
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
            onClick={() => onStartWorkflow('upload-documents', category.id)}
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
