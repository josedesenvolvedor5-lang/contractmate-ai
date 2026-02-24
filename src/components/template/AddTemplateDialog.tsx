import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, FileText } from 'lucide-react';

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

  // Count detected variables
  const varCount = (content.match(/\{\{[^}]+\}\}/g) || []).length;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-card border border-border rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="heading-3 text-card-foreground">Novo Modelo</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Crie um modelo com campos {'{{variável}}'} para preenchimento automático
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome do modelo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Contrato de Locação"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="contratos">Escrituras</option>
                <option value="procuracoes">Procuração</option>
                <option value="diversos">Diversos</option>
              </select>
            </div>

            {/* Content - Editor only */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Conteúdo do modelo
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Use {'{{nome_do_campo}}'} para criar campos que serão preenchidos automaticamente pela IA.
                Ex: {'{{nome_comprador}}'}, {'{{cpf}}'}, {'{{endereco}}'}
              </p>
              <div
                contentEditable
                onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
                className="w-full min-h-[200px] max-h-[300px] overflow-auto p-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent prose prose-sm max-w-none"
                style={{ fontFamily: 'Georgia, serif', lineHeight: '1.6' }}
                suppressContentEditableWarning
              />
            </div>

            {/* Variable count */}
            {varCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-accent">
                <FileText className="h-4 w-4" />
                {varCount} campo(s) detectado(s) automaticamente
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !content.trim() || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {loading ? 'Salvando...' : 'Criar modelo'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
