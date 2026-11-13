param(
  [Parameter(Mandatory = $true)]
  [string]$SceneFile,
  [ValidateSet('preview', 'render')]
  [string]$Mode = 'preview'
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$scene = (Resolve-Path $SceneFile).Path
$articleDir = Split-Path (Split-Path $scene -Parent) -Parent
$slug = Split-Path $articleDir -Leaf
$assetsDir = Join-Path $root (Join-Path 'public\media' $slug)
$mediaDir = Join-Path $root '.manim-media'
$python = Join-Path $root '.venv\Scripts\python.exe'
$ffmpegFallback = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter ffmpeg.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue)
if (-not $ffmpeg) { $ffmpeg = $ffmpegFallback }

if (-not (Test-Path $python)) {
  throw "Missing .venv. Create a Python 3.11+ environment and install Manim CE."
}
if (-not $ffmpeg -or -not (Test-Path $ffmpeg)) {
  throw "FFmpeg was not found. Install it and restart Zed."
}

$source = Get-Content $scene -Raw
$sceneMatch = [regex]::Match($source, 'class\s+([A-Za-z_]\w*)\s*\(\s*ThreeDScene\s*\)')
if (-not $sceneMatch.Success) {
  throw "No ThreeDScene class found in $scene"
}
$sceneName = $sceneMatch.Groups[1].Value
$outputMatch = [regex]::Match($source, '(?m)^#\s*output:\s*([A-Za-z0-9._-]+)\s*$')
$outputName = if ($outputMatch.Success) { $outputMatch.Groups[1].Value } else { [IO.Path]::GetFileNameWithoutExtension($scene) }

New-Item -ItemType Directory -Force $assetsDir, $mediaDir | Out-Null

if ($Mode -eq 'preview') {
  & $python -m manim -ql --disable_caching --media_dir $mediaDir $scene $sceneName
  if ($LASTEXITCODE -ne 0) { throw "Manim preview render failed." }
  $preview = Get-ChildItem $mediaDir -Recurse -Filter "$sceneName.mp4" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $preview) { throw "Preview MP4 was not generated." }
  Start-Process $preview.FullName
  Write-Host "Preview: $($preview.FullName)"
  exit 0
}

& $python -m manim -r 1920,1080 --fps 30 --disable_caching --media_dir $mediaDir --format mp4 -o "$outputName.mp4" $scene $sceneName
if ($LASTEXITCODE -ne 0) { throw "Manim production render failed." }
$rendered = Get-ChildItem $mediaDir -Recurse -Filter "$outputName.mp4" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $rendered) { throw "Production MP4 was not generated." }

$mp4 = Join-Path $assetsDir "$outputName.mp4"
$webm = Join-Path $assetsDir "$outputName.webm"
$poster = Join-Path $assetsDir "$outputName-poster.webp"
Copy-Item $rendered.FullName $mp4 -Force

& $ffmpeg -y -i $mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -an $webm
if ($LASTEXITCODE -ne 0) { throw "WebM conversion failed." }
& $ffmpeg -y -ss 00:00:02 -i $mp4 -frames:v 1 -c:v libwebp -quality 85 $poster
if ($LASTEXITCODE -ne 0) { throw "Poster generation failed." }

Write-Host "MP4:   $mp4"
Write-Host "WebM:  $webm"
Write-Host "Poster: $poster"
