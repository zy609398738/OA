@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo.
echo ">>> ��ʼִ�� nginx ..."

:: SHELL_ROOT - Location(Path) of this batch file
pushd "%~dp0"
set SHELL_ROOT=!cd!
popd

set NGINX_CONF=%NGINX_SOLUTION%\conf\nginx.conf

:: Show all env vars of nginx
set NGINX

@echo on
pushd "%NGINX_SOLUTION%"
@set _ERR_CODE=%ERRORLEVEL%
@echo off
IF NOT "%_ERR_CODE%"=="0" (
	echo ">>> Nginx ����(���� solution Ŀ¼)����: %_ERR_CODE%"
	exit /b %_ERR_CODE%
)

@echo on
call "%NGINX_PROG_PATH%" -t -c "%NGINX_CONF%"
@set _ERR_CODE=%ERRORLEVEL%
@echo off
IF NOT "%_ERR_CODE%"=="0" (
	echo ">>> Nginx ����(��������ļ�)����: %_ERR_CODE%"
	@echo on
    :: -t ���������ܹ���ʾ���������Ϣ, ������ -t ��ͨ�����������Ҫ����һ�� -c ����ʾ������Ϣ
    call "%NGINX_PROG_PATH%" -c "%NGINX_CONF%"
    @echo off
    exit /b %_ERR_CODE%
)

@echo on
start "Nginx" "%NGINX_PROG_PATH%" -c "%NGINX_CONF%"
@set _ERR_CODE=%ERRORLEVEL%
@echo off
IF NOT "%_ERR_CODE%"=="0" (
	echo ">>> Nginx ����(���� nginx ����)����: %_ERR_CODE%"
	exit /b %_ERR_CODE%
)

popd

echo ">>> nginx �������."
echo.

ENDLOCAL
