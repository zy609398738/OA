<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
PageOfficeCtrl pocCtrl=new PageOfficeCtrl(request);
//���÷�����ҳ��
pocCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//����Զ��尴ť
pocCtrl.addCustomToolButton("����", "Save()", 1);
pocCtrl.addCustomToolButton("ȫ��", "SetFullScreen()", 4);
//���ñ���ҳ��
pocCtrl.setSaveFilePage("SaveFile.jsp?id=1");
//���ļ�
pocCtrl.webOpen("doc/test.doc", OpenModeType.docNormalEdit, "������");
pocCtrl.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title></title>

    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
        function SetFullScreen() {
            document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
        }
    </script>

</head>
<body>
    <form id="form1">
    <div style="font-size: 14px;">
        <div style="border:1px solid black;">PageOffice������ҳ�洫ֵ�����ַ�ʽ��</br>
             <span style="color: Red;">1.ͨ�����ñ���ҳ���url�е�?������ҳ�洫�ݲ�����</span></br>
              &nbsp;&nbsp;&nbsp;��:pocCtrl.setSaveFilePage("SaveFile.jsp?id=1");</br>
              &nbsp;&nbsp;&nbsp;����ҳ���ȡ�����ķ�����</br>
              &nbsp;&nbsp;&nbsp;String value=request.getParameter("id");</br>
    
              <span style="color: Red;">2.ͨ��input�����������ҳ�洫�ݲ�����</span></br>
               &nbsp;&nbsp;&nbsp;��:<xmp> <input id="Hidden1" name="age" type="hidden" value="25" /></xmp></br>
               &nbsp;&nbsp;&nbsp;����ҳ���ȡ�����ķ�����</br>
               &nbsp;&nbsp;&nbsp;String age=fs.getFormField("age");</br>
               &nbsp;&nbsp;&nbsp;ע�⣺��ȡForm�ؼ����ݹ����Ĳ���ֵ��fs.getFormField("������")�����еĲ������ǵ�ǰ�ؼ��ġ�name�����Զ�����id��������ϸ������鿴SaveFile.jsp��<br>

              <span style="color: Red;">3.ͨ��Form�ؼ�������ҳ�洫�ݲ���(�����Form�ؼ���������������򡢵�ѡ�򡢸�ѡ��TextArea�����͵Ŀؼ�)��</span></br>
               &nbsp;&nbsp;&nbsp;��:<xmp> <input id="Text1" name="userName" type="text" value="����" /></xmp></br>
               &nbsp;&nbsp;&nbsp;����ҳ���ȡ�����ķ�����</br>
               &nbsp;&nbsp;&nbsp;String name=fs.getFormField("userName");</br>
               &nbsp;&nbsp;&nbsp;ע�⣺��ȡForm�ؼ����ݹ����Ĳ���ֵ��fs.getFormField("������")�����еĲ������ǵ�ǰ�ؼ��ġ�name�����Զ�����id��������ϸ������鿴SaveFile.jsp��<br>
    </div>
        <span style="color: Red;">������Ա��Ϣ��</span><br />
        <input id="Hidden1" name="age" type="hidden" value="25" />
        <span style="color: Red;">������</span><input id="Text1" name="userName" type="text" value="����" /><br />
        <span style="color: Red;">�Ա�</span><select id="Select1" name="selSex">
            <option value="��">��</option>
            <option value="Ů">Ů</option>
        </select>
    </div>
    <div style="width: auto; height: 700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1" >
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
