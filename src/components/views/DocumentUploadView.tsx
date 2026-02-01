import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, FileText, Image } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileUploadZone } from '@/components/upload/FileUploadZone';
import type { UploadedDocument, TemplateVariable } from '@/types/document';

interface DocumentUploadViewProps {
  variables: TemplateVariable[];
  onComplete: (documents: UploadedDocument[]) => void;
  onBack: () => void;
}

const documentSlots = [
  { id: 'rg-cnh', name: 'RG / CNH', description: 'Documento de identificação com foto' },
  { id: 'comprovante', name: 'Comprovante Endereço', description: 'Conta de luz, água ou telefone' },
  { id: 'outros', name: 'Documento 3', description: 'Outros documentos necessários' },
];

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
        title="Elaboração de Requerimentos"
        subtitle="Inclua os documentos necessários em cada espaço:"
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

      {/* Document Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {documentSlots.map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-elevated p-6 text-center"
          >
            <h3 className="heading-3 text-card-foreground mb-2">{slot.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{slot.description}</p>
            
            <div className="aspect-video rounded-lg bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Clique ou arraste</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Multi-Upload Zone */}
      <div className="mb-8">
        <h3 className="heading-3 text-foreground mb-4">Ou envie todos de uma vez</h3>
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
