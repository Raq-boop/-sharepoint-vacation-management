/**
 * MockDataService - Serviço de Dados de Exemplo
 *
 * Fornece dados simulados para desenvolvimento e demonstração
 * quando não há conexão com SharePoint disponível.
 *
 * Funcionalidades:
 * - Dados realistas para demonstração
 * - Simula latência de rede
 * - Estados variados de pedidos
 * - Persistência local via localStorage
 *
 * Cenários de Uso:
 * - Desenvolvimento local sem SharePoint
 * - Demonstrações e apresentações
 * - Testes de interface de usuário
 * - Treinamento de usuários
 */
import { IPedidoFerias, EstadoPedido } from '../models/IPedidoFerias';

// Dados de exemplo para demonstração
const MOCK_PEDIDOS: IPedidoFerias[] = [
  {
    Id: 1,
    Title: 'Férias de Verão - João Silva',
    ColaboradorId: 101,
    Colaborador: {
      Title: 'João Silva',
      EMail: 'joao.silva@empresa.com',
      Id: 101
    },
    DataInicio: '2024-01-15',
    DataFim: '2024-01-29',
    DiasTotal: 15,
    Motivo: 'Férias de verão com a família',
    Estado: EstadoPedido.Pendente,
    DataSolicitacao: '2023-12-10',
    AprovadoPor: undefined,
    DataAprovacao: undefined,
    Observacoes: '',
    Created: '2023-12-10T09:30:00Z',
    Modified: '2023-12-10T09:30:00Z',
    Author: {
      Title: 'João Silva',
      Id: 101
    },
    Editor: {
      Title: 'João Silva',
      Id: 101
    }
  },
  {
    Id: 2,
    Title: 'Férias de Fim de Ano - Maria Santos',
    ColaboradorId: 102,
    Colaborador: {
      Title: 'Maria Santos',
      EMail: 'maria.santos@empresa.com',
      Id: 102
    },
    DataInicio: '2023-12-20',
    DataFim: '2024-01-05',
    DiasTotal: 10,
    Motivo: 'Férias de fim de ano',
    Estado: EstadoPedido.Aprovado,
    DataSolicitacao: '2023-11-15',
    AprovadoPor: {
      Title: 'Carlos Manager',
      Id: 201
    },
    DataAprovacao: '2023-11-18',
    Observacoes: 'Aprovado. Boas férias!',
    Created: '2023-11-15T14:20:00Z',
    Modified: '2023-11-18T10:15:00Z',
    Author: {
      Title: 'Maria Santos',
      Id: 102
    },
    Editor: {
      Title: 'Carlos Manager',
      Id: 201
    }
  },
  {
    Id: 3,
    Title: 'Férias Escolares - Pedro Costa',
    ColaboradorId: 103,
    Colaborador: {
      Title: 'Pedro Costa',
      EMail: 'pedro.costa@empresa.com',
      Id: 103
    },
    DataInicio: '2024-07-01',
    DataFim: '2024-07-15',
    DiasTotal: 15,
    Motivo: 'Acompanhar férias escolares dos filhos',
    Estado: EstadoPedido.Rejeitado,
    DataSolicitacao: '2024-05-20',
    AprovadoPor: {
      Title: 'Ana Supervisor',
      Id: 202
    },
    DataAprovacao: '2024-05-25',
    Observacoes: 'Rejeitado devido a conflito com projeto prioritário. Reagendar para agosto.',
    Created: '2024-05-20T11:45:00Z',
    Modified: '2024-05-25T16:30:00Z',
    Author: {
      Title: 'Pedro Costa',
      Id: 103
    },
    Editor: {
      Title: 'Ana Supervisor',
      Id: 202
    }
  },
  {
    Id: 4,
    Title: 'Férias Antecipadas - Ana Lima',
    ColaboradorId: 104,
    Colaborador: {
      Title: 'Ana Lima',
      EMail: 'ana.lima@empresa.com',
      Id: 104
    },
    DataInicio: '2024-03-10',
    DataFim: '2024-03-20',
    DiasTotal: 8,
    Motivo: 'Casamento na família',
    Estado: EstadoPedido.Aprovado,
    DataSolicitacao: '2024-02-01',
    AprovadoPor: {
      Title: 'Carlos Manager',
      Id: 201
    },
    DataAprovacao: '2024-02-03',
    Observacoes: 'Aprovado para evento familiar importante.',
    Created: '2024-02-01T13:15:00Z',
    Modified: '2024-02-03T09:45:00Z',
    Author: {
      Title: 'Ana Lima',
      Id: 104
    },
    Editor: {
      Title: 'Carlos Manager',
      Id: 201
    }
  },
  {
    Id: 5,
    Title: 'Férias de Carnaval - Roberto Oliveira',
    ColaboradorId: 105,
    Colaborador: {
      Title: 'Roberto Oliveira',
      EMail: 'roberto.oliveira@empresa.com',
      Id: 105
    },
    DataInicio: '2024-02-12',
    DataFim: '2024-02-16',
    DiasTotal: 5,
    Motivo: 'Férias de carnaval',
    Estado: EstadoPedido.Pendente,
    DataSolicitacao: '2024-01-20',
    AprovadoPor: undefined,
    DataAprovacao: undefined,
    Observacoes: '',
    Created: '2024-01-20T10:30:00Z',
    Modified: '2024-01-20T10:30:00Z',
    Author: {
      Title: 'Roberto Oliveira',
      Id: 105
    },
    Editor: {
      Title: 'Roberto Oliveira',
      Id: 105
    }
  }
];

/**
 * Classe MockDataService
 * Simula operações do PnPService com dados de exemplo
 */
export class MockDataService {
  private static readonly STORAGE_KEY = 'mockPedidosFerias';
  private static readonly SIMULATED_DELAY = 800; // ms

  /**
   * Simula latência de rede
   */
  private static async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.SIMULATED_DELAY));
  }

  /**
   * Carrega dados do localStorage ou retorna dados padrão
   */
  private static getData(): IPedidoFerias[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Erro ao carregar dados do localStorage:', error);
    }
    return [...MOCK_PEDIDOS];
  }

  /**
   * Salva dados no localStorage
   */
  private static saveData(data: IPedidoFerias[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Erro ao salvar dados no localStorage:', error);
    }
  }

  /**
   * Obtém todos os pedidos de férias (simulado)
   */
  public static async getPedidosFerias(): Promise<IPedidoFerias[]> {
    await this.simulateNetworkDelay();
    const data = this.getData();
  console.log('MockDataService: Carregados', data.length, 'pedidos de exemplo');
    return data;
  }

  /**
   * Cria um novo pedido (simulado)
   */
  public static async createPedidoFerias(pedido: Omit<IPedidoFerias, 'Id' | 'Created' | 'Modified' | 'Author' | 'Editor'>): Promise<number> {
    await this.simulateNetworkDelay();
    
    const data = this.getData();
    const newId = Math.max(...data.map(p => p.Id), 0) + 1;
    const now = new Date().toISOString();
    
    const newPedido: IPedidoFerias = {
      ...pedido,
      Id: newId,
      Created: now,
      Modified: now,
      Author: {
        Title: pedido.Colaborador.Title,
        Id: pedido.Colaborador.Id
      },
      Editor: {
        Title: pedido.Colaborador.Title,
        Id: pedido.Colaborador.Id
      }
    };
    
    data.push(newPedido);
    this.saveData(data);
    
  console.log('MockDataService: Pedido criado com ID', newId);
    return newId;
  }

  /**
   * Atualiza um pedido existente (simulado)
   */
  public static async updateListItem(pedidoId: number, updates: Partial<IPedidoFerias>): Promise<void> {
    await this.simulateNetworkDelay();
    
    const data = this.getData();
    let index = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i].Id === pedidoId) {
        index = i;
        break;
      }
    }
    
    if (index === -1) {
      throw new Error(`Pedido com ID ${pedidoId} não encontrado`);
    }
    
    data[index] = {
      ...data[index],
      ...updates,
      Modified: new Date().toISOString(),
      Editor: {
        Title: 'Sistema Demo',
        Id: 999
      }
    };
    
    this.saveData(data);
  console.log('MockDataService: Pedido', pedidoId, 'atualizado');
  }

  /**
   * Remove um pedido (simulado)
   */
  public static async deletePedidoFerias(pedidoId: number): Promise<void> {
    await this.simulateNetworkDelay();
    
    const data = this.getData();
    const filteredData = data.filter(p => p.Id !== pedidoId);
    
    if (filteredData.length === data.length) {
      throw new Error(`Pedido com ID ${pedidoId} não encontrado`);
    }
    
  this.saveData(filteredData);
  console.log('MockDataService: Pedido', pedidoId, 'removido');
  }

  /**
   * Reseta dados para o estado inicial
   */
  public static resetToDefault(): void {
    this.saveData([...MOCK_PEDIDOS]);
  console.log('MockDataService: Dados resetados para o padrão');
  }

  /**
   * Verifica se está no modo de demonstração
   */
  public static isDemoMode(): boolean {
    return true; // Sempre verdadeiro para dados de exemplo
  }
}