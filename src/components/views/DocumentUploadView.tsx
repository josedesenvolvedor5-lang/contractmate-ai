import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileUploadZone } from '@/components/upload/FileUploadZone';
import type { UploadedDocument, TemplateVariable, Party } from '@/types/document';
import { detectParties } from '@/lib/template-utils';

interface DocumentUploadViewProps {
  variables: TemplateVariable[];
  onComplete: (documents: UploadedDocument[]) => void;
  onBack: () => void;
}

export function DocumentUploadView({ variables, onComplete, onBack }: DocumentUploadViewProps) {
  const { parties } = useMemo(() => detectParties(variables), [variables]);
  const hasParties = parties.length > 0;

  // Files per party + general
  const [filesByParty, setFilesByParty] = useState<Record<string, UploadedDocument[]>>(() => {
    const init: Record<string, UploadedDocument[]> = { general: [] };
    parties.forEach(p => { init[p.id] = []; });
    return init;
  });

  const handleFilesChange = (partyId: string, files: UploadedDocument[]) => {
    setFilesByParty(prev => ({ ...prev, [partyId]: files }));
  };

  const totalFiles = Object.values(filesByParty).reduce((sum, f) => sum + f.length, 0);

  const handleContinue = () => {
    if (totalFiles === 0) return;
    // Flatten all files and tag with partyId
    const allDocs: UploadedDocument[] = [];
    for (const [partyId, docs] of Object.entries(filesByParty)) {
      docs.forEach(doc => {
        allDocs.push({ ...doc, partyId: partyId === 'general' ? undefined : partyId });
      });
    }
    onComplete(allDocs);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Envio de Documentos"
        subtitle={hasParties
          ? "Envie os documentos separados por parte para melhor extração pela IA"
          : "Envie os documentos do cliente para extração automática pela IA"
        }
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
            {hasParties && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({parties.length} parte{parties.length > 1 ? 's' : ''} detectada{parties.length > 1 ? 's' : ''})
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {variables.map((v) => {
              const prefix = v.party || v.name.split('_')[0];
              const party = parties.find(p => p.id === prefix);
              return (
                <span
                  key={v.id}
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={party ? {
                    borderColor: party.color,
                    color: party.color,
                    backgroundColor: `${party.color}10`,
                  } : {}}
                >
                  {party && <span className="opacity-60 mr-1">{party.label}:</span>}
                  {v.displayName}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Upload zones per party */}
      {hasParties ? (
        <div className="space-y-6 mb-8">
          {parties.map((party) => (
            <motion.div
              key={party.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${party.color}15`, color: party.color }}
                >
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{party.label}</h3>
                <span className="text-xs text-muted-foreground">
                  — RG, CNH, comprovantes deste participante
                </span>
              </div>
              <FileUploadZone
                title={`Documentos do ${party.label}`}
                description={`Arraste os documentos do ${party.label}: RG, CNH, comprovantes, certidões`}
                accept="image/*,.pdf"
                multiple
                files={filesByParty[party.id] || []}
                onFilesChange={(files) => handleFilesChange(party.id, files)}
                maxFiles={10}
              />
            </motion.div>
          ))}

          {/* General docs */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-foreground">Documentos gerais</h3>
              <span className="text-xs text-muted-foreground">
                — Matrícula do imóvel, certidões, etc.
              </span>
            </div>
            <FileUploadZone
              title="Documentos gerais"
              description="Documentos que não pertencem a uma parte específica"
              accept="image/*,.pdf"
              multiple
              files={filesByParty.general || []}
              onFilesChange={(files) => handleFilesChange('general', files)}
              maxFiles={10}
            />
          </motion.div>
        </div>
      ) : (
        <div className="mb-8">
          <FileUploadZone
            title="Upload em lote"
            description="Arraste todos os documentos do cliente: RG, CNH, comprovantes, certidões, etc."
            accept="image/*,.pdf"
            multiple
            files={filesByParty.general || []}
            onFilesChange={(files) => handleFilesChange('general', files)}
            maxFiles={10}
          />
        </div>
      )}

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
          disabled={totalFiles === 0}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Processar com IA
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
