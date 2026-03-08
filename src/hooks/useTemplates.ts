import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Template, TemplateVariable } from '@/types/document';
import { contratoTemplates } from '@/data/contractTemplates';
import { toast } from 'sonner';

const TEMPLATES_KEY = 'templates';

function mapRow(row: any): Template {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Template['category'],
    content: row.content,
    variables: (row.variables as unknown as TemplateVariable[]) || [],
    createdAt: new Date(row.created_at),
  };
}

async function fetchTemplatesFromDb(categoryId?: string): Promise<Template[]> {
  let query = supabase.from('templates').select('*');
  if (categoryId) {
    query = query.eq('category', categoryId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  if (data && data.length > 0) {
    return data.map(mapRow);
  }

  // Fallback to local templates if DB is empty
  return categoryId
    ? contratoTemplates.filter((t) => t.category === categoryId)
    : contratoTemplates;
}

function detectVariables(content: string): TemplateVariable[] {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const vars: TemplateVariable[] = [];
  const seen = new Set<string>();
  let match;
  let idx = 0;

  while ((match = variableRegex.exec(content)) !== null) {
    const varName = match[1].trim();
    if (!seen.has(varName)) {
      seen.add(varName);
      idx++;
      vars.push({
        id: `v${idx}`,
        name: varName,
        displayName: varName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        type: 'text',
        required: true,
      });
    }
  }
  return vars;
}

export function useTemplates(categoryId?: string) {
  const queryClient = useQueryClient();
  const queryKey = categoryId ? [TEMPLATES_KEY, categoryId] : [TEMPLATES_KEY];

  const { data: templates = [], isLoading: loading } = useQuery({
    queryKey,
    queryFn: () => fetchTemplatesFromDb(categoryId),
    staleTime: 30_000, // 30s before refetch
    placeholderData: (prev) => prev, // keep previous data while loading
  });

  const addMutation = useMutation({
    mutationFn: async ({ name, content, category }: { name: string; content: string; category: string }) => {
      const detectedVars = detectVariables(content);
      const { data, error } = await supabase.from('templates').insert([{
        name,
        content,
        category,
        variables: JSON.parse(JSON.stringify(detectedVars)),
      }]).select().single();

      if (error) throw error;
      return { row: data, detectedVars };
    },
    onSuccess: ({ row, detectedVars }) => {
      // Optimistic: add to cache immediately
      const newTemplate = mapRow(row);
      queryClient.setQueryData<Template[]>(queryKey, (old = []) => {
        // If old data was fallback local templates, replace entirely
        const isLocalFallback = old.length > 0 && old[0].id.startsWith('tpl-');
        return isLocalFallback ? [newTemplate] : [newTemplate, ...old];
      });
      // Also invalidate the global key for dashboard counts
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
      toast.success(`Modelo "${row.name}" criado com ${detectedVars.length} campos detectados`);
    },
    onError: () => {
      toast.error('Erro ao salvar modelo');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, content, variables }: { id: string; content: string; variables: TemplateVariable[] }) => {
      const { error } = await supabase.from('templates').update({
        content,
        variables: JSON.parse(JSON.stringify(variables)),
      }).eq('id', id);
      if (error) throw error;
      return { id, content, variables };
    },
    onSuccess: ({ id, content, variables }) => {
      // Optimistic update in cache
      queryClient.setQueryData<Template[]>(queryKey, (old = []) =>
        old.map(t => t.id === id ? { ...t, content, variables } : t)
      );
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
      toast.success('Modelo atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao salvar alterações');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('templates').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id: string) => {
      // Optimistic: remove from cache before server responds
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Template[]>(queryKey);
      queryClient.setQueryData<Template[]>(queryKey, (old = []) => old.filter(t => t.id !== id));
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
      toast.success('Modelo excluído');
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error('Erro ao excluir modelo');
    },
  });

  const addTemplate = useCallback(async (name: string, content: string, category: string) => {
    try {
      const result = await addMutation.mutateAsync({ name, content, category });
      return result.row;
    } catch {
      return null;
    }
  }, [addMutation]);

  const updateTemplate = useCallback(async (id: string, content: string, variables: TemplateVariable[]) => {
    try {
      await updateMutation.mutateAsync({ id, content, variables });
      return true;
    } catch {
      return false;
    }
  }, [updateMutation]);

  const deleteTemplate = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  return { templates, loading, addTemplate, updateTemplate, deleteTemplate };
}
