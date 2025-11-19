/**
 * Lightweight stub of PnPService to satisfy imports after simplification.
 * Provides safe defaults so the project can build and run locally without SharePoint.
 */
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPedidoFerias, INewPedidoFerias, EstadoPedido } from '../models/IPedidoFerias';

export class PnPService {
  private _context?: WebPartContext;

  constructor(context?: WebPartContext) {
    this._context = context;
  }

  public async getLists(): Promise<string[]> {
    return [];
  }

  public async getPedidosFerias(): Promise<IPedidoFerias[]> {
    return [];
  }

  public async getListItems(listTitle: string, select?: string[], filter?: string, top?: number): Promise<unknown[]> {
    return [];
  }

  public async createListItem(listTitle: string, itemData: Record<string, unknown> | INewPedidoFerias): Promise<IPedidoFerias> {
    const data = itemData as INewPedidoFerias;
    const title = data.Title || '';
    const colaboradorId = data.ColaboradorId || 0;
    const dataInicio = data.DataInicio || new Date().toISOString();
    const dataFim = data.DataFim || new Date().toISOString();
    const diasTotal = data.DiasTotal || 0;
    const motivo = data.Motivo;
    const estado = data.Estado || EstadoPedido.Pendente;

    return {
      Id: 0,
      Title: title,
      ColaboradorId: colaboradorId,
      Colaborador: { Title: '', EMail: '', Id: colaboradorId },
      DataInicio: dataInicio,
      DataFim: dataFim,
      DiasTotal: diasTotal,
      Motivo: motivo,
      Estado: estado,
  DataSolicitacao: data.DataSolicitacao || new Date().toISOString(),
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      Author: { Title: 'Local', Id: 0 },
      Editor: { Title: 'Local', Id: 0 }
    } as IPedidoFerias;
  }

  public async updateListItem(listTitle: string, itemId: number, itemData: Partial<INewPedidoFerias> & Record<string, unknown>): Promise<IPedidoFerias> {
    const title = itemData.Title || '';
    const colaboradorId = itemData.ColaboradorId || 0;
    const dataInicio = itemData.DataInicio || new Date().toISOString();
    const dataFim = itemData.DataFim || new Date().toISOString();
    const diasTotal = itemData.DiasTotal || 0;
    const motivo = itemData.Motivo;
    const estado = itemData.Estado || EstadoPedido.Pendente;

    return {
      Id: itemId,
      Title: title,
      ColaboradorId: colaboradorId,
      Colaborador: { Title: '', EMail: '', Id: colaboradorId },
      DataInicio: dataInicio,
      DataFim: dataFim,
      DiasTotal: diasTotal,
      Motivo: motivo,
      Estado: estado,
      DataSolicitacao: itemData.DataSolicitacao || new Date().toISOString(),
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      Author: { Title: 'Local', Id: 0 },
      Editor: { Title: 'Local', Id: 0 }
    } as IPedidoFerias;
  }

  public async deleteListItem(listTitle: string, itemId: number): Promise<boolean> {
    return true;
  }

  public async getCurrentUser(): Promise<{ Id: number; Title: string }> {
    return { Id: 0, Title: 'Local User' };
  }

  public async getCurrentWebInfo(): Promise<{ Title: string; AbsoluteUrl: string }> {
    return { Title: 'Local Web', AbsoluteUrl: '' };
  }

  public isUsingMockData(): boolean {
    return false;
  }

  public getConnectionError(): string | undefined {
    return undefined;
  }

  public async aprovaPedido(id: number, aprovador: string): Promise<boolean> {
    return true;
  }

  public async rejeitaPedido(id: number, aprovador: string, motivo: string): Promise<boolean> {
    return true;
  }
}

export default PnPService;
