/**
 * SISTEMA DE PEDIDOS DE FÉRIAS - DEFINIÇÕES DE TIPOS
 * 
 * Este arquivo contém todas as interfaces TypeScript e enums utilizados
 * no sistema de gerenciamento de pedidos de férias desenvolvido em SPFx.
 * 
 * Arquitetura:
 * - Integração com SharePoint Lists para persistência
 * - Utilização do PnP JS para operações CRUD
 * - Suporte a aprovação/rejeição hierárquica
 * - Interface responsiva com Fluent UI
 * 
 * @author Sistema SPFx Pedidos Férias
 * @version 1.0.0
 */
import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * Interface principal que representa um pedido de férias no SharePoint
 * 
 * Esta interface mapeia diretamente para os campos da lista SharePoint
 * "PedidoFerias" e inclui campos padrão do SharePoint como Created, Modified, etc.
 * 
 * Relacionamentos:
 * - Colaborador: Lookup para lista de usuários do SharePoint
 * - AprovadoPor: Lookup para usuário que aprovou/rejeitou
 * - Estado: Choice field com valores do enum EstadoPedido
 * 
 * @interface IPedidoFerias
 */
export interface IPedidoFerias {
  /** ID único do item no SharePoint (chave primária) */
  Id: number;
  
  /** Título do pedido - campo obrigatório padrão do SharePoint */
  Title: string;
  
  /** ID do colaborador na lista de usuários do SharePoint */
  ColaboradorId: number;
  
  /** Objeto expandido com dados do colaborador (via lookup) */
  Colaborador: {
    /** Nome completo do colaborador */
    Title: string;
    /** Email corporativo do colaborador */
    EMail: string;
    /** ID do usuário no SharePoint */
    Id: number;
  };
  
  /** Data de início das férias (formato ISO 8601 string) */
  DataInicio: string;
  
  /** Data de término das férias (formato ISO 8601 string) */
  DataFim: string;
  
  /** Número total de dias úteis/corridos solicitados */
  DiasTotal: number;
  
  /** Justificativa ou motivo das férias (campo opcional) */
  Motivo?: string;
  
  /** Estado atual do pedido (enum EstadoPedido) */
  Estado: EstadoPedido;
  
  /** Data/hora quando o pedido foi criado (formato ISO 8601) */
  DataSolicitacao: string;
  
  /** Dados do gestor que aprovou/rejeitou (opcional) */
  AprovadoPor?: {
    /** Nome do gestor aprovador */
    Title: string;
    /** ID do usuário gestor no SharePoint */
    Id: number;
  };
  
  /** Data/hora da aprovação ou rejeição (opcional) */
  DataAprovacao?: string;
  
  /** Comentários do gestor na aprovação/rejeição (opcional) */
  Observacoes?: string;
  
  /** Data de criação do item no SharePoint (campo padrão) */
  Created: string;
  
  /** Data da última modificação do item (campo padrão) */
  Modified: string;
  
  /** Usuário que criou o item (campo padrão SharePoint) */
  Author: {
    Title: string;
    Id: number;
  };
  
  /** Usuário que fez a última modificação (campo padrão SharePoint) */
  Editor: {
    Title: string;
    Id: number;
  };
}

/**
 * Enum que define os possíveis estados de um pedido de férias
 * 
 * Fluxo de estados:
 * 1. Pendente -> Aprovado/Rejeitado/Cancelado
 * 2. Estados finais: Aprovado, Rejeitado, Cancelado
 * 
 * Utilizado como Choice field no SharePoint com valores string
 * 
 * @enum {string}
 */
export enum EstadoPedido {
  /** Estado inicial - aguardando aprovação do gestor */
  Pendente = "Pendente",
  /** Pedido aprovado pelo gestor - férias confirmadas */
  Aprovado = "Aprovado", 
  /** Pedido rejeitado pelo gestor - não autorizado */
  Rejeitado = "Rejeitado",
  /** Pedido cancelado pelo próprio colaborador antes da aprovação */
  Cancelado = "Cancelado"
}

/**
 * Interface que representa um colaborador no sistema
 * 
 * Utilizada principalmente para o componente People Picker
 * e para exibição de dados do colaborador nas listas
 * 
 * Fonte de dados: User Information List do SharePoint
 * 
 * @interface IColaborador
 */
export interface IColaborador {
  /** ID único do usuário no SharePoint */
  Id: number;
  
  /** Nome completo do colaborador */
  Title: string;
  
  /** Email corporativo (usado para buscar foto via Graph API) */
  EMail: string;
  
  /** Cargo/função do colaborador (opcional) */
  JobTitle?: string;
  
  /** Departamento do colaborador (opcional) */
  Department?: string;
  
  /** Telefone comercial (opcional) */
  WorkPhone?: string;
  
  /** URL da foto do perfil (obtida via Microsoft Graph) */
  PictureUrl?: string;
}

/**
 * Interface para configuração de filtros na listagem de pedidos
 * 
 * Permite filtrar pedidos por múltiplos critérios simultaneamente
 * Utilizada pelos componentes de filtro na interface
 * 
 * @interface IPedidoFeriasFilters
 */
export interface IPedidoFeriasFilters {
  /** Filtro por colaborador específico (People Picker) */
  colaborador?: IColaborador;
  
  /** Filtro por estado do pedido (dropdown) */
  estado?: EstadoPedido;
  
  /** Data inicial do período de férias (filtro "a partir de") */
  dataInicioFrom?: Date;
  
  /** Data final do período de férias (filtro "até") */
  dataInicioTo?: Date;
  
  /** Busca textual em colaborador, motivo e observações */
  searchText?: string;
}

/**
 * Interface para configuração de ordenação da lista
 * 
 * Suporta ordenação por qualquer campo da interface IPedidoFerias
 * ou por campos relacionados (lookup fields)
 * 
 * @interface ISortConfig
 */
export interface ISortConfig {
  /** Campo para ordenação - aceita campos diretos ou lookups */
  field: keyof IPedidoFerias | 'Colaborador/Title' | 'AprovadoPor/Title';
  
  /** Direção da ordenação */
  direction: 'asc' | 'desc';
}

/**
 * Props do componente principal PedidoFeriasList
 * 
 * Configurações passadas pelo Web Part para personalizar
 * o comportamento do componente
 * 
 * @interface IPedidoFeriasListProps
 */
export interface IPedidoFeriasListProps {
  /** Nome da lista SharePoint (configurável) */
  listTitle: string;
  
  /** Número de itens por página na paginação */
  pageSize: number;
  
  /** Se deve exibir os filtros na interface */
  showFilters: boolean;
  
  /** Se permite aprovação/rejeição (baseado em permissões) */
  allowApproval: boolean;
  
  /** Contexto do SharePoint Framework */
  context: WebPartContext;
}

/**
 * Interface para operações de atualização de pedidos existentes
 * 
 * Utilizada principalmente para aprovação/rejeição de pedidos
 * Contém apenas os campos que podem ser modificados após criação
 * 
 * @interface IPedidoUpdate
 */
export interface IPedidoUpdate {
  /** Novo estado do pedido (Aprovado/Rejeitado) */
  Estado: EstadoPedido;
  
  /** ID do usuário que está aprovando/rejeitando */
  AprovadoPorId?: number;
  
  /** Data/hora da aprovação/rejeição (formato ISO 8601) */
  DataAprovacao?: string;
  
  /** Comentários do gestor sobre a decisão */
  Observacoes?: string;
}

/**
 * Interface para criação de novos pedidos de férias
 * 
 * Contém apenas os campos necessários para criar um novo item
 * Exclui campos automáticos como ID, Created, Modified, etc.
 * 
 * @interface INewPedidoFerias
 */
export interface INewPedidoFerias {
  /** Título descritivo do pedido */
  Title: string;
  
  /** ID do colaborador solicitante */
  ColaboradorId: number;
  
  /** Data de início das férias (formato ISO 8601) */
  DataInicio: string;
  
  /** Data de término das férias (formato ISO 8601) */
  DataFim: string;
  
  /** Número total de dias solicitados */
  DiasTotal: number;
  
  /** Justificativa das férias (opcional) */
  Motivo?: string;
  
  /** Estado inicial (sempre Pendente) */
  Estado: EstadoPedido;
  
  /** Data/hora da solicitação (formato ISO 8601) */
  DataSolicitacao: string;
}

/**
 * Interface para resultados paginados de busca
 * 
 * Utilizada pelo serviço para retornar listas paginadas
 * com informações de controle de paginação
 * 
 * @interface IPedidoFeriasSearchResult
 */
export interface IPedidoFeriasSearchResult {
  /** Array de pedidos da página atual */
  items: IPedidoFerias[];
  
  /** Total de registros que atendem aos critérios */
  totalCount: number;
  
  /** Indica se há mais páginas disponíveis */
  hasNext: boolean;
}

/**
 * Interface para controle de permissões do usuário atual
 * 
 * Baseada em grupos do SharePoint e regras de negócio
 * Controla quais ações o usuário pode executar na interface
 * 
 * Hierarquia de permissões:
 * - Admin: Pode tudo
 * - Gestor: Pode aprovar/rejeitar pedidos de sua equipe
 * - Usuário: Pode apenas criar e visualizar próprios pedidos
 * 
 * @interface IUserPermissions
 */
export interface IUserPermissions {
  /** Pode aprovar pedidos (gestores e admins) */
  canApprove: boolean;
  
  /** Pode rejeitar pedidos (gestores e admins) */
  canReject: boolean;
  
  /** Pode criar novos pedidos (todos os usuários) */
  canCreate: boolean;
  
  /** Pode editar pedidos existentes (próprios pedidos pendentes) */
  canEdit: boolean;
  
  /** Pode excluir pedidos (próprios pedidos ou admin) */
  canDelete: boolean;
  
  /** Tem privilégios de administrador total */
  isAdmin: boolean;
}

/**
 * Interface para estatísticas e métricas do sistema
 * 
 * Utilizada para exibir dashboards e relatórios gerenciais
 * Calculada dinamicamente com base nos dados atuais
 * 
 * @interface IPedidoFeriasStats
 */
export interface IPedidoFeriasStats {
  /** Número de pedidos aguardando aprovação */
  totalPendentes: number;
  
  /** Número de pedidos aprovados no período */
  totalAprovados: number;
  
  /** Número de pedidos rejeitados no período */
  totalRejeitados: number;
  
  /** Total de dias de férias solicitados */
  diasTotalSolicitados: number;
  
  /** Nome do colaborador com mais pedidos */
  colaboradorComMaisPedidos: string;
}

/**
 * Export padrão da interface principal
 * Permite import simplificado: import IPedidoFerias from './IPedidoFerias'
 */
export default IPedidoFerias;