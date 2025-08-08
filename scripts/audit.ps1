Param(
  [string]$Root = (Get-Location).Path,
  [string]$Src = "$((Get-Location).Path)\src",
  [string]$Out = "$((Get-Location).Path)\audit"
)

New-Item -ItemType Directory -Force -Path $Out | Out-Null

Write-Host "==> Audit: source = $Src"
if (-not (Test-Path $Src)) {
  Write-Host "❌ Dossier 'src' introuvable: $Src"
  exit 1
}

function Search-ToFile {
    param([string]$Pattern, [string]$OutFile)
  
    $files = Get-ChildItem -Path $Src -Recurse -File
    $results = @()
  
    foreach ($f in $files) {
      # REGEX mode (default) – NOT SimpleMatch
      $hit = Select-String -Path $f.FullName -Pattern $Pattern -ErrorAction SilentlyContinue
      if ($hit) { $results += $hit }
    }
  
    if ($results.Count -eq 0) {
      "" | Set-Content -Path $OutFile
    } else {
      $results | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line)" } | Set-Content -Path $OutFile
    }
  
    $lines = (Get-Content $OutFile | Measure-Object -Line).Lines
    Write-Host "→ $OutFile ($lines lignes)"
  }
  
  Write-Host "==> 1) Index des occurrences clés"
  Search-ToFile '(defineEntity|createEntityHooks|createModelForm|crudService|relationService|client\.models|useEntityManager|use[A-Z][A-Za-z]+Manager)' "$Out\index_hits.txt"
  
  Write-Host "==> 2) Tous les hooks exportés"
  Search-ToFile '^(export\s+(const|function)\s+use[A-Z])' "$Out\hooks.txt"
  
  Write-Host "==> 3) Services (génériques & appels directs)"
  Search-ToFile '(crudService\(|relationService\(|client\.models\.)' "$Out\Services.txt"
  
  Write-Host "==> 4) Formulaires / mapping / validation"
  Search-ToFile '(createModelForm\(|\binitialForm\b|\btoForm\b|\btoInput\b|\bzod\b)' "$Out\forms.txt"
  
  Write-Host "==> 5) Auth côté client (owner/sub, groupes)"
  Search-ToFile '(\bower\b|cognito:groups|ADMINS|withAuth|AuthContext|\bsub\b)' "$Out\auth.txt"


Write-Host "==> 6) Dépendances circulaires (madge via npx)"
try {
  npx --yes madge --ts-config ./tsconfig.json --circular "$Src" | Set-Content "$Out\circular.txt"
} catch {
  "madge error or no cycles" | Set-Content "$Out\circular.txt"
}

Write-Host "==> 7) Graphe de dépendances (dependency-cruiser via npx)"
if (-not (Test-Path "$Root\.dependency-cruiser.js") -and -not (Test-Path "$Root\.dependency-cruiser.cjs") -and -not (Test-Path "$Root\.dependency-cruiser.json")) {
@'
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [],
  options: {
    tsConfig: { fileName: "./tsconfig.json" },
    doNotFollow: { path: ["node_modules"] },
    exclude: { path: ["node_modules", "dist", "build", "coverage"] },
    includeOnly: ["^src"],
    reporterOptions: { dot: { collapsePattern: "node_modules" } }
  }
};
'@ | Set-Content "$Root\.dependency-cruiser.js"
}
try {
  npx --yes depcruise --config .dependency-cruiser.js "$Src" --output-type json | Set-Content "$Out\deps.json"
} catch {
  "{}" | Set-Content "$Out\deps.json"
}

Write-Host ""
Write-Host "✅ Audit terminé."
Get-ChildItem -Path $Out | Select-Object Name,Length
Write-Host ""
Write-Host "Envoie-moi:"
Write-Host " - audit/index_hits.txt"
Write-Host " - audit/hooks.txt"
Write-Host " - audit/services.txt"
Write-Host " - audit/forms.txt"
Write-Host " - audit/auth.txt"
Write-Host " - audit/circular.txt"
Write-Host " - audit/deps.json"
