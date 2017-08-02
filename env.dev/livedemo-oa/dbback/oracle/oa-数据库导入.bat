sqlplus system/system as sysdba@XE @oa-createuser.sql
imp oa/oa@XE fromuser=oa touser=oa file=oa.dmp
pause