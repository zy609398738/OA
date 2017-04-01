#!/bin/bash
useradd -mU -u ${oauserID} -d /home/oauser -s /bin/bash oauser
# Javascript debug option
#export THINKBASE_NET_RHINO_DEBUGGER="local://CMS"

# PROFILE 通常可以设置为基于 ${PROFILE_REPO} 的相对目录, 如果 bat 文件就放在 profile 下则可以不设, 或者简单的设为 $(cd "$(dirname "$0")"; pwd)
export PROFILE=$(cd "$(dirname "$0")"; pwd)

export TOMCAT_PORT_HTTP=8080

# 设置数据库连接信息
export JDBC_URL="jdbc:mysql://${DBSERVER}/${DBNAME}?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull"
export DB_USERNAME="${DB_USERNAME}"
export DB_PASSWORD="${DB_PASSWORD}"

# 复制 license
#cp -fv "$PROFILE/.conf"/*.lic "$PROFILE/../../instance/yigo-farm/base/1.6/"

# 必要时设置 JAVA_HOME 和 PATH
# export JAVA_HOME="/data/dada/java/jdk"
# export PATH="$JAVA_HOME/bin:$PATH"

# 最后简单的调用 boot.sh
chmod 777 "$PROFILE/../../instance/etc/runner/boot.sh"
echo "su oauser -c $PROFILE/../../instance/etc/runner/boot.sh"
su oauser -c "source /etc/profile;$PROFILE/../../instance/etc/runner/boot.sh"