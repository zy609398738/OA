--这是在审批记录表bpm_log中新增电子签名字段的SQL
ALTER TABLE bpm_log
 ADD E_Signature VARCHAR(255);