function Rename-KebabCase {
    param($Path)
    
    $items = Get-ChildItem -Path $Path -Recurse | Sort-Object @{Expression={$_.FullName.Length}; Descending=$true}
    
    foreach ($item in $items) {
        # Simple PascalCase to kebab-case logic for names like 'Form.tsx' -> 'form.tsx' and 'Dashboard.tsx' -> 'dashboard.tsx'
        $nameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($item.Name)
        $ext = [System.IO.Path]::GetExtension($item.Name)
        
        $newNameWithoutExt = [regex]::Replace($nameWithoutExt, '([a-z])([A-Z])', '$1-$2').ToLower()
        $newName = $newNameWithoutExt + $ext
        
        if ($newName -cne $item.Name) {
            $tempName = $item.Name + "-temp"
            git mv $item.FullName (Join-Path $item.Parent.FullName $tempName)
            git mv (Join-Path $item.Parent.FullName $tempName) (Join-Path $item.Parent.FullName $newName)
        }
    }
}
Rename-KebabCase "resources/js/pages/Admin"
git mv "resources/js/pages/Admin" "resources/js/pages/admin-temp"
git mv "resources/js/pages/admin-temp" "resources/js/pages/admin"
