<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,java.sql.*,java.net.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%!
    /**
     * 判断字符是否是中文
     *
     * @param c 字符
     * @return 是否是中文
     */
    public  boolean isChinese(char c) {
        Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
        if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
                || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
                || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
                || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS) {
            return true;
        }
        return false;
    }

    /**
     * 判断字符串是否是乱码
     *
     * @param strName 字符串
     * @return 是否是乱码
     */
    public  boolean isMessyCode(String strName) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("\\s*|t*|r*|n*");
        java.util.regex.Matcher m = p.matcher(strName);
        String after = m.replaceAll("");
        String temp = after.replaceAll("\\p{P}", "");
        char[] ch = temp.trim().toCharArray();
        float chLength = ch.length;
        float count = 0;
        for (int i = 0; i < ch.length; i++) {
            char c = ch[i];
            if (!Character.isLetterOrDigit(c)) {
                if (!isChinese(c)) {
                    count = count + 1;
                }
            }
        }
        float result = count / chLength;
        if (result > 0.4) {
            return true;
        } else {
            return false;
        }

    }
	
	public String repairStr(String s) throws Exception{
		if(! isMessyCode(s)) return s;
		
		try{
			String strTmp = new String(s.getBytes("ISO8859_1"), "UTF-8");
			if(! isMessyCode(strTmp)) return strTmp;
		}
		catch(Exception e){
			return "error";
		}
		try{
			String strTmp = URLDecoder.decode(s, "UTF-8");
			if(! isMessyCode(strTmp)) return strTmp;
		}
		catch(Exception e){
			return "error";
		}

		return "null";

	}

%>
<%
     String strKey=request.getParameter("key");

     if (strKey != null && strKey.trim().length() > 0) {
		strKey = repairStr(strKey);
	 }
     int  id=Integer.parseInt(request.getParameter("id"));
	
	 //根据id查询数据库中对应的文档名称
     Class.forName("org.sqlite.JDBC");
	 String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\SaveAndSearch.db";
     Connection conn = DriverManager.getConnection(strUrl);
     Statement stmt = conn.createStatement();
	 String  sql="select * from word where id="+id;
     ResultSet rs = stmt.executeQuery(sql);
     String FileName = "";
        while (rs.next()) {
       FileName = rs.getString("FileName");
	}
	stmt.close();
	conn.close();
	
	/******************************PageOffice编程开始**************************/
        PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //此行必须
	//隐藏菜单栏
	poCtrl1.setMenubar(false);
	poCtrl1.addCustomToolButton("保存","Save()",1);
	//设置保存页面
	poCtrl1.setSaveFilePage("SaveFile.jsp?id="+id);
	//打开Word文件
	String filePath= request.getSession().getServletContext().getRealPath("SaveAndSearch/doc/"+FileName+".doc");
	poCtrl1.webOpen(filePath, OpenModeType.docNormalEdit, "张三");
	poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>编辑文档页面</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script type="text/javascript">
        var strKey = "<%=strKey%>";
        function Save() {
            if (strKey != "") 
            document.getElementById("PageOfficeCtrl1").WebSave();
            //document.getElementById("PageOfficeCtrl1").CustomSaveResult获取的是保存页面的返回值
            if (document.getElementById("PageOfficeCtrl1").CustomSaveResult == "ok")
                document.getElementById("PageOfficeCtrl1").Alert("保存成功");
            else
                 document.getElementById("PageOfficeCtrl1").Alert(document.getElementById("PageOfficeCtrl1").CustomSaveResult);
        }

         function SetKeyWord(key, visible) { 
           if (key=="null"||"" == key) {
                 document.getElementById("PageOfficeCtrl1").Alert("关键字为空。");
                return;
            }  
             var sMac = "function myfunc()" + "\r\n"
                        + "Application.Selection.HomeKey(6) \r\n"
                        + "Application.Selection.Find.ClearFormatting \r\n"
                        + "Application.Selection.Find.Replacement.ClearFormatting \r\n"
                        + "Application.Selection.Find.Text = \"" + key + "\" \r\n"

                        + "While (Application.Selection.Find.Execute()) \r\n"
                        +  "If (" + visible + ") Then \r\n"
                        +  "Application.Selection.Range.HighlightColorIndex = 7 \r\n"
                        +  "Else \r\n"
                        +  "Application.Selection.Range.HighlightColorIndex = 0 \r\n"
                        +  "End If \r\n"
                        +  "Wend \r\n"
                        +  "Application.Selection.HomeKey(6) \r\n"
                        + "End function";
            
            document.getElementById("PageOfficeCtrl1").RunMacro("myfunc", sMac);
            
        }
    </script>

  </head>
  
  <body>
   <form id="form1" >
    <input name="button" id="Button1" type="button" onclick="SetKeyWord(strKey,true)" value="高亮显示关键字" />
    <input name="button" id="Button2" type="button" onclick="SetKeyWord(strKey,false)" value="取消关键字显示" />
    <div style="width: auto; height: 700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
  </body>
</html>
