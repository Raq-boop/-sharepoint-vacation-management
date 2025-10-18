/**
 * COMPONENTE PRINCIPAL DO SISTEMA DE PEDIDOS DE FÉRIAS
 * 
 * Este é o componente raiz do sistema que integra todas as funcionalidades:
 * - Listagem de pedidos com filtros e busca
 * - Exibição de fotos dos colaboradores via Microsoft Graph
 * - Interface responsiva com Fluent UI
 * - Estados de loading e tratamento de erros
 * - Dados simulados para demonstração
 * 
 * Arquitetura do Componente:
 * - Utiliza React Hooks para gerenciamento de estado
 * - Integração com SharePoint via PnP JS (preparado)
 * - Design responsivo com Fluent UI components
 * - Sistema de cache para fotos de usuários
 * 
 * Funcionalidades Implementadas:
 * ✅ Listagem de pedidos com dados simulados
 * ✅ Filtros por texto e estado
 * ✅ Exibição de fotos via Microsoft Graph API
 * ✅ Interface responsiva e moderna
 * ✅ Estados de loading e mensagens de erro
 * 
 * Próximas Funcionalidades:
 * 🔄 Integração real com SharePoint Lists
 * 🔄 Formulário de criação de pedidos
 * 🔄 Sistema de aprovação/rejeição
 * 🔄 Paginação e ordenação
 * 
 * @component PedidoFerias
 * @author Sistema SPFx Pedidos Férias
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './PedidoFerias.module.scss';
import type { IPedidoFeriasProps } from './IPedidoFeriasProps';

// Componentes customizados do sistema
import UserPhoto from '../../../components/UserPhoto';
import { IPedidoFerias, EstadoPedido } from '../../../models/IPedidoFerias';

// Componentes do Fluent UI para interface moderna
import {
  Stack,           // Layout flexível
  Text,            // Tipografia
  PrimaryButton,   // Botões primários
  DefaultButton,   // Botões secundários
  SearchBox,       // Campo de busca
  Dropdown,        // Seleção de opções
  IDropdownOption, // Tipo para opções do dropdown
  Spinner,         // Indicador de carregamento
  SpinnerSize,     // Tamanhos do spinner
  MessageBar,      // Mensagens de status
  MessageBarType,  // Tipos de mensagem
  Panel,           // Painel lateral
  PanelType,       // Tipos de painel
  PersonaSize      // Tamanhos para fotos de usuário
} from '@fluentui/react';

/**
 * Componente funcional principal com props tipadas
 * 
 * @param props Propriedades recebidas do WebPart pai
 * @returns JSX.Element Interface renderizada do sistema
 */
const PedidoFerias: React.FC<IPedidoFeriasProps> = (props) => {
  
  // ===== GERENCIAMENTO DE ESTADO COM REACT HOOKS =====
  
  /** Lista de pedidos de férias (carregada via API ou dados simulados) */
  const [pedidos, setPedidos] = useState<IPedidoFerias[]>([]);
  
  /** Indicador se dados estão sendo carregados */
  const [loading, setLoading] = useState<boolean>(true);
  
  /** Mensagem de erro para exibir ao usuário */
  const [error, setError] = useState<string>('');
  
  /** Texto digitado no campo de busca para filtrar pedidos */
  const [searchText, setSearchText] = useState<string>('');
  
  /** Estado selecionado no dropdown de filtros */
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  
  /** Controla se o painel de novo pedido está aberto */
  const [showNewPedidoPanel, setShowNewPedidoPanel] = useState<boolean>(false);
  
  // Serviço PnP para integração SharePoint (comentado para desenvolvimento)
  // const [pnpService] = useState<PnPService>(() => new PnPService(props.context));

  // ===== DADOS SIMULADOS PARA DEMONSTRAÇÃO =====
  // Em produção, estes dados viriam da lista SharePoint via PnP JS
  const dadosSimulados: IPedidoFerias[] = [
    {
      Id: 1,
      Title: 'Férias de Verão - João Silva',
      ColaboradorId: 1,
      Colaborador: { Title: 'João Silva', EMail: 'joao.silva@hnlcompany.onmicrosoft.com', Id: 1 },
      DataInicio: '2025-07-01',
      DataFim: '2025-07-15',
      DiasTotal: 15,
      Motivo: 'Férias de verão com a família',
      Estado: EstadoPedido.Pendente,
      DataSolicitacao: '2025-06-15T10:00:00Z',
      Created: '2025-06-15T10:00:00Z',
      Modified: '2025-06-15T10:00:00Z',
      Author: { Title: 'João Silva', Id: 1 },
      Editor: { Title: 'João Silva', Id: 1 }
    },
    {
      Id: 2,
      Title: 'Férias de Natal - Maria Santos',
      ColaboradorId: 2,
      Colaborador: { Title: 'Maria Santos', EMail: 'maria.santos@hnlcompany.onmicrosoft.com', Id: 2 },
      DataInicio: '2025-12-20',
      DataFim: '2025-12-30',
      DiasTotal: 10,
      Motivo: 'Festividades de fim de ano',
      Estado: EstadoPedido.Aprovado,
      DataSolicitacao: '2025-11-01T14:30:00Z',
      AprovadoPor: { Title: 'Gestor RH', Id: 99 },
      DataAprovacao: '2025-11-05T09:15:00Z',
      Observacoes: 'Aprovado. Boas férias!',
      Created: '2025-11-01T14:30:00Z',
      Modified: '2025-11-05T09:15:00Z',
      Author: { Title: 'Maria Santos', Id: 2 },
      Editor: { Title: 'Gestor RH', Id: 99 }
    },
    {
      Id: 3,
      Title: 'Férias Rejeitadas - Pedro Costa',
      ColaboradorId: 3,
      Colaborador: { Title: 'Pedro Costa', EMail: 'pedro.costa@hnlcompany.onmicrosoft.com', Id: 3 },
      DataInicio: '2025-05-10',
      DataFim: '2025-05-20',
      DiasTotal: 10,
      Motivo: 'Compromissos familiares urgentes',
      Estado: EstadoPedido.Rejeitado,
      DataSolicitacao: '2025-04-25T16:45:00Z',
      AprovadoPor: { Title: 'Gestor RH', Id: 99 },
      DataAprovacao: '2025-04-28T11:20:00Z',
      Observacoes: 'Rejeitado. Período muito próximo ao fechamento do projeto.',
      Created: '2025-04-25T16:45:00Z',
      Modified: '2025-04-28T11:20:00Z',
      Author: { Title: 'Pedro Costa', Id: 3 },
      Editor: { Title: 'Gestor RH', Id: 99 }
    }
  ];

  // ===== MÉTODOS DE CARREGAMENTO DE DADOS =====

  /**
   * Carrega lista de pedidos de férias
   * 
   * Fluxo de execução:
   * 1. Ativa estado loading
   * 2. Limpa mensagens de erro
   * 3. Tenta buscar dados do SharePoint via PnP JS
   * 4. Em caso de erro ou desenvolvimento, usa dados simulados
   * 5. Atualiza estado do componente
   * 
   * TODO: Implementar integração real com SharePoint List
   * - Usar PnPService.getPedidos()
   * - Aplicar filtros e paginação
   * - Tratar permissões de acesso
   * 
   * @async
   * @returns Promise<void>
   */
  const loadPedidos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      // DESENVOLVIMENTO: Simula delay de API real
      // Em produção, substituir por: const pedidos = await pnpService.getPedidos();
      setTimeout(() => {
        setPedidos(dadosSimulados);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError('Erro ao carregar pedidos. Usando dados de demonstração.');
      
      // Fallback para dados simulados em caso de erro
      setPedidos(dadosSimulados);
      setLoading(false);
    }
  };

  /**
   * Hook useEffect para carregar dados quando componente monta
   * 
   * Executa loadPedidos() uma única vez na inicialização
   * Inclui tratamento de erro adicional para capturar falhas
   * no processo de carregamento
   */
  useEffect(() => {
    loadPedidos().catch(error => {
      console.error('Erro no useEffect loadPedidos:', error);
      setLoading(false);
    });
  }, []); // Array vazio = executa apenas uma vez

  // ===== MÉTODOS UTILITÁRIOS E FORMATAÇÃO =====

  /**
   * Retorna cor hexadecimal baseada no estado do pedido
   * 
   * Utilizado para estilizar badges e bordas dos cards
   * Cores seguem padrão Microsoft Fluent UI
   * 
   * @param estado Estado do pedido (enum EstadoPedido)
   * @returns string Cor hexadecimal
   */
  const getEstadoColor = (estado: EstadoPedido): string => {
    switch (estado) {
      case EstadoPedido.Pendente: return '#ff8c00';  // Laranja - Atenção
      case EstadoPedido.Aprovado: return '#10893e';  // Verde - Sucesso
      case EstadoPedido.Rejeitado: return '#d13438'; // Vermelho - Erro
      case EstadoPedido.Cancelado: return '#666666'; // Cinza - Neutro
      default: return '#666666';                     // Fallback
    }
  };

  /**
   * Formata string ISO 8601 para data brasileira (DD/MM/AAAA)
   * 
   * @param dateString Data em formato ISO 8601
   * @returns string Data formatada pt-BR
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  /**
   * Formata string ISO 8601 para data e hora brasileira (DD/MM/AAAA HH:MM)
   * 
   * @param dateString Data/hora em formato ISO 8601
   * @returns string Data e hora formatada pt-BR
   */
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // ===== SISTEMA DE FILTROS DINÂMICOS =====

  /**
   * Filtra lista de pedidos baseado em critérios múltiplos
   * 
   * Algoritmo de filtros combinados:
   * 1. Filtro textual (busca em múltiplos campos)
   * 2. Filtro por estado específico
   * 3. Operador lógico AND entre filtros
   * 
   * Performance: Executa a cada mudança de estado (searchText, filtroEstado, pedidos)
   * 
   * @constant
   * @type {IPedidoFerias[]} Array filtrado de pedidos
   */
  const filteredPedidos = pedidos.filter(pedido => {
    // FILTRO TEXTUAL: Busca case-insensitive em múltiplos campos
    // Campos pesquisados: Nome colaborador, Motivo, Título do pedido
    const matchSearch = !searchText || 
      pedido.Colaborador.Title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
      (pedido.Motivo && pedido.Motivo.toLowerCase().indexOf(searchText.toLowerCase()) >= 0) ||
      pedido.Title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
    
    // FILTRO ESTADO: Compara estado exato ou "todos" (string vazia)
    const matchEstado = !filtroEstado || pedido.Estado === filtroEstado;
    
    // COMBINAÇÃO: Retorna true apenas se AMBOS os filtros passam
    return matchSearch && matchEstado;
  });

  /**
   * Opções para dropdown de filtro por estado
   * 
   * Utiliza enum EstadoPedido para garantir consistência
   * Inclui opção "Todos" para resetar filtro
   * 
   * @constant
   * @type {IDropdownOption[]} Array de opções Fluent UI
   */
  const estadoOptions: IDropdownOption[] = [
    { key: '', text: 'Todos os estados' },                    // Opção padrão
    { key: EstadoPedido.Pendente, text: 'Pendente' },         // Filtro específico
    { key: EstadoPedido.Aprovado, text: 'Aprovado' },         // Filtro específico
    { key: EstadoPedido.Rejeitado, text: 'Rejeitado' },       // Filtro específico
    { key: EstadoPedido.Cancelado, text: 'Cancelado' }        // Filtro específico
  ];

  // ===== RENDERIZAÇÃO CONDICIONAL BASEADA EM ESTADO =====

  /**
   * Estado LOADING: Exibe spinner centralizado
   * 
   * Renderizado quando dados estão sendo carregados
   * Utiliza Fluent UI Spinner com label descritivo
   * Layout centralizado com padding adequado
   */
  if (loading) {
    return (
      <div className={styles.pedidoFerias}>
        <Stack horizontalAlign="center" tokens={{ padding: 40 }}>
          <Spinner 
            size={SpinnerSize.large} 
            label="Carregando pedidos de férias..." 
            ariaLive="polite"
            labelPosition="bottom"
          />
        </Stack>
      </div>
    );
  }

  return (
    <div className={styles.pedidoFerias}>
      <Stack tokens={{ childrenGap: 20 }}>
        {/* Header */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#323130' } }}>
            🏢 Sistema de Pedidos de Férias
          </Text>
          <PrimaryButton
            text="+ Novo Pedido"
            onClick={() => setShowNewPedidoPanel(true)}
            styles={{ root: { minWidth: 120 } }}
          />
        </Stack>

        {/* Filtros */}
        <div
          style={{
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff',
            marginBottom: '15px'
          }}
        >
          <Stack tokens={{ childrenGap: 15 }}>
            <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
              🔍 Filtros
            </Text>
            <Stack horizontal tokens={{ childrenGap: 15 }} wrap>
              <SearchBox
                placeholder="Buscar por colaborador, motivo..."
                value={searchText}
                onChange={(_, newValue) => setSearchText(newValue || '')}
                styles={{ root: { minWidth: 250 } }}
              />
              <Dropdown
                placeholder="Estado"
                options={estadoOptions}
                selectedKey={filtroEstado}
                onChange={(_, option) => setFiltroEstado(option?.key as string || '')}
                styles={{ root: { minWidth: 150 } }}
              />
            </Stack>
          </Stack>
        </div>

        {/* Error Message */}
        {error && (
          <MessageBar messageBarType={MessageBarType.warning}>
            {error}
          </MessageBar>
        )}

        {/* Lista de Pedidos */}
        <Stack tokens={{ childrenGap: 15 }}>
          <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
            📊 Pedidos de Férias ({filteredPedidos.length} {filteredPedidos.length === 1 ? 'item' : 'itens'})
          </Text>
          
          {filteredPedidos.map(pedido => (
            <div
              key={pedido.Id}
              style={{
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: `2px solid ${getEstadoColor(pedido.Estado)}`,
                backgroundColor: '#ffffff',
                marginBottom: '8px'
              }}
            >
              <Stack tokens={{ childrenGap: 12 }}>
                {/* Header do Card */}
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                  <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
                    <UserPhoto
                      email={pedido.Colaborador.EMail}
                      displayName={pedido.Colaborador.Title}
                      context={props.context}
                      size={PersonaSize.size40}
                      showName={true}
                    />
                    <Stack>
                      <Text styles={{ root: { fontSize: 12, color: '#666' } }}>
                        📅 Solicitado em: {formatDateTime(pedido.DataSolicitacao)}
                      </Text>
                    </Stack>
                  </Stack>
                  <Stack horizontalAlign="end">
                    <div
                      style={{
                        backgroundColor: getEstadoColor(pedido.Estado),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      {pedido.Estado.toUpperCase()}
                    </div>
                  </Stack>
                </Stack>

                {/* Período e Motivo */}
                <Stack tokens={{ childrenGap: 8 }}>
                  <Text styles={{ root: { fontSize: 16, fontWeight: 600 } }}>
                    📅 {formatDate(pedido.DataInicio)} → {formatDate(pedido.DataFim)} ({pedido.DiasTotal} {pedido.DiasTotal === 1 ? 'dia' : 'dias'})
                  </Text>
                  {pedido.Motivo && (
                    <Text styles={{ root: { fontSize: 14, color: '#666', fontStyle: 'italic' } }}>
                      💬 &ldquo;{pedido.Motivo}&rdquo;
                    </Text>
                  )}
                </Stack>

                {/* Aprovação/Rejeição */}
                {(pedido.Estado === EstadoPedido.Aprovado || pedido.Estado === EstadoPedido.Rejeitado) && pedido.AprovadoPor && (
                  <Stack tokens={{ childrenGap: 8 }}>
                    <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                      <Text styles={{ root: { fontSize: 12, color: '#666' } }}>
                        {pedido.Estado === EstadoPedido.Aprovado ? '✅ Aprovado' : '❌ Rejeitado'} por:
                      </Text>
                      <UserPhoto
                        email={pedido.AprovadoPor.Title + '@hnlcompany.onmicrosoft.com'}
                        displayName={pedido.AprovadoPor.Title}
                        context={props.context}
                        size={PersonaSize.size24}
                        showName={true}
                      />
                      <Text styles={{ root: { fontSize: 12, color: '#666' } }}>
                        em {formatDateTime(pedido.DataAprovacao || '')}
                      </Text>
                    </Stack>
                    {pedido.Observacoes && (
                      <Text styles={{ root: { fontSize: 12, color: '#666', fontStyle: 'italic' } }}>
                        💬 &ldquo;{pedido.Observacoes}&rdquo;
                      </Text>
                    )}
                  </Stack>
                )}

                {/* Ações */}
                {pedido.Estado === EstadoPedido.Pendente && (
                  <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <PrimaryButton
                      text="✅ Aprovar"
                      onClick={() => alert('Funcionalidade de aprovação em desenvolvimento')}
                      styles={{ root: { backgroundColor: '#10893e' } }}
                    />
                    <DefaultButton
                      text="❌ Rejeitar"
                      onClick={() => alert('Funcionalidade de rejeição em desenvolvimento')}
                      styles={{ root: { color: '#d13438', borderColor: '#d13438' } }}
                    />
                    <DefaultButton
                      text="👁️ Detalhes"
                      onClick={() => alert('Detalhes do pedido em desenvolvimento')}
                    />
                  </Stack>
                )}
              </Stack>
            </div>
          ))}
        </Stack>

        {/* Panel para Novo Pedido */}
        <Panel
          isOpen={showNewPedidoPanel}
          onDismiss={() => setShowNewPedidoPanel(false)}
          type={PanelType.medium}
          headerText="➕ Novo Pedido de Férias"
        >
          <Stack tokens={{ childrenGap: 20, padding: '20px 0' }}>
            <Text>Funcionalidade de criação de novos pedidos em desenvolvimento...</Text>
            <PrimaryButton
              text="Fechar"
              onClick={() => setShowNewPedidoPanel(false)}
            />
          </Stack>
        </Panel>
      </Stack>
    </div>
  );
};

export default PedidoFerias;
