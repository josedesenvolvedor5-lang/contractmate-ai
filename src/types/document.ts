export interface Template {
  id: string;
  name: string;
  category: 'requerimentos' | 'declaracoes' | 'contratos' | 'outros';
  content: string;
  variables: TemplateVariable[];
  createdAt: Date;
}

export interface TemplateVariable {
  id: string;
  name: string;
  displayName: string;
  type: 'text' | 'date' | 'number' | 'cpf' | 'rg' | 'address' | 'phone' | 'email';
  required: boolean;
  value?: string;
  confidence?: number;
  source?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  file: File;
  preview?: string;
  status: 'pending' | 'processing' | 'extracted' | 'error';
  extractedData?: Record<string, string>;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredDocs: string[];
  templateCount: number;
}

export interface ExtractedField {
  variable: string;
  value: string;
  confidence: number;
  source: string;
}

export type WorkflowStep = 'select-template' | 'upload-template' | 'upload-documents' | 'review' | 'export';
