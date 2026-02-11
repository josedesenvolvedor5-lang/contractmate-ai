import { motion } from 'framer-motion';
import { Check, FileText, Upload, Eye, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkflowStep } from '@/types/document';
interface Step {
  id: WorkflowStep;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}
const steps: Step[] = [{
  id: 'select-template',
  label: 'Modelo',
  icon: FileText
}, {
  id: 'upload-documents',
  label: 'Documentos',
  icon: Upload
}, {
  id: 'review',
  label: 'Revisão',
  icon: Eye
}, {
  id: 'export',
  label: 'Exportar',
  icon: Download
}];
interface WorkflowStepsProps {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  onStepClick?: (step: WorkflowStep) => void;
}
export function WorkflowSteps({
  currentStep,
  completedSteps,
  onStepClick
}: WorkflowStepsProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  return <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isClickable = isCompleted || index <= currentIndex;
        return;
      })}
      </div>
    </div>;
}