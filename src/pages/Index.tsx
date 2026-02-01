import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { WorkflowSteps } from '@/components/workflow/WorkflowSteps';
import { DashboardView } from '@/components/views/DashboardView';
import { TemplateUploadView } from '@/components/views/TemplateUploadView';
import { DocumentUploadView } from '@/components/views/DocumentUploadView';
import { ReviewView } from '@/components/views/ReviewView';
import type { TemplateVariable, UploadedDocument, WorkflowStep } from '@/types/document';
import { toast } from 'sonner';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('select-template');
  const [completedSteps, setCompletedSteps] = useState<WorkflowStep[]>([]);
  
  // Workflow data
  const [templateContent, setTemplateContent] = useState('');
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
    if (page === 'dashboard') {
      // Reset workflow
      setWorkflowStep('select-template');
      setCompletedSteps([]);
      setTemplateContent('');
      setVariables([]);
      setDocuments([]);
    }
  }, []);

  const handleStartWorkflow = useCallback((step: WorkflowStep, categoryId?: string) => {
    setCurrentPage('workflow');
    setWorkflowStep(step);
    if (step === 'upload-documents' && categoryId) {
      // Pre-populate with category template
      setCompletedSteps(['select-template']);
    }
  }, []);

  const handleTemplateComplete = useCallback((content: string, vars: TemplateVariable[]) => {
    setTemplateContent(content);
    setVariables(vars);
    setCompletedSteps((prev) => [...prev, 'upload-template']);
    setWorkflowStep('upload-documents');
    toast.success(`${vars.length} variáveis detectadas no modelo`);
  }, []);

  const handleDocumentsComplete = useCallback((docs: UploadedDocument[]) => {
    setDocuments(docs);
    setCompletedSteps((prev) => [...prev, 'upload-documents']);
    setWorkflowStep('review');
    toast.success('Documentos enviados. Processando com IA...');
  }, []);

  const handleExport = useCallback((format: 'pdf' | 'docx' | 'print') => {
    // In real app, this would generate the actual file
    setCompletedSteps((prev) => [...prev, 'review', 'export']);
    toast.success(`Documento exportado em formato ${format.toUpperCase()}`);
  }, []);

  const handleStepClick = useCallback((step: WorkflowStep) => {
    setWorkflowStep(step);
  }, []);

  const handleBack = useCallback(() => {
    const stepOrder: WorkflowStep[] = ['select-template', 'upload-template', 'upload-documents', 'review', 'export'];
    const currentIndex = stepOrder.indexOf(workflowStep);
    if (currentIndex > 0) {
      setWorkflowStep(stepOrder[currentIndex - 1]);
    } else {
      handleNavigate('dashboard');
    }
  }, [workflowStep, handleNavigate]);

  const isWorkflow = currentPage === 'workflow';

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="flex-1 ml-64">
        {/* Workflow Steps Header */}
        {isWorkflow && (
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4">
            <WorkflowSteps
              currentStep={workflowStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
          </div>
        )}

        <div className={`p-8 ${isWorkflow ? 'pt-6' : ''}`}>
          <AnimatePresence mode="wait">
            {currentPage === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardView onStartWorkflow={handleStartWorkflow} />
              </motion.div>
            )}

            {isWorkflow && workflowStep === 'upload-template' && (
              <motion.div
                key="upload-template"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TemplateUploadView
                  onComplete={handleTemplateComplete}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {isWorkflow && workflowStep === 'upload-documents' && (
              <motion.div
                key="upload-documents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DocumentUploadView
                  variables={variables}
                  onComplete={handleDocumentsComplete}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {isWorkflow && workflowStep === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-[calc(100vh-10rem)]"
              >
                <ReviewView
                  templateContent={templateContent}
                  variables={variables}
                  documents={documents}
                  onExport={handleExport}
                  onBack={handleBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Index;
