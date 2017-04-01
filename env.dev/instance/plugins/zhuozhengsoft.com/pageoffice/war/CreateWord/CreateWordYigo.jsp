<%@ page language="java"
	import="java.util.*,java.io.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
String realPath = request.getSession().getServletContext().getRealPath("");
String fixPath = "instance/plugins/zhuozhengsoft.com/pageoffice/war";
realPath = realPath.substring(0, realPath.length() - fixPath.length());
String fileName=request.getParameter("filePath");
String filePath = fileName;
filePath = realPath + "modules/yigo2/Data/" + filePath;
filePath = filePath.replaceAll("/", "\\\\");
//******************************卓正PageOffice组件的使用*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //此行必须
	//隐藏菜单栏
	poCtrl1.setMenubar(false);
	//隐藏工具栏
	poCtrl1.setCustomToolbar(false);

	poCtrl1.setJsFunction_BeforeDocumentSaved("BeforeDocumentSaved()");
	
	//设置保存页面
	poCtrl1.setSaveFilePage("SaveNewFileYigo.jsp?filePath="+fileName);
	File file = new File(filePath);
	if(file.exists()){
		poCtrl1.webOpen(filePath, OpenModeType.docNormalEdit, "张三");
	}
	//新建Word文件，webCreateNew方法中的两个参数分别指代“操作人”和“新建Word文档的版本号”
	poCtrl1.webCreateNew("张佚名",DocumentVersion.Word2003);
	poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title></title>
		<link href="../images/csstg.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript">
		        function Save() {
		            document.getElementById("PageOfficeCtrl1").WebSave();
		            if(document.getElementById("PageOfficeCtrl1").CustomSaveResult=="ok"){
			            alert('保存成功！');
			            //location.href = "word-lists.jsp";
		            }else{
		            	alert('保存失败！');
		            }
		        }
		
		        function Cancel() {
		            window.close();
		        }
		
		        function getFocus() {
		            var str = document.getElementById("FileSubject").value;
		            if (str == "请输入文档主题") {
		                document.getElementById("FileSubject").value = "";
		            }
		        }
		        function lostFocus() {
		            var str = document.getElementById("FileSubject").value;
		            if (str.length <= 0) {
		                document.getElementById("FileSubject").value = "请输入文档主题";
		            }
		        }
				function BeforeDocumentSaved() {
					var str = document.getElementById("FileSubject").value;
					if (str.length <= 0) {
						document.getElementById("PageOfficeCtrl1").Alert("请输入文档主题");
						return false
					}
					else
						return true;
				}
		    </script>
	</head>
	<body>
		<form id="form2" action="CreateWord.aspx">
			<div id="content">
				<div id="textcontent" style="width: 1000px; height: 800px;">
					<!-- <div class="flow4">
						<span style="width: 100px;"> &nbsp; </span>
					</div> -->
					<!-- <div>
						文档主题：
						<input name="FileSubject" id="FileSubject" type="text"
							onfocus="getFocus()" onblur="lostFocus()" class="boder"
							style="width: 180px;" value="请输入文档主题" />
						<input type="button" onclick="Save()" value="保存" />
						<input type="button" onclick="Cancel()" value="取消" />
					</div> -->
					<!-- <div>
						&nbsp;
					</div> -->
					<po:PageOfficeCtrl id="PageOfficeCtrl1" />
				</div>
			</div>
			<div id="footer">
				<hr width="1000px;" />
				<div>
					Copyright (c) 2012 北京卓正志远软件有限公司
				</div>
			</div>
		</form>
	</body>
</html>
