--因为Oracle的表空间默认是不自动扩展的，所以遇上表空间不足的情况需要人工设置表空间
--查询剩余表空间
select b.file_name 物理文件名,
       b.tablespace_name 表空间,
       b.bytes / 1024 / 1024 大小M,
       (b.bytes - sum(nvl(a.bytes, 0))) / 1024 / 1024 已使用M,
       substr((b.bytes - sum(nvl(a.bytes, 0))) / (b.bytes) * 100, 1, 5) 利用率
  from dba_data_files b left join dba_free_space a on a.file_id = b.file_id
 group by b.tablespace_name, b.file_name, b.bytes
 order by b.tablespace_name;
 
--增大所需表空间大小：
--alter database datafile '表空间位置'resize 新的尺寸
--例如：
--alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\SYSTEM.DBF' resize 4000m

--设置表空间自动扩展,每次自动扩展最小100M,最大上限10000M
alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\SYSAUX.DBF'
      autoextend on next 100m maxsize 10000m;
--设置表空间自动扩展,每次自动扩展最小100M,最大上限10000M
alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\SYSTEM.DBF'
      autoextend on next 100m maxsize 10000m;
--设置表空间自动扩展,每次自动扩展最小100M,最大上限10000M
alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\UNDOTBS1.DBF'
      autoextend on next 100m maxsize 10000m;
--设置表空间自动扩展,每次自动扩展最小100M,最大上限10000M
alter database datafile 'C:\ORACLEXE\APP\ORACLE\ORADATA\XE\USERS.DBF'
      autoextend on next 100m maxsize 10000m;