REM ===========================================================================
REM ��������ľ�������޸ı��ĵ�������Ϣ
REM ===========================================================================


REM ������Ϣ ==================================================================
REM ����֤�鹫�õ� distinguished name ��Ϣ
REM (O:Organization Name, L:Locality Name, ST:State or Province Name, C:Country Name)
SET BASE_DN_O=yigo-redist
SET BASE_DN_L=bokesoft
SET BASE_DN_ST=Shanghai
SET BASE_DN_C=CN
REM ===========================================================================


REM CA ������� ===============================================================
REM CA˽Կ֤���ļ�����Ч��(��)
SET CA_KEY_DAYS=3700

REM CA ֤���е� distinguished name ��Ϣ
REM CA��Ӧ��CN (Common Name)
SET CA_DN_CN=yigo-redist
REM CA��Ӧ��OU (Organizational Unit Name)
SET CA_DN_OU=yigo-redist-ca
REM ===========================================================================


REM ������֤��������� ========================================================
SET WEBSITE=yigo-redist.dev.bokesoft.com
SET WEBSERVER=YigoRedistWebSite

REM ������֤�����Ч��(��)
SET SERVER_KEY_DAYS=3700

REM KEYPASS:��Կ��������, STOREPASS:�洢����(����Tomcat��ʱ, �������������һ��)
SET SERVER_KEYPASS=openssl
SET SERVER_STOREPASS=openssl

REM ������֤���е� distinguished name ��Ϣ(Organizational Unit Name)
SET SERVER_DN_OU=yigo-redist-website
REM ===========================================================================


REM �ͻ���֤��������� ========================================================
REM �ͻ���֤���ļ�����Ч��(��)
SET CLIENT_KEY_DAYS=365

REM �ͻ�֤���е�Ĭ�� distinguished name ��Ϣ
SET CLIENT_DN_CN=test-user
SET CLIENT_DN_OU=yigo-redist-client

REM �ͻ�֤���Ĭ�ϵ�������
SET CLIENT_EXP_PWD=openssl
REM ===========================================================================
