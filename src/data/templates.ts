import type { Template } from '@/types/document';

export const requerimentoTemplates: Template[] = [
  {
    id: 'req-certidao-negativa',
    name: 'Requerimento de Certidão Negativa',
    category: 'requerimentos',
    content: `<h1 style="text-align: center;">REQUERIMENTO</h1>

<p>Ilmo(a). Sr(a). Diretor(a) do Cartório de Registro de Imóveis</p>

<p>{{nome_requerente}}, brasileiro(a), {{estado_civil}}, portador(a) do RG nº {{rg}} e inscrito(a) no CPF sob o nº {{cpf}}, residente e domiciliado(a) à {{endereco_completo}}, vem, respeitosamente, à presença de Vossa Senhoria, requerer a expedição de <strong>CERTIDÃO NEGATIVA DE PROPRIEDADE DE IMÓVEIS</strong> em seu nome.</p>

<p>Nestes termos,<br/>Pede deferimento.</p>

<p>{{cidade}}, {{data_atual}}</p>

<p style="text-align: center; margin-top: 60px;">_________________________________<br/>{{nome_requerente}}</p>`,
    variables: [
      { id: 'v1', name: 'nome_requerente', displayName: 'Nome do Requerente', type: 'text', required: true },
      { id: 'v2', name: 'estado_civil', displayName: 'Estado Civil', type: 'text', required: true },
      { id: 'v3', name: 'rg', displayName: 'RG', type: 'rg', required: true },
      { id: 'v4', name: 'cpf', displayName: 'CPF', type: 'cpf', required: true },
      { id: 'v5', name: 'endereco_completo', displayName: 'Endereço Completo', type: 'address', required: true },
      { id: 'v6', name: 'cidade', displayName: 'Cidade', type: 'text', required: true },
      { id: 'v7', name: 'data_atual', displayName: 'Data', type: 'date', required: true },
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'req-segunda-via',
    name: 'Requerimento de Segunda Via de Documento',
    category: 'requerimentos',
    content: `<h1 style="text-align: center;">REQUERIMENTO DE SEGUNDA VIA</h1>

<p>Ao Ilustríssimo Senhor Diretor do {{orgao_emissor}}</p>

<p>{{nome_requerente}}, nacionalidade {{nacionalidade}}, {{profissao}}, portador(a) da Cédula de Identidade RG nº {{rg}}, expedida pelo {{orgao_rg}}, inscrito(a) no CPF/MF sob o nº {{cpf}}, residente e domiciliado(a) na {{endereco_completo}}, CEP {{cep}}, vem, mui respeitosamente, requerer a Vossa Senhoria a expedição de <strong>SEGUNDA VIA</strong> do documento {{tipo_documento}}, pelos motivos abaixo expostos:</p>

<p><strong>MOTIVO:</strong> {{motivo_solicitacao}}</p>

<p>Nestes termos,<br/>Pede deferimento.</p>

<p>{{cidade}}, {{data_atual}}</p>

<p style="text-align: center; margin-top: 60px;">_________________________________<br/>{{nome_requerente}}<br/>CPF: {{cpf}}</p>`,
    variables: [
      { id: 'v1', name: 'orgao_emissor', displayName: 'Órgão Emissor', type: 'text', required: true },
      { id: 'v2', name: 'nome_requerente', displayName: 'Nome do Requerente', type: 'text', required: true },
      { id: 'v3', name: 'nacionalidade', displayName: 'Nacionalidade', type: 'text', required: true },
      { id: 'v4', name: 'profissao', displayName: 'Profissão', type: 'text', required: true },
      { id: 'v5', name: 'rg', displayName: 'RG', type: 'rg', required: true },
      { id: 'v6', name: 'orgao_rg', displayName: 'Órgão Emissor do RG', type: 'text', required: true },
      { id: 'v7', name: 'cpf', displayName: 'CPF', type: 'cpf', required: true },
      { id: 'v8', name: 'endereco_completo', displayName: 'Endereço Completo', type: 'address', required: true },
      { id: 'v9', name: 'cep', displayName: 'CEP', type: 'text', required: true },
      { id: 'v10', name: 'tipo_documento', displayName: 'Tipo do Documento', type: 'text', required: true },
      { id: 'v11', name: 'motivo_solicitacao', displayName: 'Motivo da Solicitação', type: 'text', required: true },
      { id: 'v12', name: 'cidade', displayName: 'Cidade', type: 'text', required: true },
      { id: 'v13', name: 'data_atual', displayName: 'Data', type: 'date', required: true },
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'req-informacao',
    name: 'Requerimento de Informação',
    category: 'requerimentos',
    content: `<h1 style="text-align: center;">REQUERIMENTO DE INFORMAÇÃO</h1>
<p style="text-align: center;">(Lei nº 12.527/2011 - Lei de Acesso à Informação)</p>

<p>Ao {{orgao_destinatario}}</p>

<p>{{nome_requerente}}, brasileiro(a), inscrito(a) no CPF sob nº {{cpf}}, residente à {{endereco_completo}}, com base na Lei nº 12.527/2011 (Lei de Acesso à Informação), vem requerer as seguintes informações:</p>

<p><strong>INFORMAÇÕES SOLICITADAS:</strong></p>
<p>{{descricao_informacao}}</p>

<p><strong>FINALIDADE:</strong> {{finalidade}}</p>

<p><strong>FORMA DE RECEBIMENTO:</strong> {{forma_recebimento}}</p>

<p><strong>E-MAIL PARA CONTATO:</strong> {{email}}</p>

<p><strong>TELEFONE:</strong> {{telefone}}</p>

<p>{{cidade}}, {{data_atual}}</p>

<p style="text-align: center; margin-top: 60px;">_________________________________<br/>{{nome_requerente}}</p>`,
    variables: [
      { id: 'v1', name: 'orgao_destinatario', displayName: 'Órgão Destinatário', type: 'text', required: true },
      { id: 'v2', name: 'nome_requerente', displayName: 'Nome do Requerente', type: 'text', required: true },
      { id: 'v3', name: 'cpf', displayName: 'CPF', type: 'cpf', required: true },
      { id: 'v4', name: 'endereco_completo', displayName: 'Endereço Completo', type: 'address', required: true },
      { id: 'v5', name: 'descricao_informacao', displayName: 'Descrição da Informação', type: 'text', required: true },
      { id: 'v6', name: 'finalidade', displayName: 'Finalidade', type: 'text', required: true },
      { id: 'v7', name: 'forma_recebimento', displayName: 'Forma de Recebimento', type: 'text', required: true },
      { id: 'v8', name: 'email', displayName: 'E-mail', type: 'email', required: true },
      { id: 'v9', name: 'telefone', displayName: 'Telefone', type: 'phone', required: true },
      { id: 'v10', name: 'cidade', displayName: 'Cidade', type: 'text', required: true },
      { id: 'v11', name: 'data_atual', displayName: 'Data', type: 'date', required: true },
    ],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'req-alvara',
    name: 'Requerimento de Alvará de Funcionamento',
    category: 'requerimentos',
    content: `<h1 style="text-align: center;">REQUERIMENTO DE ALVARÁ DE FUNCIONAMENTO</h1>

<p>Ilmo(a). Sr(a). Secretário(a) Municipal de {{secretaria}}</p>

<p>{{nome_empresa}}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº {{cnpj}}, com sede na {{endereco_empresa}}, CEP {{cep}}, neste ato representada por seu(sua) {{cargo_representante}}, {{nome_representante}}, brasileiro(a), portador(a) do RG nº {{rg}} e CPF nº {{cpf}}, vem, respeitosamente, requerer a Vossa Senhoria a concessão de <strong>ALVARÁ DE FUNCIONAMENTO</strong> para exercício da atividade de {{atividade_principal}}.</p>

<p><strong>ÁREA DO ESTABELECIMENTO:</strong> {{area_estabelecimento}} m²</p>

<p><strong>HORÁRIO DE FUNCIONAMENTO:</strong> {{horario_funcionamento}}</p>

<p><strong>NÚMERO DE FUNCIONÁRIOS:</strong> {{numero_funcionarios}}</p>

<p>Declara, ainda, que o estabelecimento atende a todas as exigências legais quanto à segurança, higiene e localização.</p>

<p>Nestes termos,<br/>Pede deferimento.</p>

<p>{{cidade}}, {{data_atual}}</p>

<p style="text-align: center; margin-top: 60px;">_________________________________<br/>{{nome_representante}}<br/>{{cargo_representante}}</p>`,
    variables: [
      { id: 'v1', name: 'secretaria', displayName: 'Secretaria', type: 'text', required: true },
      { id: 'v2', name: 'nome_empresa', displayName: 'Nome da Empresa', type: 'text', required: true },
      { id: 'v3', name: 'cnpj', displayName: 'CNPJ', type: 'text', required: true },
      { id: 'v4', name: 'endereco_empresa', displayName: 'Endereço da Empresa', type: 'address', required: true },
      { id: 'v5', name: 'cep', displayName: 'CEP', type: 'text', required: true },
      { id: 'v6', name: 'cargo_representante', displayName: 'Cargo do Representante', type: 'text', required: true },
      { id: 'v7', name: 'nome_representante', displayName: 'Nome do Representante', type: 'text', required: true },
      { id: 'v8', name: 'rg', displayName: 'RG', type: 'rg', required: true },
      { id: 'v9', name: 'cpf', displayName: 'CPF', type: 'cpf', required: true },
      { id: 'v10', name: 'atividade_principal', displayName: 'Atividade Principal', type: 'text', required: true },
      { id: 'v11', name: 'area_estabelecimento', displayName: 'Área (m²)', type: 'number', required: true },
      { id: 'v12', name: 'horario_funcionamento', displayName: 'Horário de Funcionamento', type: 'text', required: true },
      { id: 'v13', name: 'numero_funcionarios', displayName: 'Número de Funcionários', type: 'number', required: true },
      { id: 'v14', name: 'cidade', displayName: 'Cidade', type: 'text', required: true },
      { id: 'v15', name: 'data_atual', displayName: 'Data', type: 'date', required: true },
    ],
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'req-isencao-taxa',
    name: 'Requerimento de Isenção de Taxa',
    category: 'requerimentos',
    content: `<h1 style="text-align: center;">REQUERIMENTO DE ISENÇÃO DE TAXA</h1>

<p>Excelentíssimo(a) Senhor(a) {{autoridade}}</p>

<p>{{nome_requerente}}, brasileiro(a), {{estado_civil}}, {{profissao}}, portador(a) do RG nº {{rg}} e inscrito(a) no CPF sob o nº {{cpf}}, residente e domiciliado(a) à {{endereco_completo}}, vem, respeitosamente, requerer a <strong>ISENÇÃO</strong> do pagamento da taxa referente a {{tipo_taxa}}, pelos seguintes fundamentos:</p>

<p><strong>FUNDAMENTAÇÃO:</strong></p>
<p>{{fundamentacao}}</p>

<p><strong>RENDA FAMILIAR:</strong> R$ {{renda_familiar}}</p>

<p><strong>NÚMERO DE DEPENDENTES:</strong> {{numero_dependentes}}</p>

<p>Declara, sob as penas da lei, que as informações prestadas são verdadeiras e que se enquadra nos requisitos legais para a concessão do benefício.</p>

<p>Nestes termos,<br/>Pede deferimento.</p>

<p>{{cidade}}, {{data_atual}}</p>

<p style="text-align: center; margin-top: 60px;">_________________________________<br/>{{nome_requerente}}<br/>CPF: {{cpf}}</p>`,
    variables: [
      { id: 'v1', name: 'autoridade', displayName: 'Autoridade', type: 'text', required: true },
      { id: 'v2', name: 'nome_requerente', displayName: 'Nome do Requerente', type: 'text', required: true },
      { id: 'v3', name: 'estado_civil', displayName: 'Estado Civil', type: 'text', required: true },
      { id: 'v4', name: 'profissao', displayName: 'Profissão', type: 'text', required: true },
      { id: 'v5', name: 'rg', displayName: 'RG', type: 'rg', required: true },
      { id: 'v6', name: 'cpf', displayName: 'CPF', type: 'cpf', required: true },
      { id: 'v7', name: 'endereco_completo', displayName: 'Endereço Completo', type: 'address', required: true },
      { id: 'v8', name: 'tipo_taxa', displayName: 'Tipo de Taxa', type: 'text', required: true },
      { id: 'v9', name: 'fundamentacao', displayName: 'Fundamentação', type: 'text', required: true },
      { id: 'v10', name: 'renda_familiar', displayName: 'Renda Familiar', type: 'number', required: true },
      { id: 'v11', name: 'numero_dependentes', displayName: 'Nº de Dependentes', type: 'number', required: true },
      { id: 'v12', name: 'cidade', displayName: 'Cidade', type: 'text', required: true },
      { id: 'v13', name: 'data_atual', displayName: 'Data', type: 'date', required: true },
    ],
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'req-prorrogacao-prazo',
    name: 'Requerimento de Prorrogação de Prazo',
    category: 'requerimentos',
    content: `<h1 style="text-align: center;">REQUERIMENTO DE PRORROGAÇÃO DE PRAZO</h1>

<p>Ao {{orgao_destinatario}}</p>

<p>Ref.: Processo nº {{numero_processo}}</p>

<p>{{nome_requerente}}, brasileiro(a), inscrito(a) no CPF sob o nº {{cpf}}, residente à {{endereco_completo}}, na qualidade de {{qualidade_parte}} no processo em epígrafe, vem, respeitosamente, requerer a <strong>PRORROGAÇÃO DO PRAZO</strong> para {{finalidade_prazo}}, pelo período de {{dias_prorrogacao}} dias, pelos motivos a seguir expostos:</p>

<p><strong>JUSTIFICATIVA:</strong></p>
<p>{{justificativa}}</p>

<p><strong>PRAZO ORIGINAL:</strong> {{data_prazo_original}}</p>

<p><strong>NOVO PRAZO SOLICITADO:</strong> {{data_novo_prazo}}</p>

<p>Nestes termos,<br/>Pede deferimento.</p>

<p>{{cidade}}, {{data_atual}}</p>

<p style="text-align: center; margin-top: 60px;">_________________________________<br/>{{nome_requerente}}<br/>CPF: {{cpf}}</p>`,
    variables: [
      { id: 'v1', name: 'orgao_destinatario', displayName: 'Órgão Destinatário', type: 'text', required: true },
      { id: 'v2', name: 'numero_processo', displayName: 'Número do Processo', type: 'text', required: true },
      { id: 'v3', name: 'nome_requerente', displayName: 'Nome do Requerente', type: 'text', required: true },
      { id: 'v4', name: 'cpf', displayName: 'CPF', type: 'cpf', required: true },
      { id: 'v5', name: 'endereco_completo', displayName: 'Endereço Completo', type: 'address', required: true },
      { id: 'v6', name: 'qualidade_parte', displayName: 'Qualidade da Parte', type: 'text', required: true },
      { id: 'v7', name: 'finalidade_prazo', displayName: 'Finalidade do Prazo', type: 'text', required: true },
      { id: 'v8', name: 'dias_prorrogacao', displayName: 'Dias de Prorrogação', type: 'number', required: true },
      { id: 'v9', name: 'justificativa', displayName: 'Justificativa', type: 'text', required: true },
      { id: 'v10', name: 'data_prazo_original', displayName: 'Data Prazo Original', type: 'date', required: true },
      { id: 'v11', name: 'data_novo_prazo', displayName: 'Nova Data', type: 'date', required: true },
      { id: 'v12', name: 'cidade', displayName: 'Cidade', type: 'text', required: true },
      { id: 'v13', name: 'data_atual', displayName: 'Data', type: 'date', required: true },
    ],
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'req-certidao-inteiro-teor',
    name: 'Requerimento de Certidão de Inteiro Teor',
    category: 'requerimentos',
    content: `<h1 style="text-align: center;">REQUERIMENTO DE CERTIDÃO DE INTEIRO TEOR</h1>

<p>Ilmo(a). Sr(a). Oficial do Cartório de {{tipo_cartorio}}</p>

<p>{{nome_requerente}}, brasileiro(a), {{estado_civil}}, portador(a) do RG nº {{rg}} e inscrito(a) no CPF sob o nº {{cpf}}, residente e domiciliado(a) à {{endereco_completo}}, vem, respeitosamente, requerer a expedição de <strong>CERTIDÃO DE INTEIRO TEOR</strong> do seguinte documento:</p>

<p><strong>TIPO DE DOCUMENTO:</strong> {{tipo_documento}}</p>

<p><strong>LIVRO:</strong> {{numero_livro}}</p>

<p><strong>FOLHA:</strong> {{numero_folha}}</p>

<p><strong>TERMO/REGISTRO:</strong> {{numero_termo}}</p>

<p><strong>DATA DO REGISTRO:</strong> {{data_registro}}</p>

<p><strong>FINALIDADE:</strong> {{finalidade}}</p>

<p>Nestes termos,<br/>Pede deferimento.</p>

<p>{{cidade}}, {{data_atual}}</p>

<p style="text-align: center; margin-top: 60px;">_________________________________<br/>{{nome_requerente}}</p>`,
    variables: [
      { id: 'v1', name: 'tipo_cartorio', displayName: 'Tipo de Cartório', type: 'text', required: true },
      { id: 'v2', name: 'nome_requerente', displayName: 'Nome do Requerente', type: 'text', required: true },
      { id: 'v3', name: 'estado_civil', displayName: 'Estado Civil', type: 'text', required: true },
      { id: 'v4', name: 'rg', displayName: 'RG', type: 'rg', required: true },
      { id: 'v5', name: 'cpf', displayName: 'CPF', type: 'cpf', required: true },
      { id: 'v6', name: 'endereco_completo', displayName: 'Endereço Completo', type: 'address', required: true },
      { id: 'v7', name: 'tipo_documento', displayName: 'Tipo de Documento', type: 'text', required: true },
      { id: 'v8', name: 'numero_livro', displayName: 'Número do Livro', type: 'text', required: true },
      { id: 'v9', name: 'numero_folha', displayName: 'Número da Folha', type: 'text', required: true },
      { id: 'v10', name: 'numero_termo', displayName: 'Número do Termo', type: 'text', required: true },
      { id: 'v11', name: 'data_registro', displayName: 'Data do Registro', type: 'date', required: true },
      { id: 'v12', name: 'finalidade', displayName: 'Finalidade', type: 'text', required: true },
      { id: 'v13', name: 'cidade', displayName: 'Cidade', type: 'text', required: true },
      { id: 'v14', name: 'data_atual', displayName: 'Data', type: 'date', required: true },
    ],
    createdAt: new Date('2024-02-25'),
  },
  {
    id: 'req-autorizacao-viagem',
    name: 'Requerimento de Autorização de Viagem',
    category: 'requerimentos',
    content: `<h1 style="text-align: center;">AUTORIZAÇÃO DE VIAGEM PARA MENOR</h1>

<p>Eu, {{nome_responsavel}}, brasileiro(a), {{estado_civil}}, {{profissao}}, portador(a) do RG nº {{rg_responsavel}} e inscrito(a) no CPF sob o nº {{cpf_responsavel}}, residente e domiciliado(a) à {{endereco_responsavel}}, na qualidade de {{vinculo}} do(a) menor {{nome_menor}}, nascido(a) em {{data_nascimento_menor}}, portador(a) do RG nº {{rg_menor}}, <strong>AUTORIZO</strong> expressamente que o(a) mesmo(a) viaje:</p>

<p><strong>ACOMPANHADO(A) DE:</strong> {{nome_acompanhante}}, portador(a) do RG nº {{rg_acompanhante}} e CPF nº {{cpf_acompanhante}}</p>

<p><strong>DESTINO:</strong> {{destino_viagem}}</p>

<p><strong>PERÍODO:</strong> De {{data_ida}} a {{data_volta}}</p>

<p><strong>MOTIVO:</strong> {{motivo_viagem}}</p>

<p><strong>MEIO DE TRANSPORTE:</strong> {{meio_transporte}}</p>

<p>Declaro estar ciente de que esta autorização tem validade apenas para a viagem acima especificada.</p>

<p>{{cidade}}, {{data_atual}}</p>

<p style="text-align: center; margin-top: 60px;">_________________________________<br/>{{nome_responsavel}}<br/>CPF: {{cpf_responsavel}}</p>

<p style="text-align: center; margin-top: 20px; font-size: 12px;">(Firma reconhecida em cartório)</p>`,
    variables: [
      { id: 'v1', name: 'nome_responsavel', displayName: 'Nome do Responsável', type: 'text', required: true },
      { id: 'v2', name: 'estado_civil', displayName: 'Estado Civil', type: 'text', required: true },
      { id: 'v3', name: 'profissao', displayName: 'Profissão', type: 'text', required: true },
      { id: 'v4', name: 'rg_responsavel', displayName: 'RG do Responsável', type: 'rg', required: true },
      { id: 'v5', name: 'cpf_responsavel', displayName: 'CPF do Responsável', type: 'cpf', required: true },
      { id: 'v6', name: 'endereco_responsavel', displayName: 'Endereço do Responsável', type: 'address', required: true },
      { id: 'v7', name: 'vinculo', displayName: 'Vínculo (pai/mãe/tutor)', type: 'text', required: true },
      { id: 'v8', name: 'nome_menor', displayName: 'Nome do Menor', type: 'text', required: true },
      { id: 'v9', name: 'data_nascimento_menor', displayName: 'Data de Nascimento', type: 'date', required: true },
      { id: 'v10', name: 'rg_menor', displayName: 'RG do Menor', type: 'rg', required: true },
      { id: 'v11', name: 'nome_acompanhante', displayName: 'Nome do Acompanhante', type: 'text', required: true },
      { id: 'v12', name: 'rg_acompanhante', displayName: 'RG do Acompanhante', type: 'rg', required: true },
      { id: 'v13', name: 'cpf_acompanhante', displayName: 'CPF do Acompanhante', type: 'cpf', required: true },
      { id: 'v14', name: 'destino_viagem', displayName: 'Destino', type: 'text', required: true },
      { id: 'v15', name: 'data_ida', displayName: 'Data de Ida', type: 'date', required: true },
      { id: 'v16', name: 'data_volta', displayName: 'Data de Volta', type: 'date', required: true },
      { id: 'v17', name: 'motivo_viagem', displayName: 'Motivo da Viagem', type: 'text', required: true },
      { id: 'v18', name: 'meio_transporte', displayName: 'Meio de Transporte', type: 'text', required: true },
      { id: 'v19', name: 'cidade', displayName: 'Cidade', type: 'text', required: true },
      { id: 'v20', name: 'data_atual', displayName: 'Data', type: 'date', required: true },
    ],
    createdAt: new Date('2024-03-01'),
  },
];

export const allTemplates = [...requerimentoTemplates];

export function getTemplatesByCategory(category: string): Template[] {
  return allTemplates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return allTemplates.find((t) => t.id === id);
}
