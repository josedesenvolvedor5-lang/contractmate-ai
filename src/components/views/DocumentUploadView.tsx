import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Plus, X, Pencil, Check } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileUploadZone } from '@/components/upload/FileUploadZone';
import type { UploadedDocument, TemplateVariable, Party } from '@/types/document';
import { detectParties, PARTY_COLORS } from '@/lib/template-utils';
import { cn } from '@/lib/utils';

interface DocumentUploadViewProps {
  variables: TemplateVariable[];
  onComplete: (documents: UploadedDocument[]) => void;
  onBack: () => void;
}

export function DocumentUploadView({ variables, onComplete, onBack }: DocumentUploadViewProps) {
  const { parties: detectedParties } = useMemo(() => detectParties(variables), [variables]);

  // Editable parties list — starts with auto-detected ones
  const [parties, setParties] = useState<Party[]>(detectedParties);
  const [newPartyName, setNewPartyName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [editingPartyId, setEditingPartyId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  const handleAddParty = useCallback(() => {
    const name = newPartyName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (parties.some(p => p.id === id)) return;
    const color = PARTY_COLORS[(parties.length) % PARTY_COLORS.length];
    setParties(prev => [...prev, { id, label: name, color }]);
    setFilesByParty(prev => ({ ...prev, [id]: [] }));
    setNewPartyName('');
    setShowAddInput(false);
  }, [newPartyName, parties]);

  const handleRemoveParty = useCallback((partyId: string) => {
    setParties(prev => prev.filter(p => p.id !== partyId));
    setFilesByParty(prev => {
      const next = { ...prev };
      // Move files from removed party to general
      if (next[partyId]?.length) {
        next.general = [...(next.general || []), ...next[partyId]];
      }
      delete next[partyId];
      return next;
    });
  }, []);

  const handleRenameParty = useCallback((partyId: string) => {
    const name = editingName.trim();
    if (!name) return;
    setParties(prev => prev.map(p => p.id === partyId ? { ...p, label: name } : p));
    setEditingPartyId(null);
    setEditingName('');
  }, [editingName]);

  const handleContinue = () => {
    if (totalFiles === 0) return;
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
          className="mb-6 p-4 rounded-xl bg-secondary border border-border"
        >
          <p className="text-sm text-muted-foreground mb-2">
            <strong className="text-foreground">Campos a preencher:</strong>
            {hasParties && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({parties.length} parte{parties.length > 1 ? 's' : ''})
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {variables.map((v) => {
              const party = parties.find(p => 
                v.name.toLowerCase().startsWith(p.id + '_') || 
                v.name.toLowerCase().endsWith('_' + p.id)
              );
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

      {/* Party Management Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Partes / Lotes de Documentos</h3>
          </div>
          {!showAddInput && (
            <button
              onClick={() => setShowAddInput(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar Parte
            </button>
          )}
        </div>

        {/* Existing parties as chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {parties.map(party => (
            <div
              key={party.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{
                borderColor: party.color,
                color: party.color,
                backgroundColor: `${party.color}10`,
              }}
            >
              {editingPartyId === party.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRenameParty(party.id)}
                    className="w-24 bg-transparent border-b outline-none text-xs"
                    style={{ borderColor: party.color }}
                    autoFocus
                  />
                  <button onClick={() => handleRenameParty(party.id)} className="hover:opacity-70">
                    <Check className="h-3 w-3" />
                  </button>
                  <button onClick={() => setEditingPartyId(null)} className="hover:opacity-70">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <>
                  <span>{party.label}</span>
                  <button
                    onClick={() => { setEditingPartyId(party.id); setEditingName(party.label); }}
                    className="hover:opacity-70"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button onClick={() => handleRemoveParty(party.id)} className="hover:opacity-70">
                    <X className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          ))}

          {parties.length === 0 && !showAddInput && (
            <p className="text-xs text-muted-foreground">
              Nenhuma parte detectada. Clique em "Adicionar Parte" para criar lotes separados.
            </p>
          )}
        </div>

        {/* Add new party input */}
        <AnimatePresence>
          {showAddInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mt-2"
            >
              <input
                type="text"
                value={newPartyName}
                onChange={e => setNewPartyName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddParty()}
                placeholder="Nome da parte (ex: Juiz, Réu, Fiador...)"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <button
                onClick={handleAddParty}
                disabled={!newPartyName.trim()}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Adicionar
              </button>
              <button
                onClick={() => { setShowAddInput(false); setNewPartyName(''); }}
                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
