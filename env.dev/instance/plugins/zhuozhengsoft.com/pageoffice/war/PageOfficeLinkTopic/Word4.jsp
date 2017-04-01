<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
//当打开文档后，FileIsOpened的值变为true
session.setAttribute("FileIsOpened",true);

PageOfficeCtrl poCtrl=new PageOfficeCtrl(request);
//设置服务器页面
poCtrl.setServerPage(request.getContextPath()+"/poserver.zz");
//添加自定义按钮
poCtrl.addCustomToolButton("保存并关闭","Save",1);

//设置保存页面
poCtrl.setSaveFilePage("SaveFile.jsp");
//打开Word文档
poCtrl.setJsFunction_BeforeDocumentSaved("BeforeDocumentSaved()");
poCtrl.webOpen("doc/test.doc",OpenModeType.docNormalEdit,"张佚名");
poCtrl.setTagId("PageOfficeCtrl1");//此行必需
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>PageOfficeLink打开文档的页面返回参数给父页面</title>
       <script type="text/javascript"
			src="js/jquery-1.6.min.js"></script>
</head>
<body>
     请点击"保存并关闭"按钮来观察index.jsp页面的第二个文本框中的值的变化。
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
			//关闭PageOfficeLink弹出的窗口
			  window.external.close();
        }
  
	   function BeforeDocumentSaved() {
               $.ajax({  
                    type : "POST",  //提交方式  
                    url : "Result.jsp?page=open&r=" +Math.random(),//路径  
                    dataType: "text", 
                    success : function(data) {//返回数据根据结果进行相应的处理  
                    } 
                    
              }); 
            return  true;
     }
    </script>

    <form id="form1" >
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
</body>
</html>
