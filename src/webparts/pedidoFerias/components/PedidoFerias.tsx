import * as React from 'react';/**

import { useState, useEffect } from 'react'; * COMPONENTE PRINCIPAL DO SISTEMA DE PEDIDOS DE FÉRIAS

import styles from './PedidoFerias.module.scss'; * 

import type { IPedidoFeriasProps } from './IPedidoFeriasProps'; * Este é o componente raiz do sistema que integra todas as funcionalidades:

 * - Listagem de pedidos com filtros e busca

// Importações do Fluent UI * - Exibição de fotos dos colaboradores via Microsoft Graph

import { * - Interface responsiva com Fluent UI

  Stack, * - Estados de loading e tratamento de erros

  Text, * - Dados simulados para demonstração

  PrimaryButton, * 

  DefaultButton, * Arquitetura do Componente:

  SearchBox, * - Utiliza React Hooks para gerenciamento de estado

  Dropdown, * - Integração com SharePoint via PnP JS (preparado)

  IDropdownOption, * - Design responsivo com Fluent UI components

  MessageBar, * - Sistema de cache para fotos de usuários

  MessageBarType, * 

  Spinner, * Funcionalidades Implementadas:

  SpinnerSize, * ✅ Listagem de pedidos com dados simulados

  DetailsList, * ✅ Filtros por texto e estado

  DetailsListLayoutMode, * ✅ Exibição de fotos via Microsoft Graph API

  IColumn, * ✅ Interface responsiva e moderna

  SelectionMode, * ✅ Estados de loading e mensagens de erro

  IconButton, * 

  Panel, * Próximas Funcionalidades:

  PanelType, * 🔄 Integração real com SharePoint Lists

  TextField, * 🔄 Formulário de criação de pedidos

  DatePicker, * 🔄 Sistema de aprovação/rejeição

  ComboBox, * 🔄 Paginação e ordenação

  IComboBoxOption * 

} from '@fluentui/react'; * @component PedidoFerias

 * @author Sistema SPFx Pedidos Férias

// Interface do pedido de férias */

interface IPedidoFerias {import * as React from 'react';

  id: number;import { useState, useEffect } from 'react';

  funcionario: string;import styles from './PedidoFerias.module.scss';

  cargo: string;import type { IPedidoFeriasProps } from './IPedidoFeriasProps';

  departamento: string;

  dataInicio: Date;// Componentes customizados do sistema

  dataFim: Date;import UserPhoto from '../../../components/UserPhoto';

  diasSolicitados: number;import { IPedidoFerias, EstadoPedido } from '../../../models/IPedidoFerias';

  motivo: string;

  status: 'Pendente' | 'Aprovado' | 'Rejeitado';// Componentes do Fluent UI para interface moderna

  dataSubmissao: Date;import {

  aprovadoPor?: string;  Stack,           // Layout flexível

  comentarios?: string;  Text,            // Tipografia

  comentarioGestor?: string;  PrimaryButton,   // Botões primários

}  DefaultButton,   // Botões secundários

  SearchBox,       // Campo de busca

// Dados simulados expandidos com mais funcionários  Dropdown,        // Seleção de opções

const dadosSimulados: IPedidoFerias[] = [  IDropdownOption, // Tipo para opções do dropdown

  {  Spinner,         // Indicador de carregamento

    id: 1,  SpinnerSize,     // Tamanhos do spinner

    funcionario: 'Ana Silva',  MessageBar,      // Mensagens de status

    cargo: 'Desenvolvedora Senior',  MessageBarType,  // Tipos de mensagem

    departamento: 'TI',  Panel,           // Painel lateral

    dataInicio: new Date('2025-11-15'),  PanelType,       // Tipos de painel

    dataFim: new Date('2025-11-25'),  PersonaSize      // Tamanhos para fotos de usuário

    diasSolicitados: 10,} from '@fluentui/react';

    motivo: 'Viagem em família',

    status: 'Pendente',/**

    dataSubmissao: new Date('2025-10-15'), * Componente funcional principal com props tipadas

    comentarioGestor: '' * 

  }, * @param props Propriedades recebidas do WebPart pai

  { * @returns JSX.Element Interface renderizada do sistema

    id: 2, */

    funcionario: 'Carlos Santos',const PedidoFerias: React.FC<IPedidoFeriasProps> = (props) => {

    cargo: 'Analista de Sistemas',  

    departamento: 'TI',  // ===== GERENCIAMENTO DE ESTADO COM REACT HOOKS =====

    dataInicio: new Date('2025-12-20'),  

    dataFim: new Date('2025-12-30'),  /** Lista de pedidos de férias (carregada via API ou dados simulados) */

    diasSolicitados: 10,  const [pedidos, setPedidos] = useState<IPedidoFerias[]>([]);

    motivo: 'Férias de fim de ano',  

    status: 'Aprovado',  /** Indicador se dados estão sendo carregados */

    dataSubmissao: new Date('2025-10-10'),  const [loading, setLoading] = useState<boolean>(true);

    aprovadoPor: 'Maria Gestora',  

    comentarios: 'Aprovado para período de baixa demanda',  /** Mensagem de erro para exibir ao usuário */

    comentarioGestor: 'Período aprovado conforme planejamento da equipe'  const [error, setError] = useState<string>('');

  },  

  {  /** Texto digitado no campo de busca para filtrar pedidos */

    id: 3,  const [searchText, setSearchText] = useState<string>('');

    funcionario: 'Beatriz Costa',  

    cargo: 'UX Designer',  /** Estado selecionado no dropdown de filtros */

    departamento: 'Design',  const [filtroEstado, setFiltroEstado] = useState<string>('');

    dataInicio: new Date('2025-11-01'),  

    dataFim: new Date('2025-11-10'),  /** Controla se o painel de novo pedido está aberto */

    diasSolicitados: 10,  const [showNewPedidoPanel, setShowNewPedidoPanel] = useState<boolean>(false);

    motivo: 'Descanso pessoal',  

    status: 'Rejeitado',  // Serviço PnP para integração SharePoint (comentado para desenvolvimento)

    dataSubmissao: new Date('2025-10-08'),  // const [pnpService] = useState<PnPService>(() => new PnPService(props.context));

    aprovadoPor: 'João Diretor',

    comentarios: 'Período de alta demanda de projetos',  // ===== DADOS SIMULADOS PARA DEMONSTRAÇÃO =====

    comentarioGestor: 'Sugerimos reagendar para dezembro'  // Em produção, estes dados viriam da lista SharePoint via PnP JS

  },  const dadosSimulados: IPedidoFerias[] = [

  {    {

    id: 4,      Id: 1,

    funcionario: 'Rafael Oliveira',      Title: 'Férias de Verão - João Silva',

    cargo: 'Product Manager',      ColaboradorId: 1,

    departamento: 'Produto',      Colaborador: { Title: 'João Silva', EMail: 'joao.silva@hnlcompany.onmicrosoft.com', Id: 1 },

    dataInicio: new Date('2025-12-15'),      DataInicio: '2025-07-01',

    dataFim: new Date('2025-12-22'),      DataFim: '2025-07-15',

    diasSolicitados: 7,      DiasTotal: 15,

    motivo: 'Festividades natalinas',      Motivo: 'Férias de verão com a família',

    status: 'Pendente',      Estado: EstadoPedido.Pendente,

    dataSubmissao: new Date('2025-10-12'),      DataSolicitacao: '2025-06-15T10:00:00Z',

    comentarioGestor: ''      Created: '2025-06-15T10:00:00Z',

  },      Modified: '2025-06-15T10:00:00Z',

  {      Author: { Title: 'João Silva', Id: 1 },

    id: 5,      Editor: { Title: 'João Silva', Id: 1 }

    funcionario: 'Fernanda Lima',    },

    cargo: 'Analista de Marketing',    {

    departamento: 'Marketing',      Id: 2,

    dataInicio: new Date('2025-11-18'),      Title: 'Férias de Natal - Maria Santos',

    dataFim: new Date('2025-11-25'),      ColaboradorId: 2,

    diasSolicitados: 7,      Colaborador: { Title: 'Maria Santos', EMail: 'maria.santos@hnlcompany.onmicrosoft.com', Id: 2 },

    motivo: 'Casamento de familiar',      DataInicio: '2025-12-20',

    status: 'Aprovado',      DataFim: '2025-12-30',

    dataSubmissao: new Date('2025-10-05'),      DiasTotal: 10,

    aprovadoPor: 'Carla Coordenadora',      Motivo: 'Festividades de fim de ano',

    comentarios: 'Evento importante da família',      Estado: EstadoPedido.Aprovado,

    comentarioGestor: 'Aprovado com antecedência suficiente'      DataSolicitacao: '2025-11-01T14:30:00Z',

  },      AprovadoPor: { Title: 'Gestor RH', Id: 99 },

  {      DataAprovacao: '2025-11-05T09:15:00Z',

    id: 6,      Observacoes: 'Aprovado. Boas férias!',

    funcionario: 'Pedro Rocha',      Created: '2025-11-01T14:30:00Z',

    cargo: 'Desenvolvedor Frontend',      Modified: '2025-11-05T09:15:00Z',

    departamento: 'TI',      Author: { Title: 'Maria Santos', Id: 2 },

    dataInicio: new Date('2025-12-02'),      Editor: { Title: 'Gestor RH', Id: 99 }

    dataFim: new Date('2025-12-09'),    },

    diasSolicitados: 7,    {

    motivo: 'Viagem de lazer',      Id: 3,

    status: 'Pendente',      Title: 'Férias Rejeitadas - Pedro Costa',

    dataSubmissao: new Date('2025-10-14'),      ColaboradorId: 3,

    comentarioGestor: ''      Colaborador: { Title: 'Pedro Costa', EMail: 'pedro.costa@hnlcompany.onmicrosoft.com', Id: 3 },

  },      DataInicio: '2025-05-10',

  {      DataFim: '2025-05-20',

    id: 7,      DiasTotal: 10,

    funcionario: 'Juliana Mendes',      Motivo: 'Compromissos familiares urgentes',

    cargo: 'Analista Financeira',      Estado: EstadoPedido.Rejeitado,

    departamento: 'Financeiro',      DataSolicitacao: '2025-04-25T16:45:00Z',

    dataInicio: new Date('2025-11-25'),      AprovadoPor: { Title: 'Gestor RH', Id: 99 },

    dataFim: new Date('2025-12-02'),      DataAprovacao: '2025-04-28T11:20:00Z',

    diasSolicitados: 7,      Observacoes: 'Rejeitado. Período muito próximo ao fechamento do projeto.',

    motivo: 'Descanso médico recomendado',      Created: '2025-04-25T16:45:00Z',

    status: 'Aprovado',      Modified: '2025-04-28T11:20:00Z',

    dataSubmissao: new Date('2025-10-11'),      Author: { Title: 'Pedro Costa', Id: 3 },

    aprovadoPor: 'Roberto Supervisor',      Editor: { Title: 'Gestor RH', Id: 99 }

    comentarios: 'Recomendação médica para descanso',    }

    comentarioGestor: 'Aprovado por questões de saúde'  ];

  },

  {  // ===== MÉTODOS DE CARREGAMENTO DE DADOS =====

    id: 8,

    funcionario: 'Ricardo Alves',  /**

    cargo: 'DevOps Engineer',   * Carrega lista de pedidos de férias

    departamento: 'TI',   * 

    dataInicio: new Date('2025-11-12'),   * Fluxo de execução:

    dataFim: new Date('2025-11-19'),   * 1. Ativa estado loading

    diasSolicitados: 7,   * 2. Limpa mensagens de erro

    motivo: 'Curso de especialização',   * 3. Tenta buscar dados do SharePoint via PnP JS

    status: 'Pendente',   * 4. Em caso de erro ou desenvolvimento, usa dados simulados

    dataSubmissao: new Date('2025-10-13'),   * 5. Atualiza estado do componente

    comentarioGestor: ''   * 

  },   * TODO: Implementar integração real com SharePoint List

  {   * - Usar PnPService.getPedidos()

    id: 9,   * - Aplicar filtros e paginação

    funcionario: 'Camila Torres',   * - Tratar permissões de acesso

    cargo: 'Scrum Master',   * 

    departamento: 'TI',   * @async

    dataInicio: new Date('2025-12-10'),   * @returns Promise<void>

    dataFim: new Date('2025-12-17'),   */

    diasSolicitados: 7,  const loadPedidos = async (): Promise<void> => {

    motivo: 'Férias acumuladas',    try {

    status: 'Aprovado',      setLoading(true);

    dataSubmissao: new Date('2025-10-07'),      setError('');

    aprovadoPor: 'André Gerente',      

    comentarios: 'Direito adquirido de férias acumuladas',      // DESENVOLVIMENTO: Simula delay de API real

    comentarioGestor: 'Conforme política de RH'      // Em produção, substituir por: const pedidos = await pnpService.getPedidos();

  },      setTimeout(() => {

  {        setPedidos(dadosSimulados);

    id: 10,        setLoading(false);

    funcionario: 'Lucas Ferreira',      }, 1000);

    cargo: 'QA Analyst',      

    departamento: 'TI',    } catch (err) {

    dataInicio: new Date('2025-11-08'),      console.error('Erro ao carregar pedidos:', err);

    dataFim: new Date('2025-11-15'),      setError('Erro ao carregar pedidos. Usando dados de demonstração.');

    diasSolicitados: 7,      

    motivo: 'Mudança de residência',      // Fallback para dados simulados em caso de erro

    status: 'Pendente',      setPedidos(dadosSimulados);

    dataSubmissao: new Date('2025-10-16'),      setLoading(false);

    comentarioGestor: ''    }

  }  };

];

  /**

// Função para formatar data   * Hook useEffect para carregar dados quando componente monta

const formatarData = (data: Date): string => {   * 

  return data.toLocaleDateString('pt-BR', {    * Executa loadPedidos() uma única vez na inicialização

    day: '2-digit',    * Inclui tratamento de erro adicional para capturar falhas

    month: '2-digit',    * no processo de carregamento

    year: 'numeric'    */

  });  useEffect(() => {

};    loadPedidos().catch(error => {

      console.error('Erro no useEffect loadPedidos:', error);

// Função para obter as iniciais do nome      setLoading(false);

const obterIniciais = (nome: string): string => {    });

  return nome.split(' ').map(n => n[0]).join('').toUpperCase();  }, []); // Array vazio = executa apenas uma vez

};

  // ===== MÉTODOS UTILITÁRIOS E FORMATAÇÃO =====

const PedidoFerias: React.FC<IPedidoFeriasProps> = (props) => {

  // Estados do componente  /**

  const [pedidos, setPedidos] = useState<IPedidoFerias[]>(dadosSimulados);   * Retorna cor hexadecimal baseada no estado do pedido

  const [pedidosFiltrados, setPedidosFiltrados] = useState<IPedidoFerias[]>(dadosSimulados);   * 

  const [loading, setLoading] = useState(false);   * Utilizado para estilizar badges e bordas dos cards

  const [filtroTexto, setFiltroTexto] = useState('');   * Cores seguem padrão Microsoft Fluent UI

  const [filtroStatus, setFiltroStatus] = useState('');   * 

  const [abaSelecionada, setAbaSelecionada] = useState('dashboard');   * @param estado Estado do pedido (enum EstadoPedido)

  const [mostrarPainel, setMostrarPainel] = useState(false);   * @returns string Cor hexadecimal

   */

  // Estados do formulário  const getEstadoColor = (estado: EstadoPedido): string => {

  const [novoFuncionario, setNovoFuncionario] = useState('');    switch (estado) {

  const [novoCargo, setNovoCargo] = useState('');      case EstadoPedido.Pendente: return '#ff8c00';  // Laranja - Atenção

  const [novoDepartamento, setNovoDepartamento] = useState('');      case EstadoPedido.Aprovado: return '#10893e';  // Verde - Sucesso

  const [novaDataInicio, setNovaDataInicio] = useState<Date | null>(null);      case EstadoPedido.Rejeitado: return '#d13438'; // Vermelho - Erro

  const [novaDataFim, setNovaDataFim] = useState<Date | null>(null);      case EstadoPedido.Cancelado: return '#666666'; // Cinza - Neutro

  const [novoMotivo, setNovoMotivo] = useState('');      default: return '#666666';                     // Fallback

    }

  // Opções para dropdown de status  };

  const opcoesStatus: IDropdownOption[] = [

    { key: '', text: 'Todos os Status' },  /**

    { key: 'Pendente', text: 'Pendente' },   * Formata string ISO 8601 para data brasileira (DD/MM/AAAA)

    { key: 'Aprovado', text: 'Aprovado' },   * 

    { key: 'Rejeitado', text: 'Rejeitado' }   * @param dateString Data em formato ISO 8601

  ];   * @returns string Data formatada pt-BR

   */

  // Opções para funcionários  const formatDate = (dateString: string): string => {

  const opcoesFuncionarios: IComboBoxOption[] = [    const date = new Date(dateString);

    { key: 'Ana Silva', text: 'Ana Silva' },    return date.toLocaleDateString('pt-BR');

    { key: 'Carlos Santos', text: 'Carlos Santos' },  };

    { key: 'Beatriz Costa', text: 'Beatriz Costa' },

    { key: 'Rafael Oliveira', text: 'Rafael Oliveira' },  /**

    { key: 'Fernanda Lima', text: 'Fernanda Lima' },   * Formata string ISO 8601 para data e hora brasileira (DD/MM/AAAA HH:MM)

    { key: 'Pedro Rocha', text: 'Pedro Rocha' },   * 

    { key: 'Juliana Mendes', text: 'Juliana Mendes' },   * @param dateString Data/hora em formato ISO 8601

    { key: 'Ricardo Alves', text: 'Ricardo Alves' },   * @returns string Data e hora formatada pt-BR

    { key: 'Camila Torres', text: 'Camila Torres' },   */

    { key: 'Lucas Ferreira', text: 'Lucas Ferreira' }  const formatDateTime = (dateString: string): string => {

  ];    const date = new Date(dateString);

    return date.toLocaleDateString('pt-BR') + ' ' + 

  // Função para aplicar filtros           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const aplicarFiltros = () => {  };

    let resultado = pedidos;

  // ===== SISTEMA DE FILTROS DINÂMICOS =====

    // Filtro por texto

    if (filtroTexto) {  /**

      resultado = resultado.filter(pedido =>   * Filtra lista de pedidos baseado em critérios múltiplos

        pedido.funcionario.toLowerCase().includes(filtroTexto.toLowerCase()) ||   * 

        pedido.cargo.toLowerCase().includes(filtroTexto.toLowerCase()) ||   * Algoritmo de filtros combinados:

        pedido.departamento.toLowerCase().includes(filtroTexto.toLowerCase()) ||   * 1. Filtro textual (busca em múltiplos campos)

        pedido.motivo.toLowerCase().includes(filtroTexto.toLowerCase())   * 2. Filtro por estado específico

      );   * 3. Operador lógico AND entre filtros

    }   * 

   * Performance: Executa a cada mudança de estado (searchText, filtroEstado, pedidos)

    // Filtro por status   * 

    if (filtroStatus) {   * @constant

      resultado = resultado.filter(pedido => pedido.status === filtroStatus);   * @type {IPedidoFerias[]} Array filtrado de pedidos

    }   */

  const filteredPedidos = pedidos.filter(pedido => {

    setPedidosFiltrados(resultado);    // FILTRO TEXTUAL: Busca case-insensitive em múltiplos campos

  };    // Campos pesquisados: Nome colaborador, Motivo, Título do pedido

    const matchSearch = !searchText || 

  // Efeito para aplicar filtros quando mudarem      pedido.Colaborador.Title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||

  useEffect(() => {      (pedido.Motivo && pedido.Motivo.toLowerCase().indexOf(searchText.toLowerCase()) >= 0) ||

    aplicarFiltros();      pedido.Title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;

  }, [filtroTexto, filtroStatus, pedidos]);    

    // FILTRO ESTADO: Compara estado exato ou "todos" (string vazia)

  // Função para calcular estatísticas    const matchEstado = !filtroEstado || pedido.Estado === filtroEstado;

  const calcularEstatisticas = () => {    

    const total = pedidos.length;    // COMBINAÇÃO: Retorna true apenas se AMBOS os filtros passam

    const pendentes = pedidos.filter(p => p.status === 'Pendente').length;    return matchSearch && matchEstado;

    const aprovados = pedidos.filter(p => p.status === 'Aprovado').length;  });

    const rejeitados = pedidos.filter(p => p.status === 'Rejeitado').length;

  /**

    return { total, pendentes, aprovados, rejeitados };   * Opções para dropdown de filtro por estado

  };   * 

   * Utiliza enum EstadoPedido para garantir consistência

  const stats = calcularEstatisticas();   * Inclui opção "Todos" para resetar filtro

   * 

  // Função para obter cor do status   * @constant

  const obterCorStatus = (status: string): string => {   * @type {IDropdownOption[]} Array de opções Fluent UI

    switch (status) {   */

      case 'Aprovado': return '#107c10';  const estadoOptions: IDropdownOption[] = [

      case 'Rejeitado': return '#d13438';    { key: '', text: 'Todos os estados' },                    // Opção padrão

      case 'Pendente': return '#ff8c00';    { key: EstadoPedido.Pendente, text: 'Pendente' },         // Filtro específico

      default: return '#666';    { key: EstadoPedido.Aprovado, text: 'Aprovado' },         // Filtro específico

    }    { key: EstadoPedido.Rejeitado, text: 'Rejeitado' },       // Filtro específico

  };    { key: EstadoPedido.Cancelado, text: 'Cancelado' }        // Filtro específico

  ];

  // Função para adicionar comentário do gestor

  const adicionarComentarioGestor = (id: number, comentario: string) => {  // ===== RENDERIZAÇÃO CONDICIONAL BASEADA EM ESTADO =====

    setPedidos(prev => prev.map(pedido => 

      pedido.id === id   /**

        ? { ...pedido, comentarioGestor: comentario }   * Estado LOADING: Exibe spinner centralizado

        : pedido   * 

    ));   * Renderizado quando dados estão sendo carregados

  };   * Utiliza Fluent UI Spinner com label descritivo

   * Layout centralizado com padding adequado

  // Função para criar novo pedido   */

  const criarNovoPedido = () => {  if (loading) {

    if (!novoFuncionario || !novaDataInicio || !novaDataFim || !novoMotivo) {    return (

      alert('Por favor, preencha todos os campos obrigatórios.');      <div className={styles.pedidoFerias}>

      return;        <Stack horizontalAlign="center" tokens={{ padding: 40 }}>

    }          <Spinner 

            size={SpinnerSize.large} 

    const diasSolicitados = Math.ceil(            label="Carregando pedidos de férias..." 

      (novaDataFim.getTime() - novaDataInicio.getTime()) / (1000 * 60 * 60 * 24)            ariaLive="polite"

    ) + 1;            labelPosition="bottom"

          />

    const novoPedido: IPedidoFerias = {        </Stack>

      id: Math.max(...pedidos.map(p => p.id)) + 1,      </div>

      funcionario: novoFuncionario,    );

      cargo: novoCargo || 'Não informado',  }

      departamento: novoDepartamento || 'Não informado',

      dataInicio: novaDataInicio,  return (

      dataFim: novaDataFim,    <div className={styles.pedidoFerias}>

      diasSolicitados,      <Stack tokens={{ childrenGap: 20 }}>

      motivo: novoMotivo,        {/* Header */}

      status: 'Pendente',        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">

      dataSubmissao: new Date(),          <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#323130' } }}>

      comentarioGestor: ''            🏢 Sistema de Pedidos de Férias

    };          </Text>

          <PrimaryButton

    setPedidos(prev => [novoPedido, ...prev]);            text="+ Novo Pedido"

                onClick={() => setShowNewPedidoPanel(true)}

    // Limpar formulário            styles={{ root: { minWidth: 120 } }}

    setNovoFuncionario('');          />

    setNovoCargo('');        </Stack>

    setNovoDepartamento('');

    setNovaDataInicio(null);        {/* Filtros */}

    setNovaDataFim(null);        <div

    setNovoMotivo('');          style={{

    setMostrarPainel(false);            padding: '20px',

  };            borderRadius: '8px',

            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',

  // Renderizar Dashboard            backgroundColor: '#ffffff',

  const renderDashboard = () => (            marginBottom: '15px'

    <div className={styles.fadeIn}>          }}

      {/* Cartões de Estatísticas */}        >

      <div className={styles.dashboardGrid}>          <Stack tokens={{ childrenGap: 15 }}>

        <div className={styles.statCard}>            <Text variant="large" styles={{ root: { fontWeight: 600 } }}>

          <div className={styles.statNumber}>{stats.total}</div>              🔍 Filtros

          <div className={styles.statLabel}>Total de Pedidos</div>            </Text>

        </div>            <Stack horizontal tokens={{ childrenGap: 15 }} wrap>

        <div className={styles.statCard}>              <SearchBox

          <div className={styles.statNumber}>{stats.pendentes}</div>                placeholder="Buscar por colaborador, motivo..."

          <div className={styles.statLabel}>Pendentes</div>                value={searchText}

        </div>                onChange={(_, newValue) => setSearchText(newValue || '')}

        <div className={styles.statCard}>                styles={{ root: { minWidth: 250 } }}

          <div className={styles.statNumber}>{stats.aprovados}</div>              />

          <div className={styles.statLabel}>Aprovados</div>              <Dropdown

        </div>                placeholder="Estado"

        <div className={styles.statCard}>                options={estadoOptions}

          <div className={styles.statNumber}>{stats.rejeitados}</div>                selectedKey={filtroEstado}

          <div className={styles.statLabel}>Rejeitados</div>                onChange={(_, option) => setFiltroEstado(option?.key as string || '')}

        </div>                styles={{ root: { minWidth: 150 } }}

      </div>              />

            </Stack>

      {/* Grid de Funcionários */}          </Stack>

      <div className={styles.employeeGrid}>        </div>

        {dadosSimulados.map((pedido, index) => (

          <div key={index} className={styles.employeeCard}>        {/* Error Message */}

            <div className={styles.employeeHeader}>        {error && (

              <div className={styles.employeePhoto}>          <MessageBar messageBarType={MessageBarType.warning}>

                {obterIniciais(pedido.funcionario)}            {error}

              </div>          </MessageBar>

              <div className={styles.employeeInfo}>        )}

                <h3>{pedido.funcionario}</h3>

                <p>{pedido.cargo}</p>        {/* Lista de Pedidos */}

                <p style={{ fontSize: '12px', color: '#8a8886' }}>{pedido.departamento}</p>        <Stack tokens={{ childrenGap: 15 }}>

              </div>          <Text variant="large" styles={{ root: { fontWeight: 600 } }}>

            </div>            📊 Pedidos de Férias ({filteredPedidos.length} {filteredPedidos.length === 1 ? 'item' : 'itens'})

            <div style={{ marginTop: '12px' }}>          </Text>

              <strong>Período:</strong> {formatarData(pedido.dataInicio)} - {formatarData(pedido.dataFim)}<br/>          

              <strong>Dias:</strong> {pedido.diasSolicitados}<br/>          {filteredPedidos.map(pedido => (

              <strong>Motivo:</strong> {pedido.motivo}            <div

            </div>              key={pedido.Id}

            <div className={`${styles.vacationStatus} ${styles[pedido.status.toLowerCase()]}`}>              style={{

              {pedido.status}                padding: '20px',

            </div>                borderRadius: '8px',

            {pedido.status === 'Pendente' && (                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',

              <div style={{ marginTop: '12px' }}>                border: `2px solid ${getEstadoColor(pedido.Estado)}`,

                <TextField                backgroundColor: '#ffffff',

                  label="Comentário do Gestor"                marginBottom: '8px'

                  placeholder="Adicionar comentário..."              }}

                  value={pedido.comentarioGestor || ''}            >

                  onChange={(_, value) => adicionarComentarioGestor(pedido.id, value || '')}              <Stack tokens={{ childrenGap: 12 }}>

                  multiline                {/* Header do Card */}

                  rows={2}                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">

                  style={{ fontSize: '12px' }}                  <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">

                />                    <UserPhoto

              </div>                      email={pedido.Colaborador.EMail}

            )}                      displayName={pedido.Colaborador.Title}

            {pedido.comentarioGestor && (                      context={props.context}

              <div style={{                       size={PersonaSize.size40}

                marginTop: '8px',                       showName={true}

                padding: '8px',                     />

                background: '#f8f9fa',                     <Stack>

                borderRadius: '4px',                      <Text styles={{ root: { fontSize: 12, color: '#666' } }}>

                fontSize: '12px',                        📅 Solicitado em: {formatDateTime(pedido.DataSolicitacao)}

                fontStyle: 'italic'                      </Text>

              }}>                    </Stack>

                <strong>Comentário do Gestor:</strong> {pedido.comentarioGestor}                  </Stack>

              </div>                  <Stack horizontalAlign="end">

            )}                    <div

          </div>                      style={{

        ))}                        backgroundColor: getEstadoColor(pedido.Estado),

      </div>                        color: 'white',

    </div>                        padding: '4px 12px',

  );                        borderRadius: '4px',

                        fontSize: '12px',

  // Renderizar Notificações                        fontWeight: 600

  const renderNotificacoes = () => (                      }}

    <div className={styles.notificationsPanel}>                    >

      <h3 style={{ marginBottom: '20px', color: '#323130' }}>📢 Central de Notificações</h3>                      {pedido.Estado.toUpperCase()}

                          </div>

      <div className={styles.notificationItem}>                  </Stack>

        <div className={styles.notificationIcon}>🔔</div>                </Stack>

        <div className={styles.notificationContent}>

          <h4>Novos pedidos pendentes</h4>                {/* Período e Motivo */}

          <p>Você tem {stats.pendentes} pedidos aguardando aprovação</p>                <Stack tokens={{ childrenGap: 8 }}>

          <div className={styles.notificationTime}>Atualizado agora</div>                  <Text styles={{ root: { fontSize: 16, fontWeight: 600 } }}>

        </div>                    📅 {formatDate(pedido.DataInicio)} → {formatDate(pedido.DataFim)} ({pedido.DiasTotal} {pedido.DiasTotal === 1 ? 'dia' : 'dias'})

      </div>                  </Text>

                  {pedido.Motivo && (

      <div className={styles.notificationItem}>                    <Text styles={{ root: { fontSize: 14, color: '#666', fontStyle: 'italic' } }}>

        <div className={styles.notificationIcon}>✅</div>                      💬 &ldquo;{pedido.Motivo}&rdquo;

        <div className={styles.notificationContent}>                    </Text>

          <h4>Pedidos aprovados hoje</h4>                  )}

          <p>2 pedidos foram aprovados e os funcionários foram notificados</p>                </Stack>

          <div className={styles.notificationTime}>Há 2 horas</div>

        </div>                {/* Aprovação/Rejeição */}

      </div>                {(pedido.Estado === EstadoPedido.Aprovado || pedido.Estado === EstadoPedido.Rejeitado) && pedido.AprovadoPor && (

                  <Stack tokens={{ childrenGap: 8 }}>

      <div className={styles.notificationItem}>                    <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">

        <div className={styles.notificationIcon}>📅</div>                      <Text styles={{ root: { fontSize: 12, color: '#666' } }}>

        <div className={styles.notificationContent}>                        {pedido.Estado === EstadoPedido.Aprovado ? '✅ Aprovado' : '❌ Rejeitado'} por:

          <h4>Férias próximas</h4>                      </Text>

          <p>3 funcionários iniciarão férias na próxima semana</p>                      <UserPhoto

          <div className={styles.notificationTime}>Há 4 horas</div>                        email={pedido.AprovadoPor.Title + '@hnlcompany.onmicrosoft.com'}

        </div>                        displayName={pedido.AprovadoPor.Title}

      </div>                        context={props.context}

                        size={PersonaSize.size24}

      <div className={styles.notificationItem}>                        showName={true}

        <div className={styles.notificationIcon}>⚠️</div>                      />

        <div className={styles.notificationContent}>                      <Text styles={{ root: { fontSize: 12, color: '#666' } }}>

          <h4>Conflito de datas</h4>                        em {formatDateTime(pedido.DataAprovacao || '')}

          <p>Detectado possível conflito entre pedidos do mesmo departamento</p>                      </Text>

          <div className={styles.notificationTime}>Ontem</div>                    </Stack>

        </div>                    {pedido.Observacoes && (

      </div>                      <Text styles={{ root: { fontSize: 12, color: '#666', fontStyle: 'italic' } }}>

    </div>                        💬 &ldquo;{pedido.Observacoes}&rdquo;

  );                      </Text>

                    )}

  // Renderizar Calendário                  </Stack>

  const renderCalendario = () => {                )}

    const hoje = new Date();

    const mesAtual = hoje.getMonth();                {/* Ações */}

    const anoAtual = hoje.getFullYear();                {pedido.Estado === EstadoPedido.Pendente && (

                      <Stack horizontal tokens={{ childrenGap: 10 }}>

    const primeiroDiaMes = new Date(anoAtual, mesAtual, 1);                    <PrimaryButton

    const ultimoDiaMes = new Date(anoAtual, mesAtual + 1, 0);                      text="✅ Aprovar"

    const diasNoMes = ultimoDiaMes.getDate();                      onClick={() => alert('Funcionalidade de aprovação em desenvolvimento')}

                          styles={{ root: { backgroundColor: '#10893e' } }}

    const nomesMeses = [                    />

      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',                    <DefaultButton

      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'                      text="❌ Rejeitar"

    ];                      onClick={() => alert('Funcionalidade de rejeição em desenvolvimento')}

                      styles={{ root: { color: '#d13438', borderColor: '#d13438' } }}

    // Gerar dias do calendário                    />

    const diasCalendario = [];                    <DefaultButton

    for (let dia = 1; dia <= diasNoMes; dia++) {                      text="👁️ Detalhes"

      const dataAtual = new Date(anoAtual, mesAtual, dia);                      onClick={() => alert('Detalhes do pedido em desenvolvimento')}

      const temFerias = dadosSimulados.some(pedido =>                     />

        pedido.status === 'Aprovado' &&                  </Stack>

        dataAtual >= pedido.dataInicio &&                 )}

        dataAtual <= pedido.dataFim              </Stack>

      );            </div>

                ))}

      diasCalendario.push({        </Stack>

        dia,

        temFerias,        {/* Panel para Novo Pedido */}

        ehHoje: dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear()        <Panel

      });          isOpen={showNewPedidoPanel}

    }          onDismiss={() => setShowNewPedidoPanel(false)}

          type={PanelType.medium}

    return (          headerText="➕ Novo Pedido de Férias"

      <div className={styles.calendarContainer}>        >

        <div className={styles.calendarHeader}>          <Stack tokens={{ childrenGap: 20, padding: '20px 0' }}>

          <h3>{nomesMeses[mesAtual]} {anoAtual}</h3>            <Text>Funcionalidade de criação de novos pedidos em desenvolvimento...</Text>

          <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>            <PrimaryButton

            <span>🔵 Férias aprovadas</span>              text="Fechar"

            <span>🟡 Hoje</span>              onClick={() => setShowNewPedidoPanel(false)}

          </div>            />

        </div>          </Stack>

                </Panel>

        <div className={styles.calendarGrid}>      </Stack>

          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (    </div>

            <div key={dia} style={{   );

              fontWeight: 'bold', };

              textAlign: 'center', 

              padding: '10px',export default PedidoFerias;

              background: '#f0f0f0',
              color: '#666'
            }}>
              {dia}
            </div>
          ))}
          
          {Array.from({ length: primeiroDiaMes.getDay() }, (_, i) => (
            <div key={`empty-${i}`} className={styles.calendarDay}></div>
          ))}
          
          {diasCalendario.map(({ dia, temFerias, ehHoje }) => (
            <div 
              key={dia} 
              className={`${styles.calendarDay} ${temFerias ? styles.hasVacation : ''} ${ehHoje ? styles.today : ''}`}
            >
              {dia}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pedidoFerias}>
      <div className={styles.container}>
        {/* Cabeçalho */}
        <div className={styles.headerCard}>
          <h1 className={styles.title}>🏖️ Sistema de Gestão de Férias</h1>
          <p style={{ textAlign: 'center', fontSize: '16px', margin: '10px 0 0 0', opacity: 0.9 }}>
            Plataforma moderna para gerenciamento de pedidos de férias
          </p>
        </div>

        {/* Abas de Navegação */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabButton} ${abaSelecionada === 'dashboard' ? styles.active : ''}`}
            onClick={() => setAbaSelecionada('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`${styles.tabButton} ${abaSelecionada === 'pedidos' ? styles.active : ''}`}
            onClick={() => setAbaSelecionada('pedidos')}
          >
            📋 Pedidos
          </button>
          <button 
            className={`${styles.tabButton} ${abaSelecionada === 'notificacoes' ? styles.active : ''}`}
            onClick={() => setAbaSelecionada('notificacoes')}
          >
            🔔 Notificações
          </button>
          <button 
            className={`${styles.tabButton} ${abaSelecionada === 'calendario' ? styles.active : ''}`}
            onClick={() => setAbaSelecionada('calendario')}
          >
            📅 Calendário
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className={styles.mainContent}>
          {abaSelecionada === 'dashboard' && renderDashboard()}
          
          {abaSelecionada === 'pedidos' && (
            <div>
              {/* Controles e Filtros */}
              <div className={styles.formSection}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <SearchBox 
                      placeholder="Buscar por funcionário, cargo, departamento..."
                      value={filtroTexto}
                      onChange={(_, value) => setFiltroTexto(value || '')}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Dropdown
                      placeholder="Filtrar por status"
                      options={opcoesStatus}
                      selectedKey={filtroStatus}
                      onChange={(_, option) => setFiltroStatus(option?.key as string || '')}
                    />
                  </div>
                </div>
                
                <div className={styles.buttonGroup}>
                  <button 
                    className={styles.primaryButton}
                    onClick={() => setMostrarPainel(true)}
                  >
                    ➕ Novo Pedido
                  </button>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => alert('Funcionalidade de exportação em desenvolvimento')}
                  >
                    📤 Exportar
                  </button>
                </div>
              </div>

              {/* Lista de Pedidos */}
              {loading ? (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner}></div>
                </div>
              ) : pedidosFiltrados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <h3>Nenhum pedido encontrado</h3>
                  <p>Tente ajustar os filtros ou criar um novo pedido.</p>
                </div>
              ) : (
                <div className={styles.employeeGrid}>
                  {pedidosFiltrados.map((pedido) => (
                    <div key={pedido.id} className={styles.employeeCard}>
                      <div className={styles.employeeHeader}>
                        <div className={styles.employeePhoto}>
                          {obterIniciais(pedido.funcionario)}
                        </div>
                        <div className={styles.employeeInfo}>
                          <h3>{pedido.funcionario}</h3>
                          <p>{pedido.cargo}</p>
                          <p style={{ fontSize: '12px', color: '#8a8886' }}>{pedido.departamento}</p>
                        </div>
                      </div>
                      
                      <div style={{ marginTop: '12px', fontSize: '14px' }}>
                        <div><strong>Período:</strong> {formatarData(pedido.dataInicio)} - {formatarData(pedido.dataFim)}</div>
                        <div><strong>Dias:</strong> {pedido.diasSolicitados}</div>
                        <div><strong>Motivo:</strong> {pedido.motivo}</div>
                        <div><strong>Solicitado em:</strong> {formatarData(pedido.dataSubmissao)}</div>
                      </div>
                      
                      <div className={`${styles.vacationStatus} ${styles[pedido.status.toLowerCase()]}`}>
                        {pedido.status}
                      </div>

                      {pedido.aprovadoPor && (
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                          <strong>Por:</strong> {pedido.aprovadoPor}
                          {pedido.comentarios && <div><em>"{pedido.comentarios}"</em></div>}
                        </div>
                      )}

                      {pedido.status === 'Pendente' && (
                        <div style={{ marginTop: '12px' }}>
                          <TextField
                            label="Comentário do Gestor"
                            placeholder="Adicionar comentário..."
                            value={pedido.comentarioGestor || ''}
                            onChange={(_, value) => adicionarComentarioGestor(pedido.id, value || '')}
                            multiline
                            rows={2}
                            style={{ fontSize: '12px' }}
                          />
                        </div>
                      )}

                      {pedido.comentarioGestor && (
                        <div style={{ 
                          marginTop: '8px', 
                          padding: '8px', 
                          background: '#f8f9fa', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontStyle: 'italic'
                        }}>
                          <strong>Comentário do Gestor:</strong> {pedido.comentarioGestor}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {abaSelecionada === 'notificacoes' && renderNotificacoes()}
          {abaSelecionada === 'calendario' && renderCalendario()}
        </div>

        {/* Painel para Novo Pedido */}
        <Panel
          isOpen={mostrarPainel}
          onDismiss={() => setMostrarPainel(false)}
          type={PanelType.medium}
          headerText="➕ Novo Pedido de Férias"
        >
          <div style={{ padding: '20px 0' }}>
            <div className={styles.formField} style={{ marginBottom: '16px' }}>
              <ComboBox
                label="Funcionário *"
                placeholder="Selecionar funcionário"
                options={opcoesFuncionarios}
                selectedKey={novoFuncionario}
                onChange={(_, option) => setNovoFuncionario(option?.key as string || '')}
                allowFreeform
              />
            </div>

            <div className={styles.formField} style={{ marginBottom: '16px' }}>
              <TextField
                label="Cargo"
                placeholder="Digite o cargo"
                value={novoCargo}
                onChange={(_, value) => setNovoCargo(value || '')}
              />
            </div>

            <div className={styles.formField} style={{ marginBottom: '16px' }}>
              <TextField
                label="Departamento"
                placeholder="Digite o departamento"
                value={novoDepartamento}
                onChange={(_, value) => setNovoDepartamento(value || '')}
              />
            </div>

            <div className={styles.formField} style={{ marginBottom: '16px' }}>
              <DatePicker
                label="Data de Início *"
                placeholder="Selecionar data"
                value={novaDataInicio}
                onSelectDate={setNovaDataInicio}
                formatDate={(date) => date ? formatarData(date) : ''}
              />
            </div>

            <div className={styles.formField} style={{ marginBottom: '16px' }}>
              <DatePicker
                label="Data de Fim *"
                placeholder="Selecionar data"
                value={novaDataFim}
                onSelectDate={setNovaDataFim}
                formatDate={(date) => date ? formatarData(date) : ''}
              />
            </div>

            <div className={styles.formField} style={{ marginBottom: '24px' }}>
              <TextField
                label="Motivo *"
                placeholder="Descreva o motivo da solicitação"
                value={novoMotivo}
                onChange={(_, value) => setNovoMotivo(value || '')}
                multiline
                rows={3}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.primaryButton} onClick={criarNovoPedido}>
                ✅ Criar Pedido
              </button>
              <button 
                className={styles.secondaryButton} 
                onClick={() => setMostrarPainel(false)}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default PedidoFerias;