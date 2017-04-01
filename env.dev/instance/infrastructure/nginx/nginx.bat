@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo.
echo ">>> 开始执行 nginx ..."

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
	echo ">>> Nginx 运行(进入 solution 目录)错误: %_ERR_CODE%"
	exit /b %_ERR_CODE%
)

@echo on
call "%NGINX_PROG_PATH%" -t -c "%NGINX_CONF%"
@set _ERR_CODE=%ERRORLEVEL%
@echo off
IF NOT "%_ERR_CODE%"=="0" (
	echo ">>> Nginx 运行(检查配置文件)错误: %_ERR_CODE%"
	@echo on
    :: -t 参数并不能够显示具体错误信息, 所以在 -t 不通过的情况下需要运行一遍 -c 以显示错误信息
    call "%NGINX_PROG_PATH%" -c "%NGINX_CONF%"
    @echo off
    exit /b %_ERR_CODE%
)

@echo on
start "Nginx" "%NGINX_PROG_PATH%" -c "%NGINX_CONF%"
@set _ERR_CODE=%ERRORLEVEL%
@echo off
IF NOT "%_ERR_CODE%"=="0" (
	echo ">>> Nginx 运行(启动 nginx 进程)错误: %_ERR_CODE%"
	exit /b %_ERR_CODE%
)

popd

echo ">>> nginx 启动完成."
echo.

ENDLOCAL
