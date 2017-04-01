@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

SET BK_IM_DEV_MODE=Y

pushd "%~dp0"
call start-messager-server.bat

ENDLOCAL
