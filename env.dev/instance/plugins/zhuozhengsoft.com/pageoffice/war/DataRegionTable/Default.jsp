<%@ page language="java" import="java.util.*, java.awt.*" pageEncoding="gb2312"%>
<%@page import="com.zhuozhengsoft.pageoffice.*, com.zhuozhengsoft.pageoffice.wordwriter.*"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//***************************׿��PageOffice�����ʹ��********************************
        WordDocument doc = new WordDocument();
        //����������
        DataRegion dTable = doc.openDataRegion("PO_table");
        //������������ɱ༭��
        dTable.setEditing(true);

        //�����������еı��OpenTable(index)�����е�indexΪword�ĵ��б����±꣬��1��ʼ
        Table table1 = doc.openDataRegion("PO_Table").openTable(1);
        //���ñ��߿���ʽ
        table1.getBorder().setLineColor(Color.green);
        table1.getBorder().setLineWidth(WdLineWidth.wdLineWidth050pt);
        // ���ñ�ͷ��Ԫ���ı�����
        table1.openCellRC(1, 2).getParagraphFormat().setAlignment(WdParagraphAlignment.wdAlignParagraphCenter);
        table1.openCellRC(1, 3).getParagraphFormat().setAlignment(WdParagraphAlignment.wdAlignParagraphCenter);
        table1.openCellRC(2, 1).getParagraphFormat().setAlignment(WdParagraphAlignment.wdAlignParagraphCenter);
        table1.openCellRC(3, 1).getParagraphFormat().setAlignment(WdParagraphAlignment.wdAlignParagraphCenter);

        // ����ͷ��Ԫ��ֵ
        table1.openCellRC(1, 2).setValue("��Ʒ1");
        table1.openCellRC(1, 3).setValue("��Ʒ2");
        table1.openCellRC(2, 1).setValue("A����");
        table1.openCellRC(3, 1).setValue("B����");
        
        PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
        poCtrl.setWriter(doc);

        //����Զ��尴ť
        poCtrl.addCustomToolButton("����", "Save", 1);
        poCtrl.addCustomToolButton("ȫ��/��ԭ", "IsFullScreen", 4);
        
        //���÷�����ҳ��
        poCtrl.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
        //���ñ���ҳ
        poCtrl.setSaveDataPage("SaveData.jsp");
        //�����ĵ��򿪷�ʽ
        poCtrl.webOpen("doc/test.doc", OpenModeType.docSubmitForm, "������");
        poCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    <title>���������ύ���</title>
    <link href="images/csstg.css" rel="stylesheet" type="text/css" />
</head>
<body>
   

    <div id="content">
        <div id="textcontent" style="width: 1000px; height: 800px;">
      

            <script type="text/javascript">
                //����ҳ��
                function Save() {
                    document.getElementById("PageOfficeCtrl1").WebSave();
                }

                //ȫ��/��ԭ
                function IsFullScreen() {
                    document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
                }

            </script>

            <!--**************   ׿�� PageOffice��� ************************-->
            <po:PageOfficeCtrl id="PageOfficeCtrl1">
            </po:PageOfficeCtrl>
        </div>
    </div>

</body>
</html>
