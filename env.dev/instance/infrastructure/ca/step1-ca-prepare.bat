@SETLOCAL
@call .etc\setEnv.cmd

%CMD_NEWLINE%
@echo ===============================================================================
@echo ��PKCS12��ʽ��CA��֤�鵼�� CA˽Կ��δ����CA��֤�� =============================
@echo ===============================================================================

mkdir work
mkdir work\ca
del /s /q work\ca

%CMD_NEWLINE%
@echo ===============================================================================
@echo ��PKCS12��ʽ��CA֤�鵼�������ܵ�CA֤��: work\ca\ca-cert.pem
openssl pkcs12 -in dist\ca-cert\%CA_DN_CN%-%CA_DN_OU%.pfx -clcerts -nodes -nokeys -out work\ca\ca-cert.pem.1
@REM ���õ���֤���ļ��Ŀ�ͷ����(Bag Attributes)ȥ��
@REM ��Ϊstep2-server.bat��keytool importʱ����Ϊ����Bag Attributes���ļ�"����һ�� X.509 ��֤"
%CMD_SED% -e '1,4d' work\ca\ca-cert.pem.1 > work\ca\ca-cert.pem

%CMD_NEWLINE%
@echo ===============================================================================
@echo ��PKCS12��ʽ��CA֤�鵼��CA˽Կ: work\ca\ca-key.pem
openssl pkcs12 -in dist\ca-cert\%CA_DN_CN%-%CA_DN_OU%.pfx -clcerts -nodes -out work\ca\file.pem
openssl rsa -in work\ca\file.pem -out work\ca\ca-key.pem

@pause