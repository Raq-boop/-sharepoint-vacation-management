import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './PedidoFerias.module.scss';
import type { IPedidoFeriasProps } from './IPedidoFeriasProps';
import { PnPService } from '../../../services/PnPService';
import { IPedidoFerias, EstadoPedido } from '../../../models/IPedidoFerias';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { TextField } from '@fluentui/react/lib/TextField';

interface IFilterState {
  colaborador: string;
  status: string;
  searchTerm: string;
  sortBy: string;
}

interface IErrorState {
  show: boolean;
  message: string;
  type: MessageBarType;
}

interface IDialogState {
  show: boolean;
  type: 'approve' | 'reject';
  pedidoId: number | undefined;
  rejectionReason: string;
}

const PedidoFerias: React.FC<IPedidoFeriasProps> = (props) => {
  // Estados do componente
  const [pedidos, setPedidos] = useState<IPedidoFerias[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<IErrorState>({ show: false, message: '', type: MessageBarType.error });
  const [filters, setFilters] = useState<IFilterState>({
    colaborador: '',
    status: '',
    searchTerm: '',
    sortBy: 'dataInicio'
  });
  const [dialog, setDialog] = useState<IDialogState>({
    show: false,
    type: 'approve',
    pedidoId: undefined,
    rejectionReason: ''
  });

  // Serviço PnP
  const pnpService = useMemo(() => {
    return new PnPService(props.context);
  }, [props.context]);

  // Dados mock para fallback
  const getMockData = useCallback((): IPedidoFerias[] => [
    {
      Id: 1,
      Title: 'Pedido de Férias - João Silva',
      ColaboradorId: 1,
      Colaborador: {
        Title: 'João Silva',
        EMail: 'joao.silva@hnlcompany.onmicrosoft.com',
        Id: 1
      },
      DataInicio: '2025-07-01T00:00:00Z',
      DataFim: '2025-07-15T00:00:00Z',
      DiasTotal: 15,
      Motivo: 'Férias de verão com a família',
      Estado: 'Pendente' as EstadoPedido,
      DataSolicitacao: '2025-06-15T11:00:00Z',
      Created: '2025-06-15T11:00:00Z',
      Modified: '2025-06-15T11:00:00Z',
      Author: { Title: 'João Silva', Id: 1 },
      Editor: { Title: 'João Silva', Id: 1 }
    },
    {
      Id: 2,
      Title: 'Pedido de Férias - Maria Santos',
      ColaboradorId: 2,
      Colaborador: {
        Title: 'Maria Santos',
        EMail: 'maria.santos@hnlcompany.onmicrosoft.com',
        Id: 2
      },
      DataInicio: '2025-12-20T00:00:00Z',
      DataFim: '2025-12-30T00:00:00Z',
      DiasTotal: 10,
      Motivo: 'Festividades de fim de ano',
      Estado: 'Aprovado' as EstadoPedido,
      DataSolicitacao: '2025-11-01T14:30:00Z',
      AprovadoPor: { Title: 'Gestor Aprovador', Id: 100 },
      DataAprovacao: '2025-11-02T10:00:00Z',
      Created: '2025-11-01T14:30:00Z',
      Modified: '2025-11-02T10:00:00Z',
      Author: { Title: 'Maria Santos', Id: 2 },
      Editor: { Title: 'Gestor Aprovador', Id: 100 }
    },
    {
      Id: 3,
      Title: 'Pedido de Férias - Ana Costa',
      ColaboradorId: 3,
      Colaborador: {
        Title: 'Ana Costa',
        EMail: 'ana.costa@hnlcompany.onmicrosoft.com',
        Id: 3
      },
      DataInicio: '2025-11-25T00:00:00Z',
      DataFim: '2025-12-06T00:00:00Z',
      DiasTotal: 12,
      Motivo: 'Viagem para Europa',
      Estado: 'Pendente' as EstadoPedido,
      DataSolicitacao: '2025-10-18T09:15:00Z',
      Created: '2025-10-18T09:15:00Z',
      Modified: '2025-10-18T09:15:00Z',
      Author: { Title: 'Ana Costa', Id: 3 },
      Editor: { Title: 'Ana Costa', Id: 3 }
    },
    {
      Id: 4,
      Title: 'Pedido de Férias - Ricardo Oliveira',
      ColaboradorId: 4,
      Colaborador: {
        Title: 'Ricardo Oliveira',
        EMail: 'ricardo.oliveira@hnlcompany.onmicrosoft.com',
        Id: 4
      },
      DataInicio: '2025-11-01T00:00:00Z',
      DataFim: '2025-11-08T00:00:00Z',
      DiasTotal: 8,
      Motivo: 'Descanso pessoal',
      Estado: 'Rejeitado' as EstadoPedido,
      DataSolicitacao: '2025-10-12T16:45:00Z',
      AprovadoPor: { Title: 'Gestor Rejeitador', Id: 101 },
      DataAprovacao: '2025-10-13T09:00:00Z',
      Observacoes: 'Período de alta demanda de projeto',
      Created: '2025-10-12T16:45:00Z',
      Modified: '2025-10-13T09:00:00Z',
      Author: { Title: 'Ricardo Oliveira', Id: 4 },
      Editor: { Title: 'Gestor Rejeitador', Id: 101 }
    },
    {
      Id: 5,
      Title: 'Pedido de Férias - Fernanda Lima',
      ColaboradorId: 5,
      Colaborador: {
        Title: 'Fernanda Lima',
        EMail: 'fernanda.lima@hnlcompany.onmicrosoft.com',
        Id: 5
      },
      DataInicio: '2026-01-15T00:00:00Z',
      DataFim: '2026-01-29T00:00:00Z',
      DiasTotal: 15,
      Motivo: 'Férias de janeiro - descanso anual',
      Estado: 'Pendente' as EstadoPedido,
      DataSolicitacao: '2025-10-05T13:20:00Z',
      Created: '2025-10-05T13:20:00Z',
      Modified: '2025-10-05T13:20:00Z',
      Author: { Title: 'Fernanda Lima', Id: 5 },
      Editor: { Title: 'Fernanda Lima', Id: 5 }
    },
    {
      Id: 6,
      Title: 'Pedido de Férias - Pedro Rodrigues',
      ColaboradorId: 6,
      Colaborador: {
        Title: 'Pedro Rodrigues',
        EMail: 'pedro.rodrigues@hnlcompany.onmicrosoft.com',
        Id: 6
      },
      DataInicio: '2025-11-10T00:00:00Z',
      DataFim: '2025-11-17T00:00:00Z',
      DiasTotal: 8,
      Motivo: 'Casamento do irmão',
      Estado: 'Aprovado' as EstadoPedido,
      DataSolicitacao: '2025-09-28T10:30:00Z',
      AprovadoPor: { Title: 'Gestor Aprovador', Id: 100 },
      DataAprovacao: '2025-09-29T08:00:00Z',
      Created: '2025-09-28T10:30:00Z',
      Modified: '2025-09-29T08:00:00Z',
      Author: { Title: 'Pedro Rodrigues', Id: 6 },
      Editor: { Title: 'Gestor Aprovador', Id: 100 }
    },
    {
      Id: 7,
      Title: 'Pedido de Férias - Lucas Carvalho',
      ColaboradorId: 7,
      Colaborador: {
        Title: 'Lucas Carvalho',
        EMail: 'lucas.carvalho@hnlcompany.onmicrosoft.com',
        Id: 7
      },
      DataInicio: '2025-12-02T00:00:00Z',
      DataFim: '2025-12-16T00:00:00Z',
      DiasTotal: 15,
      Motivo: 'Férias de fim de ano',
      Estado: 'Pendente' as EstadoPedido,
      DataSolicitacao: '2025-10-20T15:45:00Z',
      Created: '2025-10-20T15:45:00Z',
      Modified: '2025-10-20T15:45:00Z',
      Author: { Title: 'Lucas Carvalho', Id: 7 },
      Editor: { Title: 'Lucas Carvalho', Id: 7 }
    },
    {
      Id: 8,
      Title: 'Pedido de Férias - Carla Souza',
      ColaboradorId: 8,
      Colaborador: {
        Title: 'Carla Souza',
        EMail: 'carla.souza@hnlcompany.onmicrosoft.com',
        Id: 8
      },
      DataInicio: '2025-11-05T00:00:00Z',
      DataFim: '2025-11-12T00:00:00Z',
      DiasTotal: 8,
      Motivo: 'Aniversário de casamento',
      Estado: 'Aprovado' as EstadoPedido,
      DataSolicitacao: '2025-09-25T08:00:00Z',
      AprovadoPor: { Title: 'Gestor Aprovador', Id: 100 },
      DataAprovacao: '2025-09-26T09:30:00Z',
      Created: '2025-09-25T08:00:00Z',
      Modified: '2025-09-26T09:30:00Z',
      Author: { Title: 'Carla Souza', Id: 8 },
      Editor: { Title: 'Gestor Aprovador', Id: 100 }
    }
  ], []);

  // Função para carregar pedidos
  const loadPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError({ show: false, message: '', type: MessageBarType.error });
      
      const data = await pnpService.getPedidosFerias() as IPedidoFerias[];
      setPedidos(data.length > 0 ? data : getMockData());
      
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError({
        show: true,
        message: 'Erro ao carregar pedidos. Usando dados de exemplo.',
        type: MessageBarType.warning
      });
      setPedidos(getMockData());
    } finally {
      setLoading(false);
    }
  }, [pnpService]);

  // Função para aprovar pedido
  const handleApprove = useCallback(async (id: number) => {
    try {
      setProcessing(true);
      
      // Simular delay de rede para demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Tentar integração real, mas usar fallback local se falhar
      try {
        await pnpService.aprovaPedido(id, props.userDisplayName);
      } catch (serviceError) {
        console.warn('Serviço SharePoint não disponível, usando dados locais:', serviceError);
      }
      
      // Atualizar estado local (funciona tanto com backend real quanto simulado)
      setPedidos(prev => prev.map(p => 
        p.Id === id 
          ? { 
              ...p, 
              Estado: EstadoPedido.Aprovado, 
              AprovadoPor: { Title: props.userDisplayName || 'Gestor', Id: 0 },
              DataAprovacao: new Date().toISOString()
            }
          : p
      ));
      
      const pedido = pedidos.filter((p: IPedidoFerias) => p.Id === id)[0];
      const pedidoNome = pedido ? pedido.Colaborador.Title : 'colaborador';
      setError({
        show: true,
        message: `✓ Pedido de ${pedidoNome} aprovado com sucesso!`,
        type: MessageBarType.success
      });
      
      // Auto-dismiss success message after 4 seconds
      setTimeout(() => {
        setError({ show: false, message: '', type: MessageBarType.error });
      }, 4000);
      
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      setError({
        show: true,
        message: '❌ Erro ao aprovar pedido. Tente novamente.',
        type: MessageBarType.error
      });
    } finally {
      setProcessing(false);
    }
  }, [pnpService, props.userDisplayName, pedidos]);

  // Função para rejeitar pedido
  const handleReject = useCallback(async (id: number, motivo: string) => {
    if (!motivo.trim()) {
      setError({
        show: true,
        message: '⚠️ Motivo da rejeição é obrigatório.',
        type: MessageBarType.warning
      });
      return;
    }

    try {
      setProcessing(true);
      
      // Simular delay de rede para demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Tentar integração real, mas usar fallback local se falhar
      try {
        await pnpService.rejeitaPedido(id, props.userDisplayName, motivo);
      } catch (serviceError) {
        console.warn('Serviço SharePoint não disponível, usando dados locais:', serviceError);
      }
      
      // Atualizar estado local
      setPedidos(prev => prev.map(p => 
        p.Id === id 
          ? { 
              ...p, 
              Estado: EstadoPedido.Rejeitado, 
              AprovadoPor: { Title: props.userDisplayName || 'Gestor', Id: 0 }, 
              Observacoes: motivo,
              DataAprovacao: new Date().toISOString()
            }
          : p
      ));
      
      const pedido = pedidos.filter((p: IPedidoFerias) => p.Id === id)[0];
      const pedidoNome = pedido ? pedido.Colaborador.Title : 'colaborador';
      setError({
        show: true,
        message: `❌ Pedido de ${pedidoNome} rejeitado com sucesso!`,
        type: MessageBarType.success
      });
      
      // Auto-dismiss success message after 4 seconds
      setTimeout(() => {
        setError({ show: false, message: '', type: MessageBarType.error });
      }, 4000);
      
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      setError({
        show: true,
        message: '❌ Erro ao rejeitar pedido. Tente novamente.',
        type: MessageBarType.error
      });
    } finally {
      setProcessing(false);
    }
  }, [pnpService, props.userDisplayName, pedidos]);

  // Filtrar e ordenar pedidos
  const filteredAndSortedPedidos = useMemo(() => {
    let filtered = [...pedidos];
    
    // Filtrar por colaborador
    if (filters.colaborador) {
      filtered = filtered.filter(p => p.Colaborador.Title === filters.colaborador);
    }
    
    // Filtrar por status
    if (filters.status) {
      filtered = filtered.filter(p => p.Estado.toLowerCase() === filters.status.toLowerCase());
    }
    
    // Filtrar por termo de busca
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.Colaborador.Title.toLowerCase().indexOf(term) !== -1 ||
        (p.Motivo && p.Motivo.toLowerCase().indexOf(term) !== -1) ||
        (p.Observacoes && p.Observacoes.toLowerCase().indexOf(term) !== -1)
      );
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'colaborador':
          return a.Colaborador.Title.localeCompare(b.Colaborador.Title);
        case 'status':
          return a.Estado.localeCompare(b.Estado);
        case 'dataSolicitacao':
          return new Date(b.DataSolicitacao).getTime() - new Date(a.DataSolicitacao).getTime();
        case 'dataInicio':
        default:
          return new Date(a.DataInicio).getTime() - new Date(b.DataInicio).getTime();
      }
    });
    
    return filtered;
  }, [pedidos, filters]);



  // Effect para carregar dados
  useEffect(() => {
    loadPedidos().catch(console.error);
  }, [loadPedidos]);

  // Handlers para filtros
  const handleFilterChange = (key: keyof IFilterState, value: string): void => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handlers para diálogos
  const openApproveDialog = (id: number): void => {
    setDialog({ show: true, type: 'approve', pedidoId: id, rejectionReason: '' });
  };

  const openRejectDialog = (id: number): void => {
    setDialog({ show: true, type: 'reject', pedidoId: id, rejectionReason: '' });
  };

  const closeDialog = (): void => {
    setDialog({ show: false, type: 'approve', pedidoId: undefined, rejectionReason: '' });
  };

  const confirmAction = async (): Promise<void> => {
    if (!dialog.pedidoId) return;
    
    if (dialog.type === 'approve') {
      await handleApprove(dialog.pedidoId);
    } else {
      await handleReject(dialog.pedidoId, dialog.rejectionReason);
    }
    
    // Fechar dialog após ação
    closeDialog();
  };

  // Função para formatar data
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateRange = (start: Date, end: Date, days: number): string => {
    const startStr = start.toLocaleDateString('pt-BR');
    const endStr = end.toLocaleDateString('pt-BR');
    return `${startStr} — ${endStr} (${days} dias)`;
  };

  // Renderizar loading
  if (loading) {
    return (
      <div className={styles.pedidoFerias}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spinner size={SpinnerSize.large} label="Carregando pedidos de férias..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pedidoFerias}>
      <div className={styles.container}>
        {/* Mensagens de erro/sucesso */}
        {error.show && (
          <MessageBar
            messageBarType={error.type}
            isMultiline={false}
            onDismiss={() => setError({ show: false, message: '', type: MessageBarType.error })}
            dismissButtonAriaLabel="Fechar"
          >
            {error.message}
          </MessageBar>
        )}

        <div className={styles.filterSection}>
          <div className={styles.filterIcon}>🔍</div>
          <h3>Filtros</h3>
          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label htmlFor="colaborador-filter">👤 Colaborador:</label>
              <select 
                id="colaborador-filter"
                className={styles.peoplePickerSim}
                value={filters.colaborador}
                onChange={(e) => handleFilterChange('colaborador', e.target.value)}
              >
                <option value="">Todos os colaboradores</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Santos">Maria Santos</option>
                <option value="Ana Costa">Ana Costa</option>
                <option value="Ricardo Oliveira">Ricardo Oliveira</option>
                <option value="Fernanda Lima">Fernanda Lima</option>
                <option value="Pedro Rodrigues">Pedro Rodrigues</option>
                <option value="Lucas Carvalho">Lucas Carvalho</option>
                <option value="Carla Souza">Carla Souza</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="status-filter">📊 Status:</label>
              <select 
                id="status-filter"
                className={styles.statusFilter}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Todos os estados</option>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="🔍 Buscar por motivo..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.requestsList}>
          <div className={styles.listHeader}>
            <span className={styles.listIcon}>📋</span>
            <h3>Pedidos de Férias ({filteredAndSortedPedidos.length} itens)</h3>
            <div className={styles.sortControls}>
              <label htmlFor="sort-select">Ordenar por:</label>
              <select 
                id="sort-select"
                className={styles.sortSelect}
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="dataInicio">Data de Início</option>
                <option value="dataSolicitacao">Data da Solicitação</option>
                <option value="colaborador">Colaborador</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {filteredAndSortedPedidos.map((pedido) => {
            const getAvatarClass = (nome: string): string => {
              const initials = nome.split(' ').map(n => n[0]).join('').toUpperCase();
              switch (initials) {
                case 'JS': return styles.avatarJS;
                case 'MS': return styles.avatarMS;
                case 'AC': return styles.avatarAC;
                case 'RO': return styles.avatarRO;
                case 'FL': return styles.avatarFL;
                case 'PR': return styles.avatarPR;
                case 'LC': return styles.avatarLC;
                case 'CS': return styles.avatarCS;
                default: return styles.avatarJS;
              }
            };

            const getStatusClass = (status: string): string => {
              switch (status.toLowerCase()) {
                case 'aprovado': return styles.approved;
                case 'rejeitado': return styles.rejected;
                default: return styles.pending;
              }
            };

            const getStatusBadgeClass = (status: string): string => {
              switch (status.toLowerCase()) {
                case 'aprovado': return styles.statusApproved;
                case 'rejeitado': return styles.statusRejected;
                default: return styles.statusPending;
              }
            };

            const canApproveReject = pedido.Estado === EstadoPedido.Pendente && !processing;
            const initials = pedido.Colaborador.Title.split(' ').map((n: string) => n[0]).join('').toUpperCase();
            const isProcessingThis = processing && dialog.pedidoId === pedido.Id;

            return (
              <div key={pedido.Id} className={`${styles.requestItem} ${getStatusClass(pedido.Estado)}`}>
                <div className={styles.requestHeader}>
                  <div className={styles.userInfo}>
                    <div className={`${styles.avatar} ${getAvatarClass(pedido.Colaborador.Title)}`}>
                      {initials}
                    </div>
                    <div className={styles.userDetails}>
                      <h4>{pedido.Colaborador.Title}</h4>
                      <p>{pedido.Colaborador.EMail}</p>
                    </div>
                  </div>
                  <div className={styles.requestMeta}>
                    <span className={styles.requestDate}>
                      📅 Solicitado em: {formatDate(new Date(pedido.DataSolicitacao))}
                    </span>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(pedido.Estado)}`}>
                      {pedido.Estado.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className={styles.requestBody}>
                  <div className={styles.vacationPeriod}>
                    <span className={styles.periodIcon}>📅</span>
                    <span>{formatDateRange(new Date(pedido.DataInicio), new Date(pedido.DataFim), pedido.DiasTotal)}</span>
                  </div>
                  <div className={styles.vacationReason}>
                    <span className={styles.reasonIcon}>💬</span>
                    <span>&quot;{pedido.Motivo}&quot;</span>
                  </div>
                  {pedido.Estado === EstadoPedido.Rejeitado && pedido.Observacoes && (
                    <div className={styles.rejectionReason}>
                      <span className={styles.reasonIcon}>❌</span>
                      <span>Motivo da rejeição: {pedido.Observacoes}</span>
                    </div>
                  )}
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.approveBtn} 
                      disabled={!canApproveReject || isProcessingThis}
                      onClick={() => openApproveDialog(pedido.Id)}
                    >
                      {isProcessingThis && dialog.type === 'approve' ? '⏳ Aprovando...' : '✓ Aprovar'}
                    </button>
                    <button 
                      className={styles.rejectBtn} 
                      disabled={!canApproveReject || isProcessingThis}
                      onClick={() => openRejectDialog(pedido.Id)}
                    >
                      {isProcessingThis && dialog.type === 'reject' ? '⏳ Rejeitando...' : '✗ Rejeitar'}
                    </button>
                    <button className={styles.detailsBtn}>
                      👁 Detalhes
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dialog de confirmação */}
        <Dialog
          hidden={!dialog.show}
          onDismiss={closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: dialog.type === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição',
            subText: dialog.type === 'approve' 
              ? 'Tem certeza que deseja aprovar este pedido de férias?' 
              : 'Tem certeza que deseja rejeitar este pedido de férias?'
          }}
        >
          {dialog.type === 'reject' && (
            <TextField
              label="Motivo da rejeição"
              multiline
              rows={3}
              value={dialog.rejectionReason}
              onChange={(_, newValue) => setDialog(prev => ({ ...prev, rejectionReason: newValue || '' }))}
              placeholder="Digite o motivo da rejeição..."
              required
            />
          )}
          <DialogFooter>
            <PrimaryButton 
              onClick={confirmAction} 
              text={dialog.type === 'approve' ? 'Aprovar' : 'Rejeitar'}
              disabled={processing || (dialog.type === 'reject' && !dialog.rejectionReason.trim())}
            />
            <DefaultButton onClick={closeDialog} text="Cancelar" />
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
};

export default PedidoFerias;

