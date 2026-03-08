import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileUploadZone } from '@/components/upload/FileUploadZone';
import type { UploadedDocument, TemplateVariable } from '@/types/document';

interface DocumentUploadViewProps {
  variables: TemplateVariable[];
  onComplete: (documents: UploadedDocument[]) => void;
  onBack: () => void;
}

export function DocumentUploadView({ variables, onComplete, onBack }: DocumentUploadViewProps) {
  const [files, setFiles] = useState<UploadedDocument[]>([]);

  const handleContinue = () => {
    if (files.length > 0) {
      onComplete(files);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Envio de Documentos"
        subtitle="Envie os documentos do cliente para extração automática pela IA"
      />

      {/* Variables Summary */}
      {variables.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-secondary border border-border"
        >
          <p className="text-sm text-muted-foreground mb-2">
            <strong className="text-foreground">Campos a preencher:</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {variables.map((v) => (
              <span key={v.id} className="px-3 py-1 rounded-full bg-card text-xs font-medium text-foreground border border-border">
                {v.displayName}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upload Zone */}
      <div className="mb-8">
        <FileUploadZone
          title="Upload em lote"
          description="Arraste todos os documentos do cliente: RG, CNH, comprovantes, certidões, etc."
          accept="image/*,.pdf"
          multiple
          files={files}
          onFilesChange={setFiles}
          maxFiles={10}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex-1 px-5 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleContinue}
          disabled={files.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Processar com IA
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
