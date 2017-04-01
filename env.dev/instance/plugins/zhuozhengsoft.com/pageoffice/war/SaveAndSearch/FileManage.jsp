<%@ page language="java" import="java.util.*,java.sql.*,java.net.*" pageEncoding="gb2312"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
 <head id="Head1">
    <title></title>
    <link href="css/style.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        function onColor(td) {
            td.style.backgroundColor = '#D7FFEE';
        }
        function offColor(td) {
            td.style.backgroundColor = '';
        }
        function getFocus() {
            var str = document.getElementById("Input_KeyWord").value;
            if (str == "������ؼ���") {
                document.getElementById("Input_KeyWord").value = "";
            }

        }
        function lostFocus() {
            var str = document.getElementById("Input_KeyWord").value;
            if (str.length <= 0) {
                document.getElementById("Input_KeyWord").value = "������ؼ���";
            }
        }
        function copyKeyToInput(key) {
            document.getElementById("Input_KeyWord").value = key;
        }
        function mySubmit() {
	    document.getElementById("Input_KeyWord").value = encodeURI(document.getElementById("Input_KeyWord").value);    
            document.getElementById("form1").submit();
        }

    </script>

</head>
  
 <body>
    <!--header-->
    <div class="zz-headBox br-5 clearfix" align="center">
        <div class="zz-head mc">
            <!--logo-->
            <div class="logo fl">
                <a href="#">
                    <img src="images/logo.png" alt="" /></a></div>
            <!--logo end-->
            <ul class="head-rightUl fr">
                <li><a href="http://www.zhuozhengsoft.com">׿����վ</a></li>
                <li><a href="http://www.zhuozhengsoft.com/poask/index.asp">�ͻ��ʰ�</a></li>
                <li class="bor-0"><a href="http://www.zhuozhengsoft.com/contact-us.html">��ϵ����</a></li>
            </ul>
        </div>
    </div>
    <!--header end-->
    <!--content-->
    <div class="zz-content mc clearfix pd-28" align="center">
        <div class="demo mc">
            <h2 class="fs-16">
                PageOffice ʵ��Word�ĵ������߱༭�����ȫ�Ĺؼ�������</h2>
        </div>
        <div class="demo mc">
            <h3 class="fs-12">
                �����ļ�</h3>
            <form id="form1" action="FileManage.jsp"  method="post">
            <table class="text" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td style="font-size: 9pt" align="left">
                        ͨ���ĵ������еĹؼ��������ĵ�&nbsp;&nbsp;&nbsp;
                    </td>
                    <td align="center">
                        <input name="Input_KeyWord" id="Input_KeyWord" type="text" onfocus="getFocus()" onblur="lostFocus()"
                            class="boder" style="width: 180px;" value="������ؼ���" />
                    </td>
                    <td style="width: 221px;">
                        &nbsp;
			<input type="button" value="����" onclick="mySubmit();" style=" width:86px;" />
                    </td>
                </tr>
                <tr>
                    <td >&nbsp;</td>
                    <td colspan="2">&nbsp;<span style="color:Gray;">����������</span> 
                    <a href="#" style="color:#00217d;" onclick="copyKeyToInput('��վ');">��վ</a>
                    <a href="#" style="color:#00217d;" onclick="copyKeyToInput('���');">���</a>
                    <a href="#" style="color:#00217d;" onclick="copyKeyToInput('����');">����</a></td>
                </tr>
            </table>
            </form>
        </div>
        <div class="zz-talbeBox mc" >
            <h2 class="fs-12">
                    �ĵ��б�</h2>
            <table class="zz-talbe">
                <thead>
                    <tr>
                        <th width="90%">
                                               �ĵ�����
                        </th>
                        <th width="100%">
                                               ����
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <%

                    	String key = request.getParameter("Input_KeyWord");
                    	String sql = "";
                    	if (key != null && key.trim().length() > 0) {
                    	 sql = "select * from word  where Content like '%" + URLDecoder.decode(key, "UTF-8")
                    				+ "%' order by ID desc";
                    	} else {
                    		sql = "select * from word order by ID desc";
                    	}
                    	Class.forName("org.sqlite.JDBC");
	    				String strUrl = "jdbc:sqlite:"
								+ this.getServletContext().getRealPath("demodata/") + "\\SaveAndSearch.db";
                    	Connection conn = DriverManager.getConnection(strUrl);
                    	Statement stmt = conn.createStatement();
                    	ResultSet rs = stmt.executeQuery(sql);
                    	int id;
                    	String FileName = "";
                    	String Content = "";
                    	while (rs.next()) {
                    		FileName = rs.getString("FileName");
                    		Content = rs.getString("Content");
                    		id = rs.getInt("ID");
                    %>
					<tr onmouseover='onColor(this)' onmouseout='offColor(this)'>
					<td>
					<%=FileName%>			
					</td>
					
					<td style='text-align:center;'>
                       <a style="color:#00217d;" href='Edit.jsp?id=<%=id %>&key=<%=key %>'>�༭</a>	
					</td>
					
				<%
					}
				%>
					</tr>
					<%
						stmt.close();
						conn.close();
					%>
                </tbody>
            </table>
        </div>
    </div>
    <!--content end-->
    <!--footer-->
    <div class="login-footer clearfix">
        Copyright &copy 2013 ����׿��־Զ������޹�˾</div>
    <!--footer end-->
</body>
</html>
