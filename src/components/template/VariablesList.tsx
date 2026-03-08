import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, Edit3, Users, ChevronDown, ChevronRight } from 'lucide-react';
import type { TemplateVariable, Party } from '@/types/document';
import { groupVariablesByParty } from '@/lib/template-utils';
import { cn } from '@/lib/utils';

interface VariablesListProps {
  variables: TemplateVariable[];
  parties: Party[];
  onVariableChange: (id: string, value: string) => void;
  onVariableSelect?: (id: string) => void;
  selectedVariableId?: string;
}

export function VariablesList({ 
  variables, 
  parties,
  onVariableChange, 
  onVariableSelect,
  selectedVariableId 
}: VariablesListProps) {
  const grouped = useMemo(() => groupVariablesByParty(variables), [variables]);
  const hasParties = parties.length > 0;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const all = new Set<string>();
    grouped.forEach((_, key) => all.add(key));
    return all;
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    if (confidence >= 0.9) {
      return (
        <span className="badge-success flex items-center gap-1">
          <Check className="h-3 w-3" />
          Alta
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
        Baixa
      </span>
    );
  };

  const renderVariable = (variable: TemplateVariable, index: number) => (
    <motion.div
      key={variable.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onVariableSelect?.(variable.id)}
      className={cn(
        "card-elevated p-3 cursor-pointer transition-all",
        selectedVariableId === variable.id && "ring-2 ring-accent"
      )}
    >
      <div className="flex items-start justify-between mb-1.5">
        <label className="text-sm font-medium text-foreground">
          {variable.displayName}
          {variable.required && <span className="text-destructive ml-1">*</span>}
        </label>
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
        <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>
    </motion.div>
  );

  // No parties → flat list
  if (!hasParties) {
    return (
      <div className="space-y-3">
        {variables.map((v, i) => renderVariable(v, i))}
      </div>
    );
  }

  // Grouped by party
  const groupOrder = [...parties.map(p => p.id), 'general'];

  return (
    <div className="space-y-4">
      {groupOrder.map(groupKey => {
        const vars = grouped.get(groupKey);
        if (!vars || vars.length === 0) return null;

        const party = parties.find(p => p.id === groupKey);
        const isExpanded = expandedGroups.has(groupKey);
        const filledCount = vars.filter(v => v.value).length;

        return (
          <div key={groupKey}>
            <button
              onClick={() => toggleGroup(groupKey)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {isExpanded
                ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                : <ChevronRight className="h-4 w-4 text-muted-foreground" />
              }
              {party ? (
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${party.color}15`, color: party.color }}
                >
                  <Users className="h-3.5 w-3.5" />
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                  <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
              <span className="text-sm font-semibold text-foreground flex-1 text-left">
                {party?.label || 'Geral'}
              </span>
              <span className="text-xs text-muted-foreground">
                {filledCount}/{vars.length}
              </span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-2 pl-2" style={party ? { borderLeft: `2px solid ${party.color}30` } : {}}>
                    {vars.map((v, i) => renderVariable(v, i))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
