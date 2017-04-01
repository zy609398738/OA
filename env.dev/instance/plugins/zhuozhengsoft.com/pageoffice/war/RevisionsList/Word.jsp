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
	poCtrl1.setOfficeToolbars(false);//����office������
        poCtrl1.setSaveFilePage("SaveFile.jsp");
	//���ļ�
	poCtrl1.webOpen("doc/test.doc", OpenModeType.docRevisionOnly, "Tom");
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
        
        function AfterDocumentOpened() {
            refreshList();
        }
        
          //��ȡ��ǰ�ۼ��б�
         function refreshList() {
            var i;
            document.getElementById("ul_Comments").innerHTML = "";
            for (i = 1; i <= document.getElementById("PageOfficeCtrl1").Document.Revisions.Count; i++) {
                var str = "";
                str = str + document.getElementById("PageOfficeCtrl1").Document.Revisions.Item(i).Author;
                var  revisionDate=document.getElementById("PageOfficeCtrl1").Document.Revisions.Item(i).Date;
                 //ת��Ϊ��׼ʱ��
                 str=str+" "+dateFormat(revisionDate,"yyyy-MM-dd HH:mm:ss");
                  
                if (document.getElementById("PageOfficeCtrl1").Document.Revisions.Item(i).Type == "1") {
                    str = str + ' ���룺' + document.getElementById("PageOfficeCtrl1").Document.Revisions.Item(i).Range.Text;
                }
                else if (document.getElementById("PageOfficeCtrl1").Document.Revisions.Item(i).Type == "2") {
                    str = str + ' ɾ����' + document.getElementById("PageOfficeCtrl1").Document.Revisions.Item(i).Range.Text;
                }
                else {
                    str = str + ' ������ʽ����ʽ��';
                }
                document.getElementById("ul_Comments").innerHTML += "<li><a href='#' onclick='goToRevision(" + i + ")'>" + str + "</a></li>"
            }

        }
         //GMTʱ���ʽת��ΪCST
          dateFormat = function (date, format) {
            date = new Date(date); 
            var o = {
                'M+' : date.getMonth() + 1, //month
                'd+' : date.getDate(), //day
                'H+' : date.getHours(), //hour
                'm+' : date.getMinutes(), //minute
                's+' : date.getSeconds(), //second
                'q+' : Math.floor((date.getMonth() + 3) / 3), //quarter
                'S' : date.getMilliseconds() //millisecond
            };
 
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
 
            for (var k in o)
                if (new RegExp('(' + k + ')').test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
 
            return format;
        }

        //��λ����ǰ�ۼ�
        function goToRevision(index)
        {
	        var sMac = "Sub myfunc() " + "\r\n"
                     + "ActiveDocument.Revisions.Item("+index+").Range.Select " + "\r\n"
                     + "End Sub ";

	        document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", sMac);
	        
        }

        //ˢ���б�
       function refresh_click()
        {
	       refreshList();    
        }


    </script>
    <div  style=" width:1300px; height:700px;">
        <div id="Div_Comments" style=" float:left; width:200px; height:700px; border:solid 1px red;">
        <h3>�ۼ��б�</h3>
        <input type="button" name="refresh" value="ˢ��"onclick=" return refresh_click()"/>
        <ul id="ul_Comments">
            
        </ul>
        </div>
       <div style=" width:1050px; height:700px; float:right;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1" >
        </po:PageOfficeCtrl>
      </div>
    </form>
</body>
</html>

