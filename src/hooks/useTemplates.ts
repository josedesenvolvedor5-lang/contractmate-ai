import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Template, TemplateVariable } from '@/types/document';
import { contratoTemplates } from '@/data/contractTemplates';
import { toast } from 'sonner';

export function useTemplates(categoryId?: string) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('templates').select('*');
      if (categoryId) {
        query = query.eq('category', categoryId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: Template[] = data.map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category as Template['category'],
          content: row.content,
          variables: (row.variables as unknown as TemplateVariable[]) || [],
          createdAt: new Date(row.created_at),
        }));
        setTemplates(mapped);
      } else {
        // Fallback to local templates if DB is empty
        const local = categoryId
          ? contratoTemplates.filter((t) => t.category === categoryId)
          : contratoTemplates;
        setTemplates(local);
      }
    } catch {
      // Fallback to local templates on error
      const local = categoryId
        ? contratoTemplates.filter((t) => t.category === categoryId)
        : contratoTemplates;
      setTemplates(local);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const addTemplate = useCallback(async (name: string, content: string, category: string) => {
    // Detect variables from content
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const detectedVars: TemplateVariable[] = [];
    const seen = new Set<string>();
    let match;
    let idx = 0;

    while ((match = variableRegex.exec(content)) !== null) {
      const varName = match[1].trim();
      if (!seen.has(varName)) {
        seen.add(varName);
        idx++;
        detectedVars.push({
          id: `v${idx}`,
          name: varName,
          displayName: varName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          type: 'text',
          required: true,
        });
      }
    }

    const { data, error } = await supabase.from('templates').insert([{
      name,
      content,
      category,
      variables: JSON.parse(JSON.stringify(detectedVars)),
    }]).select().single();

    if (error) {
      toast.error('Erro ao salvar modelo');
      return null;
    }

    toast.success(`Modelo "${name}" criado com ${detectedVars.length} campos detectados`);
    await fetchTemplates();
    return data;
  }, [fetchTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao excluir modelo');
      return;
    }
    toast.success('Modelo excluído');
    await fetchTemplates();
  }, [fetchTemplates]);

  return { templates, loading, addTemplate, deleteTemplate, refetch: fetchTemplates };
}
