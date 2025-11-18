<#
  Script para criar a lista `PedidosFerias` com os campos esperados pelo web part.
  Requer: PnP.PowerShell (instale via Install-Module PnP.PowerShell)

  Uso:
    Connect-PnPOnline -Url https://<seu-site>.sharepoint.com/sites/<site> -Interactive
    .\scripts\create-pedidos-ferias.ps1
#>

param(
  [string]$ListTitle = 'PedidosFerias'
)

Write-Host "Criando lista: $ListTitle" -ForegroundColor Cyan

# Criar lista
if (-not (Get-PnPList -Identity $ListTitle -ErrorAction SilentlyContinue)) {
  New-PnPList -Title $ListTitle -Template GenericList -Description 'Lista para gerenciar pedidos de férias' | Out-Null
  Write-Host "Lista criada: $ListTitle"
} else {
  Write-Host "Lista já existe: $ListTitle"
}

function Add-FieldIfNotExists($listTitle, $internalName, $schemaXml) {
  $field = Get-PnPField -List $listTitle -Identity $internalName -ErrorAction SilentlyContinue
  if (-not $field) {
    Add-PnPField -List $listTitle -DisplayName $internalName -InternalName $internalName -Type "Text" -AddToDefaultView:$false -Values @{ } -SchemaXml $schemaXml
    Write-Host "Campo adicionado: $internalName"
  } else {
    Write-Host "Campo já existe: $internalName"
  }
}

# Campos simples (texto e number)
Add-PnPField -List $ListTitle -DisplayName 'EmailColaborador' -InternalName 'EmailColaborador' -Type Text -Required:$false -AddToDefaultView:$true | Out-Null
Add-PnPField -List $ListTitle -DisplayName 'DiasTotal' -InternalName 'DiasTotal' -Type Number -Required:$false -AddToDefaultView:$true | Out-Null

# Campos data
Add-PnPField -List $ListTitle -DisplayName 'DataInicio' -InternalName 'DataInicio' -Type DateTime -Required:$true -AddToDefaultView:$true | Out-Null
Add-PnPField -List $ListTitle -DisplayName 'DataFim' -InternalName 'DataFim' -Type DateTime -Required:$true -AddToDefaultView:$true | Out-Null
Add-PnPField -List $ListTitle -DisplayName 'DataSolicitacao' -InternalName 'DataSolicitacao' -Type DateTime -Required:$false -AddToDefaultView:$true | Out-Null
Add-PnPField -List $ListTitle -DisplayName 'DataAprovacao' -InternalName 'DataAprovacao' -Type DateTime -Required:$false -AddToDefaultView:$true | Out-Null

# Campos multilinha
Add-PnPField -List $ListTitle -DisplayName 'Motivo' -InternalName 'Motivo' -Type Note -Required:$false -AddToDefaultView:$false | Out-Null
Add-PnPField -List $ListTitle -DisplayName 'Observacoes' -InternalName 'Observacoes' -Type Note -Required:$false -AddToDefaultView:$false | Out-Null

# Campos de escolha
$choices = @('Pendente','Aprovado','Rejeitado')
Add-PnPField -List $ListTitle -DisplayName 'Estado' -InternalName 'Estado' -Type Choice -AddToDefaultView:$true -Values $choices -Required:$true | Out-Null

# Campos User (Pessoa)
Add-PnPField -List $ListTitle -DisplayName 'AprovadoPor' -InternalName 'AprovadoPor' -Type User -AddToDefaultView:$false | Out-Null

Write-Host "Script concluído. Verifique a lista e campos no site." -ForegroundColor Green
