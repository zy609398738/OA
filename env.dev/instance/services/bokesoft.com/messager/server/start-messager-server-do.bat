@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

title Bokesoft Messager Server

:: SHELL_ROOT - Location(Path) of this batch file
pushd "%~dp0"
set SHELL_ROOT=!cd!
popd

:: JAVA_HOME
if "%JAVA_HOME%"=="" (
    set JAVA_HOME=!REDIST_ROOT!\infrastructure\jdk\default
    echo ^>^>^> Environment variable [JAVA_HOME] is empty, use the defaule value [!JAVA_HOME!]
)

:: Clean the other important variables
set JDBC_URL=

:: Call rhino-shell
set XP_PATCH_KILL_BY_CMDLINE=!REDIST_ROOT!\etc\runner\vbs\killByStamp.vbs
set CLASSPATH=!SHELL_ROOT!/main/src/main/resources;!SHELL_ROOT!/main/dist/jars/*;!SHELL_ROOT!/main/dist/libs/*
set CMDLINE="!JAVA_HOME!\bin\java" -Dplugin.stamp=bokesoft-messager@!PROFILE! -cp "!CLASSPATH!" com.bokesoft.services.messager.Starter
echo !CMDLINE!
call !CMDLINE!

ENDLOCAL
