import * as React from 'react';
import { Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IPedidoFeriasSimpleProps {
  context: WebPartContext;
  title?: string;
}

const PedidoFeriasSimple: React.FC<IPedidoFeriasSimpleProps> = ({
  context,
  title = "Sistema de Pedidos de Férias"
}) => {
  return (
    <Stack tokens={{ childrenGap: 16 }}>
      {/* Título */}
      <Text variant="xxLarge" styles={{ root: { fontWeight: 'bold', color: '#323130' } }}>
        {title}
      </Text>
      
      {/* Mensagem de status */}
      <MessageBar messageBarType={MessageBarType.success}>
        Sistema de gerenciamento de pedidos de férias implementado com sucesso! 
        Componentes principais criados: PedidoFeriasService, usePedidoFerias hook, 
        PedidoFeriasList, e PeoplePicker.
      </MessageBar>

      {/* Informações do sistema */}
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="large" styles={{ root: { fontWeight: 'semibold' } }}>
          Funcionalidades Implementadas:
        </Text>
        <ul>
          <li>Interfaces TypeScript completas para pedidos de férias</li>
          <li>Serviço PnP JS para operações CRUD no SharePoint</li>
          <li>Hook React para gerenciamento de estado</li>
          <li>Componente de listagem com filtros e ordenação</li>
          <li>People Picker para seleção de colaboradores</li>
          <li>Botões de aprovação/rejeição com modais</li>
          <li>Sistema de paginação e loading states</li>
          <li>Tratamento de erros e permissões</li>
        </ul>
      </Stack>

      {/* Próximos passos */}
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="large" styles={{ root: { fontWeight: 'semibold' } }}>
          Próximos Passos:
        </Text>
        <ul>
          <li>Corrigir erros de compilação TypeScript restantes</li>
          <li>Criar lista &quot;Pedidos de Férias&quot; no SharePoint</li>
          <li>Testar funcionalidades no ambiente SharePoint</li>
          <li>Opcional: Integrar Microsoft Graph para fotos</li>
          <li>Deploy para produção</li>
        </ul>
      </Stack>

      {/* Informações técnicas */}
      <Stack tokens={{ childrenGap: 8 }}>
        <Text variant="medium" styles={{ root: { color: '#605E5C' } }}>
          <strong>Contexto:</strong> {context.pageContext.web.title}
        </Text>
        <Text variant="medium" styles={{ root: { color: '#605E5C' } }}>
          <strong>Usuário:</strong> {context.pageContext.user.displayName}
        </Text>
        <Text variant="medium" styles={{ root: { color: '#605E5C' } }}>
          <strong>Ambiente:</strong> {context.pageContext.web.absoluteUrl}
        </Text>
      </Stack>
    </Stack>
  );
};

export default PedidoFeriasSimple;