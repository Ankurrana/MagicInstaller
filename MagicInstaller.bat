@echo off
call where node.exe >nul 2>&1 && node install.js || echo "Please install node and add it to windows path to continue"
pause
