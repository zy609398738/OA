<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ز˵���
	poCtrl1.setMenubar(true);
	//����Զ��尴ť
    poCtrl1.addCustomToolButton("ɾ����괦��","delBookMark()",7);
    poCtrl1.addCustomToolButton("ɾ��ѡ���ı��е�","delChoBookMark()",7);
  
	poCtrl1.webOpen("doc/template.doc", OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
   <head> 
        <title>jsɾ�����λ�õ���ǩ</title>
   </head>
<body>
    <span style="color:red"> ɾ����ǰ�������λ�õĹ��::��������ָ����ǩ�ϣ����ɾ����ǰ�������λ����ǩ��ť</span>
        <label>�ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js������</label>
        <label style="color:blue">function  delBookMark()</label>
    <br/>
    <span style="color:red">ɾ����ѡ�ı��е���ǩ��ѡ���ı����ݣ����ɾ��ѡ���ı������е���ǩ��ť��Ȼ��Ч��</span>
        <label >�ؼ����룺���Ҽ���ѡ�񡰲鿴Դ�ļ�������js������</label>
        <label style="color:blue">function  delChoBookMark()</label>
    <br/>
    <span>ģ���е�</span><span>��xxxxx��</span><span>������ǩ;&nbsp;���߿���ѡ��   ����->��ǩ->��λ���в鿴��ǩλ��</span><br/>
    <input id="Button1" type="button" onclick="delBookMark();"    value="ɾ����ǰ�������λ�õ���ǩ" /> &nbsp;&nbsp;
    <input id="Button1" type="button" onclick="delChoBookMark();" value="ɾ��ѡ���ı������е���ǩ" /> &nbsp;&nbsp;
     <div style="width:auto; height:700px;">
        <po:PageOfficeCtrl id ="PageOfficeCtrl1" >
        </po:PageOfficeCtrl>
    </div>
  <script type="text/javascript">
    //ɾ����ǰ�������λ�õ���ǩ
    function delBookMark() {
	  var mac = "Function myfunc()" + " \r\n"
	 + "If Application.Selection.Bookmarks.Count > 0 Then " + " \r\n"
	 + "   Application.Selection.Bookmarks(1).Select " + " \r\n"
	 + "   Application.Selection.Range.Delete " + " \r\n"  
	 + "  'Application.Selection.Bookmarks(1).Delete"+"\r\n" 
	 + "   Else"+"\r\n"
	 + '   MsgBox  "��ǰλ��û����ǩ" ' +"\r\n"
	 + "End If " + " \r\n"
	 + "End Function " + " \r\n";
	  document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", mac); 
    }
    //ɾ��ѡ���ı��������е���ǩ   
	 function delChoBookMark() {
	 //�жϵ�ǰ�Ƿ�ѡ�����ı�����
	 if (document.getElementById("PageOfficeCtrl1").Document.Application.Selection.Range.Text != ""){
	  var mac = "Function myfunc()" + " \r\n"
	 + " If Application.Selection.Bookmarks.Count >= 1 Then " + " \r\n"
	 + "   ReDim aMarks(Application.Selection.Bookmarks.Count - 1)" + " \r\n"  
	 + "   i = 0"+"\r\n" 
	 + "   For Each aBookmark In Application.Selection.Bookmarks " + " \r\n"
	 + "   aMarks(i) = aBookmark.Name " + " \r\n"  
	 + "   i = i + 1"+"\r\n"
	 + "   Next aBookmark " + " \r\n"  
	 + "   For Each myElement In aMarks"+"\r\n" 
	 + "   ActiveDocument.Bookmarks(myElement).Select" + " \r\n"
	 + "   ActiveDocument.Bookmarks(myElement).Range.Delete"+" \r\n"
	 + "   Next" +"\r\n"
	 //�ж�ѡ���ı����Ƿ�����ǩ
	 + "   Else" +"\r\n"
	 + '   MsgBox  "ѡ���ı���û����ǩ" ' +"\r\n"
	 + "   End If "+ "\r\n"
	 + "   End Function " + " \r\n";
	 document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", mac);  
	 }else{
	    document.getElementById("PageOfficeCtrl1").Alert("��û��ѡ���κ��ı�");
	  }
      } 
</script>
</body>
</html>





