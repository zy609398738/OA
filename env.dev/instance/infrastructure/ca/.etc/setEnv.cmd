@echo off
REM ===========================================================================
REM ע��: ���ĵ���������ϵͳ����, �벻Ҫ�޸ı����е�����!
REM ===========================================================================

SET PATH=%JAVA_HOME%\bin;.\.bin\openssl

SET PROMPT=--$g
SET CMD_NEWLINE=@.bin\cygwin\echo.exe -e "\n"
SET CMD_SED=.bin\cygwin\sed.exe

REM OPENSSL�����ļ�
SET OPENSSL_CONF=.etc\openssl.cnf.properties
REM �洢OPENSSL�����к�
SET OPENSSL_SRL_FILE=.etc\ca-cert.srl

call .etc\config.cmd


REM JSSE ���ε�CA��֤�����Կ�洢�ļ�·��
SET JDK_KEYSTORE=%JAVA_HOME%\jre\lib\security\cacerts
REM JSSE ���ε�CA��֤��Ĵ洢����, �ƺ����ܸı�
SET JDK_STOREPASS=changeit

REM JDK_CA_ROOT_ALIAS:���ε�CA��֤�����
SET JDK_CA_ROOT_ALIAS=%WEBSITE%-CA-ROOT

REM ALIAS:KeyPair����/������֤�����
SET SERVER_ALIAS=%WEBSITE%-%WEBSERVER%

REM KEYSTORE:��Կ�洢�ļ���
SET SERVER_KEYSTORE=%SERVER_ALIAS%.keystore

REM ������֤���е� distinguished name ��Ϣ(Common Name)
SET SERVER_DN_CN=%WEBSITE%

REM ����������Ŀ¼�ṹ
mkdir dist
mkdir dist\ca-cert
mkdir dist\client
mkdir dist\server

@echo on