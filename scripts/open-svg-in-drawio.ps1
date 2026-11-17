param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$FilePath
)

$resolvedFile = (Resolve-Path -LiteralPath $FilePath -ErrorAction Stop).Path

if ([System.IO.Path]::GetExtension($resolvedFile) -ine '.svg') {
    Write-Error "The current file is not an SVG file: $resolvedFile"
    exit 1
}

$drawioPath = 'C:\Program Files\draw.io\draw.io.exe'
if (-not (Test-Path -LiteralPath $drawioPath -PathType Leaf)) {
    Write-Error "draw.io was not found at: $drawioPath"
    exit 1
}

Start-Process -FilePath $drawioPath -ArgumentList @($resolvedFile)
