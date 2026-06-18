# stop hook — handoff READY → followup_message (Git Manager)
$ErrorActionPreference = 'SilentlyContinue'

$null = [Console]::In.ReadToEnd()

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$handoffPath = Join-Path $projectRoot 'handoff.json'

if (-not (Test-Path $handoffPath)) { exit 0 }

try {
  $handoff = Get-Content -Path $handoffPath -Raw -Encoding UTF8 | ConvertFrom-Json
} catch { exit 0 }

if ($handoff.status -ne 'READY') { exit 0 }

$followup = @'
handoff.json status is READY. Git Manager only (docs/agent/composer.md).

Validate diff, commit_groups, push, PR, squash merge, handoff DONE.
No new implementation.
'@

@{ followup_message = $followup.Trim() } | ConvertTo-Json -Compress
exit 0
