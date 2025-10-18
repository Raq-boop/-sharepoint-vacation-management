import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users";
import { WebPartContext } from '@microsoft/sp-webpart-base';

// Configuração de logging seguro
const LOG_SOURCE = "PnPService";

export class PnPService {
  private _sp: SPFI;

  constructor(context: WebPartContext) {
    // Configuração do PnP JS com SPFx context de forma segura
    this._sp = spfi().using(SPFx(context));
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
      console.error(`${errorMessage}:`, error);
      return undefined;
    }
  }

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
   * Método para atualizar um item de lista de forma segura
   */
  public async updateListItem(listTitle: string, itemId: number, itemData: Record<string, unknown>): Promise<unknown> {
    return this.executeWithErrorHandling(
      async () => {
        const result = await this._sp.web.lists.getByTitle(listTitle).items.getById(itemId).update(itemData);
        return result;
      },
      `Erro ao atualizar item ${itemId} na lista ${listTitle}`
    );
  }

  /**
   * Método para deletar um item de lista de forma segura
   */
  public async deleteListItem(listTitle: string, itemId: number): Promise<boolean> {
    const result = await this.executeWithErrorHandling(
      async () => {
        await this._sp.web.lists.getByTitle(listTitle).items.getById(itemId).delete();
        return true;
      },
      `Erro ao deletar item ${itemId} na lista ${listTitle}`
    );
    return result || false;
  }

  /**
   * Método para obter o usuário atual de forma segura
   */
  public async getCurrentUser(): Promise<unknown> {
    return this.executeWithErrorHandling(
      async () => {
        const user = await this._sp.web.currentUser.select("Id", "Title", "Email", "LoginName")();
        return user;
      },
      "Erro ao obter usuário atual"
    );
  }
}

export default PnPService;