package com.bokesoft.yigo.redist.originals.cms.yigo;

import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.sql.rowset.serial.SerialClob;
import javax.sql.rowset.serial.SerialException;

import org.apache.commons.collections4.map.CaseInsensitiveMap;

import com.bokesoft.myerp.billmeta.BillDocument;
import com.bokesoft.myerp.billmeta.BillHelper;
import com.bokesoft.myerp.billmeta.BillMetaField;
import com.bokesoft.myerp.billmeta.BillMetaFieldCollection;
import com.bokesoft.myerp.billmeta.BillMetaLinkedTable;
import com.bokesoft.myerp.billui.BillViewer;
import com.bokesoft.myerp.common.rowset.BKRowSet;
import com.bokesoft.myerp.dev.common.Document;
import com.bokesoft.myerp.dev.common.IDocument;
import com.bokesoft.yigo.redist.originals.cms2.util.Misc;

/**
 * @see /ecomm/trunk/modules/backend/core/src/main/java/com/bokesoft/cms/core/yigo/helper/YigoHelper.java,
 *      revision 46670.
 */
public class YigoHelper {
	
	/**
	 * 将doc中的指定表的数据转化为List<Map<String,Object>>,元素Map<String,Object>代表行数据
	 * @param doc
	 * @param tableIndex
	 * @return
	 * @throws Throwable
	 */
	public static List<Map<String,Object>> table2ListOfMap(IDocument doc, int tableIndex) throws Throwable{	
		Map<String,BillMetaField> keyVsBMField = keyVsBMFieldMap(tableIndex, doc);
		List<Map<String,Object>> listOfMap = new ArrayList<Map<String,Object>>();
		BKRowSet rstDtl = doc.getRst(tableIndex);
		if(null != rstDtl){
			rstDtl.bkBeforeFirst();
			while(rstDtl.bkNext()){
				Map<String,Object> lineMap = new HashMap<String,Object>();
				for(String key : keyVsBMField.keySet()){
					//rstDtl中的字段名字都是DBCol,List中的key值是字段的key,和DBCol有可能不相等
					BillMetaField field = keyVsBMField.get(key);			
					Object o = rstDtl.bkGetObject(field.getDBColumnName());
					//如果此字段没有值则不需要进行转化
					if(null != o){
						lineMap.put(key, o);
					}
				}
				listOfMap.add(lineMap);
			}
		}
		return listOfMap;
	}
	
	/**
	 * 将listOfMap中的数据合并到指定的doc的第tableIndex表中
	 * @param doc
	 * @param tableIndex
	 * @param listOfMap
	 * @throws Throwable
	 */
	public static void merge2Table(IDocument doc, int tableIndex, List<Map<String,Object>> listOfMap) throws Throwable{		
		Map<String,BillMetaField> keyVsBMField = keyVsBMFieldMap(tableIndex, doc);
		BKRowSet rst2Merge = doc.getRst(tableIndex);
		if (rst2Merge.bkSize() == 0) {//当rst2Merge中原先没有数据的时候
			int cnt = listOfMap.size();
			for (int i=0; i<cnt; i++){
				Map<String,Object> lineData = listOfMap.get(i);
				rst2Merge.bkInsertRow();
				mergeLine(rst2Merge, lineData, keyVsBMField);
			}
		}else{//rst2Merge有数据的时候
			Set<Integer> mergedBillIDs = new HashSet<Integer>();
			rst2Merge.bkBeforeFirst();
			while (rst2Merge.bkNext()) {//对rst2Merge的数据进行合并
				boolean find = false;//作为合并过的标志
				int cnt = listOfMap.size();
				for (int i=0; i<cnt; i++){
					Map<String,Object> lineData = listOfMap.get(i);		
					if(lineData.containsKey("billdtlid")){
						//如果含有billdtlid，则需要以billdtlid为依据找到合适的行进行合并
						int billDtlID = (Integer) lineData.get("billdtlid");
						if (mergedBillIDs.contains(billDtlID)){
							continue;	//List中已合并过的数据不需要再进行比较和合并
						}
						if (billDtlID == rst2Merge.bkGetInt("billdtlid") ){// 找到匹配项，合并并且跳出for循环
							mergeLine(rst2Merge, lineData, keyVsBMField);
							mergedBillIDs.add(billDtlID);	//记录已合并的数据
							find=true;
							break;
						}
					}
				}
				if(find==false){//如果find是false说明List中没有此行数据，删除此行
					rst2Merge.bkDeleteRow();
				}				
			}
			//对List剩下的数据(也就是rst2Merge中不匹配的行)进行添加行
			int cnt = listOfMap.size();
			for (int i=0; i<cnt; i++){
				Map<String,Object> lineData = listOfMap.get(i);
				//有billdtlid的行需要判断之前有没有合并过
				if(lineData.containsKey("billdtlid")){
					int billDtlID = (Integer) lineData.get("billdtlid");
					if (mergedBillIDs.contains(billDtlID)){
						continue;	//已合并过的数据不需要再进行比较和合并
					}
				}
				rst2Merge.bkInsertRow();
				mergeLine(rst2Merge, lineData, keyVsBMField);
			}
		}
	}
	
	/**
	 * 将doc的数据转化为Map<String, Object>类型,key代表的主表的key或者明细的表明，value代表各自的数据
	 * 明细表的value为List<Map<String,Object>>,其中Map<String,Object>代表每行的数据
	 * @param doc
	 * @return
	 * @throws Throwable
	 */
	public static Map<String, Object> doc2MasterDetailMap(IDocument doc) throws Throwable{
		Map<String,BillMetaField> keyVsBMField = keyVsBMFieldMap(1, doc);
		Map<String,Object> map = new HashMap<String,Object>();
		BKRowSet rstHead = doc.getRst(1);
		if(null != rstHead){
			rstHead.bkFirst();
			for(String key : keyVsBMField.keySet()){
				BillMetaField field = keyVsBMField.get(key);
				Object o = rstHead.bkGetObject(field.getDBColumnName());
				if(null != o){
					map.put(key, o);
				}
			}
		}
		//一般来说主表为空，明细一般为空,这里以防万一，主表为空时候依然转化明细表
		for(int i = 1; i < doc.getMetaTable().GetTableCount(); i++){
			List<Map<String,Object>> listOfMap = table2ListOfMap(doc, i+1);
			String tableName = doc.getMetaTable().TableName(i+1);
			map.put(tableName, listOfMap);		
		}
		return map;
	}
	
	/**
	 * 将Map数据合并到doc中
	 * @param doc
	 * @param masterDetailMap
	 * @throws Throwable
	 */
	@SuppressWarnings("unchecked")
	public static void merge2Doc(IDocument doc, Map<String, Object> masterDetailMap) throws Throwable{
		Map<String,BillMetaField> keyVsBMField = keyVsBMFieldMap(1, doc);
		for(String key : masterDetailMap.keySet()){
			BillMetaField field = (BillMetaField) keyVsBMField.get(key);
			Object oldObject = masterDetailMap.get(key);
			if(null != field){
//				EBillFieldType eFldType =field.FieldType;
//				if(eFldType == EBillFieldType.ebftInt
//						|| eFldType == EBillFieldType.ebftBillType
//						|| eFldType == EBillFieldType.ebftSelect
//						|| eFldType == EBillFieldType.ebftRowNo
//						|| eFldType == EBillFieldType.ebftBillID
//						|| eFldType == EBillFieldType.ebftBillDtlID
//						|| eFldType == EBillFieldType.ebftPrice
//						|| eFldType == EBillFieldType.ebftDecimal
//						|| eFldType == EBillFieldType.ebftAmount
//						|| eFldType == EBillFieldType.ebftMoney
//						|| eFldType == EBillFieldType.ebftItemID
//						|| eFldType == EBillFieldType.ebftDynamicItemID
//						|| eFldType == EBillFieldType.ebftStatus){
//					if(!oldObject.toString().matches("[0-9]+")){
//						throw new RuntimeException("字段类型不符合数字类型");
//					}
//				}
				//将主表中的字段值类型转化为Yigo对应的类型
				Object matchObject = BillHelper.ConvertValue(oldObject, field);
				String dbColumnName = field.getDBColumnName();
				if(null != dbColumnName){
					if(null == doc.getRst(1)){//如果doc主表为空
						doc.reset();
						doc.getRst(1).bkInsertRow();
					}
					doc.getRst(1).bkUpdateObject(dbColumnName, matchObject);						
				}
			}
		}
		for(int i = 1; i < doc.getMetaTable().GetTableCount(); i++){
			String tableName = doc.getMetaTable().TableName(i+1);
			if(masterDetailMap.containsKey(tableName)){
				List<Map<String,Object>> listOfMap = (List<Map<String, Object>>) masterDetailMap.get(tableName);
				merge2Table(doc, i+1, listOfMap);
			}
		}
	}
	
	/**
	 * 在viewer层面将指定第tableIndexi表的数据转化为List<Map<String,Object>>
	 * @param viewer
	 * @param tableIndex
	 * @return
	 * @throws Throwable
	 */
	public static List<Map<String,Object>> table2ListOfMap(BillViewer viewer, int tableIndex) throws Throwable{
		BillDocument bdoc = viewer.getBillDoc();
		IDocument doc = new Document(bdoc);
		return table2ListOfMap(doc, tableIndex);
	}
	
	/**
	 * 在viewer层面将listOfMap合并到指定第tableIndex表中
	 * @param viewer
	 * @param tableIndex
	 * @param listOfMap
	 * @throws Throwable
	 */
	public static void merge2Table(BillViewer viewer, int tableIndex, List<Map<String,Object>> listOfMap) throws Throwable{
		BillDocument bdoc = viewer.getBillDoc();
		IDocument doc = new Document(bdoc);
		merge2Table(doc, tableIndex, listOfMap);
	}
	
	/**
	 * 在viewer层面将viewer中的document转化为Map<String, Object>
	 * @param viewer
	 * @return
	 * @throws Throwable
	 */
	public static Map<String, Object> doc2MasterDetailMap(BillViewer viewer) throws Throwable{
		BillDocument bdoc = viewer.getBillDoc();
		IDocument doc = new Document(bdoc);
		return doc2MasterDetailMap(doc);
	}
	
	/**
	 * 在viewer层面将masterDetailMap合并到viewer中的document
	 * @param viewer
	 * @param masterDetailMap
	 * @throws Throwable
	 */
	public static void merge2Doc(BillViewer viewer, Map<String, Object> masterDetailMap) throws Throwable{
		BillDocument bdoc = viewer.getBillDoc();
		IDocument doc =  new Document(bdoc);
		merge2Doc(doc, masterDetailMap);
	}
	
	/**
	 * 将明细表的具体某一行rst2Merge数据和lineData进行合并
	 * 需要注意lineData的key为字段的key,而rst2Merge中的key为字段在数据库中的colName，所以需要keyVsBMField进行对应
	 * @param rst2Merge
	 * @param lineData
	 * @param keyVsBMField
	 * @throws SQLException
	 */
	private static void mergeLine(BKRowSet rst2Merge,
			Map<String, Object> lineData, Map<String, BillMetaField> keyVsBMField) throws SQLException {
		for (String key : lineData.keySet()) {
			if (!keyVsBMField.containsKey(key)) {
				throw new RuntimeException("明细表中不包含" + key + "字段");
			} else {
				BillMetaField field = (BillMetaField) keyVsBMField.get(key);
				Object oldObject = lineData.get(key);
				//将List中的字段的值转化为相对应的Yigo的类型
				Object matchObject = BillHelper.ConvertValue(oldObject, field);
				rst2Merge.bkUpdateObject(field.getDBColumnName(), matchObject);
			}
		}
	}
	
	/**
	 * 将doc的字段的key和字段的BillMetaField进行对应,为了便于类型的转化,并且key忽略了大小写
	 * @param tableIndex
	 * @param doc
	 * @return
	 * @throws Throwable
	 */
	private static Map<String,BillMetaField> keyVsBMFieldMap(int tableIndex, IDocument doc) throws Throwable {
		BillMetaLinkedTable metaTable = doc.getMetaTable();		
		Map<String,BillMetaField> keyVsBMField = new CaseInsensitiveMap<String,BillMetaField>();
		BillMetaFieldCollection fields = metaTable.MetaFields;
		for(int i = 0 ; i < fields.Count(); i++ ){
			BillMetaField field = fields.Item(i);
			if (tableIndex == field.getDBLocation()){
				keyVsBMField.put(field.getKey(), field);
			}
		}
		return keyVsBMField;
	}

	/**
	 * 将 {@link BKRowSet}、{@link PagingSearchResult} 等特殊的数据类转换为可以被模板引擎等处理的类型;
	 * (注意：{@link BKRowSet} 将转化为 List[Map], 每个 Map 对应其中一行, 字段名总是大写)
	 * @param obj
	 * @return
	 */
	public static Object normalize(Object obj){
		if (null==obj){
			return null;
		}
		if (obj instanceof SerialClob){
			SerialClob c = (SerialClob)obj;
			try {
				String s = c.getSubString(1, (int) c.length());
				return s;
			} catch (SerialException e) {
				Misc.throwRuntime(e);
				return null;
			}
		}
		if (obj instanceof BKRowSet){
			BKRowSet brs = (BKRowSet)obj;
			try {
				return wrapBKRowSet(brs);
			} catch (SQLException e) {
				Misc.throwRuntime(e);
				return null;
			}
		}
		return obj;
	}

	public static List<Map<String, Object>> wrapBKRowSet(BKRowSet brs) throws SQLException {
		List<String> colNames = new ArrayList<String>();
		int ccnt = brs.getColumnCount();
		for(int i=0; i<ccnt; i++){
			String colName = versionCompatibleGetColumnName(brs, i+1);
			colNames.add(colName);
		}
		
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		brs.bkBeforeFirst();
		while(brs.bkNext()){
			Map<String, Object> line = new HashMap<String, Object>();
			for(String colName: colNames){
				Object value = brs.bkGetObject(colName);
				if (brs.bkGetObject(colName) instanceof Double) { // 如果是double类型
					value = brs.bkGetBigDecimal(colName);
				}
				//放到模型里面的字段名都使用大写
				line.put(colName.toUpperCase(), normalize(value));
			}
			result.add(line);
		}
		
		return result;
	}

	private static String versionCompatibleGetColumnName(BKRowSet brs, int index){
		//在 Yigo 1.4 和 1.6 中, BKRowSet 的 getColumnName 方法中参数从 Integer 变为 int, 导致必须使用反射的方式避免兼容性问题
		try {
			Method m;
			try {
				m = BKRowSet.class.getMethod("getColumnName", int.class);	//优先尝试 1.6 的定义
			} catch (NoSuchMethodException e) {
				m = BKRowSet.class.getMethod("getColumnName", Integer.class);
			}
			return (String)m.invoke(brs, index);
		} catch (Exception e) {
			Misc.throwRuntime(e);
			return null;
		}
	}
		
}
