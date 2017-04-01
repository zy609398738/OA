@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

pushd "%~dp0"
start /WAIT /B start-messager-server-do.bat

ENDLOCAL
