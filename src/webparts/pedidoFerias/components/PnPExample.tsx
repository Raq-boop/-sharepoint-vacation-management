import * as React from 'react';
import { useState, useEffect } from 'react';
import { IPedidoFeriasProps } from './IPedidoFeriasProps';
import { usePnP } from '../../../hooks/usePnP';
import {
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize
} from '@fluentui/react';

const PnPExample: React.FC<IPedidoFeriasProps> = (props) => {
  const {
    pnpService,
    isLoading,
    error,
    getLists,
    getCurrentUser,
    getCurrentWebInfo
  } = usePnP(props.context);

  const [lists, setLists] = useState<unknown[]>([]);
  const [currentUser, setCurrentUser] = useState<unknown>(null);
  const [webInfo, setWebInfo] = useState<unknown>(null);

  // Carrega informações iniciais
  useEffect(() => {
    if (pnpService) {
      void loadInitialData();
    }
  }, [pnpService]);

  const loadInitialData = async (): Promise<void> => {
    try {
      // Carrega informações básicas em paralelo
      const [userInfo, webData] = await Promise.all([
        getCurrentUser(),
        getCurrentWebInfo()
      ]);

      setCurrentUser(userInfo);
      setWebInfo(webData);
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
    }
  };

  const handleLoadLists = async (): Promise<void> => {
    const listsData = await getLists();
    if (listsData) {
      setLists(listsData);
    }
  };

  const handleClearData = (): void => {
    setLists([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Exemplo PnP JS - Ambiente Seguro</h2>
      
      {error && (
        <MessageBar messageBarType={MessageBarType.error} dismissButtonAriaLabel="Fechar">
          {error}
        </MessageBar>
      )}

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spinner size={SpinnerSize.large} label="Carregando dados..." />
        </div>
      )}

      {/* Informações do usuário e web */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h3>Informações do Contexto</h3>
        {currentUser && (
          <div>
            <strong>Usuário:</strong> {JSON.stringify(currentUser, null, 2)}
          </div>
        )}
        {webInfo && (
          <div>
            <strong>Site:</strong> {JSON.stringify(webInfo, null, 2)}
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div style={{ marginBottom: '20px' }}>
        <PrimaryButton
          text="Carregar Listas"
          onClick={handleLoadLists}
          disabled={isLoading}
          style={{ marginRight: '10px' }}
        />
        <DefaultButton
          text="Limpar Dados"
          onClick={handleClearData}
          disabled={isLoading}
        />
      </div>

      {/* Lista de listas */}
      {lists.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Listas do Site ({lists.length})</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            <pre>{JSON.stringify(lists, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Informações de desenvolvimento */}
      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <h4>Status da Configuração PnP:</h4>
        <ul>
          <li>✅ PnP Service inicializado: {pnpService ? 'Sim' : 'Não'}</li>
          <li>✅ Contexto SPFx: {props.context ? 'Configurado' : 'Não configurado'}</li>
          <li>✅ Logging configurado: Sim (nível Warning)</li>
          <li>✅ Tratamento de erros: Implementado</li>
          <li>✅ Estados de loading: Implementado</li>
        </ul>
      </div>
    </div>
  );
};

export default PnPExample;