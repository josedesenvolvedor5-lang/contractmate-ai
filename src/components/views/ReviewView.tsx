import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Printer, FileText, RotateCcw, AlertTriangle, Maximize2, Minimize2, PenLine, Eye } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { VariablesList } from '@/components/template/VariablesList';
import { DocumentPreview } from '@/components/template/DocumentPreview';
import type { TemplateVariable, UploadedDocument } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';
import { generateExportHtml, generateDocxHtml, getEmptyRequiredVariables } from '@/lib/template-utils';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import { cn } from '@/lib/utils';

interface ReviewViewProps {
  templateContent: string;
  variables: TemplateVariable[];
  documents: UploadedDocument[];
  onExport: (format: 'pdf' | 'docx' | 'print') => void;
  onBack: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
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
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string | null>(null);

  useEffect(() => {
    const extractWithAI = async () => {
      try {
        const supportedDocs = documents.filter(
          doc => doc.file.type.startsWith('image/') || doc.file.type === 'application/pdf'
        );

        if (supportedDocs.length === 0) {
          setIsProcessing(false);
          return;
        }

        const base64Files = await Promise.all(
          supportedDocs.map(doc => fileToBase64(doc.file))
        );

        const variablesPayload = initialVariables.map(v => ({
          name: v.name,
          displayName: v.displayName,
        }));

        const images = base64Files.filter(b => !b.startsWith('data:application/pdf'));
        const pdfs = base64Files.filter(b => b.startsWith('data:application/pdf'));

        const { data, error } = await supabase.functions.invoke('extract-document-data', {
          body: { variables: variablesPayload, images, pdfs },
        });

        if (error) {
          console.error('Extraction error:', error);
          setProcessingError('Erro ao processar documentos. Preencha manualmente.');
          setIsProcessing(false);
          return;
        }

        const results: Array<{ name: string; value: string; confidence: number }> = data?.results || [];

        const updated = initialVariables.map(v => {
          const match = results.find(r => r.name.toLowerCase() === v.name.toLowerCase());
          if (match && match.value) {
            return { ...v, value: match.value, confidence: match.confidence, source: 'IA' };
          }
          return v;
        });

        setVariables(updated);
      } catch (err) {
        console.error('Extraction failed:', err);
        setProcessingError('Erro ao processar documentos. Preencha manualmente.');
      } finally {
        setIsProcessing(false);
      }
    };

    extractWithAI();
  }, [initialVariables, documents]);

  const handleVariableChange = useCallback((id: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, value, confidence: 1 } : v))
    );
    // Reset edited HTML when variables change so preview re-renders
    setEditedHtml(null);
  }, []);

  const handleContentChange = useCallback((html: string) => {
    setEditedHtml(html);
  }, []);

  const validateBeforeExport = useCallback((): boolean => {
    const empty = getEmptyRequiredVariables(variables);
    if (empty.length > 0) {
      const names = empty.map(v => v.displayName).join(', ');
      toast.warning(`Campos obrigatórios vazios: ${names}`, {
        description: 'Preencha todos os campos obrigatórios antes de exportar.',
        duration: 5000,
      });
      setSelectedVariableId(empty[0].id);
      return false;
    }
    return true;
  }, [variables]);

  const getExportHtml = useCallback(() => {
    if (editedHtml) {
      return `<div style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.8; color: #1a1a1a; padding: 2rem; font-size: 12pt;">${editedHtml}</div>`;
    }
    return generateExportHtml(templateContent, variables);
  }, [editedHtml, templateContent, variables]);

  const handleDownloadPdf = useCallback(() => {
    if (!validateBeforeExport()) return;
    const html = getExportHtml();
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
    onExport('pdf');
  }, [getExportHtml, validateBeforeExport, onExport]);

  const handleDownloadDocx = useCallback(() => {
    if (!validateBeforeExport()) return;
    let docContent: string;
    if (editedHtml) {
      docContent = generateDocxHtml('', []);
      docContent = docContent.replace('<body></body>', `<body>${editedHtml}</body>`);
    } else {
      docContent = generateDocxHtml(templateContent, variables);
    }
    const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.doc';
    a.click();
    URL.revokeObjectURL(url);
    onExport('docx');
  }, [editedHtml, templateContent, variables, validateBeforeExport, onExport]);

  const handlePrint = useCallback(() => {
    if (!validateBeforeExport()) return;
    window.print();
    onExport('print');
  }, [validateBeforeExport, onExport]);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  const filledCount = variables.filter((v) => v.value).length;
  const totalCount = variables.length;
  const progress = totalCount > 0 ? (filledCount / totalCount) * 100 : 0;
  const emptyRequired = getEmptyRequiredVariables(variables);

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center min-h-[400px]"
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
    );
  }

  return (
    <>
      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            {/* Fullscreen header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
              <div className="flex items-center gap-4">
                <h3 className="heading-3 text-foreground">Edição do Documento</h3>
                <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                  <button
                    onClick={() => setEditMode(false)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      !editMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      editMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <PenLine className="h-3.5 w-3.5" />
                    Editar
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  {filledCount}/{totalCount} campos • <span className="text-xs">ESC para sair</span>
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Sair da tela cheia"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Fullscreen content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Variables sidebar in fullscreen */}
              <div className="w-80 border-r border-border overflow-auto scrollbar-thin p-4 bg-card/50">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-foreground mb-1">Dados Extraídos</h4>
                  <p className="text-xs text-muted-foreground">Clique para editar</p>
                </div>
                <VariablesList
                  variables={variables}
                  onVariableChange={handleVariableChange}
                  onVariableSelect={setSelectedVariableId}
                  selectedVariableId={selectedVariableId}
                />
              </div>

              {/* Document area */}
              <div className="flex-1 overflow-hidden">
                <DocumentPreview
                  content={templateContent}
                  variables={variables}
                  selectedVariableId={selectedVariableId}
                  editable={editMode}
                  onContentChange={handleContentChange}
                />
              </div>
            </div>

            {/* Fullscreen action bar */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-card">
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
              >
                Voltar
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadDocx}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Word
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal view */}
      <div className="flex flex-col">
        <PageHeader
          title="Revisão do Documento"
          subtitle="Confira os dados extraídos e faça ajustes se necessário"
        >
          <div className="flex items-center gap-4">
            {emptyRequired.length > 0 && (
              <div className="flex items-center gap-1.5 text-warning text-sm">
                <AlertTriangle className="h-4 w-4" />
                {emptyRequired.length} campo(s) pendente(s)
              </div>
            )}
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
              title="Tela cheia"
            >
              <Maximize2 className="h-4 w-4" />
              Tela Cheia
            </button>
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

        {processingError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            {processingError}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-foreground">Dados Extraídos</h3>
              <span className="text-xs text-muted-foreground">Clique para editar</span>
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

          <div className="min-h-[500px]">
            <DocumentPreview
              content={templateContent}
              variables={variables}
              selectedVariableId={selectedVariableId}
              editable={editMode}
              onContentChange={handleContentChange}
            />
          </div>
        </div>

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
              onClick={handlePrint}
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
      </div>
    </>
  );
}
