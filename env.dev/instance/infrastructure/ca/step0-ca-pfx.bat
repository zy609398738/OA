@SETLOCAL
@call .etc\setEnv.cmd

%CMD_NEWLINE%
@echo ===============================================================================
@echo ����CA˽Կ�Լ���ǩ����֤��, ���õ�PKCS12��ʽ��CA��֤�� ======================
@echo ===============================================================================

mkdir work
mkdir work\ca
del /s /q work\ca

%CMD_NEWLINE%
@echo ===============================================================================
@echo ����CA˽Կ ca-key.pem
@REM genrsa [������Կ����] -out[��Կ�ļ����·��] 1024 [��Կλ��]
openssl genrsa -out work\ca\ca-key.pem 1024

@SET $_CA_DN=/C=%BASE_DN_C%/ST=%BASE_DN_ST%/L=%BASE_DN_L%/O=%BASE_DN_O%/OU=%CA_DN_OU%/CN=%CA_DN_CN%
%CMD_NEWLINE%
@echo ===============================================================================
@echo ���ɴ�ǩ��֤�� ca-req.csr
@REM req[����֤������] -new[������] -out[֤���ļ����·��] -key[˽Կ�ļ�·��]
openssl req -new -out work\ca\ca-req.csr -key work\ca\ca-key.pem -subj %$_CA_DN%

%CMD_NEWLINE%
@echo ===============================================================================
@echo ��CA˽Կ������ǩ��, ����x509֤���ļ� ca-cert.pem
@REM x509[ǩ��x509֤������] -req[�����ǩ��֤��] -in[�����ǩ��֤���ļ�·��] -out[����x509֤���ļ����·��]
@REM -signkey[��ǩ����Կ�ļ�·��] -days[֤����Ч��]
openssl x509 -req -in work\ca\ca-req.csr -out work\ca\ca-cert.pem -signkey work\ca\ca-key.pem -days %CA_KEY_DAYS%

%CMD_NEWLINE%
@echo ===============================================================================
@echo ����CA֤��: work\ca\ca-cert.pfx, ע��һ��Ҫ��ס��������
@REM pkcs12[����PKCS12��ʽ֤������] -export[�����ļ�] -clerts[������client֤��] -password[��������]
@REM -in[�����client֤���ļ�·��] -inkey[client֤����Կ�ļ�·��] -out[����PKS12��ʽ�ļ�·��]
openssl pkcs12 -export -clcerts -in work\ca\ca-cert.pem -inkey work\ca\ca-key.pem -out work\ca\ca-cert.pfx

%CMD_NEWLINE%
@echo ===============================================================================
@echo �����ɵ�֤�鱣������(�Ժ���Ҫ�õ�)
copy work\ca\ca-cert.pfx dist\ca-cert\%CA_DN_CN%-%CA_DN_OU%.pfx

%CMD_NEWLINE%
@echo ===============================================================================
@echo ����CA���к��ļ�
echo 00 > %OPENSSL_SRL_FILE%

@pause

@ENDLOCAL