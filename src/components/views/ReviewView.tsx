import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, FileText, RotateCcw, Check } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { VariablesList } from '@/components/template/VariablesList';
import { DocumentPreview } from '@/components/template/DocumentPreview';
import type { TemplateVariable, UploadedDocument } from '@/types/document';

interface ReviewViewProps {
  templateContent: string;
  variables: TemplateVariable[];
  documents: UploadedDocument[];
  onExport: (format: 'pdf' | 'docx' | 'print') => void;
  onBack: () => void;
}

// Simulated AI extraction - in real app this would call the AI API
const simulateAIExtraction = (variables: TemplateVariable[]): TemplateVariable[] => {
  const mockData: Record<string, { value: string; confidence: number; source: string }> = {
    nome: { value: 'João da Silva Santos', confidence: 0.95, source: 'RG' },
    nome_comprador: { value: 'Maria Oliveira', confidence: 0.92, source: 'RG' },
    cpf: { value: '123.456.789-00', confidence: 0.98, source: 'RG' },
    cpf_comprador: { value: '987.654.321-00', confidence: 0.97, source: 'CNH' },
    rg: { value: '12.345.678-9', confidence: 0.94, source: 'RG' },
    endereco: { value: 'Rua das Flores, 123, Centro', confidence: 0.88, source: 'Comprovante' },
    cidade: { value: 'São Paulo', confidence: 0.96, source: 'Comprovante' },
    estado: { value: 'SP', confidence: 0.99, source: 'Comprovante' },
    data_nascimento: { value: '15/03/1985', confidence: 0.91, source: 'RG' },
    nacionalidade: { value: 'Brasileira', confidence: 0.93, source: 'RG' },
    estado_civil: { value: 'Solteiro(a)', confidence: 0.65, source: 'RG' },
    profissao: { value: '', confidence: 0, source: '' },
  };

  return variables.map((v) => {
    const data = mockData[v.name];
    if (data) {
      return {
        ...v,
        value: data.value,
        confidence: data.confidence,
        source: data.source,
      };
    }
    return v;
  });
};

export function ReviewView({ 
  templateContent, 
  variables: initialVariables, 
  documents, 
  onExport, 
  onBack 
}: ReviewViewProps) {
  const [variables, setVariables] = useState<TemplateVariable[]>(initialVariables);
  const [selectedVariableId, setSelectedVariableId] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(true);

  // Simulate AI processing
  useEffect(() => {
    const timer = setTimeout(() => {
      const extracted = simulateAIExtraction(initialVariables);
      setVariables(extracted);
      setIsProcessing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [initialVariables]);

  const handleVariableChange = useCallback((id: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, value, confidence: 1 } : v))
    );
  }, []);

  const filledCount = variables.filter((v) => v.value).length;
  const totalCount = variables.length;
  const progress = totalCount > 0 ? (filledCount / totalCount) * 100 : 0;

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Revisão do Documento"
        subtitle="Confira os dados extraídos e faça ajustes se necessário"
      >
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {filledCount}/{totalCount} campos
            </p>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-success"
              />
            </div>
          </div>
        </div>
      </PageHeader>

      {isProcessing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-accent/10 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <RotateCcw className="h-10 w-10 text-accent" />
              </motion.div>
            </div>
            <h3 className="heading-3 text-foreground mb-2">Processando documentos...</h3>
            <p className="text-muted-foreground">
              A IA está extraindo os dados dos {documents.length} documento(s) enviado(s)
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Split View */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Left: Form */}
            <div className="flex flex-col min-h-0">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-foreground">Dados Extraídos</h3>
                <span className="text-xs text-muted-foreground">
                  Clique para editar
                </span>
              </div>
              <div className="flex-1 overflow-auto scrollbar-thin pr-2">
                <VariablesList
                  variables={variables}
                  onVariableChange={handleVariableChange}
                  onVariableSelect={setSelectedVariableId}
                  selectedVariableId={selectedVariableId}
                />
              </div>
            </div>

            {/* Right: Preview */}
            <div className="min-h-0">
              <DocumentPreview
                content={templateContent}
                variables={variables}
                selectedVariableId={selectedVariableId}
              />
            </div>
          </div>

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center justify-between p-4 rounded-xl bg-card border border-border"
          >
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
            >
              Voltar
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onExport('docx')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Word
              </button>
              <button
                onClick={() => onExport('print')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
              <button
                onClick={() => onExport('pdf')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Exportar PDF
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
