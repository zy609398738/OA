<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*;"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	WordDocument wordDoc = new WordDocument();
	//����������openDataRegion�����Ĳ�������Word�ĵ��е���ǩ����
	DataRegion dataRegion1 = wordDoc.openDataRegion("PO_test1");
	dataRegion1.setSubmitAsFile(true);
	DataRegion dataRegion2 = wordDoc.openDataRegion("PO_test2");
	dataRegion2.setSubmitAsFile(true);
	dataRegion2.setEditing(true);
	DataRegion dataRegion3 = wordDoc.openDataRegion("PO_test3");
	dataRegion3.setSubmitAsFile(true);

	poCtrl1.setWriter(wordDoc);
	poCtrl1.addCustomToolButton("����","Save()",1);
	poCtrl1.setSaveDataPage("SaveData.jsp");
	//��Word�ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docSubmitForm, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title></title>

</head>
<body>
    <form id="form1">
    <div style="width: auto; height: 700px;">
    <!-- *********************PageOffice����ͻ���JS����*************************** -->
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
           
        }
    </script>
	 <div style=" font-size:14px; line-height:20px;">��ʾ˵����<br />��������桱��ť��PageOffice����ĵ���������������PO_test1��PO_test2��PO_test3���е����ݱ���Ϊ�������������ļ���new1.doc��new2.doc��new3.doc������Samples/SplitWord/doc�� Ŀ¼�¡�</div>
   <div style="color: red;font-size:14px; line-height:20px;" >Word��ֹ���ֻ����ҵ��֧�֣������ĵ��Ĵ�ģʽ������OpenModeType.docSubmitForm����Ҫ�����������������dataRegion1.setSubmitAsFile(true) ��<br /><br /></div>

    <!-- *********************PageOffice���������*************************** -->
        <po:PageOfficeCtrl id="PageOfficeCtrl1" />
    </div>
    <img src="OpenStream.jsp"/>
    </form>
   
</body>
</html>
