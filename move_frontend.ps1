# Script to move frontend files to the frontend folder

# Create necessary directories
$frontendDir = "$PSScriptRoot\frontend"
$excludeDirs = @("node_modules", ".git", ".github", ".vscode", "getyovids")
$excludeFiles = @("package-lock.json", ".gitignore", "move_frontend.ps1")

# Create frontend directory if it doesn't exist
if (-not (Test-Path $frontendDir)) {
    New-Item -ItemType Directory -Path $frontendDir | Out-Null
}

# Get all files and directories in the current directory
Get-ChildItem -Path $PSScriptRoot -Force | ForEach-Object {
    $item = $_
    
    # Skip if it's in the exclude list
    if ($excludeDirs -contains $item.Name -or $excludeFiles -contains $item.Name) {
        Write-Host "Skipping excluded item: $($item.Name)"
        return
    }
    
    # Skip if it's the frontend directory itself
    if ($item.FullName -eq $frontendDir) {
        return
    }
    
    $destination = Join-Path -Path $frontendDir -ChildPath $item.Name
    
    # If the destination already exists, remove it first
    if (Test-Path $destination) {
        Remove-Item -Path $destination -Recurse -Force
    }
    
    # Move the item
    try {
        Move-Item -Path $item.FullName -Destination $destination -Force
        Write-Host "Moved: $($item.Name)"
    } catch {
        Write-Host "Failed to move $($item.Name): $_" -ForegroundColor Red
    }
}

Write-Host "Frontend files have been moved to the frontend directory." -ForegroundColor Green
