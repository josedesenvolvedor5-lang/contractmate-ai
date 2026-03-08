import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, FileText } from 'lucide-react';
import { FormattingToolbar } from './FormattingToolbar';

interface AddTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, content: string, category: string) => Promise<unknown>;
}

export function AddTemplateDialog({ open, onClose, onAdd }: AddTemplateDialogProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('contratos');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !content.trim()) return;
    setLoading(true);
    await onAdd(name, content, category);
    setLoading(false);
    setName('');
    setContent('');
    setCategory('contratos');
    onClose();
  }, [name, content, category, onAdd, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const varCount = (content.match(/\{\{[^}]+\}\}/g) || []).length;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={handleClose} className="p-2 rounded-lg hover:bg-secondary transition-colors shrink-0">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-card-foreground truncate">Novo Modelo</h2>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Use {'{{variável}}'} para campos automáticos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {varCount > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-accent mr-2">
                <FileText className="h-4 w-4" />
                {varCount} campo(s)
              </span>
            )}
            <button
              onClick={handleClose}
              className="px-3 sm:px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !content.trim() || loading}
              className="flex items-center gap-2 px-3 sm:px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{loading ? 'Salvando...' : 'Criar modelo'}</span>
              <span className="sm:hidden">{loading ? '...' : 'Criar'}</span>
            </button>
          </div>
        </div>

        {/* Meta fields */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 border-b border-border bg-muted/30 shrink-0">
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do modelo (ex: Contrato de Locação)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          >
            <option value="contratos">Escrituras</option>
            <option value="procuracoes">Procuração</option>
            <option value="diversos">Diversos</option>
          </select>
        </div>

        {/* Formatting toolbar */}
        <FormattingToolbar editorRef={editorRef} />

        {/* Editor */}
        <div className="flex-1 overflow-auto min-h-0">
          <div
            ref={editorRef}
            contentEditable
            onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
            className="h-full min-h-[200px] p-4 sm:p-8 bg-background text-foreground focus:outline-none prose prose-slate max-w-none"
            style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
            suppressContentEditableWarning
          />
        </div>

        {/* Footer hint - mobile hidden */}
        <div className="hidden sm:flex items-center px-6 py-2 border-t border-border shrink-0">
          <p className="text-xs text-muted-foreground">
            Dica: {'{{nome_comprador}}'}, {'{{cpf}}'}, {'{{endereco}}'} serão preenchidos pela IA
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
