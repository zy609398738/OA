package com.bokesoft.oa.office.word.utils;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.apache.poi.xwpf.usermodel.XWPFRun.FontCharRange;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTBookmark;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTInd;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTP;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTPPr;

import com.bokesoft.oa.office.word.bean.ColumnDataUnit;
import com.bokesoft.oa.office.word.bean.HeadDataUnit;
import com.bokesoft.oa.office.word.bean.OptionDataUnit;
import com.bokesoft.oa.office.word.bean.RowDataUnit;
import com.bokesoft.oa.office.word.bean.TableDataUnit;

public class WordUtils {
	private static final String STARTMARK = "S";
	private static final String ENDMARK = "E";
	/**
	 * 获取word中书签
	 * 
	 * @param doucument
	 * @return
	 * @throws DocumentException
	 */
	public static ArrayList<HeadDataUnit> transfHeadDatasfromBookmark(XWPFDocument doucument,Map<String,String> relatedMap) throws DocumentException {
		// 获取段落文本对象
		List<XWPFParagraph> paragraphs = doucument.getParagraphs();
		ArrayList<HeadDataUnit> result = new ArrayList<HeadDataUnit>();
		for (int pgIdx = 0; pgIdx < paragraphs.size(); pgIdx++) {
			XWPFParagraph paragraph = paragraphs.get(pgIdx);
			CTP ctp = paragraph.getCTP();
			List<CTBookmark> bookmarks = ctp.getBookmarkStartList();
			for (int cIdx = 0; cIdx < bookmarks.size();) {
				CTBookmark ctBookmark = bookmarks.get(cIdx);
				String lableName = ctBookmark.getName().toUpperCase();
				if (lableName.indexOf("_") == -1 || lableName.startsWith("_")) {
					cIdx++;
					continue;
				}
				HeadDataUnit headDataUnit = new HeadDataUnit();

				if (lableName.startsWith("OP")) {
					int curDataIdx = result.size() - 1;
					headDataUnit = result.get(curDataIdx);
					List<OptionDataUnit> optionList = headDataUnit.getOptionList();
					int optionListLength = 0;
					if(optionList != null){
						optionListLength = optionList.size();
					}else{
						optionList = new ArrayList<OptionDataUnit>();
					}
					String[] infos = lableName.split("_");
					String startNodeName = lableName;
					if(STARTMARK.equals(infos[4])){
						String endNodeName = null;
						String descr = null;
						List<XWPFParagraph> containerParagraphs = new ArrayList<XWPFParagraph>();
						
						cIdx ++;
						if(cIdx >= bookmarks.size()){
							XWPFParagraph endParagraph = null;
							for(int ebLoopId = (pgIdx+1);ebLoopId < paragraphs.size(); ebLoopId++) {
								XWPFParagraph ebLooParagraph = paragraphs.get(ebLoopId);
								List<CTBookmark> ebLooPBookMarks = ebLooParagraph.getCTP().getBookmarkStartList();
								if(ebLooPBookMarks.size() > 0){
									CTBookmark endBookmark = ebLooPBookMarks.get(0);
									endNodeName = endBookmark.getName().toUpperCase();
									String[] endInfos = endNodeName.split("_");
									if(!(ENDMARK.equals(endInfos[4]))){
										throw new RuntimeException("模板设计有误,书签设计中,"+startNodeName+",应该紧跟相应E标签");
									}
									endParagraph = ebLooParagraph;
									break;
								}else{
									containerParagraphs.add(ebLooParagraph);
									continue;
								}
							}
							descr = digContentfromParagraphsByBookmarkPos(paragraph,endParagraph,containerParagraphs, startNodeName, endNodeName);
						}else{							
							CTBookmark endBookmark = bookmarks.get(cIdx);
							endNodeName = endBookmark.getName().toUpperCase();
							String[] endInfos = endNodeName.split("_");
							if(!(ENDMARK.equals(endInfos[4]))){
								throw new RuntimeException("模板设计有误,书签设计中,"+startNodeName+",应该紧跟相应E标签");
							}
							descr = digContentfromParagraphByBookmarkPos(paragraph, startNodeName, endNodeName);
						}
						OptionDataUnit optionData = new OptionDataUnit();
						String[] nameAttrStrs = lableName.split("_");
						optionData.setCaption(nameAttrStrs[3]);
						optionData.setKey("OP_" + (optionListLength+1));
						optionData.setType("OPTION");
						optionData.setDescr(descr);
						optionList.add(optionData);
						headDataUnit.setOptionList(optionList);
					}else{
						cIdx++;
					}
					continue;
				} else if (lableName.indexOf("_OP_") == -1) {
					String[] infos = lableName.split("_");
					headDataUnit.setCaption(infos[0]);
					if(null != relatedMap && null != relatedMap.get(infos[0])){
						headDataUnit.setKey(relatedMap.get(infos[0]));
					}else{
						headDataUnit.setKey("data_" + infos[1]);
					}
					headDataUnit.setType("TEXT");
					headDataUnit.setRecord("");
				} else {
					String[] infos = lableName.split("_");				
					headDataUnit.setCaption(infos[0]);
					if(null != relatedMap && null != relatedMap.get(infos[0])){
						headDataUnit.setKey(relatedMap.get(infos[0]));
					}else{
						headDataUnit.setKey("data_" + infos[2]);
					}					
					headDataUnit.setType("COMOBOBOX");
					headDataUnit.setRecord("");
					List<OptionDataUnit> optionList = new ArrayList<OptionDataUnit>();
					headDataUnit.setOptionList(optionList);

					HeadDataUnit showComoboboxUnit = new HeadDataUnit();
					showComoboboxUnit.setKey("show_" + infos[2]);
					showComoboboxUnit.setCaption(infos[0] + "内容");
					showComoboboxUnit.setType("SHOW");
					showComoboboxUnit.setRecord("");
					result.add(showComoboboxUnit);
				}
				result.add(headDataUnit);
				cIdx++;
			}
		}
		return result;
	}
	
	/**
	 * 删除下拉书签子项S,E之间的RUN
	 * @param doucument
	 * @throws DocumentException
	 */
	public static void delContentBetweenBookmarks(XWPFDocument doucument) throws DocumentException{
		// 获取段落文本对象
		List<XWPFParagraph> paragraphs = doucument.getParagraphs();
		List<Integer> nullRunList = new ArrayList<Integer>();
		for (int pgIdx = 0; pgIdx < paragraphs.size(); pgIdx++) {
			XWPFParagraph paragraph = paragraphs.get(pgIdx);
			CTP ctp = paragraph.getCTP();
			List<CTBookmark> bookmarks = ctp.getBookmarkStartList();
			for (int cIdx = 0; cIdx < bookmarks.size();) {
				CTBookmark ctBookmark = bookmarks.get(cIdx);
				String lableName = ctBookmark.getName().toUpperCase();
				if (lableName.indexOf("_") == -1 || lableName.startsWith("_")) {
					cIdx++;
					continue;
				}

				if (lableName.startsWith("OP")) {
					String[] infos = lableName.split("_");
					String startNodeName = lableName;
					if(STARTMARK.equals(infos[4])){
						String endNodeName = null;
						List<XWPFParagraph> containerParagraphs = new ArrayList<XWPFParagraph>();
						
						cIdx ++;
						if(cIdx >= bookmarks.size()){
							XWPFParagraph endParagraph = null;
							for(int ebLoopId = (pgIdx+1);ebLoopId < paragraphs.size(); ebLoopId++) {
								XWPFParagraph ebLooParagraph = paragraphs.get(ebLoopId);
								List<CTBookmark> ebLooPBookMarks = ebLooParagraph.getCTP().getBookmarkStartList();
								if(ebLooPBookMarks.size() > 0){
									CTBookmark endBookmark = ebLooPBookMarks.get(0);
									endNodeName = endBookmark.getName().toUpperCase();
									String[] endInfos = endNodeName.split("_");
									if(!(ENDMARK.equals(endInfos[4]))){
										throw new RuntimeException("模板设计有误,书签设计中,"+startNodeName+",应该紧跟相应E标签");
									}
									endParagraph = ebLooParagraph;
									break;
								}else{
									containerParagraphs.add(ebLooParagraph);
									continue;
								}
							}
							delContentfromParagraphsByBookmarkPos(paragraph,endParagraph,containerParagraphs, startNodeName, endNodeName);
						} else{							
							CTBookmark endBookmark = bookmarks.get(cIdx);
							endNodeName = endBookmark.getName().toUpperCase();
							String[] endInfos = endNodeName.split("_");
							if(!(ENDMARK.equals(endInfos[4]))){
								throw new RuntimeException("模板设计有误,书签设计中,"+startNodeName+",应该紧跟相应E标签");
							}
							delContentfromParagraphByBookmarkPos(paragraph, startNodeName, endNodeName);
						}
					}
					if(paragraph.getRuns().size() == 0){
						nullRunList.add(pgIdx+1);
					}
				}
				cIdx++;
			}
		}
		for (int i = nullRunList.size()-1; i >=0 ; i--) {
			doucument.removeBodyElement(nullRunList.get(i));
		}
	}
	
	/**
	 * 删除下拉选项S,E之间的RUN(不在一个段落中)
	 * @param paragraph
	 * @param emParagraph
	 * @param containerParagraphs
	 * @param startNodeName
	 * @param endNodeName
	 * @return
	 * @throws DocumentException
	 */
	private static Map<String,Boolean> delContentfromParagraphsByBookmarkPos(XWPFParagraph paragraph, XWPFParagraph emParagraph,
			List<XWPFParagraph> containerParagraphs, String startNodeName, String endNodeName) throws DocumentException {
		Map<String,Boolean> result = new HashMap<String,Boolean>();
		boolean needRemoveWholeParagraphS = true;
		boolean needRemoveWholeParagraphE = true;
		//有S标记段落的paragraph,定位S标记的位置,S以下的内容加入sbuff中,
		List<Element> elements = new ArrayList<Element>();
		parseParagraphXml2NodeCollection(paragraph, elements);
		
		//定位S标记书签的位置
		int startPos = calculatorManualNodePoistion(startNodeName, elements);
		
		//S以下的内容加入sbuff中
		List<XWPFRun> runs = paragraph.getRuns();
		for (int _index = startPos; _index < runs.size(); _index++) {
			paragraph.removeRun(startPos);
		}
		//所有包含段落直接写入
		for(XWPFParagraph containerParagraph:containerParagraphs){
			List<XWPFRun> contRuns = containerParagraph.getRuns();
			for (int index = 0; index < contRuns.size(); index++) {
				paragraph.removeRun(index);
			}
		}
	
		if(paragraph.getRuns().size() <= 0){
			needRemoveWholeParagraphS = true;
		}
		
		//有E标记段落的paragraph,定位S标记的位置,E以上的内容加入sbuff中,
		List<Element> emElements = new ArrayList<Element>();
		parseParagraphXml2NodeCollection(emParagraph, emElements);
		
		//定位E标记书签的位置
		int emEndPos = calculatorManualNodePoistion(endNodeName, elements);
		
		//E以上的内容加入sbuff中
		for (int index = 0; index < emEndPos; index++) {
			emParagraph.removeRun(index);
		}
		
		if(paragraph.getRuns().size() <= 0){
			needRemoveWholeParagraphE = true;
		}
		
		result.put("S", needRemoveWholeParagraphS);
		result.put("E", needRemoveWholeParagraphE);
		return result;
	}
	
	
	
	/**
	 * 删除下拉选项S,E之间的RUN(在一个段落中)
	 * @param paragraph
	 * @param startNodeName
	 * @param endNodeName
	 * @return
	 * @throws DocumentException
	 */
	private static boolean delContentfromParagraphByBookmarkPos(XWPFParagraph paragraph, String startNodeName,
			String endNodeName) throws DocumentException {
		boolean needRemoveWholeParagraph = false;
		List<Element> elements = new ArrayList<Element>();
		parseParagraphXml2NodeCollection(paragraph, elements);
		
		List<String> nodeNames = new ArrayList<String>();
		nodeNames.add(startNodeName);
		nodeNames.add(endNodeName);
		Map<String,Integer> poistions = calculatorManualNodePoistions(nodeNames, elements);
		int startPos = poistions.get(startNodeName);
		int endPos = poistions.get(endNodeName);
		
		//S以下,E以上的内容加入sbuff中输出
		for (int index = startPos; index < endPos; index++) {
			paragraph.removeRun(startPos);
		}
		if(paragraph.getRuns().size() <= 0){
			needRemoveWholeParagraph = true;
		}
		return needRemoveWholeParagraph;
	}
	/**
	 * 处理下拉选项S,E标记不在一个段落中,而且能包含多个无书签的段落
	 * @param paragraph
	 * @param emParagraph
	 * @param containerParagraphs
	 * @param startNodeName
	 * @param endNodeName
	 * @return
	 * @throws DocumentException
	 */
	private static String digContentfromParagraphsByBookmarkPos(XWPFParagraph paragraph, XWPFParagraph emParagraph,
			List<XWPFParagraph> containerParagraphs, String startNodeName, String endNodeName) throws DocumentException {
		StringBuffer sbuff = new StringBuffer();
		List<Element> elements = new ArrayList<Element>();
		parseParagraphXml2NodeCollection(paragraph, elements);
				
		//定位S标记书签的位置
		int startPos = calculatorManualNodePoistion(startNodeName, elements);
		
		//S以下的内容加入sbuff中
		List<XWPFRun> runs = paragraph.getRuns();		
		for (int index = startPos; index < runs.size(); index++) {
			sbuff.append(runs.get(index).text());
		}
		//所有包含段落直接写入
		for(XWPFParagraph containerParagraph:containerParagraphs){
			List<XWPFRun> contRuns = containerParagraph.getRuns();
			for (int index = 0; index < contRuns.size(); index++) {
				sbuff.append(contRuns.get(index).text());
			}
		}
		
		//有E标记段落的paragraph,定位S标记的位置,E以上的内容加入sbuff中,
		List<Element> emElements = new ArrayList<Element>();
		parseParagraphXml2NodeCollection(emParagraph, emElements);
		
		//定位E标记书签的位置
		int emEndPos = calculatorManualNodePoistion(endNodeName, elements);
		
		//E以上的内容加入sbuff中
		List<XWPFRun> emRuns = emParagraph.getRuns();		
		for (int index = 0; index < emEndPos; index++) {
			sbuff.append(emRuns.get(index).text());
		}		
		return sbuff.toString();
	}
	
	/**
	 * 处理下拉选项S,E标记在一个段落中
	 * @param paragraph
	 * @param startNodeName
	 * @param endNodeName
	 * @return
	 * @throws DocumentException
	 */
	private static String digContentfromParagraphByBookmarkPos(XWPFParagraph paragraph, String startNodeName,
			String endNodeName) throws DocumentException {
		StringBuffer sbuff = new StringBuffer();
		List<Element> elements = new ArrayList<Element>();
		parseParagraphXml2NodeCollection(paragraph, elements);
		
		List<String> nodeNames = new ArrayList<String>();
		nodeNames.add(startNodeName);
		nodeNames.add(endNodeName);
		Map<String,Integer> poistions = calculatorManualNodePoistions(nodeNames, elements);
		int startPos = poistions.get(startNodeName);
		int endPos = poistions.get(endNodeName);
		
		List<XWPFRun> runs = paragraph.getRuns();		
		//S以下,E以上的内容加入sbuff中输出
		for (int index = startPos; index < endPos; index++) {
			sbuff.append(runs.get(index).text());
		}
		return sbuff.toString();
	}

	/**
	 * 获取word中表头
	 * 
	 * @param doucument
	 * @return
	 */
	public static ArrayList<TableDataUnit> transfDtlDatasfromTable(XWPFDocument doucument,Map<String,String> relatedMap) {
		// 获取word中所有表格元素
		Iterator<XWPFTable> iterator = doucument.getTablesIterator();
		XWPFTable table;
		List<XWPFTableRow> rows;
		List<XWPFTableCell> cells;
		ArrayList<TableDataUnit> res = new ArrayList<TableDataUnit>();
		ArrayList<RowDataUnit> rowList = new ArrayList<RowDataUnit>();
		int tabCount = 1;
		while (iterator.hasNext()) {
			table = iterator.next();
			rows = table.getRows();
			TableDataUnit tableDataUnit = new TableDataUnit();
			tableDataUnit.setKey("dtl" + tabCount);
			if (rows.size() > 0) {
				RowDataUnit rowDataUnit = new RowDataUnit();
				cells = rows.get(0).getTableCells();
				rowDataUnit.setCollist(getTableHeadList(tabCount, cells,relatedMap));
				rowList.add(rowDataUnit);
				tableDataUnit.setRowlist(rowList);
			}
			tabCount++;
			res.add(tableDataUnit);
		}
		return res;
	}

	/**
	 * 段落文本替换
	 * 
	 * @param doucument
	 * @param titleLableList
	 * @throws DocumentException 
	 */
	public static void writeHead2Word(XWPFDocument doucument, List<HeadDataUnit> headDataUnitList) throws DocumentException {
		delContentBetweenBookmarks(doucument);
		// 获取段落文本对象
		Iterator<XWPFParagraph> itPara = doucument.getParagraphsIterator();
		while (itPara.hasNext()) {
			XWPFParagraph paragraph = itPara.next();
			List<Element> elements = new ArrayList<Element>();
			parseParagraphXml2NodeCollection(paragraph, elements);
			
			int rIdx = 0;
			List<Integer> posList = new ArrayList<Integer>();
			List<String> recordList = new ArrayList<String>();
			String record = "";
			//找到有S,E标记的书签定位
			for (int eIdx = 0; eIdx < elements.size(); eIdx++) {
				Element element = elements.get(eIdx);
				if ("bookmarkStart".equals(element.getQName().getName())) {
					String nameAttrStr = element.selectSingleNode("@w:name").getStringValue().toUpperCase();
		        	String[] nameAttrStrs = nameAttrStr.split("_");
		        	String nameAttr = "";
		        	if(nameAttrStr.startsWith("OP")){
		        		nameAttr = nameAttrStrs[4];
		        	}else{
		        		nameAttr = nameAttrStrs[0];
		        	}
					//ColumnDataUnit caption 匹配
					for (HeadDataUnit headDataUnit : headDataUnitList) {
						if (headDataUnit.getCaption().equals(nameAttr) && !("SHOW".equals(headDataUnit.getType()))) {
							if(headDataUnit.getType().equals("COMOBOBOX")){
								List<OptionDataUnit> optionList = headDataUnit.getOptionList();
								for (OptionDataUnit optionDataUnit : optionList) {
									if(null != headDataUnit.getRecord()){
										if(headDataUnit.getRecord().equals(optionDataUnit.getKey())){
											record = optionDataUnit.getDescr();
										}
									}
								}
							}else{
								record = headDataUnit.getRecord();
							}
							if(rIdx == 0){
								posList.add(rIdx+1);
								
							}else{
								posList.add(rIdx);
							}
							recordList.add(record);
						}
					}
				} else {
					//bookmarkStart不计数,r段落计数,保持与runs集合下标一致
					rIdx++;
				}
			}
			
			for (int i = 0 ; i<posList.size() ; i++) {
				XWPFRun run = paragraph.insertNewRun(posList.get(i)+i);
				run.setText(recordList.get(i));
				run.setFontFamily("宋体",FontCharRange.ascii);
				
				paragraph.setIndentationHanging(0);
				CTPPr pPPr = paragraph.getCTP().getPPr();
				CTInd ctInd = pPPr.getInd();
				ctInd.setHanging(new BigInteger("0"));
				ctInd.setHangingChars(new BigInteger("0"));
				ctInd.setLeft(new BigInteger("0"));
				ctInd.setLeftChars(new BigInteger("0"));
			}			
		}
	}

	/**
	 * 表格文本替换
	 * 
	 * @param document
	 * @param titleLableList
	 */
	public static void writeDtlTable2Word(XWPFDocument document, List<TableDataUnit> tableDataUnitList) {
		// 获取所有表格
		List<XWPFTable> tables = document.getTables();
		// 数据合法性判断(表格数量)
		if(null != tableDataUnitList){
			if (tables.size() == tableDataUnitList.size()) {
				for (int i = 0; i < tables.size(); i++) {
					XWPFTable table = tables.get(i);
					List<RowDataUnit> rowDataUnitList = tableDataUnitList.get(i).getRowlist();
					for (int j = rowDataUnitList.size() - 1 ; j >= 0 ; j--) {
						// 插入新行
						XWPFTableRow header = table.getRow(1);
						table.addRow(header, 2);
						// 获取到刚刚插入的行
						XWPFTableRow row = table.getRow(1);
						List<ColumnDataUnit> tableColList = rowDataUnitList.get(j).getCollist();
						List<XWPFTableCell> xwpfTableCells = row.getTableCells();
						// 判断数据合法性（列）
						if (xwpfTableCells.size() != tableColList.size()) {
							continue;
						}
						for (int k = 0; k < tableColList.size(); k++) {
							 List<XWPFParagraph> paras = xwpfTableCells.get(k).getParagraphs();
							 for (XWPFParagraph xwpfParagraph : paras) {
								 // 设置单元格内容
								 replaceInPara(xwpfParagraph, tableColList.get(k).getRecord());
							 }						
						}
					}
					table.removeRow(table.getRows().size()-2);
				}
			}
		}
	}
	/**
	 * 替换段落里面的变量
	 * @param para 要替换的段落
	 * @param params 参数
	 */
	private static void replaceInPara(XWPFParagraph para, String text) {
         List<XWPFRun> runs = para.getRuns();
         for (int i=0; i<runs.size(); i++) {
            //直接调用XWPFRun的setText()方法设置文本时，在底层会重新创建一个XWPFRun，把文本附加在当前文本后面，
            //所以我们不能直接设值，需要先删除当前run,然后再自己手动插入一个新的run。
            para.removeRun(i);
         }
         para.insertNewRun(0).setText(text);
	}

	/**
	 * 获取表格所有列名
	 * 
	 * @param tabCount
	 * @param cells
	 * @return
	 */
	public static List<ColumnDataUnit> getTableHeadList(int tabCount, List<XWPFTableCell> cells,Map<String,String> relatedMap) {
		List<ColumnDataUnit> res = new ArrayList<ColumnDataUnit>();
		for (int i = 0; i < cells.size(); i++) {
			ColumnDataUnit columnDataUnit = new ColumnDataUnit();
			String caption = cells.get(i).getText().trim();
			columnDataUnit.setCaption(caption);
			int colIdx = i +1;
			if(null != relatedMap && null != relatedMap.get(caption)){
				columnDataUnit.setKey(relatedMap.get(caption));
			}else{
				columnDataUnit.setKey("tab_" + tabCount + "_" + colIdx);
			}
			columnDataUnit.setRecord("");
			res.add(columnDataUnit);
		}
		return res;
	}
	
	/**
	 * 将XWPFParagraph转成xml,再有xml转成dom对象,解析后，找到该段落下所有最外层子节点的集合,以便判断出书签的位置
	 * @param paragraph
	 * @param elements
	 * @throws DocumentException
	 */
	private static void parseParagraphXml2NodeCollection(XWPFParagraph paragraph, List<Element> elements)
			throws DocumentException {
		CTP ctp = paragraph.getCTP();
		String pgXml = ctp.xmlText();
		//将段落改为xml的dom解析
		Document xmldoc = DocumentHelper.parseText(pgXml);
		Element rootElement = xmldoc.getRootElement();
		List<?> nodes = rootElement.content();
		for (Object node : nodes) {
			if (node instanceof Element) {
				Element element = (Element) node;
				if (null != element.getQName()) {
					//去掉pPr,bookmarkEnd的影响
					if (!("pPr".equals(element.getQName().getName())
							|| "bookmarkEnd".equals(element.getQName().getName())
							|| "proofErr".equals(element.getQName().getName())
						)) {
						elements.add(element);
					}
				}

			}
		}
	}
	
	/**
	 * 获取指定nodename的Node在 集合中的下标值
	 * @param nodeName
	 * @param elements
	 * @return
	 */
	private static int calculatorManualNodePoistion(String nodeName, List<Element> elements) {
		int pos = -1;
		int rIdx = 0;
		for (int eIdx = 0; eIdx < elements.size(); eIdx++) {
			Element element = elements.get(eIdx);
			//bookmarkStart不计数,r段落计数,保持与runs集合下标一致
			if ("bookmarkStart".equals(element.getQName().getName())) {
				String nameAttr = element.selectSingleNode("@w:name").getStringValue().toUpperCase();
				if (nodeName.equals(nameAttr)) {
					pos = rIdx;
					break;
				}
			} else {
				rIdx++;
			}
		}
		return pos;
	}
	
	/**
	 * 获取指定nodename的Node在 集合中的下标值
	 * @param nodeName
	 * @param elements
	 * @return
	 */
	private static Map<String,Integer> calculatorManualNodePoistions(List<String> nodeNames, List<Element> elements) {
		Map<String,Integer> result = new HashMap<String,Integer>();
		int rIdx = 0;
		for (int eIdx = 0; eIdx < elements.size(); eIdx++) {
			Element element = elements.get(eIdx);
			//bookmarkStart不计数,r段落计数,保持与runs集合下标一致
			if ("bookmarkStart".equals(element.getQName().getName())) {
				String nameAttr = element.selectSingleNode("@w:name").getStringValue().toUpperCase();
				if (nodeNames.contains(nameAttr)) {
					result.put(nameAttr,rIdx);
				}
			} else {
				rIdx++;
			}
		}
		return result;
	}
}
