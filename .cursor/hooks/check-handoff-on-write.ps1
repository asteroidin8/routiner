# postToolUse — handoff.json written as READY → remind Git Manager
$ErrorActionPreference = 'SilentlyContinue'

$stdin = [Console]::In.ReadToEnd()
if ($stdin -and $stdin -notmatch 'handoff\.json') { exit 0 }

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$handoffPath = Join-Path $projectRoot 'handoff.json'

if (-not (Test-Path $handoffPath)) { exit 0 }

try {
  $handoff = Get-Content -Path $handoffPath -Raw -Encoding UTF8 | ConvertFrom-Json
} catch { exit 0 }

if ($handoff.status -ne 'READY') { exit 0 }

$ctx = 'handoff.json is READY. Next: Git Manager (docs/agent/composer.md) — commit, PR, merge, DONE.'

@{ additional_context = $ctx } | ConvertTo-Json -Compress
exit 0
