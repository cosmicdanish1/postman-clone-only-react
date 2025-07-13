$source = Get-ChildItem -Path . -Recurse | Where-Object { $_.FullName -notlike '*\..*' -and $_.FullName -notlike '*\node_modules*' }
$dest = Get-ChildItem -Path ..\frontend -Recurse | Where-Object { $_.FullName -notlike '*\..*' -and $_.FullName -notlike '*\node_modules*' }

Write-Host "Source files count: $($source.Count)"
Write-Host "Destination files count: $($dest.Count)"

if ($source.Count -eq $dest.Count) {
    Write-Host "✅ All files copied successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ File count mismatch!" -ForegroundColor Red
}
