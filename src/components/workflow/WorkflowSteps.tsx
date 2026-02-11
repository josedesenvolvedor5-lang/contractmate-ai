import { motion } from 'framer-motion';
import { Check, FileText, Upload, Eye, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkflowStep } from '@/types/document';

interface Step {
  id: WorkflowStep;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  { id: 'select-template', label: 'Modelo', icon: FileText },
  { id: 'upload-documents', label: 'Documentos', icon: Upload },
  { id: 'review', label: 'Revisão', icon: Eye },
  { id: 'export', label: 'Exportar', icon: Download },
];

interface WorkflowStepsProps {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  onStepClick?: (step: WorkflowStep) => void;
}

export function WorkflowSteps({ currentStep, completedSteps, onStepClick }: WorkflowStepsProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || index <= currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  "relative flex flex-col items-center gap-2 transition-all",
                  isClickable && "cursor-pointer"
                )}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted 
                      ? 'hsl(var(--success))' 
                      : isCurrent 
                        ? 'hsl(var(--accent))' 
                        : 'hsl(var(--muted))',
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    isCompleted && "text-success-foreground",
                    isCurrent && "text-accent-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-3">
                  <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isCompleted ? '100%' : index < currentIndex ? '100%' : '0%' 
                      }}
                      className="h-full bg-success"
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
