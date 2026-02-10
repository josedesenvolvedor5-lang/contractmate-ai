import type { Template } from '@/types/document';

export const contratoTemplates: Template[] = [
  {
    id: 'contrato-escritura-venda-compra',
    name: 'Escritura de Venda e Compra de Imóvel',
    category: 'contratos',
    content: `<h1 style="text-align: center;">ESCRITURA DE VENDA E COMPRA</h1>

<p style="text-align: right;">PROTOCOLO: {{protocolo}}</p>

<p>Outorgante(s) vendedor(a)(es): <strong>{{nome_vendedor_1}}</strong> e <strong>{{nome_vendedor_2}}</strong></p>
<p>Outorgado(a) comprador(a): <strong>{{nome_comprador}}</strong></p>
<p>Valor da Venda: R$ {{valor_venda}}</p>
<p>Valor Venal / {{ano_referencia}}: R$ {{valor_venal}}</p>
<p>Matrícula do Imóvel nº {{matricula_imovel}} do {{numero_registro_imobiliario}}º Oficial de Registro Imobiliário local.</p>

<p>Aos {{dia_lavratura}} dias do mês de {{mes_lavratura}} do ano de dois mil e vinte e {{complemento_ano}} ({{ano_lavratura}}), nesta cidade e comarca de {{cidade_comarca}}, Estado de São Paulo, neste {{numero_tabelionato}}º Tabelionato de Notas de {{cidade_tabelionato}} – Estado de São Paulo, situado na {{endereco_tabelionato}}, nº {{numero_endereco_tabelionato}}, {{complemento_tabelionato}}, perante mim, Escrevente, compareceram partes entre si, justas e contratadas, a saber:</p>

<h2>I – Outorgante(s) vendedor(a)(es):</h2>

<p><strong>{{nome_vendedor_1}}</strong>, filho(a) de {{filiacao_pai_vendedor_1}} e de {{filiacao_mae_vendedor_1}}, portador(a) da cédula de identidade RG nº {{rg_vendedor_1}}-SSP/SP, inscrito(a) no CPF/MF sob o nº {{cpf_vendedor_1}}, {{nacionalidade_vendedor_1}}, {{profissao_vendedor_1}}, e sua esposa <strong>{{nome_vendedor_2}}</strong>, filha de {{filiacao_pai_vendedor_2}} e de {{filiacao_mae_vendedor_2}}, portadora da cédula de identidade RG nº {{rg_vendedor_2}}-SSP/SP, inscrita no CPF/MF sob o nº {{cpf_vendedor_2}}, {{nacionalidade_vendedor_2}}, {{profissao_vendedor_2}}, casados pelo regime de {{regime_casamento_vendedores}}, na vigência da lei 6.515/77, realizado em {{data_casamento_vendedores}} e registrado em {{data_registro_casamento_vendedores}}, conforme Certidão de Casamento, extraída da matrícula {{matricula_casamento_vendedores}} do Oficial de Registro Civil das Pessoas Naturais do {{subdistrito_vendedores}} Subdistrito da cidade de {{cidade_casamento_vendedores}}, residentes e domiciliados na cidade de {{cidade_vendedores}}, na {{endereco_vendedores}}, nº {{numero_endereco_vendedores}}, {{complemento_endereco_vendedores}}, endereço eletrônico: {{email_vendedores}}.</p>

<h2>II – Outorgado(a) comprador(a):</h2>

<p><strong>{{nome_comprador}}</strong>, filho(a) de {{filiacao_pai_comprador}} e de {{filiacao_mae_comprador}}, portador(a) da cédula de identidade RG nº {{rg_comprador}}/SSP/SP, e do CPF/MF nº {{cpf_comprador}}, {{nacionalidade_comprador}}, {{profissao_comprador}}, {{estado_civil_comprador}}, conforme {{certidao_estado_civil_comprador}}, extraída da matrícula {{matricula_certidao_comprador}} do Oficial de Registro Civil das Pessoas Naturais do {{subdistrito_comprador}}º Subdistrito da cidade de {{cidade_certidao_comprador}}, residente e domiciliado(a) na cidade de {{cidade_comprador}}, na {{endereco_comprador}}, nº {{numero_endereco_comprador}}, {{complemento_endereco_comprador}} – CEP {{cep_comprador}}, endereço eletrônico: {{email_comprador}}.</p>

<p>Os presentes, maiores e capazes, os quais declaram conhecerem-se mutuamente e reconhecidos como os próprios de que trato, pelo exame dos documentos apresentados, acima referidos, do que dou fé.</p>

<h2>III – DO(S) IMÓVEL(IS):</h2>

<p>Pelo(s) referido(s) outorgante(s) vendedor(a)(es), me foi dito que, a justo título, livre e desembaraçado de quaisquer ônus, judiciais ou extrajudiciais, é(são) senhor(a)(es) e legítimo(s) possuidor(a)(es) do(s) seguinte(s) bem(ns) imóvel(is):</p>

<p>{{descricao_imovel}}</p>

<h3>III.1) Cadastro na Prefeitura municipal e valor venal:</h3>

<p>Cadastrado na Prefeitura Municipal local sob número {{cadastro_municipal}}, e valor venal para {{ano_referencia}} de R$ {{valor_venal}} ({{valor_venal_extenso}});</p>

<h3>III.2) Título aquisitivo:</h3>

<p>Havido através do registro nº {{registro_aquisitivo}} de {{data_registro_aquisitivo}}, na matrícula nº {{matricula_aquisitiva}} do {{numero_registro_aquisitivo}}º Oficial de Registro Imobiliário local.</p>

<h2>IV – DA COMPRA E VENDA, PREÇO, FORMA DE PAGAMENTO, QUITAÇÃO E TRANSFERÊNCIA:</h2>

<p>Pelo(a)(s) outorgante(s) vendedor(a)(es) me foi dito que por esta escritura pública e na melhor forma de direito VENDE(M) o(s) imóvel(is) supra ao(s) outorgado(a)(s) comprador(a)(es), pelo preço certo e ajustado de R$ {{valor_venda}} ({{valor_venda_extenso}}), que o(a)(s) outorgante(s) vendedor(a)(es) confessa(m) e declara(m) já haver recebido anteriormente do(a)(s) outorgado(a)(s) comprador(a)(es), na forma contratada entre eles, em {{data_pagamento}}, pagos através de {{forma_pagamento}}, na conta de destino, do Banco {{banco_vendedor}}, agência {{agencia_vendedor}}, conta nº {{conta_vendedor}} de titularidade dele(a)(s) vendedor(a)(es).</p>

<p>Referido pagamento foi feito pelo(a)(s) comprador(a)(es), pela conta de origem, do Banco {{banco_comprador}}, agência {{agencia_comprador}}, conta nº {{conta_comprador}} de titularidade dele(a)(s) comprador(a)(es).</p>

<p>Assim, de cujo preço total expressa(m) e dá(ão) plena, geral e irrevogável quitação de pago(a)(s) e satisfeito(a)(s) para nunca mais o repetir, e desde já transfere(m)-lhe toda a posse, domínio, direitos e ações que exercia(m) sobre o(s) mencionado(s) imóvel(is), para que dele o(a)(s) mencionado(a)(s) comprador(a)(es) possa usar, gozar e livremente dispor como seu que fica sendo, obrigando-se o(a)(s) outorgante(s) vendedor(a)(es), por si e seus sucessores, a fazer a presente venda sempre boa, firme e valiosa, respondendo pela evicção, na forma da lei.</p>

<h2>V – ACEITAÇÃO PELO(A)(S) COMPRADOR(A)(ES):</h2>

<p>Pelo(a)(s) outorgado(a)(s) comprador(a)(es), me foi dito que aceitava a presente venda e esta escritura, em todos os seus expressos termos.</p>

<h2>VI – DECLARAÇÕES:</h2>

<p><strong>Do(a)(s) vendedor(a)(es):</strong></p>
<p>a) que não existem em trâmite ações fundadas em direito real ou pessoal que afetem o(s) imóvel(is) ora vendido(s);</p>
<p>b) que não possui(em) inscrição e/ou vínculos junto ao INSS como empregador(es), não comercializa(m), não exporta(m) e nem vende(m) ao consumidor produtos agropecuários, não se enquadrando nas restrições da IN/MPS/SRP número 03, de 14 de julho de 2005, e Decreto número 3.048, de 06 de maio de 1999;</p>
<p>c) que foram apresentadas as certidões pessoais do(a)(s) outorgante(s) vendedor(a)(es), conferidas, aceitas, e entregues ao(à)(s) outorgado(a)(s) comprador(a)(es);</p>
<p>d) Declara(m) o(a)(s) outorgante(s) vendedor(a)(es), sob as penas da lei, sob responsabilidade civil e criminal, que é(são) totalmente responsável(is) pelos pagamentos de quaisquer débitos tributários acaso existentes e que recaiam sobre o(s) imóvel(is) até a presente data.</p>

<p><strong>Comum das Partes:</strong></p>
<p>a) que foram orientadas a respeito da possibilidade de obtenção prévia de Certidão Negativa de Débitos Trabalhistas (CNDT);</p>
<p>b) que não se enquadram como pessoas expostas politicamente, tampouco na condição de pessoa investigada ou acusada de terrorismo;</p>
<p>c) As partes contratantes declaram que não se enquadram nas condições previstas no artigo 156 – Estado de Perigo – e no artigo 157 – Lesão – do Código Civil Brasileiro;</p>
<p>d) As informações referentes à forma de pagamento foram prestadas pelas partes, que declaram assumir total responsabilidade pela veracidade de tais informações.</p>

<h2>VII – REQUERIMENTOS:</h2>

<p>Pelas partes me foi dito que requerem e que autorizam o Oficial do Registro de Imóveis competente a proceder todos os atos de registro, matrícula, averbações e cancelamentos que se fizerem necessários à regularização e registro desta.</p>

<h2>VIII – DOCUMENTOS APRESENTADOS:</h2>

<p>1) ITBI: Pelo(s) outorgado(s) comprador(es) me foi dito que se obriga(m) nos termos da Lei Municipal de {{cidade_comarca}}/SP nº {{numero_lei_itbi}} de {{ano_lei_itbi}}, no prazo legal exigido pela Municipalidade, apresentar(em) a(s) prova(s) do(s) pagamento(s) do Imposto sobre Transmissão de Bens Imóveis – ITBI, no(s) valor(es) de R$ {{valor_itbi}}.</p>

<p>2) MATRÍCULA: Certidão(ões) de propriedade e negativa(s) de ônus e alienações da(s) matrícula(s) número(s) {{matricula_imovel}}, expedida pelo {{numero_registro_imobiliario}}º Oficial de Registro de Imóveis local, em data de {{data_certidao_matricula}}.</p>

<p>3) Certidão(ões) Negativa(s) de Débitos Trabalhistas (CNDT).</p>

<p>4) Indisponibilidade: Foi consultada a central de indisponibilidade, nos termos do provimento nº 13/2012 da Corregedoria Geral de Justiça do Estado de São Paulo.</p>

<p>5) CERTIDÃO NEGATIVA DE DÉBITOS MUNICIPAIS.</p>

<h2>IX – ARQUIVAMENTOS:</h2>

<p>Que os documentos mencionados nessa escritura estão salvos nos classificadores eletrônicos próprios, pelo protocolo desta escritura. Emite-se DOI na forma da instrução normativa da Receita Federal vigente. Assim o disseram e dou fé. A pedido das partes, lavrei a presente escritura, a qual feita e lhes sendo lida, em voz alta, acharam-na conforme, outorgaram, aceitaram e assinam.</p>

<p style="text-align: center; margin-top: 80px;">
_________________________________<br/>
<strong>{{nome_vendedor_1}}</strong><br/>
CPF: {{cpf_vendedor_1}}
</p>

<p style="text-align: center; margin-top: 40px;">
_________________________________<br/>
<strong>{{nome_vendedor_2}}</strong><br/>
CPF: {{cpf_vendedor_2}}
</p>

<p style="text-align: center; margin-top: 40px;">
_________________________________<br/>
<strong>{{nome_comprador}}</strong><br/>
CPF: {{cpf_comprador}}
</p>`,
    variables: [
      // Dados gerais
      { id: 'v1', name: 'protocolo', displayName: 'Protocolo', type: 'text', required: false },
      { id: 'v2', name: 'ano_referencia', displayName: 'Ano de Referência', type: 'text', required: true },
      { id: 'v3', name: 'valor_venda', displayName: 'Valor da Venda (R$)', type: 'number', required: true },
      { id: 'v4', name: 'valor_venda_extenso', displayName: 'Valor da Venda (Extenso)', type: 'text', required: true },
      { id: 'v5', name: 'valor_venal', displayName: 'Valor Venal (R$)', type: 'number', required: true },
      { id: 'v6', name: 'valor_venal_extenso', displayName: 'Valor Venal (Extenso)', type: 'text', required: false },
      { id: 'v7', name: 'matricula_imovel', displayName: 'Matrícula do Imóvel', type: 'text', required: true },
      { id: 'v8', name: 'numero_registro_imobiliario', displayName: 'Nº Registro Imobiliário', type: 'text', required: true },

      // Dados da lavratura
      { id: 'v9', name: 'dia_lavratura', displayName: 'Dia da Lavratura', type: 'text', required: true },
      { id: 'v10', name: 'mes_lavratura', displayName: 'Mês da Lavratura', type: 'text', required: true },
      { id: 'v11', name: 'complemento_ano', displayName: 'Complemento do Ano (ex: cinco)', type: 'text', required: true },
      { id: 'v12', name: 'ano_lavratura', displayName: 'Ano da Lavratura', type: 'text', required: true },
      { id: 'v13', name: 'cidade_comarca', displayName: 'Cidade/Comarca', type: 'text', required: true },
      { id: 'v14', name: 'numero_tabelionato', displayName: 'Nº do Tabelionato', type: 'text', required: true },
      { id: 'v15', name: 'cidade_tabelionato', displayName: 'Cidade do Tabelionato', type: 'text', required: true },
      { id: 'v16', name: 'endereco_tabelionato', displayName: 'Endereço do Tabelionato', type: 'address', required: true },
      { id: 'v17', name: 'numero_endereco_tabelionato', displayName: 'Nº End. Tabelionato', type: 'text', required: true },
      { id: 'v18', name: 'complemento_tabelionato', displayName: 'Compl. End. Tabelionato', type: 'text', required: false },

      // Vendedor 1
      { id: 'v19', name: 'nome_vendedor_1', displayName: 'Nome Vendedor 1', type: 'text', required: true },
      { id: 'v20', name: 'filiacao_pai_vendedor_1', displayName: 'Pai do Vendedor 1', type: 'text', required: true },
      { id: 'v21', name: 'filiacao_mae_vendedor_1', displayName: 'Mãe do Vendedor 1', type: 'text', required: true },
      { id: 'v22', name: 'rg_vendedor_1', displayName: 'RG Vendedor 1', type: 'rg', required: true },
      { id: 'v23', name: 'cpf_vendedor_1', displayName: 'CPF Vendedor 1', type: 'cpf', required: true },
      { id: 'v24', name: 'nacionalidade_vendedor_1', displayName: 'Nacionalidade Vendedor 1', type: 'text', required: true },
      { id: 'v25', name: 'profissao_vendedor_1', displayName: 'Profissão Vendedor 1', type: 'text', required: true },

      // Vendedor 2
      { id: 'v26', name: 'nome_vendedor_2', displayName: 'Nome Vendedor 2', type: 'text', required: true },
      { id: 'v27', name: 'filiacao_pai_vendedor_2', displayName: 'Pai do Vendedor 2', type: 'text', required: true },
      { id: 'v28', name: 'filiacao_mae_vendedor_2', displayName: 'Mãe do Vendedor 2', type: 'text', required: true },
      { id: 'v29', name: 'rg_vendedor_2', displayName: 'RG Vendedor 2', type: 'rg', required: true },
      { id: 'v30', name: 'cpf_vendedor_2', displayName: 'CPF Vendedor 2', type: 'cpf', required: true },
      { id: 'v31', name: 'nacionalidade_vendedor_2', displayName: 'Nacionalidade Vendedor 2', type: 'text', required: true },
      { id: 'v32', name: 'profissao_vendedor_2', displayName: 'Profissão Vendedor 2', type: 'text', required: true },

      // Casamento vendedores
      { id: 'v33', name: 'regime_casamento_vendedores', displayName: 'Regime de Casamento', type: 'text', required: true },
      { id: 'v34', name: 'data_casamento_vendedores', displayName: 'Data do Casamento', type: 'date', required: true },
      { id: 'v35', name: 'data_registro_casamento_vendedores', displayName: 'Data Reg. Casamento', type: 'date', required: true },
      { id: 'v36', name: 'matricula_casamento_vendedores', displayName: 'Matrícula Casamento', type: 'text', required: true },
      { id: 'v37', name: 'subdistrito_vendedores', displayName: 'Subdistrito Vendedores', type: 'text', required: true },
      { id: 'v38', name: 'cidade_casamento_vendedores', displayName: 'Cidade Casamento', type: 'text', required: true },
      { id: 'v39', name: 'cidade_vendedores', displayName: 'Cidade Vendedores', type: 'text', required: true },
      { id: 'v40', name: 'endereco_vendedores', displayName: 'Endereço Vendedores', type: 'address', required: true },
      { id: 'v41', name: 'numero_endereco_vendedores', displayName: 'Nº End. Vendedores', type: 'text', required: true },
      { id: 'v42', name: 'complemento_endereco_vendedores', displayName: 'Compl. End. Vendedores', type: 'text', required: false },
      { id: 'v43', name: 'email_vendedores', displayName: 'E-mail Vendedores', type: 'email', required: false },

      // Comprador
      { id: 'v44', name: 'nome_comprador', displayName: 'Nome Comprador', type: 'text', required: true },
      { id: 'v45', name: 'filiacao_pai_comprador', displayName: 'Pai do Comprador', type: 'text', required: true },
      { id: 'v46', name: 'filiacao_mae_comprador', displayName: 'Mãe do Comprador', type: 'text', required: true },
      { id: 'v47', name: 'rg_comprador', displayName: 'RG Comprador', type: 'rg', required: true },
      { id: 'v48', name: 'cpf_comprador', displayName: 'CPF Comprador', type: 'cpf', required: true },
      { id: 'v49', name: 'nacionalidade_comprador', displayName: 'Nacionalidade Comprador', type: 'text', required: true },
      { id: 'v50', name: 'profissao_comprador', displayName: 'Profissão Comprador', type: 'text', required: true },
      { id: 'v51', name: 'estado_civil_comprador', displayName: 'Estado Civil Comprador', type: 'text', required: true },
      { id: 'v52', name: 'certidao_estado_civil_comprador', displayName: 'Certidão Estado Civil', type: 'text', required: true },
      { id: 'v53', name: 'matricula_certidao_comprador', displayName: 'Matrícula Certidão', type: 'text', required: true },
      { id: 'v54', name: 'subdistrito_comprador', displayName: 'Subdistrito Comprador', type: 'text', required: true },
      { id: 'v55', name: 'cidade_certidao_comprador', displayName: 'Cidade Certidão', type: 'text', required: true },
      { id: 'v56', name: 'cidade_comprador', displayName: 'Cidade Comprador', type: 'text', required: true },
      { id: 'v57', name: 'endereco_comprador', displayName: 'Endereço Comprador', type: 'address', required: true },
      { id: 'v58', name: 'numero_endereco_comprador', displayName: 'Nº End. Comprador', type: 'text', required: true },
      { id: 'v59', name: 'complemento_endereco_comprador', displayName: 'Compl. End. Comprador', type: 'text', required: false },
      { id: 'v60', name: 'cep_comprador', displayName: 'CEP Comprador', type: 'text', required: true },
      { id: 'v61', name: 'email_comprador', displayName: 'E-mail Comprador', type: 'email', required: false },

      // Imóvel
      { id: 'v62', name: 'descricao_imovel', displayName: 'Descrição do Imóvel', type: 'text', required: true },
      { id: 'v63', name: 'cadastro_municipal', displayName: 'Cadastro Municipal', type: 'text', required: true },
      { id: 'v64', name: 'registro_aquisitivo', displayName: 'Nº Registro Aquisitivo', type: 'text', required: true },
      { id: 'v65', name: 'data_registro_aquisitivo', displayName: 'Data Reg. Aquisitivo', type: 'date', required: true },
      { id: 'v66', name: 'matricula_aquisitiva', displayName: 'Matrícula Aquisitiva', type: 'text', required: true },
      { id: 'v67', name: 'numero_registro_aquisitivo', displayName: 'Nº Ofício Reg. Aquisitivo', type: 'text', required: true },

      // Pagamento
      { id: 'v68', name: 'data_pagamento', displayName: 'Data do Pagamento', type: 'date', required: true },
      { id: 'v69', name: 'forma_pagamento', displayName: 'Forma de Pagamento', type: 'text', required: true },
      { id: 'v70', name: 'banco_vendedor', displayName: 'Banco Vendedor', type: 'text', required: true },
      { id: 'v71', name: 'agencia_vendedor', displayName: 'Agência Vendedor', type: 'text', required: true },
      { id: 'v72', name: 'conta_vendedor', displayName: 'Conta Vendedor', type: 'text', required: true },
      { id: 'v73', name: 'banco_comprador', displayName: 'Banco Comprador', type: 'text', required: true },
      { id: 'v74', name: 'agencia_comprador', displayName: 'Agência Comprador', type: 'text', required: true },
      { id: 'v75', name: 'conta_comprador', displayName: 'Conta Comprador', type: 'text', required: true },

      // ITBI e documentos
      { id: 'v76', name: 'numero_lei_itbi', displayName: 'Nº Lei ITBI', type: 'text', required: false },
      { id: 'v77', name: 'ano_lei_itbi', displayName: 'Ano Lei ITBI', type: 'text', required: false },
      { id: 'v78', name: 'valor_itbi', displayName: 'Valor ITBI (R$)', type: 'number', required: false },
      { id: 'v79', name: 'data_certidao_matricula', displayName: 'Data Certidão Matrícula', type: 'date', required: false },
    ],
    createdAt: new Date('2024-03-10'),
  },
];
