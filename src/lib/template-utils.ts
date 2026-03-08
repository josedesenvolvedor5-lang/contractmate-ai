import type { TemplateVariable, Party } from '@/types/document';

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a regex pattern to match a variable placeholder in template content.
 */
export function createVariablePattern(name: string): RegExp {
  const escaped = escapeRegex(name);
  return new RegExp(`\\{\\{\\s*${escaped}\\s*\\}\\}|\\[\\s*${escaped}\\s*\\]`, 'gi');
}

/**
 * Well-known party prefixes and their display labels
 */
const PARTY_PREFIXES: Record<string, string> = {
  comprador: 'Comprador',
  vendedor: 'Vendedor',
  outorgante: 'Outorgante',
  outorgado: 'Outorgado',
  locador: 'Locador',
  locatario: 'Locatário',
  cedente: 'Cedente',
  cessionario: 'Cessionário',
  devedor: 'Devedor',
  credor: 'Credor',
  fiador: 'Fiador',
  testemunha: 'Testemunha',
  parte1: 'Parte 1',
  parte2: 'Parte 2',
  conjuge_comprador: 'Cônjuge Comprador',
  conjuge_vendedor: 'Cônjuge Vendedor',
};

const PARTY_COLORS = [
  'hsl(221, 83%, 53%)',   // blue
  'hsl(142, 71%, 45%)',   // green
  'hsl(25, 95%, 53%)',    // orange
  'hsl(262, 83%, 58%)',   // purple
  'hsl(346, 77%, 50%)',   // rose
  'hsl(47, 96%, 53%)',    // amber
  'hsl(173, 80%, 40%)',   // teal
  'hsl(322, 65%, 55%)',   // pink
];

/**
 * Detects the party identifier from a variable name.
 * Checks both prefix (comprador_nome) and suffix (nome_comprador) patterns.
 * Returns the party key (lowercase) or null if no party detected.
 */
export function detectPartyPrefix(varName: string): string | null {
  const lower = varName.toLowerCase();
  // Sort by length descending so "conjuge_comprador" matches before "comprador"
  const sorted = Object.keys(PARTY_PREFIXES).sort((a, b) => b.length - a.length);
  for (const prefix of sorted) {
    if (lower.startsWith(prefix + '_') || lower.endsWith('_' + prefix)) {
      return prefix;
    }
  }
  return null;
}

/**
 * Gets the display name for a variable, stripping the party prefix.
 */
export function getDisplayNameWithoutParty(varName: string, partyPrefix: string): string {
  const withoutPrefix = varName.slice(partyPrefix.length + 1); // +1 for the underscore
  return withoutPrefix.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Detects all parties from a list of variables and assigns party info.
 * Returns { parties, variables with party assigned }
 */
export function detectParties(variables: TemplateVariable[]): { parties: Party[]; variables: TemplateVariable[] } {
  const partyMap = new Map<string, string>(); // prefix -> label
  
  // First pass: detect all party prefixes
  for (const v of variables) {
    const prefix = detectPartyPrefix(v.name);
    if (prefix && !partyMap.has(prefix)) {
      partyMap.set(prefix, PARTY_PREFIXES[prefix] || prefix.charAt(0).toUpperCase() + prefix.slice(1));
    }
  }
  
  // Build party list
  const partyEntries = Array.from(partyMap.entries());
  const parties: Party[] = partyEntries.map(([id, label], i) => ({
    id,
    label,
    color: PARTY_COLORS[i % PARTY_COLORS.length],
  }));
  
  // Second pass: assign party to variables and update displayName
  const updatedVars = variables.map(v => {
    const prefix = detectPartyPrefix(v.name);
    if (prefix) {
      return {
        ...v,
        party: prefix,
        displayName: getDisplayNameWithoutParty(v.name, prefix),
      };
    }
    return { ...v, party: undefined };
  });
  
  return { parties, variables: updatedVars };
}

/**
 * Groups variables by party. Returns Map where key is partyId (or 'general').
 */
export function groupVariablesByParty(variables: TemplateVariable[]): Map<string, TemplateVariable[]> {
  const groups = new Map<string, TemplateVariable[]>();
  
  for (const v of variables) {
    const key = v.party || 'general';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }
  
  return groups;
}

/**
 * Replaces all variable placeholders in the template with their values or fallback.
 */
export function replaceVariables(
  content: string,
  variables: TemplateVariable[],
  mode: 'preview' | 'export' = 'export'
): string {
  let processed = content;

  variables.forEach((variable) => {
    const pattern = createVariablePattern(variable.name);

    if (mode === 'preview') {
      const replacement = variable.value
        ? `<span class="filled-variable" data-id="${variable.id}">${variable.value}</span>`
        : `<span class="empty-variable" data-id="${variable.id}">{{${variable.displayName}}}</span>`;
      processed = processed.replace(pattern, replacement);
    } else {
      const value = variable.value || `{{${variable.displayName}}}`;
      processed = processed.replace(pattern, value);
    }
  });

  return processed;
}

/**
 * Generates the final HTML for export (PDF/print)
 */
export function generateExportHtml(content: string, variables: TemplateVariable[]): string {
  const processed = replaceVariables(content, variables, 'export');
  return `<div style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.8; color: #1a1a1a; padding: 2rem; font-size: 12pt;">${processed}</div>`;
}

/**
 * Generates a Word-compatible HTML document
 */
export function generateDocxHtml(content: string, variables: TemplateVariable[]): string {
  const processed = replaceVariables(content, variables, 'export');
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="Microsoft Word 15">
  <meta name="Originator" content="Microsoft Word 15">
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4;
      margin: 2.5cm 3cm 2.5cm 3cm;
    }
    body {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 12pt;
      line-height: 1.8;
      color: #000000;
    }
    h1 { font-size: 16pt; font-weight: bold; margin-bottom: 12pt; }
    h2 { font-size: 14pt; font-weight: bold; margin-bottom: 10pt; }
    h3 { font-size: 12pt; font-weight: bold; margin-bottom: 8pt; }
    p { margin-bottom: 6pt; text-align: justify; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #000; padding: 4pt 8pt; }
  </style>
</head>
<body>${processed}</body>
</html>`;
}

/**
 * Returns required variables that have no value
 */
export function getEmptyRequiredVariables(variables: TemplateVariable[]): TemplateVariable[] {
  return variables.filter(v => v.required && !v.value?.trim());
}
