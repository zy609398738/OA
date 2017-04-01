CREATE TABLE BOKEDEE_INTERFACE_STATUSLOG
(
        ID varchar(50) NOT NULL primary key,
        STARTTIMESTAMP Timestamp NULL,
        ENDTIMESTAMP Timestamp NULL,
        USETIMESTAMP Integer NULL default 0,
        TRANSFERDATASIZE FLOAT,
        STATUS Integer NULL,
        INTERFACEID varchar(150) NULL,
        SERVICEID varchar(150) NULL,
        INTERFACEDESC varchar(500) NULL,
        SERVICEDESC varchar(500) NULL,
        INTERFACENAME varchar(200) NULL,
        SERVICENAME varchar(200) NULL,
        FLAG Integer NULL default 0
);
create table BOKEDEE_INTERFACE_DETLOG
(
          ID  varchar(50) NOT NULL,
          TRANSFORMER_NAME   varchar(200) NULL,
          PROCESS_DATETIME   Timestamp NULL,
          PAYLOAD_TYPE       varchar(150) NULL,
          ISNORMAL           Integer NULL,
          PAYLOAD_CONTENT    Blob NULL,
          INBOUND_PROPERTY   Blob NULL,
          SESSION_PROPERTY   Blob NULL,
          OUTBOUND_PROPERTY  Blob NULL,
          INVOCATION_PROPERTY Blob NULL
);
create index BOKEDEE_STATUSLOG_index on BOKEDEE_INTERFACE_STATUSLOG(STARTTIMESTAMP,ENDTIMESTAMP,USETIMESTAMP,INTERFACEID,SERVICEID);
create index BOKEDEE_DETLOG_index on BOKEDEE_INTERFACE_DETLOG(ID)