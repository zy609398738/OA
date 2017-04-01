SETLOCAL

pushd "${LAUNCHER_PATH}"

set JAVA_HOME=${JAVA_HOME}
set JAVA_OPTS=-server -Xms128m -Xmx900m
set ADDITIONAL_CP="${LAUNCHER_RUNTIME_CLASSES}";${ADDITIONAL_CP}

set JPDA_OPTS=

::Uncomment this statement to enable JPDA debugging
set JPDA_OPTS=-Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,address=47777,server=y,suspend=n

"%JAVA_HOME%\bin\java" %JAVA_OPTS% %JPDA_OPTS% -Dfile.encoding=utf-8 -cp ./*;%ADDITIONAL_CP% com.bokesoft.yes.Launcher

popd
ENDLOCAL
