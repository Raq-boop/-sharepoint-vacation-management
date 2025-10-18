# 🏖️ Sistema de Pedidos de Férias - SPFx WebPart

## 📋 Resumo

WebPart avançada desenvolvida com **SharePoint Framework (SPFx)** para gerenciamento completo de pedidos de férias corporativos. Integra **Microsoft Graph API** para exibição de fotos dos colaboradores, **Fluent UI** para interface moderna e **PnP JS** para operações SharePoint. Permite criar, visualizar, filtrar e aprovar/rejeitar solicitações de férias diretamente no SharePoint Online.

![Interface do Sistema](https://img.shields.io/badge/Interface-Moderna-blue.svg)

## 🚀 Versão SharePoint Framework Utilizada

![version](https://img.shields.io/badge/SPFx-1.21.1-green.svg)
![react](https://img.shields.io/badge/React-17.0.1-blue.svg)
![typescript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)
![node](https://img.shields.io/badge/Node.js-22.20.0-green.svg)

## 🎯 Aplicação

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Obtenha seu próprio tenant de desenvolvimento gratuito participando do [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## 🛠️ Pré-requisitos

### **Ambiente de Desenvolvimento**
- Node.js v22.20.0 (LTS)
- SharePoint Framework development tools
- Microsoft 365 Developer Tenant
- Permissões para criar e editar listas no SharePoint Online
- Acesso ao Microsoft Graph API (para fotos dos usuários)

## 📊 Solução

| Solução                    | Autor(es)                                    |
| -------------------------- | -------------------------------------------- |
| spfx-pedidos-ferias        | **Raquel Sampaio** - Especialista SPFx/React |

## 📈 Histórico de Versões

| Versão | Data       | Comentários                                          |
|--------|------------|------------------------------------------------------|
| 1.0.0  | 18/10/2025 | ✅ Interface completa + Graph API + Dados simulados |
| 0.9.0  | 17/10/2025 | 🎨 Componentes React + TypeScript                   |
| 0.8.0  | 16/10/2025 | 🏗️ Estrutura base SPFx + Fluent UI                  |

## ⚖️ Aviso Legal

**ESTE CÓDIGO É FORNECIDO "NO ESTADO EM QUE SE ENCONTRA", SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU IMPLÍCITA.**

---

## ⚡ Caminho Mínimo para Execução

```bash
# 1. Clone o repositório
git clone https://github.com/Raq-boop/spfx-pedidos-ferias.git
cd spfx-pedidos-ferias

# 2. Instale as dependências
npm install

# 3. Execute o build
gulp build

# 4. Inicie o servidor de desenvolvimento
gulp serve --nobrowser

# 5. Acesse o Workbench SharePoint
# https://[seu-tenant].sharepoint.com/_layouts/15/workbench.aspx
```

> Inclua etapas adicionais conforme necessário, como configuração de permissões para Microsoft Graph ou criação da lista "PedidoFerias" no SharePoint.

## 🎯 Funcionalidades

### ✅ **Implementadas**
- 📝 **Listagem Completa**: Visualização de pedidos com dados simulados realistas
- 🔍 **Filtros Avançados**: Busca por texto livre e filtro por estado em tempo real
- 👤 **Fotos de Usuários**: Integração Microsoft Graph API com cache inteligente
- 🎨 **Interface Moderna**: Fluent UI Design nativo Microsoft 365
- 📱 **Design Responsivo**: Otimizado para desktop, tablet e mobile
- ⚡ **Performance**: Cache de fotos e lazy loading implementados
- 🎯 **Estados Dinâmicos**: Pendente, Aprovado, Rejeitado, Cancelado
- 📅 **Formatação Brasileira**: Datas no padrão DD/MM/AAAA

### 🔄 **Funcionalidades Planejadas**
- Integração real com SharePoint Lists via PnP JS
- Formulário de criação de pedidos com validações
- Sistema de aprovação/rejeição com workflow
- Dashboard com estatísticas e métricas
- Notificações por email/Teams
- Relatórios exportáveis

## 🏗️ Como Funciona

### **Versão Atual (v1.0)**
1. 🎭 **Dados Simulados**: Sistema carrega dados de demonstração com 3 colaboradores
2. 🔍 **Filtros Dinâmicos**: Busca textual case-insensitive e filtro por estado
3. 📸 **Graph API**: Busca automática de fotos via Microsoft Graph
4. 💾 **Cache Inteligente**: Armazena fotos em Map para otimizar performance
5. 🎨 **Interface Responsiva**: Adapta-se automaticamente a diferentes dispositivos

### **Fluxo Técnico**
```
Componente UserPhoto → GraphPhotoService → Microsoft Graph API
                                       ↓
                                   Cache Map ← Data URL/Blob
                                       ↓
                               Fluent UI Persona
```

### **Sistema de Filtros**
```
SearchBox Input → useState → useMemo → Filtered Array → Re-render
Dropdown State  →         →        →                →
```

## 📋 Observações

### **Dados de Demonstração**
- Sistema inclui **3 colaboradores simulados** com emails @hnlcompany.onmicrosoft.com
- **Estados variados**: Pendente, Aprovado, Rejeitado para demonstrar diferentes cenários
- **Períodos realistas** de férias com cálculo automático de dias
- **Fotos reais** buscadas via Microsoft Graph API quando disponível

### **Microsoft Graph Integration**
- Busca automática de fotos via endpoint `/users/{email}/photo/$value`
- Cache em memória usando Map para otimizar performance
- Fallback graceful para iniciais do nome quando foto não disponível
- Tratamento robusto de erros e permissões

### **Requisitos Futuros SharePoint**
- Lista "PedidoFerias" com campos: Title, Colaborador (Person), DataInicio (DateTime), DataFim (DateTime), DiasTotal (Number), Estado (Choice), Motivo (Text)
- Campo "Colaborador" deve ser do tipo "Pessoa ou Grupo"
- Permissões adequadas para criar/editar itens na lista

## 🔧 Conceitos Técnicos Demonstrados

### **Frontend Moderno**
- ⚛️ **React Hooks**: useState, useEffect, useMemo para gerenciamento de estado
- 📘 **TypeScript Avançado**: Interfaces rigorosas, enums, generic types
- 🎨 **Fluent UI**: Componentes oficiais do design system Microsoft
- 📱 **Responsive Design**: Mobile-first approach com breakpoints

### **Integração Microsoft 365**
- 🔌 **SharePoint Framework**: WebParts nativos no ecossistema M365
- 📊 **Microsoft Graph**: API oficial para dados e recursos M365
- 🏗️ **PnP JS**: Biblioteca recomendada para operações SharePoint
- 🎯 **Fluent UI**: Consistência visual com demais produtos Microsoft

### **Padrões de Desenvolvimento**
- 🏗️ **Component Architecture**: Separação clara de responsabilidades
- 🔄 **State Management**: React Hooks pattern sem Redux
- 🛡️ **Error Handling**: Try/catch sistemático com fallbacks
- ⚡ **Performance**: Cache inteligente e otimizações de renderização
- ♿ **Accessibility**: ARIA labels e navegação por teclado
- 📖 **Documentation**: JSDoc completa em todos os métodos

## 📚 Referências

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

---

*🚀 Sistema desenvolvido seguindo as **melhores práticas da indústria** para **SharePoint Framework** e **Microsoft 365**.*

## Features

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- topic 1
- topic 2
- topic 3

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
