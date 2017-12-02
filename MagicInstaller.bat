@echo off
SET PATH=%PATH%;c:\program files\nodejs

call where node.exe >nul 2>&1 && node.exe install.js || echo "Please install node and add it to windows path to continue"
pause
