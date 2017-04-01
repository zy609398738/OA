#!/bin/bash

cd "${DESIGNER_PATH}"

export JAVA_HOME="${JAVA_HOME}"
export JAVA_OPTS="-server -Xms1024m -Xmx2048m"
export ADDITIONAL_CP="${DESIGNER_RUNTIME_CLASSES}:${ADDITIONAL_CP}:${PLUGIN_PATH}/.etc/javax.servlet-api-3.1.0.jar"
export SOLUTION_PATH="${SOLUTION_PATH}"

export DESIGNER_MOCK_URL="${DESIGNER_MOCK_URL}"

export JPDA_OPTS=

#Uncomment this statement to enable JPDA debugging
#export JPDA_OPTS="-Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,address=37777,server=y,suspend=n"

$JAVA_HOME/bin/java $JAVA_OPTS $JPDA_OPTS -Dfile.encoding=utf-8 -cp "./*:$ADDITIONAL_CP" com.bokesoft.yes.dev.DevSuite "$SOLUTION_PATH"
