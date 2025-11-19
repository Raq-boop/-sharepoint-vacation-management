# 🎭 Modo de Demonstração - Sistema de Pedidos de Férias

## Visão Geral

O sistema possui um **modo de demonstração inteligente** que ativa automaticamente quando não há conexão disponível com o SharePoint, permitindo que todas as funcionalidades sejam testadas e demonstradas usando dados de exemplo.

## Funcionalidades do Modo Demo

### Funcionalidades Completas
- Criar novos pedidos de férias
- Visualizar lista completa de pedidos
- Aprovar pedidos pendentes
- Rejeitar pedidos com motivo
- Reverter status (Aprovado/Rejeitado → Pendente)
- Filtrar e pesquisar pedidos
- Dashboard com métricas

### 🎭 **Dados de Exemplo Inclusos**
- **5 pedidos pré-configurados** com diferentes estados
- **Colaboradores diversos** (João Silva, Maria Santos, Pedro Costa, Ana Lima, Roberto Oliveira)
- **Estados variados**: Pendente, Aprovado, Rejeitado
- **Datas realistas** para demonstração
- **Dados persistentes** via localStorage durante a sessão

## Como Funciona

### Ativação Automática
O modo demonstração ativa automaticamente quando:
- Não há conexão com SharePoint disponível
- Ocorrem erros de rede ou timeout
- Lista SharePoint não está acessível
- Ambiente de desenvolvimento local

### 🎨 **Interface Visual**
- **Banner laranja** no topo indicando modo demonstração
- **Mensagens claras** sobre o estado dos dados
- **Avisos informativos** sobre persistência
- **Funcionalidades mantidas** integralmente

### 💾 **Persistência Local**
- Dados salvos no **localStorage** do navegador
- Alterações **mantidas durante a sessão**
- **Reset automático** ao recarregar a página
- **Dados seguros** - não impactam produção

## 📱 Casos de Uso

### 🎓 **Treinamento**
- Treinar usuários sem impacto em dados reais
- Demonstrar fluxos completos de aprovação
- Simular cenários diversos de uso
- Ensinar funcionalidades avançadas

### 💼 **Apresentações**
- Demonstrações para stakeholders
- Apresentações comerciais
- Validação de requisitos
- Showcase de funcionalidades

### 🔧 **Desenvolvimento**
- Desenvolvimento local sem SharePoint
- Testes de interface e UX
- Validação de lógica de negócio
- Debug e troubleshooting

### Testes
- Testes de aceitação do usuário
- Validação de workflows
- Testes de performance da interface
- Verificação de responsividade

## Dados de Exemplo

### 👥 **Colaboradores**
| Nome | Email | Status Exemplo |
|------|-------|----------------|
| João Silva | joao.silva@empresa.com | Pedido Pendente |
| Maria Santos | maria.santos@empresa.com | Pedido Aprovado |
| Pedro Costa | pedro.costa@empresa.com | Pedido Rejeitado |
| Ana Lima | ana.lima@empresa.com | Pedido Aprovado |
| Roberto Oliveira | roberto.oliveira@empresa.com | Pedido Pendente |

### Cenários de Teste
- **Aprovação**: Teste do fluxo de aprovação completo
- **Rejeição**: Teste com motivos de rejeição
- **Reversão**: Teste de mudança de status
- **Filtros**: Teste de pesquisa e filtros
- **Validações**: Teste de regras de negócio

## Como Sair do Modo Demo

### 🌐 **Conexão com SharePoint**
- Configurar ambiente SharePoint corretamente
- Verificar permissões de acesso
- Validar configuração de listas
- Testar conectividade de rede

### Desenvolvimento
- Configurar SPFx workbench corretamente
- Usar `gulp serve` em ambiente com SharePoint
- Verificar configurações do manifesto
- Validar contexto do web part

## Limitações do Modo Demo

- **Dados temporários**: Perdidos ao recarregar página
- **Sem persistência real**: Não salva no SharePoint
- **Ambiente isolado**: Não afeta dados de produção
- **Funcionalidades limitadas**: Algumas integrações avançadas podem não funcionar

## Configuração Técnica

### Arquivos Envolvidos
- `MockDataService.ts` - Serviço de dados de exemplo
- `PnPService.ts` - Detecção e fallback automático
- `PedidoFerias.tsx` - Interface com banner de aviso
- `PedidoFerias.module.scss` - Estilos do modo demo

### Detecção de Erro
```typescript
// Erros que ativam modo demo:
- Network errors
- Connection timeouts
- CORS errors
- Failed to fetch
- SharePoint unavailable
```

### 💾 **Persistência**
```typescript
// LocalStorage key
const STORAGE_KEY = 'mockPedidosFerias';

// Dados mantidos durante sessão
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
```

## Vantagens do Sistema

### Para Desenvolvedores
- Desenvolvimento offline completo
- Testes rápidos sem infraestrutura
- Debug facilitado
- Prototipagem ágil

### Para Usuários
- Experiência consistente
- Treinamento seguro
- Demonstrações realistas
- Feedback imediato

### Para Negócio
- Apresentações profissionais
- Validação de requisitos
- Redução de riscos
- Acelerar aprovações

