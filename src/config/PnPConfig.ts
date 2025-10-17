// Configurações de segurança e performance para PnP JS
export const PnPConfig = {
  // Configurações de timeout
  timeout: {
    default: 30000, // 30 segundos
    longRunning: 60000, // 1 minuto para operações longas
    upload: 120000 // 2 minutos para uploads
  },

  // Configurações de retry
  retry: {
    maxAttempts: 3,
    delay: 1000, // 1 segundo entre tentativas
    backoffMultiplier: 2
  },

  // Configurações de cache
  cache: {
    enabled: true,
    defaultExpiration: 300000, // 5 minutos
    maxSize: 100 // máximo de 100 itens no cache
  },

  // Configurações de logging
  logging: {
    enabled: true,
    level: 'Warning', // Error, Warning, Info, Verbose
    includeStackTrace: false
  },

  // Configurações de segurança
  security: {
    // Validação de permissões antes de operações críticas
    validatePermissions: true,
    
    // Lista de operações que requerem confirmação
    requireConfirmation: [
      'delete',
      'update',
      'create'
    ],

    // Máximo de itens por consulta (previne consultas muito grandes)
    maxItemsPerQuery: 5000,

    // Campos sensíveis que não devem ser logados
    sensitiveFields: [
      'Password',
      'Token',
      'Key',
      'Secret',
      'Credential'
    ]
  },

  // Configurações de performance
  performance: {
    // Usar select para limitar campos retornados
    useSelectByDefault: true,
    
    // Campos padrão para seleção em listas
    defaultSelectFields: [
      'Id',
      'Title',
      'Created',
      'Modified',
      'Author/Title',
      'Editor/Title'
    ],

    // Usar paginação automática para consultas grandes
    enableAutoPaging: true,
    pageSize: 100
  },

  // Configurações de tipos de lista comuns
  listTypes: {
    // Templates de lista comuns no SharePoint
    genericList: 100,
    documentLibrary: 101,
    survey: 102,
    announcements: 104,
    contacts: 105,
    events: 106,
    tasks: 107,
    discussionBoard: 108,
    pictureLibrary: 109,
    links: 103,
    customList: 100
  },

  // Configurações de campos comuns
  commonFields: {
    // Campos internos do SharePoint que sempre existem
    system: [
      'Id',
      'Title',
      'Created',
      'Modified',
      'Author',
      'Editor',
      'ContentType',
      'Version'
    ],

    // Campos de metadados úteis
    metadata: [
      'FileSystemObjectType',
      'ServerRedirectedEmbedUri',
      'ServerRedirectedEmbedUrl',
      'ContentTypeId',
      'ComplianceAssetId'
    ]
  },

  // Mensagens de erro padronizadas
  errorMessages: {
    unauthorized: 'Você não tem permissão para realizar esta operação.',
    notFound: 'O item solicitado não foi encontrado.',
    timeout: 'A operação demorou muito para ser concluída. Tente novamente.',
    networkError: 'Erro de conexão. Verifique sua conexão com a internet.',
    serverError: 'Erro interno do servidor. Tente novamente mais tarde.',
    invalidData: 'Os dados fornecidos são inválidos.',
    quotaExceeded: 'Limite de armazenamento ou quota excedido.',
    generic: 'Ocorreu um erro inesperado. Tente novamente ou contate o suporte.'
  }
};

// Tipos TypeScript para melhor type safety
export interface IPnPError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface IPnPOperation {
  type: 'create' | 'read' | 'update' | 'delete';
  target: string;
  data?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export interface IPnPResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: IPnPError;
  operation: IPnPOperation;
}

// Utilitários de validação
export const PnPValidators = {
  // Valida se uma string é um GUID válido
  isValidGuid: (guid: string): boolean => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  },

  // Valida se um campo contém informações sensíveis
  isSensitiveField: (fieldName: string): boolean => {
    return PnPConfig.security.sensitiveFields.some(sensitive => 
      fieldName.toLowerCase().includes(sensitive.toLowerCase())
    );
  },

  // Valida se o tamanho da consulta está dentro dos limites
  isQuerySizeValid: (itemCount: number): boolean => {
    return itemCount <= PnPConfig.security.maxItemsPerQuery;
  },

  // Valida URL do SharePoint
  isValidSharePointUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('sharepoint.com') || 
             urlObj.hostname.includes('.sharepoint.') ||
             urlObj.hostname.includes('officeapps.live.com');
    } catch {
      return false;
    }
  }
};

export default PnPConfig;