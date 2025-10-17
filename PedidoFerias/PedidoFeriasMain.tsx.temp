import * as React from 'react';
import { Stack, Text } from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import PedidoFeriasList from './PedidoFeriasList';

export interface IPedidoFeriasMainProps {
  context: WebPartContext;
  title?: string;
  listTitle?: string;
  showFilters?: boolean;
  pageSize?: number;
}

const PedidoFeriasMain: React.FC<IPedidoFeriasMainProps> = ({
  context,
  title,
  listTitle = "Pedidos de Férias",
  showFilters = true,
  pageSize = 20
}) => {
  return (
    <Stack tokens={{ childrenGap: 16 }}>
      {/* Título do Web Part */}
      {title && (
        <Text variant="xxLarge" styles={{ root: { fontWeight: 'bold', color: '#323130' } }}>
          {title}
        </Text>
      )}
      
      {/* Componente principal de listagem */}
      <PedidoFeriasList
        context={context}
        listTitle={listTitle}
        showFilters={showFilters}
        pageSize={pageSize}
      />
    </Stack>
  );
};

export default PedidoFeriasMain;