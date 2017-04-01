SETLOCAL

pushd "${DESIGNER_PATH}"

set JAVA_HOME=${JAVA_HOME}
set JAVA_OPTS=-server -Xms128m -Xmx900m
set ADDITIONAL_CP="${DESIGNER_RUNTIME_CLASSES}";${ADDITIONAL_CP};"${PLUGIN_PATH}/.etc/javax.servlet-api-3.1.0.jar"
set SOLUTION_PATH=${SOLUTION_PATH}

set DESIGNER_MOCK_URL=${DESIGNER_MOCK_URL}

set JPDA_OPTS=

::Uncomment this statement to enable JPDA debugging
set JPDA_OPTS=-Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,address=57777,server=y,suspend=n

"%JAVA_HOME%\bin\java" %JAVA_OPTS% %JPDA_OPTS% -Dfile.encoding=utf-8 -cp ./*;%ADDITIONAL_CP% com.bokesoft.yes.dev.DevSuite "%SOLUTION_PATH%"

popd
ENDLOCAL
