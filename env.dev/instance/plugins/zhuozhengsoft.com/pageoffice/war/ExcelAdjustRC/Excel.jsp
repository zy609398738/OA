<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.excelwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%

   PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
   //���÷�����ҳ��
  poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
  Workbook wb=new Workbook ();
  Sheet sheet1=wb.openSheet("Sheet1");
  //���õ�������ֻ��ʱ���Ƿ������û��ֶ��������С�
  sheet1.setAllowAdjustRC(true);
  poCtrl.setWriter(wb);//���б���
  //����Զ��尴ť
  poCtrl.addCustomToolButton("����","Save()",1);
  poCtrl.setSaveFilePage("SaveFile.jsp");
  //��Word�ĵ�
  poCtrl.webOpen("doc/test.xls",OpenModeType.xlsReadOnly,"������");
  poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>Excelֻ��ģʽ�µ����иߺ��п�</title>
</head>
<body>
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
    </script>
    <form id="form1">
   <div>
      ���õ�������ֻ��ʱ�������û��ֶ��������С�</br>
      <div style="color:Red;">sheet1.setAllowAdjustRC(true);</div>
    </div>
    <div style=" width:100%; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
