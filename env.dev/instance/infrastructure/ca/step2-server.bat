@SETLOCAL
@call .etc\setEnv.cmd

%CMD_NEWLINE%
@echo ===============================================================================
@echo ���ɷ�������֤�� ==============================================================
@echo ===============================================================================

if "%JAVA_HOME%"=="" goto NO_JAVA_HOME

mkdir work
mkdir work\server
del /s /q work\server

@SET $_SERVER_DNAME=CN=%SERVER_DN_CN%, OU=%SERVER_DN_OU%, O=%BASE_DN_O%, L=%BASE_DN_L%, ST=%BASE_DN_ST%, C=%BASE_DN_C%
@SET CMDLINE=keytool
@REM -genkey[������Կ��] -alias[��Կ�Ա���] -validity[��Կ��Ч��] -keyalg[��Կ�㷨����] -keysize[��Կλ��]
@SET CMDLINE=%CMDLINE% -genkey -alias %SERVER_ALIAS% -validity %SERVER_KEY_DAYS% -keyalg RSA -keysize 1024
@REM -keypass[��Կ��������]- storepass[�洢����]
@SET CMDLINE=%CMDLINE% -keypass %SERVER_KEYPASS% -storepass %SERVER_STOREPASS%
@REM -dname[������ظ�����Ϣ,����cn�Ƿ�����������һ��Ҫ��WEB�����������õ�һ��] -keystore[��Կ�洢�ļ�·��]
@SET CMDLINE=%CMDLINE% -dname "%$_SERVER_DNAME%" -keystore work\server\%SERVER_KEYSTORE%
%CMD_NEWLINE%
@echo ===============================================================================
@echo ����KeyPair: work\server\%SERVER_KEYSTORE%
%CMDLINE%

@SET CMDLINE=keytool
@REM -certreq[������ǩ��֤��] -alias[֤�����] -sigalg[֤���㷨����] -file [�����ļ����·��]
@SET CMDLINE=%CMDLINE% -certreq -alias %SERVER_ALIAS% -sigalg MD5withRSA -file work\server\server.csr
@REM -keypass[��Կ��������] -keystore[�洢�ļ�·��] -storepass[�洢����]
@SET CMDLINE=%CMDLINE% -keypass %SERVER_KEYPASS% -keystore work\server\%SERVER_KEYSTORE% -storepass %SERVER_STOREPASS%
%CMD_NEWLINE%
@echo ===============================================================================
@echo ���ɴ�ǩ��֤�� work\server\server.csr
%CMDLINE%

@SET CMDLINE=openssl
@REM x509[ǩ��x509֤������] -req[�����ǩ��֤��] -in[�����ǩ��֤���ļ�·��] -out[����x509֤���ļ����·��]
@SET CMDLINE=%CMDLINE% x509 -req -in work\server\server.csr -out work\server\server-cert.pem
@REM // -CA[ǩ����֤��] -CAkey[��֤����Կ�ļ�] -days[֤����Ч��] -CAcreateserial[�������к�]
@REM // SET CMDLINE=%CMDLINE% -CA work\ca\ca-cert.pem -CAkey work\ca\ca-key.pem -days %SERVER_KEY_DAYS% -CAcreateserial -sha1 -trustout
@REM -CA[ǩ����֤��] -CAkey[��֤����Կ�ļ�] -days[֤����Ч��] -CAserial[CA���к��ļ�]
@SET CMDLINE=%CMDLINE% -CA work\ca\ca-cert.pem -CAkey work\ca\ca-key.pem -days %SERVER_KEY_DAYS%
@SET CMDLINE=%CMDLINE% -CAserial %OPENSSL_SRL_FILE% -sha1 -trustout
%CMD_NEWLINE%
@echo ===============================================================================
@echo ��CA˽Կ����ǩ��, ����x509֤���ļ� work\server\server-cert.pem
%CMDLINE%

%CMD_NEWLINE%
@echo ===============================================================================
@echo ����(�滻)���ε�CA��֤�鵽JSSE��Ĭ��λ��(%JDK_KEYSTORE%)
@REM ����ǰ����ɾ��(���ԭ���Ѿ������)
keytool -delete -v -alias %JDK_CA_ROOT_ALIAS% -storepass %JDK_STOREPASS% -keystore %JDK_KEYSTORE%

@SET CMDLINE=keytool
@REM -import[��������] -v trustcacerts[��������֤��] -storepass[�洢����] -alias[CA��֤��ı���]
@SET CMDLINE=%CMDLINE% -import -v -trustcacerts -storepass %JDK_STOREPASS% -alias %JDK_CA_ROOT_ALIAS%
@REM -file[֤���ļ�·��] -keystore[�����ļ�·��] -noprompt[����ʾ"���������֤��"]
@SET CMDLINE=%CMDLINE% -file work\ca\ca-cert.pem -keystore %JDK_KEYSTORE% -noprompt
%CMDLINE%

@SET CMDLINE=keytool
@REM -import[��������] -v trustcacerts[��������֤��] -storepass[�洢����] -keypass[��Կ��������]
@SET CMDLINE=%CMDLINE% -import -v -trustcacerts -storepass %SERVER_STOREPASS% -keypass %SERVER_KEYPASS%
@REM  -alias[������֤��ı���] -file[֤���ļ�·��] -keystore[�����ļ�·��]
@SET CMDLINE=%CMDLINE% -alias %SERVER_ALIAS% -file work\server\server-cert.pem -keystore work\server\%SERVER_KEYSTORE%
%CMD_NEWLINE%
@echo ===============================================================================
@echo ��CAǩ�����server��֤�鵼��keystore: work\server\%SERVER_KEYSTORE%
%CMDLINE%

@SET CMDLINE=keytool
@REM -import[��������] -v trustcacerts[��������֤��] -storepass[�洢����] -keypass[��Կ��������]
@SET CMDLINE=%CMDLINE% -import -v -trustcacerts -storepass %SERVER_STOREPASS% -keypass %SERVER_KEYPASS%
@REM  -alias[������֤��ı���] -file[֤���ļ�·��] -keystore[�����ļ�·��] -noprompt[����ʾ"����Ȼ��Ҫ������ӵ��Լ���keystore ��"]
@SET CMDLINE=%CMDLINE% -alias %JDK_CA_ROOT_ALIAS% -file work\ca\ca-cert.pem -keystore work\server\%SERVER_KEYSTORE% -noprompt
%CMD_NEWLINE%
@echo ===============================================================================
@echo ��CA��֤�鵼��keystore: work\server\%SERVER_KEYSTORE%
%CMDLINE%

%CMD_NEWLINE%
@echo �鿴JSSE CA��֤�� ==============================================================
REM keytool -list -storepass %JDK_STOREPASS% -keystore %JDK_KEYSTORE%
keytool -list -storepass %JDK_STOREPASS% -keystore %JDK_KEYSTORE% -alias %JDK_CA_ROOT_ALIAS% -v
%CMD_NEWLINE%
@echo ɾ�����뵽JSSE��Ĭ��λ�õ�CA��֤��(ʹJDK�ָ�ԭ״)==============================
keytool -delete -v -alias %JDK_CA_ROOT_ALIAS% -storepass %JDK_STOREPASS% -keystore %JDK_KEYSTORE%
@echo ===============================================================================

%CMD_NEWLINE%
@echo �����ɵ�֤�鱣������(��������ʹ��) ============================================
copy work\server\%SERVER_KEYSTORE% dist\server\%SERVER_KEYSTORE%
%CMD_NEWLINE%
@echo �鿴server��֤�� ==============================================================
keytool -list -storepass %SERVER_STOREPASS% -keystore dist\server\%SERVER_KEYSTORE% -v
@echo ===============================================================================



@goto END

:NO_JAVA_HOME
@echo Ҫ����"���ɷ�������֤��"������, ����Ҫ��װJDK������"JAVA_HOME"��������

:END
@pause

@ENDLOCAL