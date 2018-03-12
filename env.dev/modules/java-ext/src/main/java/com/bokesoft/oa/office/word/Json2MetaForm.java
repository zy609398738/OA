package com.bokesoft.oa.office.word;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bokesoft.oa.office.word.bean.BillDataUnit;
import com.bokesoft.oa.office.word.bean.ColumnDataUnit;
import com.bokesoft.oa.office.word.bean.HeadDataUnit;
import com.bokesoft.oa.office.word.bean.OptionDataUnit;
import com.bokesoft.oa.office.word.bean.RowDataUnit;
import com.bokesoft.oa.office.word.bean.TableDataUnit;
import com.bokesoft.yigo.common.def.CellType;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.def.DefSize;
import com.bokesoft.yigo.common.def.FormType;
import com.bokesoft.yigo.meta.dataobject.MetaColumn;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.meta.dataobject.MetaDataSource;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.meta.dataobject.MetaTableCollection;
import com.bokesoft.yigo.meta.form.MetaBlock;
import com.bokesoft.yigo.meta.form.MetaBody;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.meta.form.component.control.MetaComboBox;
import com.bokesoft.yigo.meta.form.component.control.MetaDataBinding;
import com.bokesoft.yigo.meta.form.component.control.MetaDefaultItem;
import com.bokesoft.yigo.meta.form.component.control.MetaLabel;
import com.bokesoft.yigo.meta.form.component.control.MetaTextArea;
import com.bokesoft.yigo.meta.form.component.control.MetaTextEditor;
import com.bokesoft.yigo.meta.form.component.control.properties.MetaListBoxItemCollection;
import com.bokesoft.yigo.meta.form.component.grid.MetaGrid;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridCell;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridColumn;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridColumnCollection;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridRow;
import com.bokesoft.yigo.meta.form.component.grid.MetaGridRowCollection;
import com.bokesoft.yigo.meta.form.component.panel.MetaFlexFlowLayoutPanel;
import com.bokesoft.yigo.meta.form.component.panel.gridpanel.MetaColumnDef;
import com.bokesoft.yigo.meta.form.component.panel.gridpanel.MetaColumnDefCollection;
import com.bokesoft.yigo.meta.form.component.panel.gridpanel.MetaGridLayoutPanel;
import com.bokesoft.yigo.meta.form.component.panel.gridpanel.MetaRowDef;
import com.bokesoft.yigo.meta.form.component.panel.gridpanel.MetaRowDefCollection;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

import jodd.util.StringUtil;

public class Json2MetaForm {
	
	
	public static MetaForm JsonToMetaForm(MetaForm metaTemp,String formCaption, String formKey, String json) {
		return JsonToMetaForm(metaTemp, formCaption, formKey, json, "true");
	}
	
	/**
	 * 根据指定条件构建MetaForm对象
	 * @param metaTemp 模板MetaForm实例
	 * @param formCaption 指定的caption,用于显示
	 * @param formKey 指定的key,用于get获取
	 * @param json 指定的界面字段数据,产生可参见com.bokesoft.oa.office.word.OfficePOITools.readWordToJson(String)
	 * @return
	 */
	public static MetaForm JsonToMetaForm(MetaForm metaTemp,String formCaption, String formKey, String json,String enableSetting) {
		JSONObject jobj = JSON.parseObject(json);
		MetaForm metaForm = (MetaForm) metaTemp.clone();		
		metaForm.setCaption(formCaption);
		metaForm.setKey(formKey);
		MetaBody metaBody = metaForm.getMetaBody();
		MetaBlock metaBlock = (MetaBlock) metaBody.get(0);

		MetaDataSource dataSource = new MetaDataSource();
		// 数据源对象设计通过MetaDataSource设置
		metaForm.setDataSource(dataSource);

		// 具体的MetaDataSource通过MetaDataObject设置
		MetaDataObject dataObject = new MetaDataObject();
		dataObject.setKey(formKey);
		dataObject.setCaption(formCaption);
		dataObject.setPrimaryType(FormType.Entity);
		// MetaDataObject有几张表则通过MetaTableCollection设置
		MetaTableCollection tableCollection = new MetaTableCollection();
		dataObject.setTableCollection(tableCollection);
		dataSource.setDataObject(dataObject);

		// 设计主表
		MetaTable mainTable = new MetaTable();
		// 必须先设置key和caption才能加入dataobject
		mainTable.setCaption(formCaption);
		mainTable.setKey(formKey);
		tableCollection.add(mainTable);
		dataObject.setMainTableKey(formKey);
		
		MetaColumn colOID = new MetaColumn();
		colOID.setCaption("对象标识");
		colOID.setDataType(DataType.LONG);
		colOID.setKey("OID");
		mainTable.add(colOID);
		
		MetaColumn colSOID = new MetaColumn();
		colSOID.setCaption("主对象标识");
		colSOID.setDataType(DataType.LONG);
		colSOID.setKey("SOID");
		mainTable.add(colSOID);
		
		MetaColumn colPOID = new MetaColumn();
		colPOID.setCaption("父对象标识");
		colPOID.setDataType(DataType.LONG);
		colPOID.setKey("POID");
		mainTable.add(colPOID);
		
		MetaColumn colVERID = new MetaColumn();
		colVERID.setCaption("对象版本");
		colVERID.setDataType(DataType.LONG);
		colVERID.setKey("VERID");
		mainTable.add(colVERID);
		
		MetaColumn colDVERID = new MetaColumn();
		colDVERID.setCaption("对象明细版本");
		colDVERID.setDataType(DataType.LONG);
		colDVERID.setKey("DVERID");
		mainTable.add(colDVERID);

		// 构建最初的流式布局 FlexFlowLayoutPanel
		MetaFlexFlowLayoutPanel flexFlowLayoutPanel = new MetaFlexFlowLayoutPanel();
		flexFlowLayoutPanel.setKey("root");
		flexFlowLayoutPanel.setCaption("根面板");
		metaBody.add(flexFlowLayoutPanel);

		// 构建网格布局 GridLayoutPanel
		MetaGridLayoutPanel gridLayoutPanel = new MetaGridLayoutPanel();
		gridLayoutPanel.setPadding("5px");
		gridLayoutPanel.setCaption("基本信息");
		gridLayoutPanel.setKey("first_head");
		gridLayoutPanel.setHeight(DefSize.parse("pref"));
		// 流式布局中嵌套网格布局
		flexFlowLayoutPanel.addComponent(gridLayoutPanel);
		
		JSONArray headerArray = jobj.getJSONArray("headers");
		List<JSONObject> comoboxlist = new ArrayList<JSONObject>();
		List<JSONObject> showlist = new ArrayList<JSONObject>();
		int rowCount = 0;
		int colIdx = 0;
		// 先将文本控件排布
		for (Object headerObj : headerArray) {
			int posX = colIdx;
			int posY = rowCount;
			JSONObject headerJson = (JSONObject) headerObj;
			String mainColCaption = headerJson.getString("caption");
			String mainColKey = headerJson.getString("key");
			String mainColtype = headerJson.getString("type");
			// 表有多少字段则通过MetaColumn集合设置
			MetaColumn headCol = new MetaColumn();
			headCol.setCaption(mainColCaption);
			headCol.setDataType(DataType.TEXT);
			headCol.setKey(mainColKey);
			mainTable.add(headCol);
			if ("TEXT".equals(mainColtype)) {
				MetaLabel label = new MetaLabel();
				label.setX(posX);
				label.setY(posY);
				label.setCaption(mainColCaption);
				label.setKey("Lab_" + mainColKey);
				label.setEnable(enableSetting);
				gridLayoutPanel.addComponent(label);

				MetaTextEditor TextEditor = new MetaTextEditor();
				TextEditor.setX(posX + 1);
				TextEditor.setY(posY);
				TextEditor.setCaption(mainColCaption);
				TextEditor.setKey(mainColKey);
				TextEditor.setBuddyKey("Lab_" + mainColKey);
				MetaDataBinding TextEditorData = new MetaDataBinding();
				TextEditor.setDataBinding(TextEditorData);
				TextEditorData.setTableKey(mainTable.getKey());
				TextEditorData.setColumnKey(mainColKey);
				TextEditor.setEnable(enableSetting);
				gridLayoutPanel.addComponent(TextEditor);

				if (colIdx < 6) {
					colIdx = colIdx + 2;
				} else {
					colIdx = 0;
					rowCount++;
				}
			} else {
				if ("SHOW".equals(mainColtype)) {
					showlist.add(headerJson);
				} else {
					comoboxlist.add(headerJson);
				}
			}
		}
		
		rowCount++;
		//排布下拉控件以及下拉控件的选择显示显示内容
		for (int comIdx = 0; comIdx < comoboxlist.size(); comIdx++) {
			//排布下拉控件
			JSONObject comoboxJson = comoboxlist.get(comIdx);
			String comoboxCaption = comoboxJson.getString("caption");
			String comoboxKey = comoboxJson.getString("key");
			JSONArray optionList = comoboxJson.getJSONArray("optionList");
			// 表有多少字段则通过MetaColumn集合设置
			MetaColumn comoboxCol = new MetaColumn();
			comoboxCol.setCaption(comoboxCaption);
			comoboxCol.setDataType(DataType.TEXT);
			comoboxCol.setKey(comoboxKey);
			comoboxCol.setDescription(JSON.toJSONString(optionList));
			mainTable.add(comoboxCol);

			int posY = rowCount;
			MetaLabel label = new MetaLabel();
			label.setX(0);
			label.setY(posY);
			label.setCaption(comoboxCaption);
			label.setKey("Lab_" + comoboxKey);
			label.setEnable(enableSetting);
			gridLayoutPanel.addComponent(label);

			MetaComboBox combobox = new MetaComboBox();
			combobox.setX(1);
			combobox.setY(posY);
			combobox.setCaption(comoboxCaption);
			combobox.setKey(comoboxKey);
			combobox.setBuddyKey("Lab_" + comoboxKey);
			combobox.setEnable(enableSetting);
			MetaDataBinding comboboxData = new MetaDataBinding();
			combobox.setDataBinding(comboboxData);
			comboboxData.setTableKey(mainTable.getKey());
			comboboxData.setColumnKey(comoboxKey);
			// Option集合设定
			MetaListBoxItemCollection itemCollection = new MetaListBoxItemCollection();
			String varMainColKey = comoboxKey + "Key";
			String vcFormulaStr = "var " + varMainColKey + " = " + comoboxKey+";";
			String relMainColShowKey = comoboxKey.replaceAll("data_", "show_");
			for (Object option : optionList) {
				JSONObject optionJson = (JSONObject) option;
				MetaDefaultItem optItem = new MetaDefaultItem();
				optItem.setCaption(optionJson.getString("caption"));
				optItem.setKey(optionJson.getString("key"));
				optItem.setValue(optionJson.getString("key"));
				itemCollection.add(optItem);
				vcFormulaStr += "if( " + varMainColKey + " == '" + optionJson.getString("key") + "' ){ " 
						+ relMainColShowKey + "='" + optionJson.getString("descr") + "'; "
						+ " }";
			}
			combobox.setItems(itemCollection);
			combobox.setValueChanged(vcFormulaStr);
			gridLayoutPanel.addComponent(combobox);
			
			//排布对应选择项后的显示内容区域
			//排布下拉控件
			JSONObject showJson = showlist.get(comIdx);
			String showCaption = showJson.getString("caption");
			String showKey = showJson.getString("key");
			// 表有多少字段则通过MetaColumn集合设置
			MetaColumn showCol = new MetaColumn();
			showCol.setCaption(showCaption);
			showCol.setDataType(DataType.TEXT);
			showCol.setKey(showKey);
			showCol.setLength(2000);
			mainTable.add(showCol);
			
			MetaTextArea textArea = new MetaTextArea();
			textArea.setX(2);
			textArea.setXSpan(4);
			textArea.setY(posY);
			textArea.setYSpan(2);
			textArea.setCaption(showCaption);
			textArea.setKey(showKey);
			textArea.setEnable("false");
			MetaDataBinding textAreaData = new MetaDataBinding();
			textArea.setDataBinding(textAreaData);
			textAreaData.setTableKey(mainTable.getKey());
			textAreaData.setColumnKey(showKey);
			gridLayoutPanel.addComponent(textArea);
			
			rowCount = rowCount+2;
		}

		//设计列布局
		MetaColumnDefCollection columnDefCollection = new MetaColumnDefCollection();
		columnDefCollection.setColumnGap(20);
		MetaColumnDef coldefault1 = new MetaColumnDef();
		coldefault1.setWidth(new DefSize(DefSize.Fix, 80));
		MetaColumnDef coldefault2 = new MetaColumnDef();
		coldefault2.setWidth(new DefSize(DefSize.Ratio, 33));
		columnDefCollection.add(coldefault1);
		columnDefCollection.add(coldefault2);
		columnDefCollection.add(coldefault1);
		columnDefCollection.add(coldefault2);
		columnDefCollection.add(coldefault1);
		columnDefCollection.add(coldefault2);				
				
		// GridLayoutPanel的行列设置
		MetaRowDefCollection rowDefCollection = new MetaRowDefCollection();
		rowDefCollection.setRowGap(6);
		rowDefCollection.setRowHeight(30);
		for (int rowIdx = 0; rowIdx < rowCount; rowIdx++) {
			rowDefCollection.add(new MetaRowDef());
		}

		gridLayoutPanel.setRowDefCollection(rowDefCollection);
		gridLayoutPanel.setColumnDefCollection(columnDefCollection);
		
		JSONArray tableArray = jobj.getJSONArray("tables");
		for (Object tableObj : tableArray) {
			JSONObject tableJson = (JSONObject) tableObj;
			String tableKey = tableJson.getString("key");
			// 设计主表明细表
			MetaTable dtlTable = new MetaTable();
			// 必须先设置key和caption才能加入dataobject
			dtlTable.setCaption(formKey+"_"+tableKey);
			dtlTable.setKey(formKey+"_"+tableKey);
			tableCollection.add(dtlTable);
			
			dtlTable.add(colOID);
			dtlTable.add(colSOID);
			dtlTable.add(colPOID);
			dtlTable.add(colVERID);
			dtlTable.add(colDVERID);

			JSONArray rowArray = tableJson.getJSONArray("rowlist");

			// 通过MetaGrid画出表格设计
			MetaGrid grid = new MetaGrid();
			grid.setKey(tableKey);
			grid.setCaption(tableKey);
			
			JSONObject rowJson = (JSONObject) rowArray.get(0);
			
			// 表格头定义
			MetaGridColumnCollection gridColumnCollection = new MetaGridColumnCollection();			

			// 具体每行每列,单元格控件及数据源定义
			MetaGridRowCollection gridRowCollection = new MetaGridRowCollection();		

			MetaGridRow gridRow = new MetaGridRow();
			gridRow.setKey("row1");
			gridRow.setTableKey(dtlTable.getKey());			
			JSONArray colArray = rowJson.getJSONArray("collist");
			for (Object colObj : colArray) {
				JSONObject colJson = (JSONObject) colObj;
				String colCaption = colJson.getString("caption");
				String colKey = colJson.getString("key");
				// String coltype = colJson.getString("type");
				
				// 表有多少字段则通过MetaColumn集合设置
				MetaColumn dtlCol = new MetaColumn();
				dtlCol.setCaption(colCaption);
				dtlCol.setDataType(DataType.TEXT);
				dtlCol.setKey(colKey);
				dtlTable.add(dtlCol);
				
				MetaGridCell gridCell = new MetaGridCell();
				gridRow.add(gridCell);
				gridCell.setCaption(colCaption);
				gridCell.setKey(colKey);
				gridCell.setCellType(CellType.parse("TextEditor"));
				gridCell.setEnable(enableSetting);

				MetaDataBinding gridCellData = new MetaDataBinding();
				gridCellData.setColumnKey(colKey);
				gridCell.setDataBinding(gridCellData);
				gridCell.setHasDataBinding(true);

				// 具体的列定义,由MetaGridColumn集合设定
				MetaGridColumn gridColumn = new MetaGridColumn();
				gridColumn.setCaption(colCaption);
				gridColumn.setKey(colKey);
				gridColumn.setWidth(new DefSize(DefSize.Fix, 80));
				gridColumnCollection.add(gridColumn);
			}
			gridRowCollection.add(gridRow);
			grid.setColumnCollection(gridColumnCollection);
			grid.setRowCollection(gridRowCollection);
			grid.process();
			// 流式布局中嵌套网格布局
			flexFlowLayoutPanel.addComponent(grid);
		}
		
		//设置数据源
		dataSource.setDataObject(dataObject);
		// 界面设计覆盖
		metaBlock.setRoot(flexFlowLayoutPanel);
		
		return metaForm;
	}
	
	/**
	 * 将json数据显示在document上
	 * @param document 单据的document
	 * @param metaForm 单据的metaform,因为iservice的document只是数据对象,没有metaform对象
	 * @param jsonStr json数据
	 */
	public static void setDatabyJson(Document document,MetaForm metaForm,String jsonStr){
		BillDataUnit billDataUnit = JSON.parseObject(jsonStr,BillDataUnit.class);
		List<HeadDataUnit> headers = billDataUnit.getHeaders();
		List<TableDataUnit> tables =  billDataUnit.getTables();
		String mainTableKey = metaForm.getDataSource().getDataObject().getMainTableKey();
		DataTable headDt = document.get(mainTableKey);
		
		headDt.first();
		//头表的赋值
		for (HeadDataUnit headDataUnit : headers) {			
			headDt.setString(headDataUnit.getKey(), headDataUnit.getRecord());
		}
		
		//明细表赋值
		for (TableDataUnit table : tables) {
			String tableKey = table.getKey();
			DataTable dtlDt = document.get(mainTableKey+"_"+tableKey);
			dtlDt.clear();
			List<RowDataUnit> rowlist = table.getRowlist();
			for (RowDataUnit rowDataUnit : rowlist) {				
				dtlDt.insert();
				List<ColumnDataUnit> collist = rowDataUnit.getCollist();
				for(ColumnDataUnit columnDataUnit : collist){
					dtlDt.setString(columnDataUnit.getKey(), columnDataUnit.getRecord());
				}
			}
		}
	}
	
	/**
	 * 将单据的数据转成json字符串 
	 * @param document 单据document
	 * @param metaForm 单据的metaform
	 * @return
	 */
	public static String document2JsonStr(Document document,MetaForm metaForm){
		String result = "";
		BillDataUnit billDataUnit = new BillDataUnit();
		MetaTableCollection metaTableCollection = metaForm.getDataSource().getDataObject().getTableCollection();
		String maintablekey = metaForm.getDataSource().getDataObject().getMainTableKey();		
		List<HeadDataUnit> headers = new ArrayList<HeadDataUnit>();
		List<TableDataUnit> tables =  new ArrayList<TableDataUnit>();
		Iterator<MetaTable> tableIterator =metaTableCollection.iterator();
		while(tableIterator.hasNext()){
			MetaTable metaTable = tableIterator.next();
			String metaTableKey = metaTable.getKey();
			if(!(maintablekey.equals(metaTableKey))){
				DataTable data = document.get(metaTableKey);
				TableDataUnit tableDataUnit = new TableDataUnit();
				tableDataUnit.setKey(metaTableKey);
				List<RowDataUnit> rowlist = new ArrayList<RowDataUnit>();
				data.beforeFirst();
				while(data.next()){
					RowDataUnit rowDataUnit = new RowDataUnit();
					List<ColumnDataUnit> collist = new ArrayList<ColumnDataUnit>();
					Iterator<MetaColumn> dtlColumnIterator =  metaTable.iterator();
					while(dtlColumnIterator.hasNext()){
						MetaColumn metaColumn = dtlColumnIterator.next();
						String dtlDataKey = metaColumn.getKey();
						if( !("OID".equals(dtlDataKey))
							&& !("SOID".equals(dtlDataKey))
							&& !("POID".equals(dtlDataKey))
							&& !("VERID".equals(dtlDataKey))
							&& !("DVERID".equals(dtlDataKey))
						){
							String dtlDataCaption = metaColumn.getCaption();
							ColumnDataUnit columnDataUnit = new ColumnDataUnit();
							columnDataUnit.setCaption(dtlDataCaption);
							columnDataUnit.setKey(dtlDataKey);
							columnDataUnit.setRecord(data.getObject(dtlDataKey)+"");
							columnDataUnit.setType("TEXT");
							collist.add(columnDataUnit);
						}
					}
					rowDataUnit.setCollist(collist);
					rowlist.add(rowDataUnit);
				}
				tableDataUnit.setRowlist(rowlist);
				tables.add(tableDataUnit);
			}else{
				MetaTable mainTable = metaTable;
				DataTable data = document.get(maintablekey);
				data.first();				
				Iterator<MetaColumn> columnIterator =  mainTable.iterator();
				while(columnIterator.hasNext()){
					
					MetaColumn metaColumn = columnIterator.next();
					String headDataCaption = metaColumn.getCaption();
					String headDataKey = metaColumn.getKey();
					String headDataDescr = metaColumn.getDescription();
					HeadDataUnit headDataUnit = new HeadDataUnit();
					headDataUnit.setCaption(headDataCaption);
					headDataUnit.setKey(headDataKey);
					if(headDataKey.startsWith("show")){
						headDataUnit.setType("SHOW");
					}else{
						if(StringUtil.isNotBlank(headDataDescr)){
							headDataUnit.setType("COMOBOBOX");
							List<OptionDataUnit> optionList = new ArrayList<OptionDataUnit>();							
							JSONArray optionArrays = JSON.parseArray(headDataDescr);
							for(Object optionObj:optionArrays){
								OptionDataUnit optionDataUnit = JSON.parseObject(JSON.toJSONString(optionObj), OptionDataUnit.class);
								optionList.add(optionDataUnit);
							}
							headDataUnit.setOptionList(optionList);
						}else{
							headDataUnit.setType("TEXT");
						}
					}
					headDataUnit.setRecord(data.getString(headDataKey));
					headers.add(headDataUnit);
				}
			}
		}
		billDataUnit.setTables(tables);
		billDataUnit.setHeaders(headers);	
		result = JSON.toJSONString(billDataUnit);
		return result;		
	}
}
