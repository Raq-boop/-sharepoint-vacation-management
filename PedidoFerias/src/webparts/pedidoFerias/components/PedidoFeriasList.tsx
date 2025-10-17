import * as React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  Stack,
  Text,
  DefaultButton,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  CommandBar,
  ICommandBarItemProps,
  Separator,
  Panel,
  PanelType,
  TextField,
  DatePicker,
  Dropdown,
  IDropdownOption,
  Label,
  Dialog,
  DialogFooter,
  DialogType
} from '@fluentui/react';
import { IPedidoFerias, EstadoPedido, ISortConfig, IPedidoFeriasFilters, IPedidoUpdate } from '../../../models/IPedidoFerias';
import { usePedidoFerias } from '../../../hooks/usePedidoFerias';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IPedidoFeriasListProps {
  context: WebPartContext;
  listTitle?: string;
  showFilters?: boolean;
  pageSize?: number;
}

export interface IPedidoFeriasListState {
  isFilterPanelOpen: boolean;
  selectedPedido: IPedidoFerias | null;
  isApprovalDialogOpen: boolean;
  approvalAction: 'approve' | 'reject' | null;
  approvalObservacoes: string;
}

const PedidoFeriasList: React.FC<IPedidoFeriasListProps> = ({
  context,
  listTitle = "Pedidos de Férias",
  showFilters = true,
  pageSize = 20
}) => {
  // Hook para gerenciar pedidos
  const {
    pedidos,
    totalCount,
    hasNext,
    isLoading,
    isUpdating,
    error,
    currentFilters,
    currentSort,
    userPermissions,
    loadPedidos,
    refreshPedidos,
    loadMorePedidos,
    updatePedidoStatus,
    setFilters,
    setSortConfig,
    clearError
  } = usePedidoFerias(context, listTitle);

  // Estado local do componente
  const [state, setState] = React.useState<IPedidoFeriasListState>({
    isFilterPanelOpen: false,
    selectedPedido: null,
    isApprovalDialogOpen: false,
    approvalAction: null,
    approvalObservacoes: ''
  });

  // Estado dos filtros temporários (antes de aplicar)
  const [tempFilters, setTempFilters] = React.useState<IPedidoFeriasFilters>({});

  /**
   * Atualizar estado local
   */
  const updateState = React.useCallback((updates: Partial<IPedidoFeriasListState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  /**
   * Formatadores de dados
   */
  const formatDate = (date: Date | string | null): string => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  };

  const formatEstado = (estado: EstadoPedido): string => {
    const estadoMap = {
      [EstadoPedido.Pendente]: 'Pendente',
      [EstadoPedido.Aprovado]: 'Aprovado',
      [EstadoPedido.Rejeitado]: 'Rejeitado',
      [EstadoPedido.Cancelado]: 'Cancelado'
    };
    return estadoMap[estado] || estado;
  };

  const getEstadoColor = (estado: EstadoPedido): string => {
    switch (estado) {
      case EstadoPedido.Aprovado: return '#107C10'; // Verde
      case EstadoPedido.Rejeitado: return '#D13438'; // Vermelho
      case EstadoPedido.Cancelado: return '#8A8886'; // Cinza
      default: return '#0078D4'; // Azul (Pendente)
    }
  };

  /**
   * Configuração das colunas
   */
  const columns: IColumn[] = React.useMemo(() => [
    {
      key: 'Colaborador',
      name: 'Colaborador',
      fieldName: 'Colaborador',
      minWidth: 120,
      maxWidth: 180,
      isResizable: true,
      isSorted: currentSort?.field === 'Colaborador/Title',
      isSortedDescending: currentSort?.direction === 'desc',
      onColumnClick: () => {
        const newDirection = currentSort?.field === 'Colaborador/Title' && currentSort?.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field: 'Colaborador/Title', direction: newDirection });
      },
      onRender: (item: IPedidoFerias) => (
        <Text>{item.Colaborador?.Title || '-'}</Text>
      )
    },
    {
      key: 'DataInicio',
      name: 'Data Início',
      fieldName: 'DataInicio',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: currentSort?.field === 'DataInicio',
      isSortedDescending: currentSort?.direction === 'desc',
      onColumnClick: () => {
        const newDirection = currentSort?.field === 'DataInicio' && currentSort?.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field: 'DataInicio', direction: newDirection });
      },
      onRender: (item: IPedidoFerias) => (
        <Text>{formatDate(item.DataInicio)}</Text>
      )
    },
    {
      key: 'DataFim',
      name: 'Data Fim',
      fieldName: 'DataFim',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: currentSort?.field === 'DataFim',
      isSortedDescending: currentSort?.direction === 'desc',
      onColumnClick: () => {
        const newDirection = currentSort?.field === 'DataFim' && currentSort?.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field: 'DataFim', direction: newDirection });
      },
      onRender: (item: IPedidoFerias) => (
        <Text>{formatDate(item.DataFim)}</Text>
      )
    },
    {
      key: 'DiasTotal',
      name: 'Dias',
      fieldName: 'DiasTotal',
      minWidth: 50,
      maxWidth: 70,
      isResizable: true,
      isSorted: currentSort?.field === 'DiasTotal',
      isSortedDescending: currentSort?.direction === 'desc',
      onColumnClick: () => {
        const newDirection = currentSort?.field === 'DiasTotal' && currentSort?.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field: 'DiasTotal', direction: newDirection });
      },
      onRender: (item: IPedidoFerias) => (
        <Text>{item.DiasTotal}</Text>
      )
    },
    {
      key: 'Estado',
      name: 'Status',
      fieldName: 'Estado',
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      isSorted: currentSort?.field === 'Estado',
      isSortedDescending: currentSort?.direction === 'desc',
      onColumnClick: () => {
        const newDirection = currentSort?.field === 'Estado' && currentSort?.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field: 'Estado', direction: newDirection });
      },
      onRender: (item: IPedidoFerias) => (
        <Text style={{ color: getEstadoColor(item.Estado), fontWeight: 'bold' }}>
          {formatEstado(item.Estado)}
        </Text>
      )
    },
    {
      key: 'DataSolicitacao',
      name: 'Solicitado em',
      fieldName: 'DataSolicitacao',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: currentSort?.field === 'DataSolicitacao',
      isSortedDescending: currentSort?.direction === 'desc',
      onColumnClick: () => {
        const newDirection = currentSort?.field === 'DataSolicitacao' && currentSort?.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ field: 'DataSolicitacao', direction: newDirection });
      },
      onRender: (item: IPedidoFerias) => (
        <Text>{formatDate(item.DataSolicitacao)}</Text>
      )
    },
    {
      key: 'actions',
      name: 'Ações',
      fieldName: 'actions',
      minWidth: 150,
      maxWidth: 200,
      isResizable: false,
      onRender: (item: IPedidoFerias) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          {userPermissions?.canApprove && item.Estado === EstadoPedido.Pendente && (
            <>
              <DefaultButton
                text="Aprovar"
                iconProps={{ iconName: 'CheckMark' }}
                onClick={() => handleApprovalAction(item, 'approve')}
                disabled={isUpdating}
                styles={{
                  root: { minWidth: 70 },
                  rootHovered: { backgroundColor: '#107C10', color: 'white' }
                }}
              />
              <DefaultButton
                text="Rejeitar"
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => handleApprovalAction(item, 'reject')}
                disabled={isUpdating}
                styles={{
                  root: { minWidth: 70 },
                  rootHovered: { backgroundColor: '#D13438', color: 'white' }
                }}
              />
            </>
          )}
          {item.Estado !== EstadoPedido.Pendente && item.AprovadoPor && (
            <Text variant="small" style={{ color: '#605E5C' }}>
              {formatEstado(item.Estado)} por {item.AprovadoPor.Title}
            </Text>
          )}
        </Stack>
      )
    }
  ], [currentSort, setSortConfig, userPermissions, isUpdating]);

  /**
   * Comandos da barra superior
   */
  const commandBarItems: ICommandBarItemProps[] = React.useMemo(() => [
    {
      key: 'refresh',
      text: 'Atualizar',
      iconProps: { iconName: 'Refresh' },
      onClick: refreshPedidos,
      disabled: isLoading
    },
    ...(showFilters ? [{
      key: 'filter',
      text: 'Filtros',
      iconProps: { iconName: 'Filter' },
      onClick: () => updateState({ isFilterPanelOpen: true }),
      disabled: isLoading
    }] : []),
    {
      key: 'info',
      text: `${totalCount} pedido(s)`,
      disabled: true,
      onRender: () => (
        <Text variant="small" styles={{ root: { padding: '8px 16px', color: '#605E5C' } }}>
          {totalCount} pedido(s) encontrado(s)
        </Text>
      )
    }
  ], [showFilters, refreshPedidos, isLoading, totalCount, updateState]);

  /**
   * Manipuladores de eventos
   */
  const handleApprovalAction = React.useCallback((pedido: IPedidoFerias, action: 'approve' | 'reject') => {
    updateState({
      selectedPedido: pedido,
      approvalAction: action,
      isApprovalDialogOpen: true,
      approvalObservacoes: ''
    });
  }, [updateState]);

  const handleApprovalConfirm = React.useCallback(async () => {
    if (!state.selectedPedido || !state.approvalAction) return;

    const update: IPedidoUpdate = {
      Estado: state.approvalAction === 'approve' ? EstadoPedido.Aprovado : EstadoPedido.Rejeitado,
      Observacoes: state.approvalObservacoes.trim() || undefined
    };

    const success = await updatePedidoStatus(state.selectedPedido.Id, update);

    if (success) {
      updateState({
        isApprovalDialogOpen: false,
        selectedPedido: null,
        approvalAction: null,
        approvalObservacoes: ''
      });
    }
  }, [state, updatePedidoStatus, updateState]);

  const handleApprovalCancel = React.useCallback(() => {
    updateState({
      isApprovalDialogOpen: false,
      selectedPedido: null,
      approvalAction: null,
      approvalObservacoes: ''
    });
  }, [updateState]);

  const handleApplyFilters = React.useCallback(() => {
    setFilters(Object.keys(tempFilters).length > 0 ? tempFilters : null);
    updateState({ isFilterPanelOpen: false });
  }, [tempFilters, setFilters, updateState]);

  const handleClearFilters = React.useCallback(() => {
    setTempFilters({});
    setFilters(null);
    updateState({ isFilterPanelOpen: false });
  }, [setFilters, updateState]);

  /**
   * Opções para dropdown de estado
   */
  const estadoOptions: IDropdownOption[] = [
    { key: '', text: 'Todos os status' },
    { key: EstadoPedido.Pendente, text: 'Pendente' },
    { key: EstadoPedido.Aprovado, text: 'Aprovado' },
    { key: EstadoPedido.Rejeitado, text: 'Rejeitado' },
    { key: EstadoPedido.Cancelado, text: 'Cancelado' }
  ];

  /**
   * Renderização do componente
   */
  return (
    <Stack tokens={{ childrenGap: 16 }}>
      {/* Barra de comandos */}
      <CommandBar items={commandBarItems} />

      {/* Mensagem de erro */}
      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          onDismiss={clearError}
          dismissButtonAriaLabel="Fechar"
        >
          {error}
        </MessageBar>
      )}

      {/* Lista de pedidos */}
      <Stack>
        {isLoading && pedidos.length === 0 ? (
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16, padding: 40 }}>
            <Spinner size={SpinnerSize.large} label="Carregando pedidos..." />
          </Stack>
        ) : pedidos.length === 0 ? (
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16, padding: 40 }}>
            <Text variant="large">Nenhum pedido de férias encontrado</Text>
            <Text variant="medium" style={{ color: '#605E5C' }}>
              {currentFilters ? 'Tente ajustar os filtros' : 'Ainda não há pedidos cadastrados'}
            </Text>
          </Stack>
        ) : (
          <>
            <DetailsList
              items={pedidos}
              columns={columns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
              isHeaderVisible={true}
              compact={false}
            />
            
            {/* Botão carregar mais */}
            {hasNext && (
              <Stack horizontalAlign="center" tokens={{ padding: 16 }}>
                <DefaultButton
                  text={isLoading ? "Carregando..." : "Carregar mais"}
                  onClick={loadMorePedidos}
                  disabled={isLoading}
                  iconProps={isLoading ? { iconName: 'Sync' } : { iconName: 'ChevronDown' }}
                />
              </Stack>
            )}
          </>
        )}
      </Stack>

      {/* Panel de filtros */}
      <Panel
        headerText="Filtrar Pedidos"
        isOpen={state.isFilterPanelOpen}
        onDismiss={() => updateState({ isFilterPanelOpen: false })}
        type={PanelType.medium}
        closeButtonAriaLabel="Fechar filtros"
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <TextField
            label="Buscar por texto"
            placeholder="Nome do colaborador, motivo..."
            value={tempFilters.searchText || ''}
            onChange={(_, value) => setTempFilters({ ...tempFilters, searchText: value || undefined })}
          />

          <Dropdown
            label="Status"
            options={estadoOptions}
            selectedKey={tempFilters.estado || ''}
            onChange={(_, option) => setTempFilters({ 
              ...tempFilters, 
              estado: option?.key ? option.key as EstadoPedido : undefined 
            })}
          />

          <DatePicker
            label="Data início (de)"
            value={tempFilters.dataInicioFrom}
            onSelectDate={(date) => setTempFilters({ ...tempFilters, dataInicioFrom: date || undefined })}
            placeholder="Selecione uma data"
          />

          <DatePicker
            label="Data início (até)"
            value={tempFilters.dataInicioTo}
            onSelectDate={(date) => setTempFilters({ ...tempFilters, dataInicioTo: date || undefined })}
            placeholder="Selecione uma data"
          />

          <Separator />

          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton
              text="Aplicar Filtros"
              onClick={handleApplyFilters}
            />
            <DefaultButton
              text="Limpar"
              onClick={handleClearFilters}
            />
          </Stack>
        </Stack>
      </Panel>

      {/* Dialog de aprovação/rejeição */}
      <Dialog
        hidden={!state.isApprovalDialogOpen}
        onDismiss={handleApprovalCancel}
        dialogContentProps={{
          type: DialogType.normal,
          title: state.approvalAction === 'approve' ? 'Aprovar Pedido' : 'Rejeitar Pedido',
          subText: state.selectedPedido ? 
            `${state.selectedPedido.Colaborador?.Title} - ${formatDate(state.selectedPedido.DataInicio)} a ${formatDate(state.selectedPedido.DataFim)}` : 
            ''
        }}
        modalProps={{ isBlocking: true }}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <TextField
            label="Observações (opcional)"
            multiline
            rows={3}
            value={state.approvalObservacoes}
            onChange={(_, value) => updateState({ approvalObservacoes: value || '' })}
            placeholder="Adicione observações sobre esta decisão..."
          />
        </Stack>

        <DialogFooter>
          <PrimaryButton
            text={state.approvalAction === 'approve' ? 'Aprovar' : 'Rejeitar'}
            onClick={handleApprovalConfirm}
            disabled={isUpdating}
          />
          <DefaultButton
            text="Cancelar"
            onClick={handleApprovalCancel}
            disabled={isUpdating}
          />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default PedidoFeriasList;