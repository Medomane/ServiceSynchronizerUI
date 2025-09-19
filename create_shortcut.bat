@echo off
echo Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Synchronization Tasks.lnk'); $Shortcut.TargetPath = '%CD%\start.bat'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.Description = 'Start Synchronization Tasks Manager'; $Shortcut.Save(); Write-Host 'Shortcut created successfully!'"
pause
