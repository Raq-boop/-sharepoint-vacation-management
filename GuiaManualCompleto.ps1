# 🎯 GUIA PASSO A PASSO - Criação Manual da Lista SharePoint
# Execute EXATAMENTE como está - Copy/Paste dos comandos

Write-Host "🚀 CRIAÇÃO MANUAL DA LISTA 'PEDIDOS DE FÉRIAS'" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 PASSO 1: CONECTAR AO SHAREPOINT" -ForegroundColor Cyan
Write-Host "Execute este comando e faça login quando solicitado:" -ForegroundColor White
Write-Host ""
Write-Host "Connect-PnPOnline -Url 'https://hnlcompany.sharepoint.com' -Interactive" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Uma janela do browser vai abrir para você fazer login" -ForegroundColor Red
Write-Host "   Use suas credenciais: raquel@hnlcompany.onmicrosoft.com" -ForegroundColor White
Write-Host ""

Write-Host "📋 PASSO 2: CRIAR A LISTA" -ForegroundColor Cyan
Write-Host "Após conectar com sucesso, execute:" -ForegroundColor White
Write-Host ""
Write-Host "New-PnPList -Title 'Pedidos de Férias' -Template GenericList -EnableVersioning" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 PASSO 3: AGUARDAR CRIAÇÃO" -ForegroundColor Cyan
Write-Host "Execute para aguardar a lista ser criada:" -ForegroundColor White
Write-Host ""
Write-Host "Start-Sleep -Seconds 3" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 PASSO 4: ADICIONAR COLUNAS UMA POR VEZ" -ForegroundColor Cyan
Write-Host "Execute estes comandos UM POR VEZ, aguardando cada um terminar:" -ForegroundColor White
Write-Host ""

Write-Host "# Coluna 1: Colaborador" -ForegroundColor Green
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Colaborador' -InternalName 'Colaborador' -Type User -Required -AddToDefaultView" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 2: Data Início" -ForegroundColor Green  
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Data Início' -InternalName 'DataInicio' -Type DateTime -Required -AddToDefaultView" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 3: Data Fim" -ForegroundColor Green
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Data Fim' -InternalName 'DataFim' -Type DateTime -Required -AddToDefaultView" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 4: Dias Total" -ForegroundColor Green
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Dias Total' -InternalName 'DiasTotal' -Type Number -Required -AddToDefaultView" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 5: Motivo" -ForegroundColor Green
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Motivo' -InternalName 'Motivo' -Type Note -AddToDefaultView" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 6: Estado (MAIS COMPLEXA - Execute como um bloco)" -ForegroundColor Green
Write-Host 'Execute este bloco completo (selecione tudo e cole):' -ForegroundColor Red
Write-Host ""
Write-Host '$choiceXml = @"' -ForegroundColor Yellow
Write-Host '<Field Type="Choice" DisplayName="Estado" Required="TRUE" Format="Dropdown" StaticName="Estado" Name="Estado">' -ForegroundColor Yellow
Write-Host '    <CHOICES>' -ForegroundColor Yellow
Write-Host '        <CHOICE>Pendente</CHOICE>' -ForegroundColor Yellow
Write-Host '        <CHOICE>Aprovado</CHOICE>' -ForegroundColor Yellow
Write-Host '        <CHOICE>Rejeitado</CHOICE>' -ForegroundColor Yellow
Write-Host '        <CHOICE>Cancelado</CHOICE>' -ForegroundColor Yellow
Write-Host '    </CHOICES>' -ForegroundColor Yellow
Write-Host '    <Default>Pendente</Default>' -ForegroundColor Yellow
Write-Host '</Field>' -ForegroundColor Yellow
Write-Host '"@' -ForegroundColor Yellow
Write-Host 'Add-PnPFieldFromXml -List "Pedidos de Férias" -FieldXml $choiceXml -AddToDefaultView' -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 7: Data Solicitação" -ForegroundColor Green
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Data Solicitação' -InternalName 'DataSolicitacao' -Type DateTime -Required -AddToDefaultView" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 8: Aprovado Por" -ForegroundColor Green
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Aprovado Por' -InternalName 'AprovadoPor' -Type User" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 9: Data Aprovação" -ForegroundColor Green
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Data Aprovação' -InternalName 'DataAprovacao' -Type DateTime" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Coluna 10: Observações" -ForegroundColor Green
Write-Host "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Observações' -InternalName 'Observacoes' -Type Note" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 PASSO 5: VERIFICAR LISTA CRIADA" -ForegroundColor Cyan
Write-Host "Execute para confirmar que a lista foi criada:" -ForegroundColor White
Write-Host ""
Write-Host "Get-PnPList -Identity 'Pedidos de Férias' | Select-Object Title, ItemCount" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 PASSO 6: ADICIONAR DADOS DE TESTE (OPCIONAL)" -ForegroundColor Cyan
Write-Host "Se quiser adicionar dados de teste, execute este bloco:" -ForegroundColor White
Write-Host ""
Write-Host '$currentUser = Get-PnPUser -Identity "raquel@hnlcompany.onmicrosoft.com"' -ForegroundColor Yellow
Write-Host ""
Write-Host '# Pedido 1' -ForegroundColor Green
Write-Host 'Add-PnPListItem -List "Pedidos de Férias" -Values @{' -ForegroundColor Yellow
Write-Host '    "Title" = "Férias de Verão - João Silva"' -ForegroundColor Yellow
Write-Host '    "Colaborador" = $currentUser.Id' -ForegroundColor Yellow
Write-Host '    "DataInicio" = "2025-07-01"' -ForegroundColor Yellow
Write-Host '    "DataFim" = "2025-07-15"' -ForegroundColor Yellow
Write-Host '    "DiasTotal" = 15' -ForegroundColor Yellow
Write-Host '    "Motivo" = "Férias de verão com a família"' -ForegroundColor Yellow
Write-Host '    "Estado" = "Pendente"' -ForegroundColor Yellow
Write-Host '    "DataSolicitacao" = "2025-06-15T10:00:00Z"' -ForegroundColor Yellow
Write-Host '}' -ForegroundColor Yellow
Write-Host ""

Write-Host '# Pedido 2' -ForegroundColor Green
Write-Host 'Add-PnPListItem -List "Pedidos de Férias" -Values @{' -ForegroundColor Yellow
Write-Host '    "Title" = "Férias de Natal - Maria Santos"' -ForegroundColor Yellow
Write-Host '    "Colaborador" = $currentUser.Id' -ForegroundColor Yellow
Write-Host '    "DataInicio" = "2025-12-20"' -ForegroundColor Yellow
Write-Host '    "DataFim" = "2025-12-30"' -ForegroundColor Yellow
Write-Host '    "DiasTotal" = 10' -ForegroundColor Yellow
Write-Host '    "Motivo" = "Festividades de fim de ano"' -ForegroundColor Yellow
Write-Host '    "Estado" = "Aprovado"' -ForegroundColor Yellow
Write-Host '    "DataSolicitacao" = "2025-11-01T14:30:00Z"' -ForegroundColor Yellow
Write-Host '    "AprovadoPor" = $currentUser.Id' -ForegroundColor Yellow
Write-Host '    "DataAprovacao" = "2025-11-05T09:15:00Z"' -ForegroundColor Yellow
Write-Host '    "Observacoes" = "Aprovado. Boas férias!"' -ForegroundColor Yellow
Write-Host '}' -ForegroundColor Yellow
Write-Host ""

Write-Host '# Pedido 3' -ForegroundColor Green
Write-Host 'Add-PnPListItem -List "Pedidos de Férias" -Values @{' -ForegroundColor Yellow
Write-Host '    "Title" = "Férias Rejeitadas - Pedro Costa"' -ForegroundColor Yellow
Write-Host '    "Colaborador" = $currentUser.Id' -ForegroundColor Yellow
Write-Host '    "DataInicio" = "2025-05-10"' -ForegroundColor Yellow
Write-Host '    "DataFim" = "2025-05-20"' -ForegroundColor Yellow
Write-Host '    "DiasTotal" = 10' -ForegroundColor Yellow
Write-Host '    "Motivo" = "Compromissos familiares urgentes"' -ForegroundColor Yellow
Write-Host '    "Estado" = "Rejeitado"' -ForegroundColor Yellow
Write-Host '    "DataSolicitacao" = "2025-04-25T16:45:00Z"' -ForegroundColor Yellow
Write-Host '    "AprovadoPor" = $currentUser.Id' -ForegroundColor Yellow
Write-Host '    "DataAprovacao" = "2025-04-28T11:20:00Z"' -ForegroundColor Yellow
Write-Host '    "Observacoes" = "Rejeitado. Período muito próximo ao fechamento do projeto."' -ForegroundColor Yellow
Write-Host '}' -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 PASSO 7: VERIFICAÇÃO FINAL" -ForegroundColor Cyan
Write-Host "Execute para ver a lista criada:" -ForegroundColor White
Write-Host ""
Write-Host 'Get-PnPListItem -List "Pedidos de Férias" | Select-Object Id, @{Name="Título";Expression={$_.FieldValues.Title}}, @{Name="Estado";Expression={$_.FieldValues.Estado}}' -ForegroundColor Yellow
Write-Host ""

Write-Host "🎉 SUCESSO!" -ForegroundColor Green
Write-Host "URL da sua lista: https://hnlcompany.sharepoint.com/Lists/Pedidos%20de%20Ferias" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Execute: gulp serve" -ForegroundColor White
Write-Host "2. Abra: https://localhost:4321/temp/workbench.html" -ForegroundColor White
Write-Host "3. Adicione a web part 'Sistema de Pedidos de Férias'" -ForegroundColor White
Write-Host "4. Teste todas as funcionalidades!" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "- Execute os comandos UM POR VEZ" -ForegroundColor Yellow
Write-Host "- Aguarde cada comando terminar antes do próximo" -ForegroundColor Yellow
Write-Host "- Se der erro, me chame que ajudo a resolver" -ForegroundColor Yellow