# Script Manual - Criar Lista Pedidos de Férias
# Execute estes comandos um por vez no SharePoint Online Management Shell ou PowerShell

Write-Host "🔧 INSTRUÇÕES MANUAIS - Criar Lista SharePoint" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Yellow

Write-Host "`n📝 OPÇÃO 1: Via Interface Web (Mais Fácil)" -ForegroundColor Cyan
Write-Host "1. Acesse: https://hnlcompany.sharepoint.com" -ForegroundColor White
Write-Host "2. Clique em ⚙️ Configurações → Conteúdo do Site" -ForegroundColor White
Write-Host "3. Clique em + Novo → Lista" -ForegroundColor White
Write-Host "4. Escolha 'Lista em branco'" -ForegroundColor White
Write-Host "5. Nome: 'Pedidos de Férias'" -ForegroundColor White
Write-Host "6. Siga as instruções no arquivo INSTRUÇÕES-LISTA-SHAREPOINT.md" -ForegroundColor White

Write-Host "`n💻 OPÇÃO 2: Via PowerShell (Para usuários avançados)" -ForegroundColor Cyan
Write-Host "Execute estes comandos individualmente:" -ForegroundColor Yellow

$comandos = @(
    "# 1. Conectar (abrirá uma página web para login)",
    "Connect-PnPOnline -Url 'https://hnlcompany.sharepoint.com' -Interactive",
    "",
    "# 2. Criar a lista",
    "New-PnPList -Title 'Pedidos de Férias' -Template GenericList",
    "",
    "# 3. Adicionar colunas",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Colaborador' -InternalName 'Colaborador' -Type User -Required",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Data Início' -InternalName 'DataInicio' -Type DateTime -Required",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Data Fim' -InternalName 'DataFim' -Type DateTime -Required",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Dias Total' -InternalName 'DiasTotal' -Type Number -Required",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Motivo' -InternalName 'Motivo' -Type Note",
    "",
    "# 4. Coluna de Estado (Escolha)",
    '$choiceXml = @"',
    '<Field Type="Choice" DisplayName="Estado" Required="TRUE" Format="Dropdown" StaticName="Estado" Name="Estado">',
    '    <CHOICES>',
    '        <CHOICE>Pendente</CHOICE>',
    '        <CHOICE>Aprovado</CHOICE>',
    '        <CHOICE>Rejeitado</CHOICE>',
    '        <CHOICE>Cancelado</CHOICE>',
    '    </CHOICES>',
    '    <Default>Pendente</Default>',
    '</Field>',
    '"@',
    "Add-PnPFieldFromXml -List 'Pedidos de Férias' -FieldXml `$choiceXml",
    "",
    "# 5. Colunas restantes",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Data Solicitação' -InternalName 'DataSolicitacao' -Type DateTime -Required",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Aprovado Por' -InternalName 'AprovadoPor' -Type User",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Data Aprovação' -InternalName 'DataAprovacao' -Type DateTime",
    "Add-PnPField -List 'Pedidos de Férias' -DisplayName 'Observações' -InternalName 'Observacoes' -Type Note"
)

foreach ($comando in $comandos) {
    Write-Host $comando -ForegroundColor White
}

Write-Host "`n🧪 OPÇÃO 3: Testar Sem SharePoint (Desenvolvimento)" -ForegroundColor Cyan
Write-Host "Execute: .\CriarDadosSimulados.ps1" -ForegroundColor White
Write-Host "Isso criará dados de teste locais para desenvolvimento" -ForegroundColor White

Write-Host "`n📋 Depois de criar a lista:" -ForegroundColor Green
Write-Host "1. Abra o workbench: https://localhost:4321/temp/workbench.html" -ForegroundColor White
Write-Host "2. Adicione a web part 'Sistema de Pedidos de Férias'" -ForegroundColor White  
Write-Host "3. Configure a web part para apontar para a lista criada" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "- Use a OPÇÃO 1 (Interface Web) se não tiver experiência com PowerShell" -ForegroundColor Yellow
Write-Host "- Siga o arquivo INSTRUÇÕES-LISTA-SHAREPOINT.md para detalhes" -ForegroundColor Yellow