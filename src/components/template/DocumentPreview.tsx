import { useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { TemplateVariable } from '@/types/document';
import { replaceVariables } from '@/lib/template-utils';
import { FormattingToolbar } from './FormattingToolbar';

interface DocumentPreviewProps {
  content: string;
  variables: TemplateVariable[];
  selectedVariableId?: string;
  editable?: boolean;
  onContentChange?: (html: string) => void;
}

export function DocumentPreview({ content, variables, selectedVariableId, editable = false, onContentChange }: DocumentPreviewProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const processedContent = useMemo(() => {
    return replaceVariables(content, variables, 'preview');
  }, [content, variables]);

  const handleInput = useCallback(() => {
    if (editorRef.current && onContentChange) {
      onContentChange(editorRef.current.innerHTML);
    }
  }, [onContentChange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-elevated h-full overflow-hidden flex flex-col"
    >
      <div className="px-6 py-4 border-b border-border">
        <h3 className="heading-3 text-card-foreground">Pré-visualização do Documento</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {editable ? 'Edite o texto diretamente no documento' : 'Os campos preenchidos aparecem em destaque'}
        </p>
      </div>

      {editable && <FormattingToolbar editorRef={editorRef} />}

      <div 
        className="flex-1 p-8 overflow-auto scrollbar-thin bg-background"
        style={{
          fontFamily: 'Georgia, serif',
          lineHeight: '1.8',
        }}
      >
        {editable ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="max-w-none prose prose-slate outline-none min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        ) : (
          <div 
            className="max-w-none prose prose-slate"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        )}
      </div>

      <style>{`
        .filled-variable {
          background-color: hsl(var(--success) / 0.15);
          color: hsl(var(--success));
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }
        
        .empty-variable {
          background-color: hsl(var(--warning) / 0.15);
          color: hsl(var(--warning));
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }

        .prose {
          font-size: 1rem;
          color: hsl(var(--foreground));
        }

        .prose p {
          margin-bottom: 1rem;
        }

        .prose h1, .prose h2, .prose h3 {
          font-family: 'Playfair Display', serif;
          color: hsl(var(--foreground));
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        [contenteditable]:focus {
          outline: none;
        }

        [contenteditable] .filled-variable,
        [contenteditable] .empty-variable {
          cursor: text;
        }
      `}</style>
    </motion.div>
  );
}
