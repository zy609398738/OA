#!/bin/bash

# SHELL_ROOT - Location(Path) of this batch file
SHELL_ROOT=$(cd "$(dirname "$0")"; pwd)

export BK_IM_DEV_MODE="Y"
export __BK_IM_LINUX_DEV_MODE="Y"  #For make start-messager-server.sh skip write log file
$SHELL_ROOT/start-messager-server.sh
