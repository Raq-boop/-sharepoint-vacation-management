// Interfaces para o sistema de Pedidos de Férias

export interface IPedidoFerias {
  Id: number;
  Title: string;
  ColaboradorId: number;
  Colaborador: {
    Title: string;
    EMail: string;
    Id: number;
  };
  DataInicio: string;
  DataFim: string;
  DiasTotal: number;
  Motivo?: string;
  Estado: EstadoPedido;
  DataSolicitacao: string;
  AprovadoPor?: {
    Title: string;
    Id: number;
  };
  DataAprovacao?: string;
  Observacoes?: string;
  Created: string;
  Modified: string;
  Author: {
    Title: string;
    Id: number;
  };
  Editor: {
    Title: string;
    Id: number;
  };
}

export enum EstadoPedido {
  Pendente = "Pendente",
  Aprovado = "Aprovado", 
  Rejeitado = "Rejeitado",
  Cancelado = "Cancelado"
}

export interface IColaborador {
  Id: number;
  Title: string;
  EMail: string;
  JobTitle?: string;
  Department?: string;
  WorkPhone?: string;
  PictureUrl?: string;
}

export interface IPedidoFeriasFilters {
  colaborador?: IColaborador;
  estado?: EstadoPedido;
  dataInicioFrom?: Date;
  dataInicioTo?: Date;
  searchText?: string;
}

export interface ISortConfig {
  field: keyof IPedidoFerias | 'Colaborador/Title' | 'AprovadoPor/Title';
  direction: 'asc' | 'desc';
}

export interface IPedidoFeriasListProps {
  listTitle: string;
  pageSize: number;
  showFilters: boolean;
  allowApproval: boolean;
  context: any; // WebPartContext
}

// Interface para operações de atualização
export interface IPedidoUpdate {
  Estado: EstadoPedido;
  AprovadoPorId?: number;
  DataAprovacao?: string;
  Observacoes?: string;
}

// Interface para criação de novo pedido
export interface INewPedidoFerias {
  Title: string;
  ColaboradorId: number;
  DataInicio: string;
  DataFim: string;
  DiasTotal: number;
  Motivo?: string;
  Estado: EstadoPedido;
  DataSolicitacao: string;
}

// Interface para resultados de busca
export interface IPedidoFeriasSearchResult {
  items: IPedidoFerias[];
  totalCount: number;
  hasNext: boolean;
}

// Interface para permissões do usuário
export interface IUserPermissions {
  canApprove: boolean;
  canReject: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isAdmin: boolean;
}

// Interface para estatísticas
export interface IPedidoFeriasStats {
  totalPendentes: number;
  totalAprovados: number;
  totalRejeitados: number;
  diasTotalSolicitados: number;
  colaboradorComMaisPedidos: string;
}

export default IPedidoFerias;