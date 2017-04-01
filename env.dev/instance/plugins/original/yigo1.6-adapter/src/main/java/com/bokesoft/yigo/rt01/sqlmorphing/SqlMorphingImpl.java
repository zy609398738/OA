package com.bokesoft.yigo.rt01.sqlmorphing;

import java.io.File;
import java.io.FileInputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.map.CaseInsensitiveMap;
import org.apache.commons.lang3.StringUtils;
import org.yaml.snakeyaml.Yaml;

import com.bokesoft.myerp.billmeta.BillMetaLinkedTable;
import com.bokesoft.myerp.common.rowset.BKRowSet;
import com.bokesoft.myerp.dev.common.IDocument;
import com.bokesoft.myerp.dev.mid.IMidContext;
import com.bokesoft.myerp.dev.mid.MidContextTool;
import com.bokesoft.yigo.redist.originals.myscm.DocTools;
import com.bokesoft.yigo.rt01.db.MidContextDBOptions;
import com.bokesoft.yigo.rt01.sqlmorphing.MorphingConfigVO.DataSourceConfig;
import com.bokesoft.yigo.rt01.utils.CtxDBUtils;
import com.bokesoft.yigo.rt01.utils.FileUtils;

public class SqlMorphingImpl {
	private static final int TABLR_INDEX_HEAD = 1;	//头表的 TableIndex 是 1
	
	/** 默认在配置目录下存放 SqlMorphing {@link MorphingConfigVO} 格式 YAML 文件的目录 */
	public static final String DEFAULT_SQL_MORPHING_YAML_DIR = "/Module/SCM/SqlMorphing";
	
	/** 通过当前 ThreadLocal 传递当前查询的明细行数据, 主要是供明细行计算 idFormula 时使用 */
	public static final ThreadLocal<Map<String, Object>> CURRENT_LINE_IN_THREAD = new ThreadLocal<Map<String,Object>>();
	
	public static int doTransfer(IMidContext ctx, String confFile) throws Throwable{
		File mphCfg = FileUtils.getFileInConfig(ctx, confFile, DEFAULT_SQL_MORPHING_YAML_DIR);
		
		Yaml yaml = new Yaml();
		MorphingConfigVO cfg = yaml.loadAs(new FileInputStream(mphCfg), MorphingConfigVO.class);
		Map<String, DataSourceConfig> dsCfgs = new CaseInsensitiveMap<String, DataSourceConfig>(cfg.getDataSources());
		
		IDocument srcDoc = ctx.getDocument();
		IDocument tgtDoc = null;
		
		BillMetaLinkedTable tgtMt = MidContextTool.getMetaTable(cfg.getTargetBillKey());
		//数据源名称 与 第几张表 的对应关系
		Map<String, Integer> dsIndexMap = new CaseInsensitiveMap<String, Integer>();
		_initCacheMap(tgtMt, dsIndexMap);

		//获取头表的数据源名称
		String tgtHeadTable = tgtMt.HeadTableName();
		//通过头表定义最终确定是 new 还是 load 目标 document
		DataSourceConfig hdDsCfg = dsCfgs.get(tgtHeadTable);
		int tgtHeadBillID = -1;
		if (null==hdDsCfg){
			//没有明确的头表定义, 只能每次都新增
			tgtDoc = _newDocument(ctx, cfg);
		}else{
			tgtHeadBillID = _evalHeadIdFormula(ctx, srcDoc, tgtHeadTable, hdDsCfg.getIdFormula());
			if (tgtHeadBillID > 0){
				String tgtHeadIdFld = tgtMt.getBillIDField().getDBColumnName();
				int cnt = CtxDBUtils.queryOneValue(
						MidContextDBOptions
							.forceOne(ctx).putDoc(srcDoc)
							.setSql("SELECT COUNT(*) FROM ${#headTable} WHERE ${#headIdFld}=${headBillID}")
							.addParam("#headTable", tgtHeadTable)
							.addParam("#headIdFld", tgtHeadIdFld)
							.addParam("headBillID", tgtHeadBillID), Integer.class);
				if (1==cnt){
					tgtDoc = MidContextTool.loadObjectByID(ctx, cfg.getTargetBillKey(), tgtHeadBillID);
				}
			}
		}
		if (null==tgtDoc){
			//只要找不到就创建新的 document
			tgtDoc = _newDocument(ctx, cfg);
		}
		
		//处理头表数据
		_processDataSource(ctx, srcDoc, tgtDoc, tgtHeadTable, TABLR_INDEX_HEAD, hdDsCfg);
		//处理明细表数据
		for(Map.Entry<String, Integer> en: dsIndexMap.entrySet()){
			String tableName = en.getKey();
			int tableIndex = en.getValue();
			if (! tgtHeadTable.equalsIgnoreCase(tableName)){
				DataSourceConfig dsCfg = dsCfgs.get(tableName);
				if (null!=dsCfg){
					_processDataSource(ctx, srcDoc, tgtDoc, tableName, tableIndex, dsCfg);
				}
			}
		}
		
		//处理 callback
		if (StringUtils.isNotBlank(cfg.getCallbackFormula())){
			MidContextTool.evaluate(ctx, tgtDoc, cfg.getCallbackFormula(), "SqlMorphing Callbacl Formula");
		}
		
		//返回
		return tgtDoc.getID();
	}

	private static IDocument _newDocument(IMidContext ctx, MorphingConfigVO cfg) throws Throwable {
		IDocument tgtDoc = MidContextTool.newDocument(ctx, cfg.getTargetBillKey());
		DocTools.resetDoc(ctx, tgtDoc);
		return tgtDoc;
	}
	
	private static int _evalHeadIdFormula(IMidContext ctx, IDocument srcDoc, String dsName, String formula) throws Throwable{
		if (StringUtils.isBlank(formula)){
			return -1;
		}
		Object evalResult = MidContextTool.evaluate(ctx, srcDoc, formula, "IdFormula for Target HeadTable "+dsName);
		if (null!=evalResult && StringUtils.isNotBlank(evalResult.toString())){
			return _toInt(evalResult);
		}else{
			return -1;
		}
	}
	private static int _evalDetailIdFormula(IMidContext ctx, IDocument srcDoc, Map<String, Object> currentLine, String dsName, String formula) throws Throwable{
		if (StringUtils.isBlank(formula)){
			return -1;
		}

		CURRENT_LINE_IN_THREAD.set(currentLine);
		try{
			Object evalResult = MidContextTool.evaluate(ctx, srcDoc, formula, "IdFormula for Target DetailTable "+dsName);
			if (null!=evalResult){
				return _toInt(evalResult);
			}else{
				return -1;
			}
		}finally{
			CURRENT_LINE_IN_THREAD.remove();
		}
	}
	private static int _toInt(Object data) {
		if (data instanceof Number){
			Number n = (Number) data;
			return n.intValue();
		}else{
			String s = data.toString();
			return Integer.parseInt(s);
		}
	}
	
	private static void _initCacheMap(BillMetaLinkedTable metaTable, Map<String, Integer> dsIndexMap) throws Throwable{
		int tableCnt = metaTable.GetTableCount();
		for (int i=1; i<=tableCnt; i++){
			String tName = metaTable.getTableName(i);
			dsIndexMap.put(tName, i);
		}
	}
	
	private static void _processDataSource(
			IMidContext ctx, IDocument srcDoc, IDocument tgtDoc, String dsName, int tableIndex, DataSourceConfig dsCfg) throws Throwable{
		BillMetaLinkedTable metaTable = tgtDoc.getMetaTable();
		String tgtBillKey = metaTable.Key;
		
		String sql = dsCfg.getDataSql();
		MidContextDBOptions dbOpts = MidContextDBOptions.create(ctx).putDoc(srcDoc).setSql(sql);
		
		BKRowSet tgtRs = tgtDoc.getRst(tableIndex);
		String colsList = metaTable.getAllDBColumns(tableIndex);
		
		if (TABLR_INDEX_HEAD==tableIndex){
			//头表
			if (!tgtRs.bkFirst()){
				//头表没有第一行
				throw new RuntimeException("目标单据 '"+tgtBillKey+"' 的头表数据错误 - 第一行数据不存在, 可能是 document 没有正确初始化");
			}

			Map<String, Object> srcData = CtxDBUtils.queryOneLine(dbOpts);
			if (null!=srcData){
				_updateRsLine(srcData, tgtRs, colsList);
			}
		}else{
			//明细表 ...
			//目标表 billDtlId 字段的名称
			String tgtBillDtlIdFld = metaTable.getBillDtlIDField(tableIndex).getDBColumnName();
			//通过 SQL 查询出来需要写入到目标的数据
			List<Map<String, Object>> srcData = CtxDBUtils.queryAsList(dbOpts);
			//循环计算没一行对应到目标表的 ID, 储存起来供后面更新目标表使用(如果 ID 为空或者小于0 说明这些行应该是新增的)
			Map<Integer, Map<String, Object>> lines2Update = new HashMap<Integer, Map<String,Object>>();	//需要修改到目标的数据行
			List<Integer> targetIds2Update = new ArrayList<Integer>();	//需要修改到目标的数据行BillDtlID
			List<Map<String, Object>> lines2Append = new ArrayList<Map<String,Object>>();	//需要增加到目标的数据行
			for (int i=0; i<srcData.size(); i++){
				Map<String, Object> srcLine = srcData.get(i);
				int tgtBillDtlId = _evalDetailIdFormula(ctx, srcDoc, srcLine, dsName, dsCfg.getIdFormula());
				if (tgtBillDtlId > 0){
					lines2Update.put(tgtBillDtlId, srcLine);
					targetIds2Update.add(tgtBillDtlId);
				}else{
					lines2Append.add(srcLine);
				}
			}
			//针对目标 RowSet 更新数据
			tgtRs.bkBeforeFirst();
			while(tgtRs.bkNext()){
				int billDtlId = tgtRs.bkGetInt(tgtBillDtlIdFld);
				Map<String, Object> line2Update = lines2Update.get(billDtlId);
				if (null==line2Update){
					//不在更新范围内的数据行需要删除
					tgtRs.bkDeleteRow();
				}else{
					_updateRsLine(line2Update, tgtRs, colsList);
				}
			}
			//然后补充上新增加的数据
			for(Map<String, Object> line2Append: lines2Append){
				tgtRs.bkInsertRow();
				_updateRsLine(line2Append, tgtRs, colsList);
			}
		}
	}

	private static void _updateRsLine(Map<String, Object> lineData2Update, BKRowSet tgtRs, String colsList) throws SQLException {
		String[] cols = colsList.split(",");
		for (int i = 0; i < cols.length; i++) {
			String colName = cols[i];
			Object val = lineData2Update.get(colName);
			if (null!=val){
				tgtRs.bkUpdateObject(colName, val);
			}
		}
	}
	
	
}
