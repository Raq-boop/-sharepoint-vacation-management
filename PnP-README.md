# PnP JS - Configuração Segura e Compatível

Este projeto está configurado para usar PnP JS de forma segura e compatível com SPFx 1.21.1.

## 📦 Pacotes Instalados

- `@pnp/sp`: ^4.16.0 - Biblioteca principal para operações SharePoint
- `@pnp/core`: Funcionalidades centrais do PnP
- `@pnp/queryable`: Sistema de consultas
- `@pnp/logging`: Sistema de logging
- `@types/node`: Tipos TypeScript para Node.js

## 🏗️ Estrutura do Projeto

```
src/
├── services/
│   └── PnPService.ts          # Serviço principal PnP
├── hooks/
│   └── usePnP.ts             # Hook React para PnP
├── config/
│   └── PnPConfig.ts          # Configurações de segurança
└── webparts/
    └── pedidoFerias/
        └── components/
            ├── PnPExample.tsx # Exemplo de uso
            └── IPedidoFeriasProps.ts
```

## 🔧 Como Usar

### 1. Em um Componente React

```typescript
import { usePnP } from '../../../hooks/usePnP';

const MyComponent: React.FC<IProps> = (props) => {
  const {
    isLoading,
    error,
    getLists,
    getListItems,
    createListItem
  } = usePnP(props.context);

  // Carregar listas
  const handleLoadLists = async () => {
    const lists = await getLists();
    console.log(lists);
  };

  // Carregar itens de uma lista
  const handleLoadItems = async () => {
    const items = await getListItems(
      'NomeDaLista',
      ['Id', 'Title', 'Created'], // campos a selecionar
      'Id gt 0', // filtro OData
      10 // quantidade máxima
    );
    console.log(items);
  };

  return (
    <div>
      {isLoading && <div>Carregando...</div>}
      {error && <div>Erro: {error}</div>}
      <button onClick={handleLoadLists}>Carregar Listas</button>
    </div>
  );
};
```

### 2. Usando o Serviço Diretamente

```typescript
import PnPService from '../services/PnPService';

// No componente ou método
const pnpService = new PnPService(this.context);

// Operação segura com tratamento de erro
const result = await pnpService.executeWithErrorHandling(
  async () => {
    return await pnpService.web.lists.getByTitle('MinhaLista').items();
  },
  'Erro ao carregar itens'
);
```

## 🛡️ Recursos de Segurança

### ✅ Tratamento de Erros
- Todos os métodos têm tratamento de erro incorporado
- Logging automático de erros
- Mensagens de erro padronizadas

### ✅ Validação de Dados
- Validação de GUIDs
- Verificação de campos sensíveis
- Validação de tamanho de consultas

### ✅ Performance
- Seleção automática de campos essenciais
- Paginação automática para consultas grandes
- Cache opcional para operações frequentes

### ✅ Logging Controlado
- Níveis de log configuráveis
- Exclusão automática de dados sensíveis
- Timestamps em todas as operações

## 📋 Operações Disponíveis

### Listas
```typescript
// Obter todas as listas
const lists = await getLists();

// Obter lista específica
const list = pnpService.getListByTitle('NomeDaLista');
```

### Itens de Lista
```typescript
// Obter itens com opções
const items = await getListItems(
  'NomeDaLista',
  ['Id', 'Title', 'Created'], // select
  'Status eq "Ativo"',        // filter
  50                          // top
);

// Criar item
const newItem = await createListItem('NomeDaLista', {
  Title: 'Novo Item',
  Description: 'Descrição do item'
});

// Atualizar item
const updated = await updateListItem('NomeDaLista', 1, {
  Title: 'Título Atualizado'
});

// Deletar item
const deleted = await deleteListItem('NomeDaLista', 1);
```

### Usuário e Contexto
```typescript
// Usuário atual
const user = await getCurrentUser();

// Informações da web
const webInfo = await getCurrentWebInfo();

// Verificar permissões
const permissions = await pnpService.checkUserPermissions('NomeDaLista');
```

## ⚙️ Configurações

### Timeouts
- Padrão: 30 segundos
- Operações longas: 60 segundos
- Uploads: 120 segundos

### Retry
- Máximo 3 tentativas
- Delay de 1 segundo entre tentativas
- Backoff exponencial

### Segurança
- Máximo 5000 itens por consulta
- Validação automática de permissões
- Campos sensíveis protegidos

## 🚨 Boas Práticas

### ❌ Evite
```typescript
// Não fazer consultas muito amplas
const allItems = await web.lists.getByTitle('Lista').items();

// Não usar any
const data: any = await operation();

// Não ignorar erros
const result = await operation(); // sem tratamento de erro
```

### ✅ Prefira
```typescript
// Usar seleção específica
const items = await getListItems('Lista', ['Id', 'Title'], 'Id gt 0', 100);

// Usar tipos específicos
const data: IListItem[] = await getListItems('Lista');

// Sempre tratar erros
const result = await executeWithErrorHandling(async () => {
  return await operation();
}, 'Erro na operação');
```

## 🔍 Debug e Monitoramento

### Logging
```typescript
import { Logger, LogLevel } from "@pnp/logging";

// Log manual
Logger.write('Minha mensagem', LogLevel.Info);
```

### Console do Navegador
- Todos os erros são logados no console
- Use F12 > Console para ver detalhes
- Filtros disponíveis por nível de log

## 📊 Monitoramento de Performance

### Métricas Automáticas
- Tempo de execução das operações
- Contagem de tentativas de retry
- Tamanho das consultas

### Otimizações
- Use `select` para limitar campos
- Use `filter` para reduzir resultados
- Use `top` para paginar grandes datasets

## 🆘 Solução de Problemas

### Erro: "Cannot find name 'require'"
✅ **Resolvido**: Tipos Node.js instalados e configurados no `tsconfig.json`

### Erro: "Unauthorized"
- Verifique permissões do usuário na lista/site
- Confirme se o contexto SPFx está correto

### Erro: "Timeout"
- Verifique conexão de rede
- Considere aumentar timeout para operações específicas

### Erro: "Too many items"
- Use paginação com `top`
- Implemente filtros mais específicos

## 🔄 Atualizações

Para manter o ambiente atualizado:

```bash
# Verificar versões
npm outdated

# Atualizar PnP (cuidado com breaking changes)
npm update @pnp/sp @pnp/core @pnp/queryable @pnp/logging

# Sempre testar após atualizações
npm run build
```

## 📞 Suporte

- Documentação oficial: [PnP JS Documentation](https://pnp.github.io/pnpjs/)
- Exemplos: [PnP Samples](https://github.com/pnp/pnpjs-samples)
- Issues: [GitHub Issues](https://github.com/pnp/pnpjs/issues)

---

**Versão**: 1.0.0  
**Compatibilidade**: SPFx 1.21.1, PnP JS 4.16.0  
**Última atualização**: Outubro 2025