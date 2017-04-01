<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//******************************׿��PageOffice�����ʹ��*******************************
	//����PageOffice���������
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
        poCtrl1.setJsFunction_AfterDocumentOpened("AfterDocumentOpened()");
        poCtrl1.addCustomToolButton("����", "Save()", 1); 
         poCtrl1.addCustomToolButton("��ʼ��д", "StartHandDraw()", 3);
	poCtrl1.addCustomToolButton("�����߿�", "SetPenWidth()", 5);
	poCtrl1.addCustomToolButton("������ɫ", "SetPenColor()", 5);
	poCtrl1.addCustomToolButton("���ñ���", "SetPenType()", 5);
	poCtrl1.addCustomToolButton("��������", "SetPenZoom()", 5);
	poCtrl1.setOfficeToolbars(false);//����office������
        poCtrl1.setSaveFilePage("SaveFile.jsp");
	//���ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docHandwritingOnly, "John");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
</head>

<body>

    <script type="text/javascript">

        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
      function StartHandDraw() {
            document.getElementById("PageOfficeCtrl1").HandDraw.Start();
        }
          //�����߿�
        function SetPenWidth(){
          document.getElementById("PageOfficeCtrl1").HandDraw.SetPenWidth(5);
        }
        //������ɫ
        function SetPenColor() {

            document.getElementById("PageOfficeCtrl1").HandDraw.SetPenColor(5292104);
        }
        //���ñ���
        function SetPenType() {

            document.getElementById("PageOfficeCtrl1").HandDraw.SetPenType(1);
        }
        //��������
        function SetPenZoom() {

            document.getElementById("PageOfficeCtrl1").HandDraw.SetPenZoom(50);
        }
        //�������һ����д
        function UndoHandDraw() {

            document.getElementById("PageOfficeCtrl1").HandDraw.Undo();
        }
        //�˳���д
        function ExitHandDraw() {

            document.getElementById("PageOfficeCtrl1").HandDraw.Exit();
        }
       

        function AfterDocumentOpened() {
            refreshList();
        }
        
        
        function refreshList() {
	      document.getElementById("PageOfficeCtrl1").HandDraw.Refresh();
           var i;
           document.getElementById("ul_Comments").innerHTML="";
           if(document.getElementById("PageOfficeCtrl1").HandDraw.Count!=0){
              for (i = 0;i <document.getElementById("PageOfficeCtrl1").HandDraw.Count;i++)
                 {
                    handDraw = document.getElementById("PageOfficeCtrl1").HandDraw.Item(i);
                    var str="";
                    str=str + "��" + handDraw.PageNumber + "ҳ" + "," + handDraw.UserName + ", " + handDraw.DateTime;
	            document.getElementById("ul_Comments").innerHTML += "<li><a href='#' onclick='goToHandDraw("+i+")'>"+str+"</a></li>";
                 }
             }else{
                    document.getElementById("PageOfficeCtrl1").Alert("��ǰ�ĵ�û����д��ע!");
                  }
        
          }
        //��λ����ǰ��д��ע
        function goToHandDraw(index){
	     document.getElementById("PageOfficeCtrl1").HandDraw.Item(index).Locate();        
        }
        function refresh_click(){
        //ˢ����д��ע����
         refreshList();
       }

    </script>
    <form id="form1">
    <div  style=" width:1380px; height:700px;">
        <div id="Div_Comments" style=" float:left; width:300px; height:700px; border:solid 1px red;">
        <h3>��д��ע�б�</h3>
        <input type="button" name="refresh" value="ˢ��"onclick="return refresh_click()"/>
        <ul id="ul_Comments">
            
        </ul>
        </div>
<div style=" width:1000px; height:700px; float:right;">
            <po:PageOfficeCtrl id="PageOfficeCtrl1" >
            </po:PageOfficeCtrl>
        </div>
    </div>
    </form>
</body>
</html>

