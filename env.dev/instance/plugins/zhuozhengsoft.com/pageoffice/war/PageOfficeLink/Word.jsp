<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����Զ��尴ť
poCtrl.addCustomToolButton("����","Save",1);

poCtrl.setJsFunction_AfterDocumentOpened("AfterDocumentOpened()"); 
//���ñ���ҳ��
poCtrl.setSaveFilePage("SaveFile.jsp");
//��Word�ĵ�
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>��򵥵Ĵ򿪱���Word�ļ�</title>
</head>
<body>
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
    </script>
    <script type="text/javascript">
        function AfterDocumentOpened() {
            document.getElementById("Text1").value = document.getElementById("PageOfficeCtrl1").DataRegionList.GetDataRegionByName("PO_Title").Value;
        }

        function setTitleText() {
            document.getElementById("PageOfficeCtrl1").DataRegionList.GetDataRegionByName("PO_Title").Value = document.getElementById("Text1").value;
        }
    </script>
<p style=" text-indent:10px;" >
        PageOffice 3.0��2.0�汾�Ļ�����������ȫ�µ��ļ��򿪷�ʽ��PageOfficeLink ��ʽ�����˷�ʽ�ṩ�˸�����������������Խ��������
        </p>
        <p style=" text-indent:10px;" >
        <span style=" font-weight:bold;"> PageOfficeLink �����POL</span>����׿����˾ΪPageOffice���ߴ��ĵ���ҳ��ר�ſ��������ⳬ���ӣ�
        </p>
        <p style=" text-indent:10px;" >
       
            ������ĵ������ӵĴ���д����&lt;a href=&quot;Word.jsp?id=12&quot;&gt;ĳĳ��˾����-12&lt;a&gt;</p>
        <p style=" text-indent:10px;" >
            POL���ĵ������ӵĴ���д����
       &lt;a href=&quot;<span style=" background-color:#D2E9FF;">&lt;%=PageOfficeLink.openWindow(request, &quot;</span>Word.jsp?id=12<span style=" background-color:#D2E9FF;">&quot;,&quot;width=800px;height=800px;&quot;)%&gt;</span>&quot;&gt;
     
            ĳĳ��˾����-12&lt;a&gt;
            &nbsp;</p>
	�ĵ����⣺<input id="Text1" type="text" size="50"      />
	<input type="button" value="�޸�" onclick="setTitleText();" />
    <form id="form1" >
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
