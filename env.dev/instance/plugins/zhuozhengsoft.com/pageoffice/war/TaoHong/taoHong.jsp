<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,java.sql.*,java.io.*,javax.servlet.*,javax.servlet.http.*"
	pageEncoding="gb2312"%>
<%@page import="com.zhuozhengsoft.pageoffice.wordwriter.DataRegion"%>
<%@page import="com.zhuozhengsoft.pageoffice.wordwriter.WordDocument"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%!

// �����ļ�
public void copyFile(String oldPath, String newPath){

		try {
			int bytesum = 0;
			int byteread = 0;
			File oldfile = new File(oldPath);
			if (oldfile.exists()) { //�ļ�����ʱ 
				InputStream inStream = new FileInputStream(oldPath); //����ԭ�ļ� 
				FileOutputStream fs = new FileOutputStream(newPath);
				byte[] buffer = new byte[1444];
				int length;
				while ((byteread = inStream.read(buffer)) != -1) {
					bytesum += byteread; //�ֽ��� �ļ���С 
					//System.out.println(bytesum);
					fs.write(buffer, 0, byteread);
				}
				inStream.close();
			}
		} catch (Exception e) {
			System.out.println("���Ƶ����ļ���������");
			e.printStackTrace();
		}

}
%>
<%

	String fileName = "";
	String mbName = request.getParameter("mb");


	//***************************׿��PageOffice�����ʹ��********************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	poCtrl1.setCustomToolbar(false);
	poCtrl1.setSaveFilePage("savefile.jsp");
	
	if (mbName != null && mbName.trim() != "") {
		// ѡ��ģ���ִ���׺�
		
		// ����ģ�壬����Ϊ��ʽ���ĵ��ļ�����zhengshi.doc
		fileName = "zhengshi.doc";
		String templateName = request.getParameter("mb");
		String templatePath = getServletContext().getRealPath("TaoHong/doc/" + templateName);
		String filePath = getServletContext().getRealPath("TaoHong/doc/" + fileName);
		copyFile(templatePath, filePath); 

		// ������ݺ��������ݵ���zhengshi.doc��
		WordDocument doc = new WordDocument();
		DataRegion copies = doc.openDataRegion("PO_Copies");
		copies.setValue("6");
		DataRegion docNum = doc.openDataRegion("PO_DocNum");
		docNum.setValue("001");
		DataRegion issueDate = doc.openDataRegion("PO_IssueDate");
		issueDate.setValue("2013-5-30");
		DataRegion issueDept = doc.openDataRegion("PO_IssueDept");
		issueDept.setValue("������");
		DataRegion sTextS = doc.openDataRegion("PO_STextS");
		sTextS.setValue("[word]doc/test.doc[/word]");
		DataRegion sTitle = doc.openDataRegion("PO_sTitle");
		sTitle.setValue("����ĳ��˾�ļ�");
		DataRegion topicWords = doc.openDataRegion("PO_TopicWords");
		topicWords.setValue("Pageoffice�� �׺�");
		poCtrl1.setWriter(doc);
		
	} else {
		//�״μ���ʱ�������������ݣ�test.doc
		fileName = "test.doc";
		
	}
	
	poCtrl1.webOpen("doc/" + fileName, OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
		<title></title>
		<link href="images/csstg.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript">
	//��ʼ����ģ���б�
	function load() {
		if (getQueryString("mb") != null)
			document.getElementById("templateName").value = getQueryString("mb");
	}

	//��ȡurl���� 
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		else
			return null;
	}

	//�׺�
	function taoHong() {
		var mb = document.getElementById("templateName").value;
		document.getElementById("form1").action = "taoHong.jsp?mb=" + mb;

		document.forms[0].submit();
	}

	//���沢�ر�
	function saveAndClose() {
		document.getElementById("PageOfficeCtrl1").WebSave();
		location.href = "index.jsp";
	}
</script>
	</head>
	<body onload="load();" >
		<div id="header">
			<div style="float: left; margin-left: 20px;">
				<img src="images/logo.jpg" height="30" />
			</div>
			<ul>
				<li>
					<a target="_blank" href="http://www.zhuozhengsoft.com">׿����վ</a>
				</li>
				<li>
					<a target="_blank"
						href="http://www.zhuozhengsoft.com/poask/index.asp">�ͻ��ʰ�</a>
				</li>
				<li>
					<a href="#">���߰���</a>
				</li>
				<li>
					<a target="_blank"
						href="http://www.zhuozhengsoft.com/contact-us.html">��ϵ����</a>
				</li>
			</ul>
		</div>
		<div id="content">
			<div id="textcontent" style="width: 1000px; height: 800px;">
				<div class="flow4">
					<a href="index.jsp"> <img alt="����" src="images/return.gif"
							border="0" />�ļ��б�</a>
					<span style="width: 100px;"> </span><strong>�ĵ����⣺</strong>
					<span style="color: Red;">�����ļ�</span>
					<form method="post" id="form1">
						<strong>ģ���б�</strong>
						<span style="color: Red;"> <select name="templateName"
								id="templateName" style='width: 240px;'>
								<option value='temp2008.doc' selected="selected">
									ģ��һ
								</option>
								<option value='temp2009.doc'>
									ģ���
								</option>
								<option value='temp2010.doc'>
									ģ����
								</option>
							</select> </span>
						<span style="color: Red;"><input type="button" value="һ���׺�"
								onclick="taoHong()"/> </span>
						<span style="color: Red;"><input type="button" value="����ر�"
								onclick="saveAndClose()"/> </span>
					</form>
				</div>
				<!--**************   ׿�� PageOffice��� ************************-->

				<po:PageOfficeCtrl id="PageOfficeCtrl1" />
			</div>
		</div>
		<div id="footer">
			<hr width="1000" />
			<div>
				Copyright (c) 2012 ����׿��־Զ������޹�˾
			</div>
		</div>

	</body>
</html>
