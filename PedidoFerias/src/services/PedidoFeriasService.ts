import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users";
import "@pnp/sp/fields";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Logger, LogLevel, PnPLogging } from "@pnp/logging";
import { 
  IPedidoFerias, 
  INewPedidoFerias, 
  IPedidoUpdate, 
  IPedidoFeriasFilters, 
  ISortConfig, 
  IPedidoFeriasSearchResult,
  EstadoPedido,
  IUserPermissions,
  IColaborador
} from '../models/IPedidoFerias';

const LOG_SOURCE = "PedidoFeriasService";

export class PedidoFeriasService {
  private _sp: SPFI;
  private _listTitle: string;

  constructor(context: WebPartContext, listTitle: string = "Pedidos de Férias") {
    this._sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
    this._listTitle = listTitle;
  }

  /**
   * Método auxiliar para tratamento de erros
   */
  private async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string = "Erro na operação"
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      Logger.write(`${LOG_SOURCE} - ${errorMessage}: ${error}`, LogLevel.Error);
      console.error(`${errorMessage}:`, error);
      throw error;
    }
  }

  /**
   * Obter todos os pedidos com filtros e ordenação
   */
  public async getPedidos(
    filters?: IPedidoFeriasFilters,
    sortConfig?: ISortConfig,
    pageSize: number = 50,
    pageNumber: number = 0
  ): Promise<IPedidoFeriasSearchResult | undefined> {
    return this.executeWithErrorHandling(
      async () => {
        let query = this._sp.web.lists.getByTitle(this._listTitle).items
          .select(
            "Id",
            "Title", 
            "Colaborador/Title",
            "Colaborador/EMail",
            "Colaborador/Id",
            "DataInicio",
            "DataFim", 
            "DiasTotal",
            "Motivo",
            "Estado",
            "DataSolicitacao",
            "AprovadoPor/Title",
            "AprovadoPor/Id",
            "DataAprovacao",
            "Observacoes",
            "Created",
            "Modified",
            "Author/Title",
            "Author/Id",
            "Editor/Title", 
            "Editor/Id"
          )
          .expand("Colaborador", "AprovadoPor", "Author", "Editor");

        // Aplicar filtros
        const filterConditions: string[] = [];
        
        if (filters?.colaborador?.Id) {
          filterConditions.push(`ColaboradorId eq ${filters.colaborador.Id}`);
        }
        
        if (filters?.estado) {
          filterConditions.push(`Estado eq '${filters.estado}'`);
        }
        
        if (filters?.dataInicioFrom) {
          const dateFrom = filters.dataInicioFrom.toISOString();
          filterConditions.push(`DataInicio ge datetime'${dateFrom}'`);
        }
        
        if (filters?.dataInicioTo) {
          const dateTo = filters.dataInicioTo.toISOString();
          filterConditions.push(`DataInicio le datetime'${dateTo}'`);
        }
        
        if (filters?.searchText) {
          filterConditions.push(
            `(substringof('${filters.searchText}', Title) or ` +
            `substringof('${filters.searchText}', Motivo) or ` +
            `substringof('${filters.searchText}', Colaborador/Title))`
          );
        }

        if (filterConditions.length > 0) {
          query = query.filter(filterConditions.join(' and '));
        }

        // Aplicar ordenação
        if (sortConfig) {
          const orderBy = sortConfig.direction === 'desc' ? 
            `${sortConfig.field} desc` : 
            sortConfig.field.toString();
          query = query.orderBy(orderBy);
        } else {
          // Ordenação padrão por data de criação (mais recentes primeiro)
          query = query.orderBy("Created", false);
        }

        // Aplicar paginação
        if (pageSize > 0) {
          query = query.top(pageSize);
          if (pageNumber > 0) {
            query = query.skip(pageNumber * pageSize);
          }
        }

        const results = await query();
        
        // Contar total de itens (sem paginação)
        let totalCount = 0;
        if (filterConditions.length > 0) {
          const countQuery = this._sp.web.lists.getByTitle(this._listTitle).items
            .filter(filterConditions.join(' and '));
          const countResults = await countQuery();
          totalCount = countResults.length;
        } else {
          const allItems = await this._sp.web.lists.getByTitle(this._listTitle).items();
          totalCount = allItems.length;
        }

        return {
          items: results as IPedidoFerias[],
          totalCount,
          hasNext: (pageNumber + 1) * pageSize < totalCount
        };
      },
      "Erro ao buscar pedidos de férias"
    );
  }

  /**
   * Obter um pedido específico por ID
   */
  public async getPedidoById(id: number): Promise<IPedidoFerias | undefined> {
    return this.executeWithErrorHandling(
      async () => {
        const item = await this._sp.web.lists.getByTitle(this._listTitle).items
          .getById(id)
          .select(
            "Id",
            "Title",
            "Colaborador/Title",
            "Colaborador/EMail", 
            "Colaborador/Id",
            "DataInicio",
            "DataFim",
            "DiasTotal",
            "Motivo",
            "Estado", 
            "DataSolicitacao",
            "AprovadoPor/Title",
            "AprovadoPor/Id",
            "DataAprovacao",
            "Observacoes",
            "Created",
            "Modified",
            "Author/Title",
            "Author/Id",
            "Editor/Title",
            "Editor/Id"
          )
          .expand("Colaborador", "AprovadoPor", "Author", "Editor")();
          
        return item as IPedidoFerias;
      },
      `Erro ao buscar pedido ${id}`
    );
  }

  /**
   * Criar novo pedido de férias
   */
  public async createPedido(pedido: INewPedidoFerias): Promise<IPedidoFerias | undefined> {
    return this.executeWithErrorHandling(
      async () => {
        const result = await this._sp.web.lists.getByTitle(this._listTitle).items.add({
          Title: pedido.Title,
          ColaboradorId: pedido.ColaboradorId,
          DataInicio: pedido.DataInicio,
          DataFim: pedido.DataFim,
          DiasTotal: pedido.DiasTotal,
          Motivo: pedido.Motivo,
          Estado: pedido.Estado,
          DataSolicitacao: pedido.DataSolicitacao
        });
        
        // Retornar o item criado com todos os campos
        return await this.getPedidoById(result.data.Id);
      },
      "Erro ao criar pedido de férias"
    );
  }

  /**
   * Atualizar status do pedido (Aprovar/Rejeitar)
   */
  public async updatePedidoStatus(
    id: number, 
    update: IPedidoUpdate, 
    currentUserId: number
  ): Promise<boolean> {
    return this.executeWithErrorHandling(
      async () => {
        const updateData: Record<string, unknown> = {
          Estado: update.Estado,
          DataAprovacao: new Date().toISOString(),
          AprovadoPorId: currentUserId
        };

        if (update.Observacoes) {
          updateData.Observacoes = update.Observacoes;
        }

        await this._sp.web.lists.getByTitle(this._listTitle).items
          .getById(id)
          .update(updateData);
          
        return true;
      },
      `Erro ao atualizar status do pedido ${id}`
    ) || false;
  }

  /**
   * Excluir pedido
   */
  public async deletePedido(id: number): Promise<boolean> {
    return this.executeWithErrorHandling(
      async () => {
        await this._sp.web.lists.getByTitle(this._listTitle).items
          .getById(id)
          .delete();
        return true;
      },
      `Erro ao excluir pedido ${id}`
    ) || false;
  }

  /**
   * Verificar permissões do usuário atual
   */
  public async getCurrentUserPermissions(): Promise<IUserPermissions | undefined> {
    return this.executeWithErrorHandling(
      async () => {
        const currentUser = await this._sp.web.currentUser();
        const list = this._sp.web.lists.getByTitle(this._listTitle);
        
        // Verificar se é administrador ou tem permissões especiais
        const userGroups = await this._sp.web.currentUser.groups();
        const isAdmin = userGroups.some(group => 
          group.Title.toLowerCase().includes('admin') || 
          group.Title.toLowerCase().includes('owner')
        );

        // Verificar permissões na lista
        const permissions = await list.getCurrentUserEffectivePermissions();
        
        return {
          canApprove: isAdmin || currentUser.IsSiteAdmin,
          canReject: isAdmin || currentUser.IsSiteAdmin,
          canCreate: true, // Assumindo que todos podem criar
          canEdit: isAdmin || currentUser.IsSiteAdmin,
          canDelete: isAdmin || currentUser.IsSiteAdmin,
          isAdmin: isAdmin || currentUser.IsSiteAdmin
        };
      },
      "Erro ao verificar permissões do usuário"
    );
  }

  /**
   * Buscar colaboradores (para People Picker)
   */
  public async searchColaboradores(searchText: string): Promise<IColaborador[]> {
    return this.executeWithErrorHandling(
      async () => {
        const users = await this._sp.web.siteUsers
          .filter(`substringof('${searchText}', Title) or substringof('${searchText}', Email)`)
          .top(10)
          .select("Id", "Title", "Email", "JobTitle", "Department")();

        return users.map(user => ({
          Id: user.Id,
          Title: user.Title,
          EMail: user.Email || '',
          JobTitle: (user as any).JobTitle || '',
          Department: (user as any).Department || ''
        }));
      },
      "Erro ao buscar colaboradores"
    ) || [];
  }

  /**
   * Verificar se a lista existe e criar se necessário
   */
  public async ensureList(): Promise<boolean> {
    return this.executeWithErrorHandling(
      async () => {
        try {
          // Tentar acessar a lista
          await this._sp.web.lists.getByTitle(this._listTitle).select("Id")();
          return true;
        } catch {
          // Lista não existe, vamos criar
          console.log(`Lista '${this._listTitle}' não encontrada. Criando...`);
          
          const listCreationInfo = {
            Title: this._listTitle,
            Description: "Lista para gerenciar pedidos de férias dos colaboradores",
            BaseTemplate: 100, // Generic List
            EnableContentTypes: true
          };

          const list = await this._sp.web.lists.add(this._listTitle, listCreationInfo.Description, 100);
          
          // Adicionar campos customizados
          await this.createListFields(list);
          
          return true;
        }
      },
      "Erro ao verificar/criar lista"
    ) || false;
  }

  /**
   * Criar campos customizados na lista
   */
  private async createListFields(list: any): Promise<void> {
    // Campo Colaborador (User)
    await list.fields.addUser("Colaborador", {
      Required: true,
      Description: "Colaborador que está solicitando as férias"
    });

    // Campo Data Início
    await list.fields.addDateTime("DataInicio", {
      Required: true,
      Description: "Data de início das férias",
      DisplayFormat: 1 // DateOnly
    });

    // Campo Data Fim  
    await list.fields.addDateTime("DataFim", {
      Required: true,
      Description: "Data de fim das férias",
      DisplayFormat: 1 // DateOnly
    });

    // Campo Dias Total
    await list.fields.addNumber("DiasTotal", {
      Required: true,
      Description: "Total de dias de férias solicitados"
    });

    // Campo Motivo
    await list.fields.addMultilineText("Motivo", {
      Required: false,
      Description: "Motivo ou observações sobre o pedido"
    });

    // Campo Estado (Choice)
    await list.fields.addChoice("Estado", {
      Required: true,
      Choices: ["Pendente", "Aprovado", "Rejeitado", "Cancelado"],
      DefaultValue: "Pendente",
      Description: "Status atual do pedido"
    });

    // Campo Data Solicitação
    await list.fields.addDateTime("DataSolicitacao", {
      Required: true,
      Description: "Data em que o pedido foi feito"
    });

    // Campo Aprovado Por (User)
    await list.fields.addUser("AprovadoPor", {
      Required: false,
      Description: "Usuário que aprovou ou rejeitou o pedido"
    });

    // Campo Data Aprovação
    await list.fields.addDateTime("DataAprovacao", {
      Required: false,
      Description: "Data em que o pedido foi aprovado/rejeitado"
    });

    // Campo Observações
    await list.fields.addMultilineText("Observacoes", {
      Required: false,
      Description: "Observações sobre a aprovação/rejeição"
    });
  }
}

export default PedidoFeriasService;