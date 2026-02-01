import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { TemplateVariable } from '@/types/document';

interface DocumentPreviewProps {
  content: string;
  variables: TemplateVariable[];
  selectedVariableId?: string;
}

export function DocumentPreview({ content, variables, selectedVariableId }: DocumentPreviewProps) {
  const processedContent = useMemo(() => {
    let processed = content;
    
    variables.forEach((variable) => {
      const pattern = new RegExp(`\\{\\{${variable.name}\\}\\}|\\[${variable.name}\\]`, 'gi');
      const replacement = variable.value 
        ? `<span class="filled-variable" data-id="${variable.id}">${variable.value}</span>`
        : `<span class="empty-variable" data-id="${variable.id}">{{${variable.displayName}}}</span>`;
      processed = processed.replace(pattern, replacement);
    });

    return processed;
  }, [content, variables]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-elevated h-full overflow-hidden flex flex-col"
    >
      <div className="px-6 py-4 border-b border-border">
        <h3 className="heading-3 text-card-foreground">Pré-visualização do Documento</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Os campos preenchidos aparecem em destaque
        </p>
      </div>

      <div 
        className="flex-1 p-8 overflow-auto scrollbar-thin bg-background"
        style={{
          fontFamily: 'Georgia, serif',
          lineHeight: '1.8',
        }}
      >
        <div 
          className="max-w-none prose prose-slate"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
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
      `}</style>
    </motion.div>
  );
}
