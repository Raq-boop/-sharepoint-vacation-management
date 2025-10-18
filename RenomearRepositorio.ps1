# 🚀 Script para Renomear Repositório no GitHub
# Execute este script após configurar seu token do GitHub

Write-Host "🎯 Profissionalizando Repositório GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar se o GitHub CLI está instalado
if (Get-Command "gh" -ErrorAction SilentlyContinue) {
    Write-Host "✅ GitHub CLI encontrado - usando método preferido" -ForegroundColor Green
    
    # Fazer login (se necessário)
    Write-Host "🔐 Verificando autenticação..."
    $authStatus = gh auth status 2>&1
    
    if ($authStatus -like "*not logged into*" -or $authStatus -like "*authentication token*") {
        Write-Host "❌ Não autenticado. Execute: gh auth login" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📋 Passos para autenticar:" -ForegroundColor Cyan
        Write-Host "1. Execute: gh auth login" -ForegroundColor White
        Write-Host "2. Escolha: GitHub.com" -ForegroundColor White
        Write-Host "3. Escolha: HTTPS" -ForegroundColor White
        Write-Host "4. Escolha: Login with a web browser" -ForegroundColor White
        Write-Host "5. Execute este script novamente" -ForegroundColor White
        pause
        exit 1
    }
    
    # Renomear repositório usando GitHub CLI
    Write-Host "🔄 Renomeando repositório..." -ForegroundColor Yellow
    
    try {
        # Comando para renomear
        gh repo edit Raq-boop/spfx-pedidos-ferias --name "sharepoint-vacation-management" --description "Enterprise vacation request management system built with SharePoint Framework, React, TypeScript, and Microsoft Graph API"
        
        Write-Host "✅ Repositório renomeado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Nova URL: https://github.com/Raq-boop/sharepoint-vacation-management" -ForegroundColor Cyan
        
        # Atualizar remote local
        Write-Host "🔄 Atualizando remote local..." -ForegroundColor Yellow
        git remote set-url origin https://github.com/Raq-boop/sharepoint-vacation-management.git
        Write-Host "✅ Remote atualizado!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Erro ao renomear: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ GitHub CLI não encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Opções para continuar:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔧 OPÇÃO 1 - Instalar GitHub CLI (Recomendado):" -ForegroundColor Yellow
    Write-Host "winget install --id GitHub.cli" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 OPÇÃO 2 - Renomear manualmente:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://github.com/Raq-boop/spfx-pedidos-ferias" -ForegroundColor White
    Write-Host "2. Clique em Settings" -ForegroundColor White
    Write-Host "3. Role até 'Repository name'" -ForegroundColor White
    Write-Host "4. Mude para: sharepoint-vacation-management" -ForegroundColor White
    Write-Host "5. Clique em 'Rename'" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Descrição para adicionar:" -ForegroundColor Yellow
    Write-Host "Enterprise vacation request management system built with SharePoint Framework, React, TypeScript, and Microsoft Graph API" -ForegroundColor White
}

Write-Host ""
Write-Host "🏷️  Topics para adicionar no GitHub:" -ForegroundColor Cyan
Write-Host "sharepoint-framework, spfx, react, typescript, microsoft-graph, vacation-management, enterprise-app, fluent-ui, microsoft-365" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Status: Repositório pronto para entrevistas!" -ForegroundColor Green
pause