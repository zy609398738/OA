<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����PageOffice�ؼ�����������
poCtrl.setCaption("PageOfficeCtrl�ؼ�����������");
//��Word�ĵ�
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"������");
poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
     <title>��ʾ���޸�PageOffice�ؼ��������ı�����</title>
    <style>
        html, body
        {
            height: 100%;
        }
        .main
        {
            height: 100%;
        }
    </style>
</head>
<body>
    <form id="form1">
    <div style="font-size: 12px; line-height: 20px; border-bottom: dotted 1px #ccc; border-top: dotted 1px #ccc;
        padding: 5px;">
        ��������Htmlҳ�����PageOfficeCtrl�ؼ������ں�̨����PageOfficeCtrl�����Caption����<br />
        �ؼ����룺<span style="background-color:Yellow;">poCtrl.setCaption("PageOfficeCtrl�ؼ��ı���������");//poCtrlΪPageOfficeCtrl����</span>
    </div>
    <div style="height: 600px; width: auto;">
        <po:PageOfficeCtrl id ="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>