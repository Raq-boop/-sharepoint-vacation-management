# 🚀 Guia Completo - Criação da Lista SharePoint para Sistema de Pedidos de Férias

## 📋 Opção 1: Script Automático (Recomendado)

### Pré-requisitos:
1. **PowerShell 5.1 ou superior**
2. **Módulo PnP PowerShell instalado:**
   ```powershell
   Install-Module PnP.PowerShell -Force -AllowClobber
   ```
3. **Permissões de administrador** no site SharePoint

### Como executar:
1. Abra **PowerShell como Administrador**
2. Navegue até a pasta do projeto:
   ```powershell
   cd "C:\Ferias"
   ```
3. Execute o script:
   ```powershell
   .\CriarListaPedidosFerias.ps1 -SiteUrl "https://seudominio.sharepoint.com/sites/seusite"
   ```
4. Siga as instruções na tela
5. Escolha se deseja adicionar dados de teste

### O que o script faz:
- ✅ Cria a lista "Pedidos de Férias"
- ✅ Adiciona todas as colunas necessárias
- ✅ Configura tipos de dados corretos  
- ✅ Define valores padrão
- ✅ Adiciona dados de teste (opcional)
- ✅ Configura visualizações

---

## 📋 Opção 2: Criação Manual

### Passo 1: Criar Lista
1. Acesse seu site SharePoint
2. Vá em **Configurações ⚙️ → Conteúdo do Site**
3. Clique em **+ Novo → Lista**
4. Escolha **Lista em branco**
5. Nome: **"Pedidos de Férias"**

### Passo 2: Adicionar Colunas

#### Coluna: Colaborador
- **Tipo:** Pessoa ou Grupo
- **Nome:** Colaborador
- **Obrigatório:** Sim
- **Permitir seleção múltipla:** Não

#### Coluna: Data Início  
- **Tipo:** Data e Hora
- **Nome:** Data Início
- **Obrigatório:** Sim
- **Formato:** Data apenas

#### Coluna: Data Fim
- **Tipo:** Data e Hora  
- **Nome:** Data Fim
- **Obrigatório:** Sim
- **Formato:** Data apenas

#### Coluna: Dias Total
- **Tipo:** Número
- **Nome:** Dias Total
- **Obrigatório:** Sim
- **Decimais:** 0
- **Mín:** 1, **Máx:** 365

#### Coluna: Motivo
- **Tipo:** Várias linhas de texto
- **Nome:** Motivo
- **Obrigatório:** Não
- **Linhas:** 3

#### Coluna: Estado
- **Tipo:** Escolha
- **Nome:** Estado  
- **Obrigatório:** Sim
- **Opções:** Pendente, Aprovado, Rejeitado, Cancelado
- **Padrão:** Pendente
- **Formato:** Menu suspenso

#### Coluna: Data Solicitação
- **Tipo:** Data e Hora
- **Nome:** Data Solicitação
- **Obrigatório:** Sim
- **Formato:** Data e hora

#### Coluna: Aprovado Por
- **Tipo:** Pessoa ou Grupo
- **Nome:** Aprovado Por
- **Obrigatório:** Não

#### Coluna: Data Aprovação  
- **Tipo:** Data e Hora
- **Nome:** Data Aprovação
- **Obrigatório:** Não
- **Formato:** Data e hora

#### Coluna: Observações
- **Tipo:** Várias linhas de texto
- **Nome:** Observações
- **Obrigatório:** Não
- **Linhas:** 3

---

## 🧪 Teste da Integração

### 1. Verificar Lista Criada
- Acesse: `https://seudominio.sharepoint.com/sites/seusite/Lists/Pedidos%20de%20Ferias`
- Confirme que todas as colunas estão presentes

### 2. Testar Web Part
1. **Workbench Local:**
   - URL: `https://localhost:4321/temp/workbench.html`
   
2. **Workbench SharePoint:** 
   - URL: `https://seudominio.sharepoint.com/sites/seusite/_layouts/15/workbench.aspx`
   - Query string de debug: `?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/build/manifests.js`

### 3. Funcionalidades para Testar
- ✅ **Carregamento:** Lista aparece na web part
- ✅ **Filtros:** Por colaborador, estado, datas
- ✅ **Ordenação:** Clique nos cabeçalhos
- ✅ **Ações:** Aprovar/Rejeitar pedidos
- ✅ **Criação:** Novo pedido
- ✅ **Responsividade:** Diferentes tamanhos de tela

---

## 🔧 Troubleshooting

### Problemas Comuns:

#### "Lista não encontrada"
- Verifique se o nome está correto: "Pedidos de Férias"
- Confirme permissões de leitura na lista

#### "Erro de conexão" 
- Verifique se o servidor gulp está rodando: `gulp serve`
- Confirme se está acessando `https://localhost:4321`

#### "Dados não carregam"
- Verifique se há itens na lista
- Confirme se as colunas têm os nomes internos corretos
- Abra console do browser (F12) para ver erros

#### "Sem permissão"
- Confirme permissões de contribuição na lista
- Verifique se está logado no SharePoint

---

## 📊 Dados de Teste Recomendados

Se não usar o script automático, crie manualmente estes itens:

### Pedido 1 - Pendente
- **Título:** "Férias de Verão - João Silva"
- **Colaborador:** [Seu usuário]
- **Data Início:** 01/07/2025
- **Data Fim:** 15/07/2025  
- **Dias Total:** 15
- **Estado:** Pendente
- **Data Solicitação:** 15/06/2025 10:00

### Pedido 2 - Aprovado
- **Título:** "Férias de Natal - Maria Santos"
- **Colaborador:** [Seu usuário]
- **Data Início:** 20/12/2025
- **Data Fim:** 30/12/2025
- **Dias Total:** 10
- **Estado:** Aprovado
- **Aprovado Por:** [Seu usuário]
- **Data Aprovação:** 05/11/2025 09:15
- **Observações:** "Aprovado. Boas férias!"

### Pedido 3 - Rejeitado  
- **Título:** "Férias Antecipadas - Pedro Costa"
- **Colaborador:** [Seu usuário]
- **Data Início:** 10/05/2025
- **Data Fim:** 20/05/2025
- **Dias Total:** 10
- **Estado:** Rejeitado
- **Aprovado Por:** [Seu usuário] 
- **Data Aprovação:** 28/04/2025 11:20
- **Observações:** "Rejeitado. Período muito próximo ao fechamento do projeto."

---

## ✅ Checklist Final

- [ ] Lista "Pedidos de Férias" criada
- [ ] Todas as 10 colunas adicionadas
- [ ] Tipos de dados corretos configurados
- [ ] Dados de teste inseridos
- [ ] Web part testada no workbench
- [ ] Filtros funcionando
- [ ] Ordenação funcionando  
- [ ] Ações de aprovação/rejeição testadas
- [ ] Responsividade verificada

🎉 **Parabéns! Seu sistema está pronto para uso!**