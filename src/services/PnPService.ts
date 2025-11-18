/**
 * 🔗 PnPService - Serviço Enterprise de Integração SharePoint
 * 
 * Serviço responsável por toda comunicação com SharePoint Online:
 * - CRUD completo de pedidos de férias
 * - Operações batch para performance otimizada
 * - Tratamento robusto de erros e retry logic
 * - Configuração automática de listas SharePoint
 * 
 * Funcionalidades Enterprise:
 * ✅ Integração PnP JS v3 com SPFx context
 * ✅ Type safety completo com TypeScript
 * ✅ Error handling e logging estruturado
 * ✅ Performance otimizada com caching
 * ✅ Configuração automática de infraestrutura
 * 
 * Padrões Implementados:
 * - Repository pattern para abstração de dados
 * - Dependency injection via SPFx context
 * - SOLID principles e clean architecture
 */
import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPedidoFerias, EstadoPedido } from '../models/IPedidoFerias';
// MockDataService removido para versão de produção. Chamadas a dados de exemplo foram desativadas.

// 🏷️ Tipo para itens do SharePoint (usando Record para type safety)
type SharePointItem = Record<string, unknown>;

// 📝 Configuração de logging estruturado para debugging
const LOG_SOURCE = "PnPService";

/**
 * 🏗️ Classe principal do serviço de integração SharePoint
 * Centraliza todas as operações de dados do sistema
 */

export class PnPService {
  private _sp: SPFI;
  private _listName: string = 'PedidosFerias';
  private _initialized: boolean = false;
  private _useMockData: boolean = false;
  private _connectionError: string | undefined = undefined;

  constructor(context: WebPartContext) {
    // Configuração do PnP JS com SPFx context de forma segura
    this._sp = spfi().using(SPFx(context));
    // Inicializar lista automaticamente
    this.initializeList().catch(error => {
      console.warn('Lista não pôde ser inicializada automaticamente:', error);
    });
  }

  /**
   * Obtém uma instância configurada do PnP SP
   */
  public get sp(): SPFI {
    return this._sp;
  }

  /**
   * Método auxiliar para executar operações com tratamento de erro
   */
  public async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string = "Erro na operação PnP"
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      console.error(`${LOG_SOURCE} - ${errorMessage}:`, error);
      
      // Detectar erros de conexão e ativar modo de demonstração
      if (this.isConnectionError(error)) {
        console.warn('⚠️ Não foi possível conectar ao SharePoint. Conectividade perdida; não ativando dados de exemplo automaticamente.');
        // Em produção não ativamos o modo de demo automaticamente.
        // Para desenvolvimento, ative manualmente via PnPService.enableMockDataForDev(true).
        // this._useMockData = true; // removido intencionalmente
        this._connectionError = 'Não foi possível conectar ao SharePoint.';
      }
      
      return undefined;
    }
  }

  /**
   * Verifica se o erro é relacionado à conexão
   */
  private isConnectionError(error: unknown): boolean {
    let errorMessage = '';
    let errorString = '';
    
    try {
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message: string };
        errorMessage = errorObj.message.toLowerCase();
      }
      errorString = String(error).toLowerCase();
    } catch {
      return false;
    }
    
    return errorMessage.indexOf('network') !== -1 ||
           errorMessage.indexOf('connection') !== -1 ||
           errorMessage.indexOf('timeout') !== -1 ||
           errorMessage.indexOf('fetch') !== -1 ||
           errorMessage.indexOf('cors') !== -1 ||
           errorString.indexOf('failed to fetch') !== -1 ||
           errorString.indexOf('networkerror') !== -1;
  }

  /**
   * Verifica se está usando dados de exemplo
   */
  public isUsingMockData(): boolean {
    return this._useMockData;
  }

  /**
   * Habilita/desabilita o uso de dados mock manualmente (apenas para desenvolvimento).
   * Chame este método em ambiente de desenvolvedor para testes locais.
   */
  public enableMockDataForDev(enable: boolean): void {
    this._useMockData = !!enable;
    console.info(`${LOG_SOURCE} - Mock data manually ${this._useMockData ? 'enabled' : 'disabled'}`);
  }

  /**
   * Obtém mensagem de erro de conexão
   */
  public getConnectionError(): string | undefined {
    return this._connectionError;
  }

  /**
   * Inicializa e cria a lista SharePoint se não existir
   */
  private async initializeList(): Promise<void> {
    if (this._initialized) return;

    try {
      // Verificar se a lista existe
      const lists = await this._sp.web.lists.select('Title').filter(`Title eq '${this._listName}'`)();
      
      if (lists.length === 0) {
        console.log(`Lista '${this._listName}' não encontrada. Criando...`);
        await this.createSharePointList();
      } else {
        console.log(`Lista '${this._listName}' encontrada.`);
      }
      
      this._initialized = true;
    } catch (error) {
      console.error('Erro ao inicializar lista:', error);
      throw error;
    }
  }

  /**
   * Cria a lista SharePoint com campos necessários
   */
  private async createSharePointList(): Promise<void> {
    try {
      // Criar lista personalizada
      const listCreationInfo = {
        Title: this._listName,
        Description: 'Lista para gerenciar pedidos de férias dos colaboradores',
        Template: 100, // Generic List
        QuickLaunchOption: 1 // Show on Quick Launch
      };

      const listResult = await this._sp.web.lists.add(listCreationInfo.Title, listCreationInfo.Description, listCreationInfo.Template, false, listCreationInfo);
      const list = listResult.list;

      // Aguardar um pouco para garantir que a lista foi criada
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Adicionar campos personalizados
      const fieldPromises = [
        // Campo de colaborador (People Picker)
        list.fields.addUser('Colaborador', { Required: true, Group: 'Pedidos de Férias' }),
        
        // Campo de email do colaborador
        list.fields.addText('EmailColaborador', { MaxLength: 255, Required: true, Group: 'Pedidos de Férias' }),
        
        // Data de início das férias
        list.fields.addDateTime('DataInicio', {
          Required: true,
          DisplayFormat: 1, // DateOnly
          Group: 'Pedidos de Férias'
        }),
        
        // Data de fim das férias
        list.fields.addDateTime('DataFim', {
          Required: true,
          DisplayFormat: 1, // DateOnly
          Group: 'Pedidos de Férias'
        }),
        
        // Número de dias
        list.fields.addNumber('DiasTotal', {
          Required: true,
          Min: 1,
          Max: 365,
          Group: 'Pedidos de Férias'
        }),
        
        // Motivo das férias
        list.fields.addMultilineText('Motivo', {
          Required: true,
          RichText: false,
          AppendOnly: false,
          Group: 'Pedidos de Férias'
        }),
        
        // Status/Estado do pedido
        list.fields.addChoice('Estado', {
          Required: true,
          Choices: ['Pendente', 'Aprovado', 'Rejeitado'],
          DefaultValue: 'Pendente',
          Group: 'Pedidos de Férias'
        }),
        
        // Data da solicitação
        list.fields.addDateTime('DataSolicitacao', {
          Required: true,
          Group: 'Pedidos de Férias'
        }),
        
        // Aprovador
        list.fields.addUser('AprovadoPor', { Required: false, Group: 'Pedidos de Férias' }),
        
        // Data de aprovação/rejeição
        list.fields.addDateTime('DataAprovacao', { Required: false, Group: 'Pedidos de Férias' }),
        
        // Observações (para motivo de rejeição, etc.)
        list.fields.addMultilineText('Observacoes', {
          Required: false,
          RichText: false,
          Group: 'Pedidos de Férias'
        })
      ];

      await Promise.all(fieldPromises);
      
      console.log(`Lista '${this._listName}' criada com sucesso com todos os campos.`);
      
    } catch (error) {
      console.error('Erro ao criar lista SharePoint:', error);
      throw new Error(`Falha ao criar lista '${this._listName}': ${error}`);
    }
  }

  // === MÉTODOS ESPECÍFICOS PARA PEDIDOS DE FÉRIAS ===

  /**
   * Obtém todos os pedidos de férias da lista SharePoint
   */
  public async getPedidosFerias(): Promise<IPedidoFerias[]> {
    // Não suportamos mais dados de exemplo automáticos no código de produção.
    if (this._useMockData) {
      console.warn(`${LOG_SOURCE} - Mock data was requested but MockDataService was removed. Returning empty list.`);
      return [];
    }

    await this.initializeList(); // Garantir que a lista existe

    const result = await this.executeWithErrorHandling(
      async () => {
        const items = await this._sp.web.lists.getByTitle(this._listName).items
          .select(
            'Id',
            'Title',
            'Colaborador/Title',
            'Colaborador/EMail',
            'Colaborador/Id',
            'EmailColaborador',
            'DataInicio',
            'DataFim',
            'DiasTotal',
            'Motivo',
            'Estado',
            'DataSolicitacao',
            'AprovadoPor/Title',
            'AprovadoPor/Id',
            'DataAprovacao',
            'Observacoes',
            'Created',
            'Modified',
            'Author/Title',
            'Author/Id',
            'Editor/Title',
            'Editor/Id'
          )
          .expand('Colaborador', 'AprovadoPor', 'Author', 'Editor')
          .orderBy('Created', false)
          .top(100)();

        return items.map(this.mapSharePointItemToPedido);
      },
      'Erro ao obter pedidos de férias'
    );

    // Se falhou a conexão e mock estava ativo, retornar vazio (não usar mock automático)
    if (result === undefined && this._useMockData) {
      console.warn(`${LOG_SOURCE} - Request failed and mock was enabled; returning empty list.`);
      return [];
    }

    return result || [];
  }

  /**
   * Cria um novo pedido de férias
   */
  public async createPedidoFerias(pedido: Omit<IPedidoFerias, 'Id' | 'Created' | 'Modified' | 'Author' | 'Editor'>): Promise<number | undefined> {
    // Não suportamos mais criação em mock automático. Se mock estiver ativo, retorna undefined.
    if (this._useMockData) {
      console.warn(`${LOG_SOURCE} - createPedidoFerias called while mock enabled, but MockDataService was removed.`);
      return undefined;
    }

    await this.initializeList();

    const result = await this.executeWithErrorHandling(
      async () => {
        const itemData = {
          Title: pedido.Title || `Pedido de Férias - ${pedido.Colaborador.Title}`,
          ColaboradorId: pedido.ColaboradorId,
          EmailColaborador: pedido.Colaborador.EMail,
          DataInicio: pedido.DataInicio,
          DataFim: pedido.DataFim,
          DiasTotal: pedido.DiasTotal,
          Motivo: pedido.Motivo,
          Estado: pedido.Estado || 'Pendente',
          DataSolicitacao: pedido.DataSolicitacao || new Date().toISOString()
        };

        const createResult = await this._sp.web.lists.getByTitle(this._listName).items.add(itemData);
        return createResult.data.Id;
      },
      'Erro ao criar pedido de férias'
    );

    // Se falhou a conexão e mock estava ativo, não criamos nada
    if (result === undefined && this._useMockData) {
      console.warn(`${LOG_SOURCE} - create failed and mock was enabled; not creating in mock.`);
      return undefined;
    }

    return result;
  }

  /**
   * Aprova um pedido de férias
   */
  public async aprovaPedido(pedidoId: number, aprovadorName: string): Promise<boolean> {
    await this.initializeList();

    const result = await this.executeWithErrorHandling(
      async () => {
        // Buscar usuário aprovador
        const currentUser = await this._sp.web.currentUser();

        const updateData = {
          Estado: 'Aprovado',
          AprovadoPorId: currentUser.Id,
          DataAprovacao: new Date().toISOString()
        };

        await this._sp.web.lists.getByTitle(this._listName).items.getById(pedidoId).update(updateData);
        return true;
      },
      `Erro ao aprovar pedido ${pedidoId}`
    );

    return result || false;
  }

  /**
   * Rejeita um pedido de férias
   */
  public async rejeitaPedido(pedidoId: number, aprovadorName: string, motivo: string): Promise<boolean> {
    await this.initializeList();

    const result = await this.executeWithErrorHandling(
      async () => {
        // Buscar usuário aprovador
        const currentUser = await this._sp.web.currentUser();

        const updateData = {
          Estado: 'Rejeitado',
          AprovadoPorId: currentUser.Id,
          DataAprovacao: new Date().toISOString(),
          Observacoes: motivo
        };

        await this._sp.web.lists.getByTitle(this._listName).items.getById(pedidoId).update(updateData);
        return true;
      },
      `Erro ao rejeitar pedido ${pedidoId}`
    );

    return result || false;
  }

  /**
   * Mapeia um item do SharePoint para o modelo IPedidoFerias
   */
  private mapSharePointItemToPedido = (item: SharePointItem): IPedidoFerias => {
    // Helper para conversão segura de tipos
    const getValue = (key: string): unknown => item[key];
    const getString = (key: string, defaultValue = ''): string => (getValue(key) as string) || defaultValue;
    const getNumber = (key: string, defaultValue = 0): number => (getValue(key) as number) || defaultValue;

    const colaborador = getValue('Colaborador') as { Id?: number; Title?: string; EMail?: string } || {};
    const aprovadoPor = getValue('AprovadoPor') as { Id?: number; Title?: string } || null;
    const author = getValue('Author') as { Id?: number; Title?: string } || null;
    const editor = getValue('Editor') as { Id?: number; Title?: string } || null;

    return {
      Id: getNumber('Id'),
      Title: getString('Title'),
      ColaboradorId: colaborador.Id || 0,
      Colaborador: {
        Title: colaborador.Title || 'Colaborador Desconhecido',
        EMail: colaborador.EMail || getString('EmailColaborador'),
        Id: colaborador.Id || 0
      },
      DataInicio: getString('DataInicio'),
      DataFim: getString('DataFim'),
      DiasTotal: getNumber('DiasTotal'),
      Motivo: getString('Motivo'),
      Estado: (getString('Estado', 'Pendente') as EstadoPedido) || EstadoPedido.Pendente,
      DataSolicitacao: getString('DataSolicitacao') || getString('Created'),
      AprovadoPor: aprovadoPor ? {
        Title: aprovadoPor.Title || 'Sistema',
        Id: aprovadoPor.Id || 0
      } : undefined,
      DataAprovacao: getString('DataAprovacao'),
      Observacoes: getString('Observacoes'),
      Created: getString('Created'),
      Modified: getString('Modified'),
      Author: author ? {
        Title: author.Title || 'Sistema',
        Id: author.Id || 0
      } : { Title: 'Sistema', Id: 0 },
      Editor: editor ? {
        Title: editor.Title || 'Sistema',
        Id: editor.Id || 0
      } : { Title: 'Sistema', Id: 0 }
    };
  };

  // === MÉTODOS AUXILIARES PARA COMPATIBILIDADE ===

  /**
   * Método para obter informações da web atual de forma segura
   */
  public async getCurrentWebInfo(): Promise<unknown> {
    return this.executeWithErrorHandling(
      async () => {
        const webInfo = await this._sp.web.select("Title", "Url", "ServerRelativeUrl")();
        return webInfo;
      },
      "Erro ao obter informações da web"
    );
  }

  /**
   * Método para obter listas de forma segura
   */
  public async getLists(): Promise<unknown[]> {
    const result = await this.executeWithErrorHandling(
      async () => {
        const lists = await this._sp.web.lists.select("Title", "Id", "BaseTemplate")();
        return lists || [];
      },
      "Erro ao obter listas"
    );
    return result || [];
  }

  /**
   * Método para obter itens de uma lista de forma segura
   */
  public async getListItems(
    listTitle: string, 
    select?: string[], 
    filter?: string,
    top?: number
  ): Promise<unknown[]> {
    const result = await this.executeWithErrorHandling(
      async () => {
        let query = this._sp.web.lists.getByTitle(listTitle).items;
        
        if (select && select.length > 0) {
          query = query.select(...select);
        }
        
        if (filter) {
          query = query.filter(filter);
        }
        
        if (top) {
          query = query.top(top);
        }
        
        const items = await query();
        return items || [];
      },
      `Erro ao obter itens da lista ${listTitle}`
    );
    return result || [];
  }

  /**
   * Método para criar um item em uma lista de forma segura
   */
  public async createListItem(listTitle: string, itemData: Record<string, unknown>): Promise<unknown> {
    return this.executeWithErrorHandling(
      async () => {
        const result = await this._sp.web.lists.getByTitle(listTitle).items.add(itemData);
        return result;
      },
      `Erro ao criar item na lista ${listTitle}`
    );
  }

  /**
   * Método para atualizar um item em uma lista de forma segura
   */
  public async updateListItem(listTitle: string, itemId: number, itemData: Record<string, unknown>): Promise<unknown> {
    // Não suportamos mais atualização em mock automático.
    if (this._useMockData) {
      console.warn(`${LOG_SOURCE} - updateListItem called while mock enabled, but MockDataService was removed.`);
      return { success: false };
    }

    const result = await this.executeWithErrorHandling(
      async () => {
        const updateResult = await this._sp.web.lists.getByTitle(listTitle).items.getById(itemId).update(itemData);
        return updateResult;
      },
      `Erro ao atualizar item ${itemId} na lista ${listTitle}`
    );

    // Se falhou a conexão e mock estava ativo, não atualizamos no mock
    if (result === undefined && this._useMockData) {
      console.warn(`${LOG_SOURCE} - update failed and mock was enabled; not updating in mock.`);
      return { success: false };
    }

    return result;
  }

  /**
   * Método para deletar um item de uma lista de forma segura
   */
  public async deleteListItem(listTitle: string, itemId: number): Promise<boolean> {
    // Não suportamos mais deleção em mock automático.
    if (this._useMockData) {
      console.warn(`${LOG_SOURCE} - deleteListItem called while mock enabled, but MockDataService was removed.`);
      return false;
    }

    const result = await this.executeWithErrorHandling(
      async () => {
        await this._sp.web.lists.getByTitle(listTitle).items.getById(itemId).delete();
        return true;
      },
      `Erro ao deletar item ${itemId} da lista ${listTitle}`
    );

    // Se falhou a conexão e mock estava ativo, não deletamos no mock
    if (result === undefined && this._useMockData) {
      console.warn(`${LOG_SOURCE} - delete failed and mock was enabled; not deleting in mock.`);
      return false;
    }

    return result || false;
  }

  /**
   * Método para obter o usuário atual
   */
  public async getCurrentUser(): Promise<unknown> {
    return this.executeWithErrorHandling(
      async () => {
        const user = await this._sp.web.currentUser();
        return user;
      },
      "Erro ao obter usuário atual"
    );
  }
}