<%@ page language="java"
	import="java.util.*,java.text.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordreader.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	WordDocument doc = new WordDocument(request, response);
	//��ȡ�ύ����ֵ
	DataRegion dataUserName = doc.openDataRegion("PO_userName");
	DataRegion dataDeptName = doc.openDataRegion("PO_deptName");
	String content = "";
	content += "��˾���ƣ�" + doc.getFormField("txtCompany");
	content += "<br/>Ա��������" + dataUserName.getValue();
	content += "<br/>�������ƣ�" + dataDeptName.getValue();

	doc.showPage(500, 400);
	doc.close();
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
				<div class="errTxtArea" style="height: 150px; text-align: left">
					<b class="txt_title">
						<div style="color: #FF0000;">
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