import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, FileText, Clock, ChevronRight, X, CheckCircle2, Pencil, Eye, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DocumentPreview } from '@/components/template/DocumentPreview';
import { AddTemplateDialog } from '@/components/template/AddTemplateDialog';
import { useTemplates } from '@/hooks/useTemplates';
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
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { templates, loading, addTemplate, updateTemplate, deleteTemplate } = useTemplates(categoryId);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = useCallback(() => {
    if (previewTemplate) {
      setEditedContent(previewTemplate.content);
      setIsEditing(true);
    }
  }, [previewTemplate]);

  const handleSaveEdit = useCallback(async () => {
    if (previewTemplate) {
      const variableRegex = /\{\{([^}]+)\}\}/g;
      const existingVarsByName = new Map(previewTemplate.variables.map(v => [v.name.toLowerCase(), v]));
      const newVars: TemplateVariable[] = [];
      const seen = new Set<string>();
      let match;
      let idx = 0;

      while ((match = variableRegex.exec(editedContent)) !== null) {
        const varName = match[1].trim();
        const key = varName.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          idx++;
          const existing = existingVarsByName.get(key);
          newVars.push(existing || {
            id: `v${idx}_${Date.now()}`,
            name: varName,
            displayName: varName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            type: 'text',
            required: true,
          });
        }
      }

      const saved = await updateTemplate(previewTemplate.id, editedContent, newVars);
      if (saved) {
        setPreviewTemplate({ ...previewTemplate, content: editedContent, variables: newVars });
        setIsEditing(false);
      }
    }
  }, [previewTemplate, editedContent, updateTemplate]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedContent('');
  }, []);

  // Full preview mode
  if (previewTemplate) {
    const emptyVars = previewTemplate.variables.map(v => ({ ...v, value: undefined }));
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setPreviewTemplate(null); setIsEditing(false); }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="heading-3 text-foreground">{previewTemplate.name}</h2>
              <p className="text-sm text-muted-foreground">{previewTemplate.variables.length} campos detectados</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Salvar alterações
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  Editar modelo
                </button>
                <button
                  onClick={() => onSelectTemplate(previewTemplate)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Usar este modelo
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col card-elevated overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="heading-3 text-card-foreground">Editor do Modelo</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Edite o texto diretamente. Os campos entre {'{{chaves}}'} serão preenchidos automaticamente.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                  Modo edição
                </div>
              </div>
              <div
                ref={(el) => {
                  if (el && !el.dataset.initialized) {
                    el.innerHTML = editedContent;
                    el.dataset.initialized = 'true';
                  }
                }}
                contentEditable
                onInput={(e) => setEditedContent((e.target as HTMLDivElement).innerHTML)}
                className="flex-1 p-8 overflow-auto scrollbar-thin bg-background text-foreground focus:outline-none prose prose-slate max-w-none"
                style={{
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1.8',
                  minHeight: '300px',
                }}
                suppressContentEditableWarning
              />
            </motion.div>
          ) : (
            <DocumentPreview
              content={previewTemplate.content}
              variables={emptyVars as TemplateVariable[]}
            />
          )}
        </div>
      </div>
    );
  }

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

      {/* Search + Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar modelo..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
          Novo modelo
        </button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Carregando modelos...</p>
        </div>
      )}

      {/* Template List */}
      {!loading && (
        <div className="space-y-3">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setPreviewTemplate(template)}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTemplate(template.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  title="Excluir modelo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTemplates.length === 0 && (
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
          <p className="body-regular text-muted-foreground mb-4">
            Crie um novo modelo ou tente buscar por outro termo
          </p>
          <button
            onClick={() => setShowAddDialog(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Criar modelo
          </button>
        </motion.div>
      )}

      {/* Add Template Dialog */}
      <AddTemplateDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={addTemplate}
      />
    </div>
  );
}
