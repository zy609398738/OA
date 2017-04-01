#!/bin/bash

cd "${LAUNCHER_PATH}"

export JAVA_HOME="${JAVA_HOME}"
export JAVA_OPTS="-server -Xms1024m -Xmx2048m"
export ADDITIONAL_CP="${LAUNCHER_RUNTIME_CLASSES}:${ADDITIONAL_CP}"

export JPDA_OPTS=

#Uncomment this statement to enable JPDA debugging
#export JPDA_OPTS="-Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,address=47777,server=y,suspend=n"

$JAVA_HOME/bin/java $JAVA_OPTS $JPDA_OPTS -Dfile.encoding=utf-8 -cp "./*:$ADDITIONAL_CP" com.bokesoft.yes.Launcher
