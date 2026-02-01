import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Image, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadedDocument } from '@/types/document';

interface FileUploadZoneProps {
  title: string;
  description: string;
  accept: string;
  multiple?: boolean;
  files: UploadedDocument[];
  onFilesChange: (files: UploadedDocument[]) => void;
  maxFiles?: number;
}

export function FileUploadZone({
  title,
  description,
  accept,
  multiple = false,
  files,
  onFilesChange,
  maxFiles = 10,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [files, maxFiles]
  );

  const processFiles = (newFiles: File[]) => {
    const availableSlots = maxFiles - files.length;
    const filesToAdd = newFiles.slice(0, availableSlots);

    const newDocuments: UploadedDocument[] = filesToAdd.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'pending',
    }));

    onFilesChange([...files, ...newDocuments]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    return FileText;
  };

  return (
    <div className="space-y-4">
      <motion.label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          'upload-zone flex flex-col items-center justify-center p-8 text-center',
          isDragging && 'dragging'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4"
        >
          <Upload className="h-7 w-7 text-muted-foreground" />
        </motion.div>
        
        <h3 className="heading-3 text-foreground mb-2">{title}</h3>
        <p className="body-small text-muted-foreground mb-4 max-w-sm">{description}</p>
        
        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer transition-all hover:opacity-90">
          Selecionar arquivos
        </span>
        
        <p className="mt-3 text-xs text-muted-foreground">
          ou arraste e solte aqui
        </p>
      </motion.label>

      {/* File Gallery */}
      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="card-elevated p-3 relative group"
                >
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center mb-2">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <FileIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>

                  <p className="text-xs font-medium text-card-foreground truncate">{file.name}</p>
                  
                  <div className="mt-1">
                    {file.status === 'pending' && (
                      <span className="text-xs text-muted-foreground">Aguardando</span>
                    )}
                    {file.status === 'processing' && (
                      <span className="text-xs text-accent">Processando...</span>
                    )}
                    {file.status === 'extracted' && (
                      <span className="badge-success text-xs">Extraído</span>
                    )}
                    {file.status === 'error' && (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        Erro
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
