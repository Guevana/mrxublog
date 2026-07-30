@echo off
chcp 65001 >nul
setlocal

set SERVER=root@47.109.26.96
set DEPLOY_PATH=/var/www/mrxublog-frontend
set BACKUP_PATH=/var/www/mrxublog-frontend-backup
set LOCAL_DIST=%~dp0dist

echo ========================================
echo   MrxuBlog Frontend Deploy
echo ========================================
echo.

echo [1/4] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b %errorlevel%
)
echo.

echo [2/4] Backing up existing deployment...
ssh -o StrictHostKeyChecking=no %SERVER% "if [ -d %DEPLOY_PATH% ]; then rm -rf %BACKUP_PATH% && cp -r %DEPLOY_PATH% %BACKUP_PATH% && echo Backup OK; else echo No existing deployment, skip backup; fi"
if %errorlevel% neq 0 (
    echo [ERROR] Backup failed!
    pause
    exit /b %errorlevel%
)
echo.

echo [3/4] Clearing old deployment...
ssh -o StrictHostKeyChecking=no %SERVER% "rm -rf %DEPLOY_PATH%/*"
if %errorlevel% neq 0 (
    echo [ERROR] Clear failed!
    pause
    exit /b %errorlevel%
)
echo.

echo [4/4] Uploading new build...
scp -o StrictHostKeyChecking=no -r "%LOCAL_DIST%\*" %SERVER%:%DEPLOY_PATH%/
if %errorlevel% neq 0 (
    echo [ERROR] Upload failed!
    pause
    exit /b %errorlevel%
)
echo.

echo ========================================
echo   Deploy completed!
echo ========================================
echo.
echo   URL: https://mrxublog.com
echo.

pause
