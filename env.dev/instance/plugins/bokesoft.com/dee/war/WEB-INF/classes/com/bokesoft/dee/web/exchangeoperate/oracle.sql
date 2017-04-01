create table BOKEDEE_T_EX_USER
(
  ID         VARCHAR2(32) not null primary key,
  CODE       VARCHAR2(36),
  NAME       VARCHAR2(60),
  PASSWORD   VARCHAR2(30),
  ISADMIN    NUMBER(32),
  EXSTATE    NUMBER(32),
  MODIFYTIME TIMESTAMP(6),
  CREATETIME TIMESTAMP(6),
  TYPE       NUMBER(2) DEFAULT 0,
  UUID       VARCHAR2(32)
);
create table BOKEDEE_T_EX_GROUP
(
  ID         VARCHAR2(32) not null primary key,
  CODE       VARCHAR2(36),
  NAME       VARCHAR2(60),
  PASSWORD   VARCHAR2(30),
  EXSTATE    NUMBER,
  MODIFYTIME TIMESTAMP(6),
  CREATETIME TIMESTAMP(6),
  TYPE       NUMBER(2) DEFAULT 1,
  UUID       VARCHAR2(32)
);
create table BokeDee_RELATION
(
  ID        VARCHAR2(32) not null primary key,
  SOURCEID  VARCHAR2(32),
  TARGETID  VARCHAR2(32),
  CREATETIME TIMESTAMP(6),
  TYPE    NUMBER(2) DEFAULT 0 
);
create table BokeDee_GROUP_CELL
(
  ID        VARCHAR2(32) not null primary key,
  GROUPID   VARCHAR2(32),
  CODEID    VARCHAR2(32),
  CREATETIME TIMESTAMP(6),
  TYPE      NUMBER(2) DEFAULT 0
);
create table BOKEDEE_ACTIONTYPE
(
  ID          VARCHAR2(32) not null primary key,
  DESCRIPTION VARCHAR2(1000),
  CREATETIME  TIMESTAMP(6),
  TYPE    NUMBER(10),
  ACTIONTYPE  VARCHAR2(100)
);
create table BOKEDEE_SEND_LOG
(
  ID         VARCHAR2(32) not null primary key,
  EVENTID    VARCHAR2(100),
  SSOURCE    VARCHAR2(100),
  RTARGET    VARCHAR2(100),
  CREATETIME TIMESTAMP(6),
  EXPIRETIME TIMESTAMP(6),
  ACTIONTYPE VARCHAR2(32),
  MSG VARCHAR2(100),
  TYPE    NUMBER(2),
  BIZDATA    BLOB
);
create table BOKEDEE_COPYFIND
(
  ID         VARCHAR2(32) not null primary key,
  EVENTID    VARCHAR2(100),
  SSOURCE    VARCHAR2(100),
  RTARGET    VARCHAR2(100),
  CREATETIME TIMESTAMP(6),
  EXPIRETIME TIMESTAMP(6),
  COPYTIME TIMESTAMP(6) default CURRENT_DATE,
  ACTIONTYPE VARCHAR2(32),
  MSG VARCHAR2(100),
  TYPE    NUMBER(2),
  BIZDATA    BLOB
);
create index BokeDee_SEND_LOG_index on BokeDee_SEND_LOG(createtime,eventid,ssource,rtarget);
create index BokeDee_COPYFIND_index on BokeDee_COPYFIND(createtime,eventid,ssource,rtarget)