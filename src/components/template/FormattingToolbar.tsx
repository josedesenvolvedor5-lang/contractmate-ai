import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, List, ListOrdered,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormattingToolbarProps {
  editorRef: React.RefObject<HTMLDivElement>;
}

const ToolbarButton = ({
  icon: Icon,
  command,
  value,
  title,
  editorRef,
}: {
  icon: React.ElementType;
  command: string;
  value?: string;
  title: string;
  editorRef: React.RefObject<HTMLDivElement>;
}) => {
  const handleClick = useCallback(() => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, [command, value, editorRef]);

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      title={title}
      className={cn(
        "p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

const FontSizeSelect = ({ editorRef }: { editorRef: React.RefObject<HTMLDivElement> }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    editorRef.current?.focus();
    document.execCommand('fontSize', false, e.target.value);
  }, [editorRef]);

  return (
    <select
      onChange={handleChange}
      defaultValue="3"
      title="Tamanho da fonte"
      className="px-2 py-1 rounded-md border border-border bg-background text-foreground text-xs cursor-pointer hover:bg-secondary transition-colors"
    >
      <option value="1">Pequeno</option>
      <option value="2">Normal-</option>
      <option value="3">Normal</option>
      <option value="4">Médio</option>
      <option value="5">Grande</option>
      <option value="6">Muito Grande</option>
      <option value="7">Título</option>
    </select>
  );
};

export function FormattingToolbar({ editorRef }: FormattingToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-0.5 flex-wrap px-3 py-2 border-b border-border bg-card"
    >
      {/* Font Size */}
      <FontSizeSelect editorRef={editorRef} />

      <div className="w-px h-5 bg-border mx-1.5" />

      {/* Text Style */}
      <ToolbarButton icon={Bold} command="bold" title="Negrito (Ctrl+B)" editorRef={editorRef} />
      <ToolbarButton icon={Italic} command="italic" title="Itálico (Ctrl+I)" editorRef={editorRef} />
      <ToolbarButton icon={Underline} command="underline" title="Sublinhado (Ctrl+U)" editorRef={editorRef} />

      <div className="w-px h-5 bg-border mx-1.5" />

      {/* Alignment */}
      <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Alinhar à esquerda" editorRef={editorRef} />
      <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Centralizar" editorRef={editorRef} />
      <ToolbarButton icon={AlignRight} command="justifyRight" title="Alinhar à direita" editorRef={editorRef} />
      <ToolbarButton icon={AlignJustify} command="justifyFull" title="Justificar" editorRef={editorRef} />

      <div className="w-px h-5 bg-border mx-1.5" />

      {/* Lists */}
      <ToolbarButton icon={List} command="insertUnorderedList" title="Lista com marcadores" editorRef={editorRef} />
      <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Lista numerada" editorRef={editorRef} />
    </motion.div>
  );
}
