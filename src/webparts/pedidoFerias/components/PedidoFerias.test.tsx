// Mock das dependências do PnP
jest.mock('../../../services/PnPService', () => {
  return {
    PnPService: jest.fn().mockImplementation(() => ({
      getPedidosFerias: jest.fn().mockResolvedValue([]),
      aprovaPedido: jest.fn(),
      rejeitaPedido: jest.fn(),
    }))
  };
});

// Mock do módulo styles
jest.mock('./PedidoFerias.module.scss', () => ({
  pedidoFerias: 'pedidoFerias',
  container: 'container',
}));

// Mock dos modelos
jest.mock('../../../models/IPedidoFerias', () => ({
  EstadoPedido: {
    Pendente: 'Pendente',
    Aprovado: 'Aprovado',
    Rejeitado: 'Rejeitado'
  }
}));

// Mock das dependências do Fluent UI
jest.mock('@fluentui/react/lib/Spinner', () => ({
  Spinner: ({ label }: { label: string }) => <div>{label}</div>,
  SpinnerSize: { large: 'large' }
}));

jest.mock('@fluentui/react/lib/MessageBar', () => ({
  MessageBar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  MessageBarType: { error: 'error', warning: 'warning', success: 'success' }
}));

jest.mock('@fluentui/react/lib/Button', () => ({
  DefaultButton: ({ children, text }: { children?: React.ReactNode, text?: string }) => <button>{children || text}</button>,
  PrimaryButton: ({ children, text }: { children?: React.ReactNode, text?: string }) => <button>{children || text}</button>
}));

jest.mock('@fluentui/react/lib/Dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogType: { normal: 'normal' },
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@fluentui/react/lib/TextField', () => ({
  TextField: () => <input />
}));

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PedidoFerias from './PedidoFerias';
import { IPedidoFeriasProps } from './IPedidoFeriasProps';

describe('PedidoFerias Component', () => {
  const defaultProps: IPedidoFeriasProps = {
    description: 'Test Description',
    isDarkTheme: false,
    environmentMessage: 'Test Environment',
    hasTeamsContext: false,
    userDisplayName: 'Test User',
    context: {} as never
  };

  it('should render component', () => {
    render(<PedidoFerias {...defaultProps} />);
    expect(screen.getByText('Carregando pedidos de férias...')).toBeInTheDocument();
  });
});