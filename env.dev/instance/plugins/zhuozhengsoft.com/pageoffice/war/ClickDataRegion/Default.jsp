<%@ page language="java" import="java.util.*,java.awt.*"
	pageEncoding="gb2312"%>
<%@page
	import="com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
	WordDocument doc = new WordDocument();
	DataRegion dataReg = doc.openDataRegion("PO_deptName");
	dataReg.getShading().setBackgroundPatternColor(Color.pink);
	//dataReg.setEditing(true);
	poCtrl.setWriter(doc);

	//���÷�����ҳ��
	poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	poCtrl.addCustomToolButton("����", "Save", 1);
	poCtrl.setJsFunction_OnWordDataRegionClick("OnWordDataRegionClick()");
	poCtrl.setOfficeToolbars(false);
	poCtrl.setCaption("Ϊ�����û�֪����Щ�ط����Ա༭��������������������ı���ɫ");
	poCtrl.setSaveFilePage("SaveFile.jsp");
	poCtrl.webOpen("doc/test.doc", OpenModeType.docSubmitForm, "����");
	poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
		<title></title>
		<link href="images/csstg.css" rel="stylesheet" type="text/css" />
	</head>
	<body>

		
		<div id="content">
			<div id="textcontent" style="width: 1000px; height: 800px;">
				<script type="text/javascript">
	//***********************************PageOffice������õ�js����**************************************
	//����ҳ��
	function Save() {
		document.getElementById("PageOfficeCtrl1").WebSave();
	}

	//ȫ��/��ԭ
	function IsFullScreen() {
		document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
	}

	function OnWordDataRegionClick(Name, Value, Left, Bottom) {
		
        if (Name == "PO_deptName") {
            var strRet = document.getElementById("PageOfficeCtrl1").ShowHtmlModalDialog("HTMLPage.htm", Value, "left=" + Left + "px;top=" + Bottom + "px;width=400px;height=300px;frame=no;");
            if (strRet != "") {
                return (strRet);
            }
            else {
                if ((Value == undefined) || (Value == ""))
                    return " ";
                else
                    return Value;
            }
        }
    }

	//***********************************PageOffice������õ�js����**************************************
</script>

				<!--**************   ׿�� PageOffice��� ************************-->
				<po:PageOfficeCtrl id="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</div>


	</body>
</html>
