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
//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ز˵���
	poCtrl1.setMenubar(false);
	//���ع�����
	poCtrl1.setCustomToolbar(false);

	poCtrl1.setJsFunction_BeforeDocumentSaved("BeforeDocumentSaved()");
	
	//���ñ���ҳ��
	poCtrl1.setSaveFilePage("SaveNewFileYigo.jsp?filePath="+fileName);
	File file = new File(filePath);
	if(file.exists()){
		poCtrl1.webOpen(filePath, OpenModeType.docNormalEdit, "����");
	}
	//�½�Word�ļ���webCreateNew�����е����������ֱ�ָ���������ˡ��͡��½�Word�ĵ��İ汾�š�
	poCtrl1.webCreateNew("������",DocumentVersion.Word2003);
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
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
			            alert('����ɹ���');
			            //location.href = "word-lists.jsp";
		            }else{
		            	alert('����ʧ�ܣ�');
		            }
		        }
		
		        function Cancel() {
		            window.close();
		        }
		
		        function getFocus() {
		            var str = document.getElementById("FileSubject").value;
		            if (str == "�������ĵ�����") {
		                document.getElementById("FileSubject").value = "";
		            }
		        }
		        function lostFocus() {
		            var str = document.getElementById("FileSubject").value;
		            if (str.length <= 0) {
		                document.getElementById("FileSubject").value = "�������ĵ�����";
		            }
		        }
				function BeforeDocumentSaved() {
					var str = document.getElementById("FileSubject").value;
					if (str.length <= 0) {
						document.getElementById("PageOfficeCtrl1").Alert("�������ĵ�����");
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
						�ĵ����⣺
						<input name="FileSubject" id="FileSubject" type="text"
							onfocus="getFocus()" onblur="lostFocus()" class="boder"
							style="width: 180px;" value="�������ĵ�����" />
						<input type="button" onclick="Save()" value="����" />
						<input type="button" onclick="Cancel()" value="ȡ��" />
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
					Copyright (c) 2012 ����׿��־Զ�������޹�˾
				</div>
			</div>
		</form>
	</body>
</html>