import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, FileText, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !content.trim()) return;
    setLoading(true);
    await onAdd(name, content, category);
    setLoading(false);
    setName('');
    setContent('');
    setCategory('contratos');
    setIsFullscreen(false);
    onClose();
  }, [name, content, category, onAdd, onClose]);

  const handleClose = useCallback(() => {
    setIsFullscreen(false);
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={
            isFullscreen
              ? "fixed inset-0 flex flex-col bg-card z-50"
              : "w-full max-w-4xl max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl"
          }
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="heading-3 text-card-foreground">Novo Modelo</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Use {'{{variável}}'} para campos de preenchimento automático
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {varCount > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-accent mr-2">
                  <FileText className="h-4 w-4" />
                  {varCount} campo(s)
                </span>
              )}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Maximize2 className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <button onClick={handleClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Meta fields */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-border bg-muted/30 shrink-0">
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
              className="h-full min-h-[300px] p-8 bg-background text-foreground focus:outline-none prose prose-slate max-w-none"
              style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
              suppressContentEditableWarning
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
            <p className="text-xs text-muted-foreground">
              Dica: {'{{nome_comprador}}'}, {'{{cpf}}'}, {'{{endereco}}'} serão preenchidos pela IA
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !content.trim() || loading}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
              >
                <Plus className="h-4 w-4" />
                {loading ? 'Salvando...' : 'Criar modelo'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
