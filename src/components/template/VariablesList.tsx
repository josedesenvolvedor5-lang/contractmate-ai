import { motion } from 'framer-motion';
import { Check, AlertTriangle, Edit3 } from 'lucide-react';
import type { TemplateVariable } from '@/types/document';
import { cn } from '@/lib/utils';

interface VariablesListProps {
  variables: TemplateVariable[];
  onVariableChange: (id: string, value: string) => void;
  onVariableSelect?: (id: string) => void;
  selectedVariableId?: string;
}

export function VariablesList({ 
  variables, 
  onVariableChange, 
  onVariableSelect,
  selectedVariableId 
}: VariablesListProps) {
  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    if (confidence >= 0.9) {
      return (
        <span className="badge-success flex items-center gap-1">
          <Check className="h-3 w-3" />
          Alta confiança
        </span>
      );
    }
    if (confidence >= 0.7) {
      return (
        <span className="badge-warning flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Verificar
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs text-destructive">
        <AlertTriangle className="h-3 w-3" />
        Baixa confiança
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {variables.map((variable, index) => (
        <motion.div
          key={variable.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onVariableSelect?.(variable.id)}
          className={cn(
            "card-elevated p-4 cursor-pointer transition-all",
            selectedVariableId === variable.id && "ring-2 ring-accent"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                {variable.displayName}
                {variable.required && <span className="text-destructive ml-1">*</span>}
              </label>
              {variable.source && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fonte: {variable.source}
                </p>
              )}
            </div>
            {getConfidenceBadge(variable.confidence)}
          </div>

          <div className="relative">
            <input
              type="text"
              value={variable.value || ''}
              onChange={(e) => onVariableChange(variable.id, e.target.value)}
              placeholder={`Digite ${variable.displayName.toLowerCase()}`}
              className={cn(
                "w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm transition-all",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                variable.confidence && variable.confidence < 0.7 && "border-warning"
              )}
            />
            <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
