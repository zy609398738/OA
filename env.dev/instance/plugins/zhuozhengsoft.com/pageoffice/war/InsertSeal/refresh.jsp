<%@ page language="java" import="java.util.*,java.io.*,javax.servlet.*,javax.servlet.http.*" pageEncoding="UTF-8"%>
<%!
//拷贝文件
public void copyFile(String oldPath, String  newPath){
	try { 
		int bytesum = 0; 
		int byteread = 0; 
		File oldfile = new File(oldPath);
		if (oldfile.exists()) { //文件存在时 
			InputStream inStream = new FileInputStream(oldPath); //读入原文件 
			FileOutputStream fs = new FileOutputStream(newPath); 
			byte[] buffer = new byte[1444]; 
			int length; 
			while ( (byteread = inStream.read(buffer)) != -1) { 
				bytesum += byteread; //字节数 文件大小 
				System.out.println(bytesum); 
				fs.write(buffer, 0, byteread); 
			} 
			fs.close();
			inStream.close(); 
		} 
	} catch (Exception e) { 
		System.out.println("复制单个文件操作出错"); 
		e.printStackTrace(); 
	} 
}
%>
<%
String rootPath = request.getSession().getServletContext().getRealPath("InsertSeal")+"/";

copyFile(rootPath + "AddSeal1/word1_bak.doc", rootPath + "AddSeal1/word1.doc");
copyFile(rootPath + "AddSeal2/word2_bak.doc", rootPath + "AddSeal2/word2.doc");
copyFile(rootPath + "AddSeal3/word3_bak.doc", rootPath + "AddSeal3/word3.doc");
copyFile(rootPath + "AddSeal4/word4_bak.doc", rootPath + "AddSeal4/word4.doc");
copyFile(rootPath + "AddSeal5/word5_bak.doc", rootPath + "AddSeal5/word5.doc");
copyFile(rootPath + "AddSeal6/test_bak.doc", rootPath + "AddSeal6/test.doc");
copyFile(rootPath + "AddSeal7/test_bak.doc", rootPath + "AddSeal7/test.doc");
copyFile(rootPath + "AddSeal8/test_bak.doc", rootPath + "AddSeal8/test.doc");
copyFile(rootPath + "AddSeal9/test_bak.doc", rootPath + "AddSeal9/test.doc");

copyFile(rootPath + "AddSign1/test_bak.doc", rootPath + "AddSign1/test.doc");
copyFile(rootPath + "AddSign2/test_bak.doc", rootPath + "AddSign2/test.doc");
copyFile(rootPath + "AddSign3/test_bak.doc", rootPath + "AddSign3/test.doc");

copyFile(rootPath + "BatchAddSeal/doc/bak/test1.doc", rootPath + "BatchAddSeal/doc/test1.doc");
copyFile(rootPath + "BatchAddSeal/doc/bak/test2.doc", rootPath + "BatchAddSeal/doc/test2.doc");
copyFile(rootPath + "BatchAddSeal/doc/bak/test3.doc", rootPath + "BatchAddSeal/doc/test3.doc");
copyFile(rootPath + "BatchAddSeal/doc/bak/test4.doc", rootPath + "BatchAddSeal/doc/test4.doc");

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>盖章和签字专题</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<link href="css/style.css" rel="stylesheet" type="text/css" />		
	</head>
	<body>
		<!--content-->
		<div class="zz-content mc clearfix pd-28" align="center">
			<div class="demo mc">
				复位成功！<a href="index.jsp">返回到示例</a>
			</div>

		</div>
	</body>
</html>


