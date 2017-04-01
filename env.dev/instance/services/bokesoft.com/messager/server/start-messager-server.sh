#!/bin/bash

log() {
    echo "`date '+%Y-%m-%d %H:%M:%S'` >> " "$*"
}
errorMsg() {
    echo ""
    echo -e ">> ERROR!" "$*"
    echo ""
}
error() {
    errorMsg "$*"
    read -p "Press <Enter> to exit ..." tmp
}

# 禁止使用 root 组的用户(gid=0(root))启动系统
if [ "$(id -g)" == "0" ]; then
    error ">>> 不能使用具有 root 权限的用户(gid=0(root))启动系统, 请使用普通用户运行; \\n\\n * 如果需要绑定 1024 以下的端口, 请使用 authbind, 或者通过 iptables 进行端口转发;"
	exit -10
fi

# SHELL_ROOT - Location(Path) of this batch file
SHELL_ROOT=$(cd "$(dirname "$0")"; pwd)

if [ -z $JAVA_HOME ]; then
    error ">>> 环境变量 [JAVA_HOME](Java环境安装目录)未设置, 系统退出;"
	exit -90
fi

# 清除一些重要的环境变量
#JDBC_URL=

# Call rhino-shell
CLASSPATH="$SHELL_ROOT/main/src/main/resources:$SHELL_ROOT/main/dist/jars/*:$SHELL_ROOT/main/dist/libs/*"
CMDLINE="$JAVA_HOME/bin/java -Dplugin.stamp=bokesoft-messager@${PROFILE} -cp $CLASSPATH com.bokesoft.services.messager.Starter"
echo $CMDLINE

if [ "${__BK_IM_LINUX_DEV_MODE}" = "Y" ]; then
    $CMDLINE
else
    if [ -d ./logs ] ; then
        $CMDLINE 1>> ./logs/bokesoft-messager.`date "+%Y%m%d-%H%M"`.log 2>&1 &
    else
        $CMDLINE 1>> bokesoft-messager.`date "+%Y%m%d-%H%M"`.log 2>&1 &
    fi
fi
