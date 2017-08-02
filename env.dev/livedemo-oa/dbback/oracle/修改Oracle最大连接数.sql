--用sys登录sql plus:
--conn sys/system as sysdba
--查看最大连接数：
 select value from V$parameter where name='processes';

--查看当前连接数：
 select count (*) from V$process;

--把最大连接数改成500：
alter system set processes=500 scope=spfile;

--查看打开游标数量
show parameter open_cursors;

--修改打开游标数量
alter system set open_cursors=10000;

--重启DB: 
--shutdown immediate;
--startup;