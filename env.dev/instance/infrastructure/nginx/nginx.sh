#!/bin/bash

#! /bin/bash
if [ -z $BASH ]; then
    echo "This shell script MUST run under bash."
    exit -1
fi
_script="$(readlink -f "${BASH_SOURCE[0]}")"
_script_dir="$(dirname "$_script")"
echo "Directory of $_script : $_script_dir"

set -o nounset
set -o errexit

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

echo -e "\n>>> 开始执行 nginx ..."

NGINX_CONF=${NGINX_SOLUTION}/conf/nginx.conf

# Show all env vars of nginx
env | grep NGINX

echo ">>> Nginx 运行 - 进入 solution 目录 ..."
set -x
pushd "${NGINX_SOLUTION}"
set +x

echo ">>> Nginx 运行 - 检查配置文件 ..."
set -x
nginx -t -c "${NGINX_CONF}" -p "${NGINX_SOLUTION}"
set +x

echo ">>> Nginx 运行 - 启动 nginx 进程 ..."
set -x
nginx -c "${NGINX_CONF}" -p "${NGINX_SOLUTION}"
set +x

echo -e ">>> nginx 启动完成.\n"

popd
