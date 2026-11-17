# chathub installer: downloads every tool into %USERPROFILE%\ChatHub so it all works offline.
# Safe to run again: it refreshes each tool from GitHub.
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$owner = 'spencerrios64'
$tools = 'chatzip','chatvault','chatscrub','chatdedupe','chatstats','chatsearch','chatgraph','chatbrief','promptbank','chatrelay','chatbridge','chatcompare','chatevals','chatpipeline','chattrainer'
$dest = Join-Path $env:USERPROFILE 'ChatHub'
New-Item -ItemType Directory -Force -Path $dest | Out-Null

function Get-Repo($name, $target) {
    $zip = Join-Path $env:TEMP ($name + '.zip')
    $tmp = Join-Path $env:TEMP ($name + '-extract')
    Invoke-WebRequest -UseBasicParsing -Uri ('https://github.com/' + $owner + '/' + $name + '/archive/refs/heads/main.zip') -OutFile $zip
    if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
    Expand-Archive -Path $zip -DestinationPath $tmp -Force
    $src = Get-ChildItem $tmp -Directory | Select-Object -First 1
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    Copy-Item -Path (Join-Path $src.FullName '*') -Destination $target -Recurse -Force
    Remove-Item $zip -Force
    Remove-Item $tmp -Recurse -Force
}

$failed = @()
foreach ($t in $tools) {
    try {
        Write-Host ('Downloading ' + $t + ' ...')
        Get-Repo $t (Join-Path $dest $t)
    } catch {
        Write-Host ('  could not download ' + $t + ': ' + $_.Exception.Message) -ForegroundColor Yellow
        $failed += $t
    }
}
Write-Host 'Downloading the hub page ...'
Get-Repo 'chathub' $dest

Set-Content -Path (Join-Path $dest 'start.bat') -Value '@echo off','start "" "%~dp0index.html"' -Encoding ASCII
try {
    $desktop = [Environment]::GetFolderPath('Desktop')
    $lnk = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $desktop 'ChatHub.lnk'))
    $lnk.TargetPath = Join-Path $dest 'start.bat'
    $lnk.WorkingDirectory = $dest
    $lnk.Save()
} catch { Write-Host 'Could not create the desktop shortcut (start.bat in the folder still works).' -ForegroundColor Yellow }

Write-Host ''
Write-Host ('Done. Installed to ' + $dest) -ForegroundColor Green
if ($failed.Count -gt 0) { Write-Host ('Failed: ' + ($failed -join ', ') + ' (run again later)') -ForegroundColor Yellow }
Start-Process (Join-Path $dest 'index.html')
