/* Formatted on 2016-03-30 15:22:08 (QP5 v5.256.13226.35538) */
--查询系统指定段延迟创建状态，Oracl1e11g-r2为了节省空间，默认为TRUE，导致空表无法EXP导出。
--项目上清空数据库业务数据，做数据初始化时会导致空表无法导出。
SHOW PARAMETER deferred_segment_creation;

--新建表的处理
--将指定段延迟创建状态改为false，只需要设置一次就可以了。
--下次数据清空的表或新建的表就不会出现无法导出的情况。
ALTER SYSTEM SET deferred_segment_creation = FALSE;

--已有表的处理
--查询当前用户的所有已存在的数据库表的修改语句
--select 'ALTER TABLE ' ||table_name || ' ALLOCATE EXTENT;'
  --from user_tables
 --where num_rows =0;

--查询出OA-Demo数据库的修改语句，执行
--ALTER TABLE YIGO_SEARCHSOA_ALL_DIC_IDS ALLOCATE EXTENT;
