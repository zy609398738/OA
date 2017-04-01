@SETLOCAL
@call .etc\setEnv.cmd

@REM ���������� ===================================================================
@echo off
REM �ж��Ƿ����������
if NOT "%1"=="" goto SET_CMDLINE
goto SET_CMDLINE_END
:SET_CMDLINE
SET $_CMDLINE=TRUE
:SET_CMDLINE_END

REM ����������� 1-Common Name, 2-Organizational Unit Name, 3-export password
if NOT "%1"=="" goto SET_CLIENT_DN_CN
goto SET_CLIENT_DN_CN_END
:SET_CLIENT_DN_CN
SET CLIENT_DN_CN=%1
echo CLIENT_DN_CN=%CLIENT_DN_CN%
:SET_CLIENT_DN_CN_END

if NOT "%2"=="" goto SET_CLIENT_DN_OU
goto SET_CLIENT_DN_OU_END
:SET_CLIENT_DN_OU
SET CLIENT_DN_OU=%2
echo CLIENT_DN_OU=%CLIENT_DN_OU%
:SET_CLIENT_DN_OU_END

if NOT "%3"=="" goto SET_CLIENT_EXP_PWD
goto SET_CLIENT_EXP_PWD_END
:SET_CLIENT_EXP_PWD
SET CLIENT_EXP_PWD=%3
echo CLIENT_EXP_PWD=%CLIENT_EXP_PWD%
:SET_CLIENT_EXP_PWD_END

@echo on
@REM ================================================================================


%CMD_NEWLINE%
@echo ===============================================================================
@echo ���ɿͻ���֤�� ================================================================
@echo ===============================================================================

mkdir work
mkdir work\client
del /s /q work\client

%CMD_NEWLINE%
@echo ===============================================================================
@echo ����client˽Կ: work\client\client-key.pem
@REM genrsa [������Կ����] -out[��Կ�ļ����·��] 1024 [��Կλ��]
openssl genrsa -out work\client\client-key.pem 1024

@SET $_CLIENT_DN=/C=%BASE_DN_C%/ST=%BASE_DN_ST%/L=%BASE_DN_L%/O=%BASE_DN_O%/OU=%CLIENT_DN_OU%/CN=%CLIENT_DN_CN%
%CMD_NEWLINE%
@echo ===============================================================================
@echo ���ɴ�ǩ��֤��: work\client\client-req.csr
@REM req[����֤������] -new[������] -out[֤���ļ����·��] -key[˽Կ�ļ�·��]
@REM -subj[request's subject, �������Distinguished Name(DN)��Ϣ]
openssl req -new -out work\client\client-req.csr -key work\client\client-key.pem -subj %$_CLIENT_DN%


@SET CMDLINE=openssl
@REM x509[ǩ��x509֤������] -req[�����ǩ��֤��] -in[�����ǩ��֤���ļ�·��] -out[����x509֤���ļ����·��]
@SET CMDLINE=%CMDLINE% x509 -req -in work\client\client-req.csr -out work\client\client.crt
@REM -signkey [��Կ�ļ�·��]
@SET CMDLINE=%CMDLINE% -signkey work\client\client-key.pem
@REM // -CA[ǩ����֤��] -CAkey[��֤����Կ�ļ�] -days[֤����Ч��] -CAcreateserial[�������к�]
@REM // SET CMDLINE=%CMDLINE% -CA work\ca\ca-cert.pem -CAkey work\ca\ca-key.pem -days %CLIENT_KEY_DAYS% -CAcreateserial
@REM -CA[ǩ����֤��] -CAkey[��֤����Կ�ļ�] -days[֤����Ч��] -CAserial[CA���к��ļ�]
@SET CMDLINE=%CMDLINE% -CA work\ca\ca-cert.pem -CAkey work\ca\ca-key.pem -days %CLIENT_KEY_DAYS% -CAserial %OPENSSL_SRL_FILE%
%CMD_NEWLINE%
@echo ===============================================================================
@echo ��CA˽Կ����ǩ��, ����x509֤���ļ�: work\client\client.crt
%CMDLINE%

@SET $_CLIENT_P12_FILE=%CLIENT_DN_OU%-%CLIENT_DN_CN%.p12
@SET CMDLINE=openssl
@REM pkcs12[����PKS12��ʽ֤������] -export[�����ļ�] -clerts[������client֤��] -password[��������]
@SET CMDLINE=%CMDLINE% pkcs12 -export -clcerts -password pass:%CLIENT_EXP_PWD%
@REM -in[�����client֤���ļ�·��] -inkey[client֤����Կ�ļ�·��] -out[����PKS12��ʽ�ļ�·��]
@SET CMDLINE=%CMDLINE% -in work\client\client.crt -inkey work\client\client-key.pem -out work\client\%$_CLIENT_P12_FILE%
@REM -name[�üǵ�����]
@SET CMDLINE=%CMDLINE% -name %CLIENT_DN_OU%-%CLIENT_DN_CN%
%CMD_NEWLINE%
@echo ===============================================================================
@echo ����client�˵ĸ���֤��: work\client\%$_CLIENT_P12_FILE%
%CMDLINE%

%CMD_NEWLINE%
@echo ===============================================================================
@echo �����ɵ�֤�鱣������(�������û�)
copy work\client\%$_CLIENT_P12_FILE% dist\client\%$_CLIENT_P12_FILE%

@if "%$_CMDLINE%"=="TRUE" goto NO_PAUSE
@pause
:NO_PAUSE

@ENDLOCAL