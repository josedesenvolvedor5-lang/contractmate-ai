import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, FileText, AlertCircle, Check } from 'lucide-react';
import mammoth from 'mammoth';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileUploadZone } from '@/components/upload/FileUploadZone';
import type { UploadedDocument, TemplateVariable, WorkflowStep } from '@/types/document';

interface TemplateUploadViewProps {
  onComplete: (content: string, variables: TemplateVariable[]) => void;
  onBack: () => void;
}

const variablePatterns = [
  /\{\{([^}]+)\}\}/g,
  /\[([^\]]+)\]/g,
];

const displayNameMap: Record<string, string> = {
  nome: 'Nome Completo',
  nome_comprador: 'Nome do Comprador',
  nome_vendedor: 'Nome do Vendedor',
  cpf: 'CPF',
  cpf_comprador: 'CPF do Comprador',
  cpf_vendedor: 'CPF do Vendedor',
  rg: 'RG',
  endereco: 'Endereço',
  cidade: 'Cidade',
  estado: 'Estado',
  cep: 'CEP',
  data_nascimento: 'Data de Nascimento',
  nacionalidade: 'Nacionalidade',
  estado_civil: 'Estado Civil',
  profissao: 'Profissão',
  validade_cnh: 'Validade CNH',
  numero_cnh: 'Número CNH',
  telefone: 'Telefone',
  email: 'E-mail',
};

export function TemplateUploadView({ onComplete, onBack }: TemplateUploadViewProps) {
  const [files, setFiles] = useState<UploadedDocument[]>([]);
  const [processing, setProcessing] = useState(false);
  const [detectedVariables, setDetectedVariables] = useState<TemplateVariable[]>([]);
  const [templateContent, setTemplateContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const extractVariables = useCallback((text: string): TemplateVariable[] => {
    const variables: Map<string, TemplateVariable> = new Map();

    variablePatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const varName = match[1].trim().toLowerCase().replace(/\s+/g, '_');
        if (!variables.has(varName)) {
          variables.set(varName, {
            id: `var-${varName}-${Date.now()}`,
            name: varName,
            displayName: displayNameMap[varName] || varName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            type: varName.includes('cpf') ? 'cpf' : varName.includes('rg') ? 'rg' : varName.includes('data') ? 'date' : 'text',
            required: true,
          });
        }
      }
    });

    return Array.from(variables.values());
  }, []);

  const processTemplate = useCallback(async (file: File) => {
    setProcessing(true);
    setError(null);

    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;
        setTemplateContent(html);
        const vars = extractVariables(html);
        setDetectedVariables(vars);
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        const text = await file.text();
        setTemplateContent(text);
        const vars = extractVariables(text);
        setDetectedVariables(vars);
      } else {
        throw new Error('Formato não suportado. Use .docx ou .html');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
    } finally {
      setProcessing(false);
    }
  }, [extractVariables]);

  const handleFilesChange = useCallback((newFiles: UploadedDocument[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0 && newFiles[0].file) {
      processTemplate(newFiles[0].file);
    } else {
      setDetectedVariables([]);
      setTemplateContent('');
    }
  }, [processTemplate]);

  const handleContinue = () => {
    if (templateContent && detectedVariables.length > 0) {
      onComplete(templateContent, detectedVariables);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Upload do Modelo"
        subtitle="Envie seu contrato Word ou HTML com as variáveis marcadas (ex: {{nome}}, [cpf])"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Zone */}
        <div>
          <FileUploadZone
            title="Arraste seu modelo aqui"
            description="Arquivos .docx ou .html com variáveis marcadas"
            accept=".docx,.html,.htm"
            files={files}
            onFilesChange={handleFilesChange}
            maxFiles={1}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Detected Variables */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Variáveis Detectadas</h3>
                <p className="text-sm text-muted-foreground">
                  {processing ? 'Analisando...' : `${detectedVariables.length} campos encontrados`}
                </p>
              </div>
            </div>

            {processing ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : detectedVariables.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-auto scrollbar-thin">
                {detectedVariables.map((variable, index) => (
                  <motion.div
                    key={variable.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                      <Check className="h-3.5 w-3.5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{variable.displayName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{`{{${variable.name}}}`}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Envie um modelo para detectar as variáveis
                </p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onBack}
              className="flex-1 px-5 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleContinue}
              disabled={detectedVariables.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
