--��sys��¼sql plus:
--conn sys/system as sysdba
--�鿴�����������
 select value from V$parameter where name='processes';

--�鿴��ǰ��������
 select count (*) from V$process;

--������������ĳ�500��
alter system set processes=500 scope=spfile;

--�鿴���α�����
show parameter open_cursors;

--�޸Ĵ��α�����
alter system set open_cursors=10000;

--����DB: 
--shutdown immediate;
--startup;