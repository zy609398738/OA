<%@ page language="java"
	import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*,java.sql.*,java.net.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%!
    /**
     * �ж��ַ��Ƿ�������
     *
     * @param c �ַ�
     * @return �Ƿ�������
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
     * �ж��ַ����Ƿ�������
     *
     * @param strName �ַ���
     * @return �Ƿ�������
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
	
	 //����id��ѯ���ݿ��ж�Ӧ���ĵ�����
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
	
	/******************************PageOffice��̿�ʼ**************************/
        PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���
	//���ز˵���
	poCtrl1.setMenubar(false);
	poCtrl1.addCustomToolButton("����","Save()",1);
	//���ñ���ҳ��
	poCtrl1.setSaveFilePage("SaveFile.jsp?id="+id);
	//��Word�ļ�
	String filePath= request.getSession().getServletContext().getRealPath("SaveAndSearch/doc/"+FileName+".doc");
	poCtrl1.webOpen(filePath, OpenModeType.docNormalEdit, "����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���	
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>�༭�ĵ�ҳ��</title>
    
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
            //document.getElementById("PageOfficeCtrl1").CustomSaveResult��ȡ���Ǳ���ҳ��ķ���ֵ
            if (document.getElementById("PageOfficeCtrl1").CustomSaveResult == "ok")
                document.getElementById("PageOfficeCtrl1").Alert("����ɹ�");
            else
                 document.getElementById("PageOfficeCtrl1").Alert(document.getElementById("PageOfficeCtrl1").CustomSaveResult);
        }

         function SetKeyWord(key, visible) { 
           if (key=="null"||"" == key) {
                 document.getElementById("PageOfficeCtrl1").Alert("�ؼ���Ϊ�ա�");
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
    <input name="button" id="Button1" type="button" onclick="SetKeyWord(strKey,true)" value="������ʾ�ؼ���" />
    <input name="button" id="Button2" type="button" onclick="SetKeyWord(strKey,false)" value="ȡ���ؼ�����ʾ" />
    <div style="width: auto; height: 700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
    </form>
  </body>
</html>
