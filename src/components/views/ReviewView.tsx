import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, FileText, RotateCcw, Check } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { VariablesList } from '@/components/template/VariablesList';
import { DocumentPreview } from '@/components/template/DocumentPreview';
import type { TemplateVariable, UploadedDocument } from '@/types/document';
import html2pdf from 'html2pdf.js';

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

  const getProcessedHtml = useCallback(() => {
    let processed = templateContent;
    variables.forEach((variable) => {
      const pattern = new RegExp(`\\{\\{${variable.name}\\}\\}|\\[${variable.name}\\]`, 'gi');
      const value = variable.value || `{{${variable.displayName}}}`;
      processed = processed.replace(pattern, value);
    });
    return `<div style="font-family: Georgia, serif; line-height: 1.8; color: #1a1a1a; padding: 2rem;">${processed}</div>`;
  }, [templateContent, variables]);

  const handleDownloadPdf = useCallback(() => {
    const html = getProcessedHtml();
    const container = document.createElement('div');
    container.innerHTML = html;
    html2pdf()
      .set({
        margin: [15, 15, 15, 15],
        filename: 'documento.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(container)
      .save();
  }, [getProcessedHtml]);

  const handleDownloadDocx = useCallback(() => {
    const html = getProcessedHtml();
    const docContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><style>body { font-family: Georgia, serif; line-height: 1.8; }</style></head>
      <body>${html}</body></html>`;
    const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.doc';
    a.click();
    URL.revokeObjectURL(url);
  }, [getProcessedHtml]);

  const filledCount = variables.filter((v) => v.value).length;
  const totalCount = variables.length;
  const progress = totalCount > 0 ? (filledCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-foreground">Dados Extraídos</h3>
                <span className="text-xs text-muted-foreground">
                  Clique para editar
                </span>
              </div>
              <div className="overflow-auto scrollbar-thin pr-2 max-h-[calc(100vh-16rem)]">
                <VariablesList
                  variables={variables}
                  onVariableChange={handleVariableChange}
                  onVariableSelect={setSelectedVariableId}
                  selectedVariableId={selectedVariableId}
                />
              </div>
            </div>

            {/* Right: Preview */}
            <div className="min-h-[500px]">
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
                onClick={handleDownloadDocx}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Baixar Word
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar PDF
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
