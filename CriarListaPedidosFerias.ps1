# Script para criar a lista "Pedidos de Férias" no SharePoint
# Execute este script conectado ao seu site SharePoint

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl
)

Write-Host "🚀 Criando lista 'Pedidos de Férias' no SharePoint..." -ForegroundColor Green

try {
    # Conectar ao SharePoint Online
    Write-Host "📡 Conectando ao SharePoint..." -ForegroundColor Yellow
    Connect-PnPOnline -Url $SiteUrl -Interactive
    
    # Verificar se a lista já existe
    $existingList = Get-PnPList -Identity "Pedidos de Férias" -ErrorAction SilentlyContinue
    if ($existingList) {
        Write-Host "⚠️  Lista 'Pedidos de Férias' já existe. Deseja recriar? (S/N)" -ForegroundColor Yellow
        $response = Read-Host
        if ($response -eq "S" -or $response -eq "s") {
            Remove-PnPList -Identity "Pedidos de Férias" -Force
            Write-Host "🗑️  Lista existente removida." -ForegroundColor Red
        } else {
            Write-Host "❌ Operação cancelada." -ForegroundColor Red
            return
        }
    }

    # Criar a lista principal
    Write-Host "📋 Criando lista 'Pedidos de Férias'..." -ForegroundColor Yellow
    New-PnPList -Title "Pedidos de Férias" -Template GenericList -EnableVersioning

    # Aguardar um pouco para a lista ser criada
    Start-Sleep -Seconds 2

    Write-Host "📊 Adicionando colunas personalizadas..." -ForegroundColor Yellow

    # Adicionar coluna Colaborador (Pessoa)
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Colaborador" -InternalName "Colaborador" -Type User -Required -AddToDefaultView

    # Adicionar coluna Data Início
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Data Início" -InternalName "DataInicio" -Type DateTime -Required -AddToDefaultView

    # Adicionar coluna Data Fim  
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Data Fim" -InternalName "DataFim" -Type DateTime -Required -AddToDefaultView

    # Adicionar coluna Dias Total
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Dias Total" -InternalName "DiasTotal" -Type Number -Required -AddToDefaultView

    # Adicionar coluna Motivo
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Motivo" -InternalName "Motivo" -Type Note -AddToDefaultView

    # Adicionar coluna Estado (Escolha)
    $choiceXml = @"
<Field Type='Choice' DisplayName='Estado' Required='TRUE' Format='Dropdown' StaticName='Estado' Name='Estado'>
    <CHOICES>
        <CHOICE>Pendente</CHOICE>
        <CHOICE>Aprovado</CHOICE>
        <CHOICE>Rejeitado</CHOICE>
        <CHOICE>Cancelado</CHOICE>
    </CHOICES>
    <Default>Pendente</Default>
</Field>
"@
    Add-PnPFieldFromXml -List "Pedidos de Férias" -FieldXml $choiceXml -AddToDefaultView

    # Adicionar coluna Data Solicitação
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Data Solicitação" -InternalName "DataSolicitacao" -Type DateTime -Required -AddToDefaultView

    # Adicionar coluna Aprovado Por (Pessoa)
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Aprovado Por" -InternalName "AprovadoPor" -Type User

    # Adicionar coluna Data Aprovação
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Data Aprovação" -InternalName "DataAprovacao" -Type DateTime

    # Adicionar coluna Observações
    Add-PnPField -List "Pedidos de Férias" -DisplayName "Observações" -InternalName "Observacoes" -Type Note

    Write-Host "✅ Lista criada com sucesso!" -ForegroundColor Green

    # Criar dados de teste
    Write-Host "📝 Deseja adicionar dados de teste? (S/N)" -ForegroundColor Yellow
    $addTestData = Read-Host
    
    if ($addTestData -eq "S" -or $addTestData -eq "s") {
        Write-Host "📊 Adicionando dados de teste..." -ForegroundColor Yellow
        
        # Obter usuário atual para usar nos dados de teste
        $currentUser = Get-PnPSiteUserById -Identity (Get-PnPContext).Web.CurrentUser.Id

        # Dados de teste
        $testData = @(
            @{
                Title = "Férias de Verão - João Silva"
                Colaborador = $currentUser.Id
                DataInicio = "2025-07-01"
                DataFim = "2025-07-15"  
                DiasTotal = 15
                Motivo = "Férias de verão com a família"
                Estado = "Pendente"
                DataSolicitacao = "2025-06-15T10:00:00Z"
            },
            @{
                Title = "Férias de Natal - Maria Santos"
                Colaborador = $currentUser.Id
                DataInicio = "2025-12-20"
                DataFim = "2025-12-30"
                DiasTotal = 10
                Motivo = "Festividades de fim de ano"
                Estado = "Aprovado"
                DataSolicitacao = "2025-11-01T14:30:00Z"
                AprovadoPor = $currentUser.Id
                DataAprovacao = "2025-11-05T09:15:00Z"
                Observacoes = "Aprovado. Boas férias!"
            },
            @{
                Title = "Férias Antecipadas - Pedro Costa"
                Colaborador = $currentUser.Id
                DataInicio = "2025-05-10"
                DataFim = "2025-05-20"
                DiasTotal = 10
                Motivo = "Compromissos familiares urgentes"
                Estado = "Rejeitado"
                DataSolicitacao = "2025-04-25T16:45:00Z"
                AprovadoPor = $currentUser.Id
                DataAprovacao = "2025-04-28T11:20:00Z"
                Observacoes = "Rejeitado. Período muito próximo ao fechamento do projeto."
            }
        )

        foreach ($item in $testData) {
            Add-PnPListItem -List "Pedidos de Férias" -Values $item
            Write-Host "  ✓ Adicionado: $($item.Title)" -ForegroundColor Cyan
        }
        
        Write-Host "✅ Dados de teste adicionados!" -ForegroundColor Green
    }

    Write-Host "`n🎉 SUCESSO! Lista 'Pedidos de Férias' criada e configurada!" -ForegroundColor Green
    Write-Host "📍 URL da lista: $SiteUrl/Lists/Pedidos%20de%20Ferias" -ForegroundColor Cyan
    Write-Host "`n📋 Próximos passos:" -ForegroundColor Yellow
    Write-Host "1. Teste a web part no workbench: https://localhost:4321/temp/workbench.html" -ForegroundColor White
    Write-Host "2. Ou teste no SharePoint: $SiteUrl/_layouts/15/workbench.aspx" -ForegroundColor White
    Write-Host "3. Configure permissões da lista conforme necessário" -ForegroundColor White

} catch {
    Write-Host "❌ Erro ao criar a lista: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Certifique-se de que:" -ForegroundColor Yellow
    Write-Host "  - Você tem permissões de administrador no site" -ForegroundColor White
    Write-Host "  - O módulo PnP PowerShell está instalado: Install-Module PnP.PowerShell" -ForegroundColor White
    Write-Host "  - A URL do site está correta" -ForegroundColor White
}