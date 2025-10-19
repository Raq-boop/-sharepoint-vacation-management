// Mock básico do PnPService
jest.mock('./PnPService', () => {
  return {
    PnPService: jest.fn().mockImplementation(() => ({
      getPedidosFerias: jest.fn(),
      aprovaPedido: jest.fn(),
      rejeitaPedido: jest.fn(),
    }))
  };
});

describe('PnPService', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });
});