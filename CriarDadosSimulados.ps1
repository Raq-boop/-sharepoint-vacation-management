# Script para simular dados da lista SharePoint localmente
# Para usar quando não há acesso ao SharePoint ou para testes de desenvolvimento

Write-Host "🧪 Criando dados de teste locais para desenvolvimento..." -ForegroundColor Green

# Simular estrutura de dados que seria retornada do SharePoint
$dadosSimulados = @{
    "Lista" = "Pedidos de Férias"
    "URL" = "Lista simulada localmente"
    "Colunas" = @(
        "Title", "Colaborador", "DataInicio", "DataFim", "DiasTotal", 
        "Motivo", "Estado", "DataSolicitacao", "AprovadoPor", "DataAprovacao", "Observacoes"
    )
    "Dados" = @(
        @{
            Id = 1
            Title = "Férias de Verão - João Silva"
            Colaborador = @{ Title = "João Silva"; EMail = "joao.silva@empresa.com"; Id = 1 }
            DataInicio = "2025-07-01T00:00:00Z"
            DataFim = "2025-07-15T00:00:00Z"
            DiasTotal = 15
            Motivo = "Férias de verão com a família"
            Estado = "Pendente"
            DataSolicitacao = "2025-06-15T10:00:00Z"
        },
        @{
            Id = 2
            Title = "Férias de Natal - Maria Santos"
            Colaborador = @{ Title = "Maria Santos"; EMail = "maria.santos@empresa.com"; Id = 2 }
            DataInicio = "2025-12-20T00:00:00Z"
            DataFim = "2025-12-30T00:00:00Z"
            DiasTotal = 10
            Motivo = "Festividades de fim de ano"
            Estado = "Aprovado"
            DataSolicitacao = "2025-11-01T14:30:00Z"
            AprovadoPor = @{ Title = "Gestor"; Id = 99 }
            DataAprovacao = "2025-11-05T09:15:00Z"
            Observacoes = "Aprovado. Boas férias!"
        },
        @{
            Id = 3
            Title = "Férias Antecipadas - Pedro Costa"
            Colaborador = @{ Title = "Pedro Costa"; EMail = "pedro.costa@empresa.com"; Id = 3 }
            DataInicio = "2025-05-10T00:00:00Z"
            DataFim = "2025-05-20T00:00:00Z"
            DiasTotal = 10
            Motivo = "Compromissos familiares urgentes"
            Estado = "Rejeitado"
            DataSolicitacao = "2025-04-25T16:45:00Z"
            AprovadoPor = @{ Title = "Gestor"; Id = 99 }
            DataAprovacao = "2025-04-28T11:20:00Z"
            Observacoes = "Rejeitado. Período muito próximo ao fechamento do projeto."
        },
        @{
            Id = 4
            Title = "Férias de Inverno - Ana Lima"
            Colaborador = @{ Title = "Ana Lima"; EMail = "ana.lima@empresa.com"; Id = 4 }
            DataInicio = "2025-06-01T00:00:00Z"
            DataFim = "2025-06-10T00:00:00Z"
            DiasTotal = 10
            Motivo = "Descanso e renovação de energias"
            Estado = "Aprovado"
            DataSolicitacao = "2025-05-01T09:00:00Z"
            AprovadoPor = @{ Title = "Gestor"; Id = 99 }
            DataAprovacao = "2025-05-03T14:20:00Z"
            Observacoes = "Aprovado. Período autorizado."
        },
        @{
            Id = 5
            Title = "Férias Curtas - Roberto Silva"
            Colaborador = @{ Title = "Roberto Silva"; EMail = "roberto.silva@empresa.com"; Id = 5 }
            DataInicio = "2025-08-15T00:00:00Z"
            DataFim = "2025-08-19T00:00:00Z"
            DiasTotal = 5
            Motivo = "Viagem familiar de fim de semana prolongado"
            Estado = "Pendente"
            DataSolicitacao = "2025-07-20T16:30:00Z"
        }
    )
}

# Salvar dados simulados como JSON
$dadosJson = $dadosSimulados | ConvertTo-Json -Depth 10 -Compress
$dadosJson | Out-File -FilePath ".\dados-simulados.json" -Encoding UTF8

Write-Host "✅ Dados de teste criados!" -ForegroundColor Green
Write-Host "📄 Arquivo: dados-simulados.json" -ForegroundColor Cyan
Write-Host "📊 $($dadosSimulados.Dados.Count) pedidos de teste criados" -ForegroundColor Yellow

Write-Host "`n🧪 Para testar:" -ForegroundColor Green  
Write-Host "1. Certifique-se de que o servidor está rodando: gulp serve" -ForegroundColor White
Write-Host "2. Abra: https://localhost:4321/temp/workbench.html" -ForegroundColor White
Write-Host "3. Adicione a web part 'Sistema de Pedidos de Férias'" -ForegroundColor White
Write-Host "4. A web part usará dados mockados se não conseguir conectar ao SharePoint" -ForegroundColor White

Write-Host "`n📋 Estrutura da lista simulada:" -ForegroundColor Yellow
Write-Host "- Lista: $($dadosSimulados.Lista)" -ForegroundColor White
Write-Host "- Colunas: $($dadosSimulados.Colunas -join ', ')" -ForegroundColor White
Write-Host "- Total de itens: $($dadosSimulados.Dados.Count)" -ForegroundColor White

Write-Host "`n🔗 Para usar SharePoint real:" -ForegroundColor Blue
Write-Host "Execute: .\CriarListaPedidosFerias.ps1 -SiteUrl 'https://seudominio.sharepoint.com/sites/seusite'" -ForegroundColor White