--��ΪOracle�ı�ռ�Ĭ���ǲ��Զ���չ�ģ��������ϱ�ռ䲻��������Ҫ�˹����ñ�ռ�
--��ѯʣ���ռ�
select b.file_name �����ļ���,
       b.tablespace_name ��ռ�,
       b.bytes / 1024 / 1024 ��СM,
       (b.bytes - sum(nvl(a.bytes, 0))) / 1024 / 1024 ��ʹ��M,
       substr((b.bytes - sum(nvl(a.bytes, 0))) / (b.bytes) * 100, 1, 5) ������
  from dba_data_files b left join dba_free_space a on a.file_id = b.file_id
 group by b.tablespace_name, b.file_name, b.bytes
 order by b.tablespace_name;
 
--���������ռ��С��
--alter database datafile '��ռ�λ��'resize �µĳߴ�
--���磺
--alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\SYSTEM.DBF' resize 4000m

--���ñ�ռ��Զ���չ,ÿ���Զ���չ��С100M,�������10000M
alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\SYSAUX.DBF'
      autoextend on next 100m maxsize 10000m;
--���ñ�ռ��Զ���չ,ÿ���Զ���չ��С100M,�������10000M
alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\SYSTEM.DBF'
      autoextend on next 100m maxsize 10000m;
--���ñ�ռ��Զ���չ,ÿ���Զ���չ��С100M,�������10000M
alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\UNDOTBS1.DBF'
      autoextend on next 100m maxsize 10000m;
--���ñ�ռ��Զ���չ,ÿ���Զ���չ��С100M,�������10000M
alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\USERS.DBF'
      autoextend on next 100m maxsize 10000m;