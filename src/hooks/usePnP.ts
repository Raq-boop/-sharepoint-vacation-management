import { useEffect, useState, useCallback } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import PnPService from '../services/PnPService';

// Interface para o estado de loading
interface LoadingState {
  isLoading: boolean;
  error: string | undefined;
}

// Hook personalizado para usar PnP de forma segura
export const usePnP = (context: WebPartContext): {
  pnpService: PnPService | undefined;
  isLoading: boolean;
  error: string | undefined;
  getLists: () => Promise<unknown[] | undefined>;
  getListItems: (listTitle: string, select?: string[], filter?: string, top?: number) => Promise<unknown[] | undefined>;
  createListItem: (listTitle: string, itemData: Record<string, unknown>) => Promise<unknown>;
  updateListItem: (listTitle: string, itemId: number, itemData: Record<string, unknown>) => Promise<unknown>;
  deleteListItem: (listTitle: string, itemId: number) => Promise<boolean | undefined>;
  getCurrentUser: () => Promise<unknown>;
  getCurrentWebInfo: () => Promise<unknown>;
  executeOperation: <T>(operation: () => Promise<T>, errorMessage?: string) => Promise<T | undefined>;
} => {
  const [pnpService, setPnpService] = useState<PnPService | undefined>(undefined);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: undefined
  });

  // Inicializa o serviço PnP
  useEffect(() => {
    if (context) {
      const service = new PnPService(context);
      setPnpService(service);
    }
  }, [context]);

  // Função auxiliar para executar operações com estado de loading
  const executeOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string = "Erro na operação"
  ): Promise<T | undefined> => {
    if (!pnpService) {
      console.warn('PnPService não foi inicializado');
      return undefined;
    }

    setLoadingState({ isLoading: true, error: undefined });
    
    try {
      const result = await operation();
      setLoadingState({ isLoading: false, error: undefined });
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setLoadingState({ isLoading: false, error: `${errorMessage}: ${errorMsg}` });
      console.error(errorMessage, error);
      return undefined;
    }
  }, [pnpService]);

  // Método para obter listas
  const getLists = useCallback(async () => {
    return executeOperation(
      async () => pnpService?.getLists() || [],
      "Erro ao carregar listas"
    );
  }, [executeOperation, pnpService]);

  // Método para obter itens de lista
  const getListItems = useCallback(async (
    listTitle: string,
    select?: string[],
    filter?: string,
    top?: number
  ) => {
    return executeOperation(
      async () => pnpService?.getListItems(listTitle, select, filter, top) || [],
      `Erro ao carregar itens da lista ${listTitle}`
    );
  }, [executeOperation, pnpService]);

  // Método para criar item
  const createListItem = useCallback(async (listTitle: string, itemData: Record<string, unknown>) => {
    return executeOperation(
      async () => pnpService?.createListItem(listTitle, itemData),
      `Erro ao criar item na lista ${listTitle}`
    );
  }, [executeOperation, pnpService]);

  // Método para atualizar item
  const updateListItem = useCallback(async (listTitle: string, itemId: number, itemData: Record<string, unknown>) => {
    return executeOperation(
      async () => pnpService?.updateListItem(listTitle, itemId, itemData),
      `Erro ao atualizar item na lista ${listTitle}`
    );
  }, [executeOperation, pnpService]);

  // Método para deletar item
  const deleteListItem = useCallback(async (listTitle: string, itemId: number) => {
    return executeOperation(
      async () => pnpService?.deleteListItem(listTitle, itemId),
      `Erro ao deletar item da lista ${listTitle}`
    );
  }, [executeOperation, pnpService]);

  // Método para obter usuário atual
  const getCurrentUser = useCallback(async () => {
    return executeOperation(
      async () => pnpService?.getCurrentUser(),
      "Erro ao obter usuário atual"
    );
  }, [executeOperation, pnpService]);

  // Método para obter informações da web
  const getCurrentWebInfo = useCallback(async () => {
    return executeOperation(
      async () => pnpService?.getCurrentWebInfo(),
      "Erro ao obter informações da web"
    );
  }, [executeOperation, pnpService]);

  return {
    pnpService,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    getLists,
    getListItems,
    createListItem,
    updateListItem,
    deleteListItem,
    getCurrentUser,
    getCurrentWebInfo,
    executeOperation
  };
};

export default usePnP;