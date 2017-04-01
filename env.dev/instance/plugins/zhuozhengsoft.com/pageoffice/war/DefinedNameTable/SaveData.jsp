<%@ page language="java"
	import="java.util.*, java.text.*,com.zhuozhengsoft.pageoffice.*, com.zhuozhengsoft.pageoffice.excelreader.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	Workbook workBook = new Workbook(request, response);
	Sheet sheet = workBook.openSheet("Sheet1");
	
	Table table = sheet.openTableByDefinedName("report");
	String content = "";
	int result = 0;
	while (!table.getEOF()) {
		//��ȡ�ύ����ֵ
		if (!table.getDataFields().getIsEmpty()) {
			content += "<br/>�·����ƣ�"
					+ table.getDataFields().get(0).getText();
			content += "<br/>�ƻ��������"
					+ table.getDataFields().get(1).getText();
			content += "<br/>ʵ���������"
					+ table.getDataFields().get(2).getText();
			content += "<br/>�ۼ��������"
					+ table.getDataFields().get(3).getText();
			//out.print(table.getDataFields().get(2).getText()+"      mmmmmmmmmmmmm          "+table.getDataFields().get(1).getText());
			
			int colCount = table.getDataFields().size();//��ȡ����
			
			if (table.getDataFields().get(2).getText().equals(null)
					|| table.getDataFields().get(2).getText().trim().length()==0) {
				content += "<br/>����ʣ�0%";
			} else {
				float f = Float.parseFloat(table.getDataFields().get(2)
						.getText());
				f = f / Float.parseFloat(table.getDataFields().get(1).getText());
				DecimalFormat df=(DecimalFormat)NumberFormat.getInstance();
				content += "<br/>����ʣ�" + df.format(f*100)+"%";
			}
			content += "<br/>*********************************************";
		}
		//ѭ��������һ��
		table.nextRow();
	}
	table.close();
	workBook.showPage(500, 400);
	workBook.close();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title></title>
	</head>
	<body>
		<form id="form1">
			<div style="border: solid 1px gray;">
				<div class="errTopArea"
					style="text-align: left; border-bottom: solid 1px gray;">
					[��ʾ���⣺����һ��������Ա���Զ���ĶԻ���]
				</div>
				<div class="errTxtArea" style="height: 88%; text-align: left">
					<b class="txt_title">
						<div style=" color:#FF0000;" >
							�ύ����Ϣ���£�
						</div> <%=content%> </b>
				</div>
				<div class="errBtmArea" style="text-align: center;">
					<input type="button" class="btnFn" value=" �ر� "
						onclick="window.opener=null;window.open('','_self');window.close();" />
				</div>
			</div>
		</form>
	</body>
</html>